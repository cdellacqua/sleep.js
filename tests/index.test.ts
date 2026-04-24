import {vi} from 'vitest';
import {sleep} from '../src/lib/index.js';

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('sleep', () => {
	it('tests a basic usage', async () => {
		let actual = 0;
		const promise = sleep(10).then(() => (actual = 1));
		expect(actual).to.eq(0);
		await wait(20);
		await promise;
		expect(actual).to.eq(1);
	});
	it('tests that it immediately rejects when called with an already aborted signal and a zero timeout', async () => {
		const controller = new AbortController();
		const testError = new Error('test-error');
		controller.abort(testError);
		await expect(sleep(0, {signal: controller.signal})).rejects.toBe(testError);
	});
	it('tests that it immediately rejects when called with an already aborted signal', async () => {
		const controller = new AbortController();
		const testError = new Error('test-error');
		controller.abort(testError);
		await expect(sleep(10, {signal: controller.signal})).rejects.toBe(testError);
	});
	it('tests the abort signal', async () => {
		let actual = 0;
		const controller = new AbortController();
		setTimeout(() => {
			controller.abort();
		}, 50);
		const promise = sleep(100, {signal: controller.signal}).catch(() => {
			actual = 1;
		});
		await wait(75);
		await promise;
		expect(actual).to.eq(1);
	});
	it('tests timeouts greater than the maximum allowed value accepted by setTimeout', async () => {
		let actual = 0;
		const controller = new AbortController();
		const promise = sleep(0x7fffffff * 2, {signal: controller.signal}).catch(() => {
			actual = 1;
		});
		await wait(2);
		expect(actual).to.eq(0);
		controller.abort();
		await promise;
	});
	it('tests that setTimeouts gets called multiple times when using a huge delay', async () => {
		const setTimeoutArgs: number[] = [];

		const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout').mockImplementation(
			((callback: TimerHandler, ms?: number, ...params: unknown[]) => {
				setTimeoutArgs.push(Number(ms));
				if (typeof callback === 'function') {
					callback(...params);
				}
				return 0 as unknown as ReturnType<typeof setTimeout>;
			}) as unknown as typeof setTimeout,
		);
		await sleep(0x7fffffff * 3 + 10);
		expect(setTimeoutArgs).to.eqls([0x7fffffff, 0x7fffffff, 0x7fffffff, 10]);
		setTimeoutSpy.mockRestore();
	});
	it('tests a delay of 0', async () => {
		let actual = 0;
		const promise = sleep(0).then(() => {
			actual = 1;
		});
		await new Promise<void>((resolve) => setImmediate(resolve));
		await promise;
		expect(actual).to.eq(1);
	});
	it('tests the hurry method passing an Error', async () => {
		const controller = new AbortController();
		const sleepPromise = sleep(10, {signal: controller.signal});
		controller.abort(new Error('skip this!'));
		await expect(sleepPromise).rejects.toThrow('skip this!');
	});
	it('tests an overridden sleep function', async () => {
		let cleared = 0;
		let set = 0;
		let callback: (() => void) | undefined;
		const sleepPromise = sleep(10, {
			timeoutApi: {
				clearTimeout: () => {
					cleared++;
					callback = undefined;
				},
				setTimeout: (cb) => {
					set++;
					callback = cb;
					return 0;
				},
			},
		});
		let state: 'pending' | 'resolved' | 'rejected' = 'pending';
		void sleepPromise.then(
			() => (state = 'resolved'),
			() => (state = 'rejected'),
		);
		expect(state).to.eq('pending');
		expect(cleared).to.eq(0);
		expect(set).to.eq(1);
		expect(callback).to.not.be.undefined;
		callback?.();
		await sleep(0);
		expect(cleared).to.eq(0);
		expect(set).to.eq(1);
		expect(state).to.eq('resolved');
	});
	it('tests an overridden sleep function, hurrying it up with an error', async () => {
		let cleared = 0;
		let set = 0;
		let callback: (() => void) | undefined;
		const controller = new AbortController();
		const sleepPromise = sleep(10, {
			signal: controller.signal,
			timeoutApi: {
				clearTimeout: () => {
					cleared++;
					callback = undefined;
				},
				setTimeout: (cb) => {
					set++;
					callback = cb;
					return 0;
				},
			},
		});
		let state: 'pending' | 'resolved' | 'rejected' = 'pending';
		void sleepPromise.then(
			() => (state = 'resolved'),
			() => (state = 'rejected'),
		);
		expect(state).to.eq('pending');
		controller.abort(new Error());
		await sleep(0);
		expect(state).to.eq('rejected');
		expect(set).to.eq(1);
		expect(cleared).to.eq(1);
		expect(callback).to.be.undefined;
	});
});

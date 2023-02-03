import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';
import chai, {expect} from 'chai';
import {sleep} from '../src/lib';

chai.use(chaiAsPromised);
chai.use(spies);

describe('sleep', () => {
	it('tests a basic usage', (done) => {
		let actual = 0;
		sleep(10).then(() => (actual = 1), done);
		expect(actual).to.eq(0);
		setTimeout(() => {
			expect(actual).to.eq(1);
			done();
		}, 20);
	});
	it('tests that it immediately rejects when called with an already aborted signal and a zero timeout', (done) => {
		const controller = new AbortController();
		const testError = new Error('test-error');
		controller.abort(testError);
		sleep(0, {signal: controller.signal})
			.then(() => done('promise should have rejected!'))
			.catch((err) => {
				expect(err).to.eq(testError);
				done();
			});
	});
	it('tests that it immediately rejects when called with an already aborted signal', (done) => {
		const controller = new AbortController();
		const testError = new Error('test-error');
		controller.abort(testError);
		sleep(10, {signal: controller.signal})
			.then(() => done('promise should have rejected!'))
			.catch((err) => {
				expect(err).to.eq(testError);
				done();
			});
	});
	it('tests the abort signal', (done) => {
		let actual = 0;
		const controller = new AbortController();
		setTimeout(() => {
			controller.abort();
		}, 50);
		sleep(100, {signal: controller.signal}).then(
			() => {
				done('promise should have rejected');
			},
			() => {
				actual = 1;
			},
		);
		setTimeout(() => {
			expect(actual).to.eq(1);
			done();
		}, 75);
	});
	it('tests timeouts greater than the maximum allowed value accepted by setTimeout', (done) => {
		let actual = 0;
		const controller = new AbortController();
		sleep(0x7fffffff * 2, {signal: controller.signal}).then(
			() => {
				done('promise should have rejected');
			},
			() => {
				actual = 1;
			},
		);
		setTimeout(() => {
			expect(actual).to.eq(0);
			controller.abort();
			done();
		}, 2);
	});
	it('tests that setTimeouts gets called multiple times when using a huge delay', (done) => {
		const setTimeoutArgs: number[] = [];

		const setTimeoutSandbox = chai.spy.sandbox();
		setTimeoutSandbox.on(globalThis, 'setTimeout', (callback, ms, ...params) => {
			setTimeoutArgs.push(ms);
			callback(...params);
		});
		sleep(0x7fffffff * 3 + 10).catch(done);
		expect(setTimeoutArgs).to.eqls([0x7fffffff, 0x7fffffff, 0x7fffffff, 10]);
		setTimeoutSandbox.restore();
		done();
	});
	it('tests a delay of 0', (done) => {
		let actual = 0;
		sleep(0).then(() => {
			actual = 1;
		}, done);
		setImmediate(() => {
			expect(actual).to.eq(1);
			done();
		});
	});
	it('tests the hurry method passing an Error', async () => {
		const controller = new AbortController();
		const sleepPromise = sleep(10, {signal: controller.signal});
		controller.abort(new Error('skip this!'));
		await expect(sleepPromise).to.eventually.be.rejectedWith('skip this!');
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
		sleepPromise.then(
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
		sleepPromise.then(
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

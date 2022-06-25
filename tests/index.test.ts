import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';
import chai, {expect} from 'chai';
import {sleep} from '../src/lib';
import {makeSignal} from '@cdellacqua/signals';

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
	it('tests hurry$ without rejecting', (done) => {
		let actual = 0;
		const hurry$ = makeSignal<void>();
		setTimeout(() => hurry$.emit(), 50);
		sleep(100, {hurry$}).then(() => {
			actual = 1;
		}, done);
		setTimeout(() => {
			expect(actual).to.eq(1);
			done();
		}, 75);
	});
	it('tests timeouts greater than the maximum allowed value accepted by setTimeout', (done) => {
		let actual = 0;
		const hurry$ = makeSignal<void>();
		sleep(0x7fffffff * 2, {hurry$}).then(() => {
			actual = 1;
		}, done);
		setTimeout(() => {
			expect(actual).to.eq(0);
			hurry$.emit();
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
	it('tests the hurry method on a delay of 0', async () => {
		const hurry$ = makeSignal<void>();
		const sleepPromise = sleep(0, {hurry$});
		expect(() => hurry$.emit()).not.to.throw();
		await expect(sleepPromise).to.eventually.not.be.rejected;
	});
	it('tests the hurry method passing an empty Error', async () => {
		const hurry$ = makeSignal<Error>();
		const sleepPromise = sleep(10, {hurry$});
		hurry$.emit(new Error());
		await expect(sleepPromise).to.eventually.be.rejectedWith();
	});
	it('tests the hurry method passing an Error', async () => {
		const hurry$ = makeSignal<Error>();
		const sleepPromise = sleep(10, {hurry$});
		hurry$.emit(new Error('skip this!'));
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
	it('tests an overridden sleep function, hurrying it up', async () => {
		let cleared = 0;
		let set = 0;
		let callback: (() => void) | undefined;
		const hurry$ = makeSignal<void>();
		const sleepPromise = sleep(10, {
			hurry$,
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
		hurry$.emit();
		await sleep(0);
		expect(state).to.eq('resolved');
		expect(set).to.eq(1);
		expect(cleared).to.eq(1);
		expect(callback).to.be.undefined;
	});
	it('tests an overridden sleep function, hurrying it up with an error', async () => {
		let cleared = 0;
		let set = 0;
		let callback: (() => void) | undefined;
		const hurry$ = makeSignal<Error>();
		const sleepPromise = sleep(10, {
			hurry$,
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
		hurry$.emit(new Error());
		await sleep(0);
		expect(state).to.eq('rejected');
		expect(set).to.eq(1);
		expect(cleared).to.eq(1);
		expect(callback).to.be.undefined;
	});
});

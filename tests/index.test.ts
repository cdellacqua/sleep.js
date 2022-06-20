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
	it('tests the skip method', (done) => {
		let actual = 0;
		const sleepPromise = sleep(100);
		setTimeout(() => sleepPromise.skip(), 50);
		sleepPromise.then(() => {
			actual = 1;
		}, done);
		setTimeout(() => {
			expect(actual).to.eq(1);
			done();
		}, 75);
	});
	it('tests timeouts greater than the maximum allowed value accepted by setTimeout', (done) => {
		let actual = 0;
		const sleepPromise = sleep(0x7fffffff * 2);
		sleepPromise.then(() => {
			actual = 1;
		}, done);
		setTimeout(() => {
			expect(actual).to.eq(0);
			sleepPromise.skip();
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
		const sleepPromise = sleep(0);
		sleepPromise.then(() => {
			actual = 1;
		}, done);
		setImmediate(() => {
			expect(actual).to.eq(1);
			done();
		});
	});
	it('tests the skip method on a delay of 0', async () => {
		const sleepPromise = sleep(0);
		expect(() => sleepPromise.skip()).not.to.throw();
		await expect(sleepPromise).to.eventually.not.be.rejected;
	});
	it('tests the skip method passing an error message', async () => {
		const sleepPromise = sleep(10);
		sleepPromise.skip('skip this!');
		await expect(sleepPromise).to.eventually.be.rejected;
	});
});

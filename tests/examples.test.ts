import {expect} from 'chai';
import {sleep} from '../src/lib/index';

describe('examples', () => {
	it('readme 1', (done) => {
		let actual = '';
		sleep(10).then(() => (actual = 'see you in a sec!'), done);
		expect(actual).to.eq('');
		setTimeout(() => {
			expect(actual).to.eq('see you in a sec!');
			done();
		}, 20);
	});
	it('readme 1/alt', (done) => {
		let actual = '';

		(async () => {
			await sleep(10);
			expect(actual).to.eq('');
			actual = 'see you in a sec!';
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('see you in a sec!');
			done();
		}, 20);
	});
	it('readme 2', (done) => {
		let actual = '';
		(async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			await sleep(100, {signal: AbortSignal.timeout(50)}).catch(() => {});
			actual = 'see you in half a sec!';
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('see you in half a sec!');
			done();
		}, 75);
	});
	it('readme 3', (done) => {
		let actual = '';
		(async () => {
			try {
				await sleep(100, {signal: AbortSignal.timeout(50)});
			} catch (err) {
				actual = 'see you in half a sec!';
			}
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('see you in half a sec!');
			done();
		}, 75);
	});
	it('readme 4', (done) => {
		let actual = '';
		(async () => {
			const controller = new AbortController();
			setTimeout(() => {
				controller.abort();
			}, 25);
			try {
				await sleep(50, {signal: controller.signal});
				actual = 'nobody clicked within 1 second!';
			} catch (err) {
				actual = 'somebody clicked within 1 second!';
			}
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('somebody clicked within 1 second!');
			done();
		}, 75);
	});
	it('readme 4/alt', (done) => {
		let actual = '';
		(async () => {
			const controller = new AbortController();
			try {
				await sleep(50, {signal: controller.signal});
				actual = 'nobody clicked within 1 second!';
			} catch (err) {
				actual = 'somebody clicked within 1 second!';
			}
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('nobody clicked within 1 second!');
			done();
		}, 75);
	});
	it('readme 5', (done) => {
		let actual = '';
		(async () => {
			await sleep(10, {
				timeoutApi: {
					setTimeout: (callback, ms) => setTimeout(callback, ms * 3),
					clearTimeout: (timeoutId) => clearTimeout(timeoutId),
				},
			});
			actual = 'see you in... 10 seconds?';
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.not.eq('see you in... 10 seconds?');
			setTimeout(() => {
				expect(actual).to.eq('see you in... 10 seconds?');
				done();
			}, 22);
		}, 10);
	});
});

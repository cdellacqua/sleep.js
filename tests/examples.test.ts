import {makeSignal} from '@cdellacqua/signals';
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
			const hurry$ = makeSignal<void>();
			setTimeout(() => hurry$.emit(), 50);
			await sleep(100, {hurry$});
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
			const hurry$ = makeSignal<void | Error>();
			setTimeout(() => hurry$.emit(new Error('ops!')), 50);
			try {
				await sleep(100, {hurry$});
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

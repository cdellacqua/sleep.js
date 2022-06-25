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
	it('readme 2', (done) => {
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
	it('readme 3', (done) => {
		let actual = '';
		(async () => {
			const sleepPromise = sleep(100);
			setTimeout(() => sleepPromise.hurry(), 50);
			await sleepPromise;
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
			const sleepPromise = sleep(100);
			setTimeout(() => sleepPromise.hurry(new Error('ops!')), 50);
			try {
				await sleepPromise;
			} catch (err) {
				actual = 'see you in half a sec!';
			}
		})().catch(done);
		setTimeout(() => {
			expect(actual).to.eq('see you in half a sec!');
			done();
		}, 75);
	});
});

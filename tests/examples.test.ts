import {sleep} from '../src/lib/index.js';

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('examples', () => {
	it('readme 1', async () => {
		let actual = '';
		const promise = sleep(10).then(() => (actual = 'see you in a sec!'));
		expect(actual).to.eq('');
		await wait(20);
		await promise;
		expect(actual).to.eq('see you in a sec!');
	});
	it('readme 1/alt', async () => {
		let actual = '';

		const promise = (async () => {
			await sleep(10);
			expect(actual).to.eq('');
			actual = 'see you in a sec!';
		})();
		await wait(20);
		await promise;
		expect(actual).to.eq('see you in a sec!');
	});
	it('readme 2', async () => {
		let actual = '';
		await (async () => {
			await sleep(100, {signal: AbortSignal.timeout(50)}).catch(() => {});
			actual = 'see you in half a sec!';
		})();
		expect(actual).to.eq('see you in half a sec!');
	});
	it('readme 3', async () => {
		let actual = '';
		await (async () => {
			try {
				await sleep(100, {signal: AbortSignal.timeout(50)});
			} catch {
				actual = 'see you in half a sec!';
			}
		})();
		expect(actual).to.eq('see you in half a sec!');
	});
	it('readme 4', async () => {
		let actual = '';
		await (async () => {
			const controller = new AbortController();
			setTimeout(() => {
				controller.abort();
			}, 25);
			try {
				await sleep(50, {signal: controller.signal});
				actual = 'nobody clicked within 1 second!';
			} catch {
				actual = 'somebody clicked within 1 second!';
			}
		})();
		expect(actual).to.eq('somebody clicked within 1 second!');
	});
	it('readme 4/alt', async () => {
		let actual = '';
		await (async () => {
			const controller = new AbortController();
			try {
				await sleep(50, {signal: controller.signal});
				actual = 'nobody clicked within 1 second!';
			} catch {
				actual = 'somebody clicked within 1 second!';
			}
		})();
		expect(actual).to.eq('nobody clicked within 1 second!');
	});
	it('readme 5', async () => {
		let actual = '';
		const promise = (async () => {
			await sleep(10, {
				timeoutApi: {
					setTimeout: (callback, ms) => setTimeout(callback, ms * 3),
					clearTimeout: (timeoutId) => clearTimeout(timeoutId),
				},
			});
			actual = 'see you in... 10 seconds?';
		})();
		await wait(10);
		expect(actual).to.not.eq('see you in... 10 seconds?');
		await wait(22);
		await promise;
		expect(actual).to.eq('see you in... 10 seconds?');
	});
});

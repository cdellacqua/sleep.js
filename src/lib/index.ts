const maxSupportedTimeout = 0x7fffffff;

type TimeoutContext = {id: ReturnType<typeof setTimeout>};

const patchedSetTimeout = (
	callback: () => void,
	ms: number,
	timeoutContext?: Partial<TimeoutContext>,
): TimeoutContext => {
	timeoutContext = timeoutContext || {id: undefined};
	if (ms > maxSupportedTimeout) {
		timeoutContext.id = setTimeout(
			patchedSetTimeout,
			maxSupportedTimeout,
			callback,
			ms - maxSupportedTimeout,
			timeoutContext,
		);
	} else {
		timeoutContext.id = setTimeout(callback, ms);
	}
	return timeoutContext as TimeoutContext;
};

const patchedClearTimeout = (timeoutContext: TimeoutContext) => clearTimeout(timeoutContext.id);

/**
 * A Promise containing a skip method.
 */
export type SleepPromise = Promise<void> & {
	/**
	 * Skip the specified timeout and resolve early.
	 *
	 * If an error is passed, the pending promise will be rejected with it instead
	 * of being resolved.
	 *
	 * @param err (optional) if passed, rejects the pending Promise, otherwise it will be resolved early.
	 */
	skip(err?: unknown): void;
};

const noop = () => undefined as void;

/**
 * Return a Promise that resolves after the specified delay.
 *
 * The returned Promise provides a `skip` method that can
 * be used to resolve (or reject) early.
 *
 * Note: although using setTimeout under the hood, you can pass a value greater than
 * its usual limit of 2147483647 (0x7fffffff, ~24.8 days). This implementation
 * will take care of huge values by using setTimeout multiple times if needed.
 *
 * Note: if the delay is 0 the returned Promise will be already resolved.
 *
 * @param ms a delay in milliseconds.
 * @returns a {@link SleepPromise}
 */
export const sleep = (ms: number): SleepPromise => {
	const normalizedMs = Math.max(0, Math.ceil(ms));

	if (normalizedMs === 0) {
		const promise = Promise.resolve();
		(promise as SleepPromise).skip = noop;
		return promise as SleepPromise;
	}

	let id: ReturnType<typeof patchedSetTimeout> | undefined;
	let resolve = noop;
	let reject: (err: unknown) => void = noop;
	const promise = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
		id = patchedSetTimeout(() => {
			id = undefined;
			resolve();
		}, normalizedMs);
	});
	(promise as SleepPromise).skip = (err?: unknown) => {
		if (id !== undefined) {
			patchedClearTimeout(id);
			id = undefined;
			if (err !== undefined) {
				reject(err);
			} else {
				resolve();
			}
		}
	};
	return promise as SleepPromise;
};

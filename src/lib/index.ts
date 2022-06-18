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
	 */
	skip(): void;
};

const noop = () => undefined as void;

/**
 * Return a Promise that resolves after the specified delay.
 *
 * The returned Promise provides a `skip` method that can
 * be used to resolve early.
 *
 * Note: although using setTimeout under the hood, you can pass a value greater than
 * its usual limit of 2147483647 (0x7fffffff, ~24.8 days). This implementation
 * will take care of huge values by using setTimeout multiple times if needed.
 *
 * @param ms a delay in milliseconds.
 * @returns a {@link SleepPromise}
 */
export const sleep = (ms: number): SleepPromise => {
	const normalizedMs = Math.max(0, Math.ceil(ms));

	let id: ReturnType<typeof patchedSetTimeout> | undefined;
	let resolve = noop;
	const promise = new Promise<void>((res) => {
		resolve = res;
		id = patchedSetTimeout(resolve, normalizedMs);
	});
	(promise as SleepPromise).skip = () => {
		if (id !== undefined) {
			patchedClearTimeout(id);
			resolve();
			resolve = noop;
		}
	};
	return promise as SleepPromise;
};

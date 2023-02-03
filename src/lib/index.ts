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
 * Any viable type that may be used by a setTimeout implementation.
 */
export type TimeoutIdentifier = string | number | boolean | symbol | bigint | object | null;

/**
 * A basic timeout API must provide a setTimeout and a clearTimeout function.
 */
export type TimeoutAPI<T extends TimeoutIdentifier> = {
	setTimeout(callback: () => void, ms: number): T;
	clearTimeout(timeoutId: T): void;
};

/**
 * A configuration object for the `sleep` function.
 */
export type SleepConfig<T extends TimeoutIdentifier> = {
	/**
	 * An optional AbortSignal that can be used
	 * to cancel (by rejecting with the abort reason) the sleep promise before its natural termination.
	 */
	signal?: AbortSignal;
	/**
	 * A custom timeout API that provides setTimeout and clearTimeout.
	 */
	timeoutApi?: TimeoutAPI<T>;
};

/**
 * Return a Promise that resolves after the specified delay.
 *
 * The second parameter is a `config` object that can contain a custom timeout API,
 * providing setTimeout and clearTimeout functions,
 * and an AbortSignal that can be used
 * to cancel (by rejecting with the abort reason) the sleep promise before its natural termination.
 *
 * Overriding the timeout API can be useful in tests or in scenarios where you would want
 * to use more precise timing than what setTimeout can offer.
 *
 * Note: if the delay is 0 the returned Promise will be already resolved.
 *
 * @param ms a delay in milliseconds.
 * @param config an object containing a signal and custom timeout API providing setTimeout and clearTimeout functions.
 * @returns a Promise
 */
export function sleep<T extends TimeoutIdentifier>(ms: number, config: SleepConfig<T>): Promise<void>;

/**
 * Return a Promise that resolves after the specified delay.
 *
 * Note: if the delay is 0 the returned Promise will be already resolved.
 *
 * @param ms a delay in milliseconds.
 * @returns a Promise
 */
export function sleep(ms: number): Promise<void>;
export function sleep(ms: number, config?: SleepConfig<TimeoutIdentifier>): Promise<void> {
	const normalizedMs = Math.max(0, Math.ceil(ms));

	const timeoutApi = config?.timeoutApi
		? config.timeoutApi
		: ({
				setTimeout: patchedSetTimeout,
				clearTimeout: patchedClearTimeout,
		  } as TimeoutAPI<TimeoutIdentifier>);

	if (config?.signal?.aborted) {
		return Promise.reject(config.signal.reason);
	}
	if (normalizedMs === 0) {
		return Promise.resolve();
	}

	let id: TimeoutIdentifier | undefined;

	const promise = new Promise<void>((res, rej) => {
		id = timeoutApi.setTimeout(() => {
			id = undefined;
			res();
		}, normalizedMs);

		if (config?.signal) {
			const signal = config.signal;
			signal.addEventListener('abort', () => {
				if (id !== undefined) {
					timeoutApi.clearTimeout(id);
					id = undefined;
					rej(signal.reason);
				}
			});
		}
	});

	return promise;
}

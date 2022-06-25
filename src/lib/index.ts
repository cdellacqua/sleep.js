import {HastyPromise, makeHastyPromise} from 'hasty-promise';

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

export type TimeoutIdentifier = string | number | boolean | symbol | bigint | object | null;

export type SleepConfig<T extends TimeoutIdentifier> = {
	setTimeout: (callback: () => void, ms: number) => T;
	clearTimeout: (timeoutId: T) => void;
};

/**
 * Return a Promise that resolves after the specified delay.
 *
 * The returned Promise provides a `hurry` method that can
 * be used to resolve or reject early. Calling `hurry` without
 * any parameter will resolve the promise, while calling it with
 * an Error instance will reject it with the given Error.
 *
 * This overload takes an `overrides` object as its second parameter
 * containing custom setTimeout and clearTimeout functions. This
 * can be useful in tests or in scenarios where you would want
 * to use more precise timing than what setTimeout can offer.
 *
 * Note: if the delay is 0 the returned Promise will be already resolved.
 *
 * @param ms a delay in milliseconds.
 * @param overrides an object containing custom setTimeout and clearTimeout functions.
 * @returns a {@link HastyPromise}
 */
export function sleep<T extends TimeoutIdentifier>(
	ms: number,
	overrides: SleepConfig<T>,
): HastyPromise<void, Error | void>;

/**
 * Return a Promise that resolves after the specified delay.
 *
 * The returned Promise provides a `hurry` method that can
 * be used to resolve or reject early. Calling `hurry` without
 * any parameter will resolve the promise, while calling it with
 * an Error instance will reject it with the given Error.
 *
 * Note: although using setTimeout under the hood, you can pass a value greater than
 * its usual limit of 2147483647 (0x7fffffff, ~24.8 days). This implementation
 * will take care of huge values by using setTimeout multiple times if needed.
 *
 * Note: if the delay is 0 the returned Promise will be already resolved.
 *
 * @param ms a delay in milliseconds.
 * @returns a {@link HastyPromise}
 */
export function sleep(ms: number): HastyPromise<void, Error | void>;
export function sleep(ms: number, overrides?: SleepConfig<TimeoutIdentifier>): HastyPromise<void, Error | void> {
	const normalizedMs = Math.max(0, Math.ceil(ms));

	const config = overrides
		? overrides
		: ({
				setTimeout: patchedSetTimeout,
				clearTimeout: patchedClearTimeout,
		  } as SleepConfig<TimeoutIdentifier>);

	if (normalizedMs === 0) {
		const promise = makeHastyPromise<void>((res) => {
			res();
			return () => undefined;
		});
		return promise;
	}

	let id: TimeoutIdentifier | undefined;

	const promise = makeHastyPromise<void, Error | void>((res, rej) => {
		id = config.setTimeout(() => {
			id = undefined;
			res();
		}, normalizedMs);

		return (reason) => {
			if (id !== undefined) {
				config.clearTimeout(id);
				id = undefined;
				if (reason !== undefined) {
					rej(reason);
				} else {
					res();
				}
			}
		};
	});

	return promise;
}

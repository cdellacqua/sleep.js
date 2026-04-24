[**@cdellacqua/sleep**](../README.md)

***

[@cdellacqua/sleep](../README.md) / SleepConfig

# Type Alias: SleepConfig\<T\>

> **SleepConfig**\<`T`\> = `object`

Defined in: [index.ts:43](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L43)

A configuration object for the `sleep` function.

## Type Parameters

### T

`T` *extends* [`TimeoutIdentifier`](TimeoutIdentifier.md)

## Properties

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.ts:48](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L48)

An optional AbortSignal that can be used
to cancel (by rejecting with the abort reason) the sleep promise before its natural termination.

***

### timeoutApi?

> `optional` **timeoutApi?**: [`TimeoutAPI`](TimeoutAPI.md)\<`T`\>

Defined in: [index.ts:52](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L52)

A custom timeout API that provides setTimeout and clearTimeout.

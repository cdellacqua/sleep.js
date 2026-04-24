[**@cdellacqua/sleep**](../README.md)

***

[@cdellacqua/sleep](../README.md) / sleep

# Function: sleep()

## Call Signature

> **sleep**\<`T`\>(`ms`, `config`): `Promise`\<`void`\>

Defined in: [index.ts:72](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L72)

Return a Promise that resolves after the specified delay.

The second parameter is a `config` object that can contain a custom timeout API,
providing setTimeout and clearTimeout functions,
and an AbortSignal that can be used
to cancel (by rejecting with the abort reason) the sleep promise before its natural termination.

Overriding the timeout API can be useful in tests or in scenarios where you would want
to use more precise timing than what setTimeout can offer.

Note: if the delay is 0 the returned Promise will be already resolved.

### Type Parameters

#### T

`T` *extends* [`TimeoutIdentifier`](../type-aliases/TimeoutIdentifier.md)

### Parameters

#### ms

`number`

a delay in milliseconds.

#### config

[`SleepConfig`](../type-aliases/SleepConfig.md)\<`T`\>

an object containing a signal and custom timeout API providing setTimeout and clearTimeout functions.

### Returns

`Promise`\<`void`\>

a Promise

## Call Signature

> **sleep**(`ms`): `Promise`\<`void`\>

Defined in: [index.ts:82](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L82)

Return a Promise that resolves after the specified delay.

Note: if the delay is 0 the returned Promise will be already resolved.

### Parameters

#### ms

`number`

a delay in milliseconds.

### Returns

`Promise`\<`void`\>

a Promise

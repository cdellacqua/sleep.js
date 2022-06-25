@cdellacqua/sleep

# @cdellacqua/sleep

## Table of contents

### Type Aliases

- [SleepConfig](README.md#sleepconfig)
- [TimeoutAPI](README.md#timeoutapi)
- [TimeoutIdentifier](README.md#timeoutidentifier)

### Functions

- [sleep](README.md#sleep)

## Type Aliases

### SleepConfig

Ƭ **SleepConfig**<`T`\>: `Object`

A configuration object for the `sleep` function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TimeoutIdentifier`](README.md#timeoutidentifier) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `hurry$?` | `ReadonlySignal`<`void` \| `Error`\> | A [ReadonlySignal](https://www.npmjs.com/package/@cdellacqua/signals) that can be used to resolve (or reject) the promise before the specified delay has passed.  Calling `emit` without any parameter will resolve the promise, while calling it with an Error instance will reject it with the passed Error. |
| `timeoutApi?` | [`TimeoutAPI`](README.md#timeoutapi)<`T`\> | A custom timeout API that provides setTimeout and clearTimeout. |

#### Defined in

[index.ts:45](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L45)

___

### TimeoutAPI

Ƭ **TimeoutAPI**<`T`\>: `Object`

A basic timeout API must provide a setTimeout and a clearTimeout function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TimeoutIdentifier`](README.md#timeoutidentifier) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clearTimeout` | (`timeoutId`: `T`) => `void` |
| `setTimeout` | (`callback`: () => `void`, `ms`: `number`) => `T` |

#### Defined in

[index.ts:37](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L37)

___

### TimeoutIdentifier

Ƭ **TimeoutIdentifier**: `string` \| `number` \| `boolean` \| `symbol` \| `bigint` \| `object` \| ``null``

Any viable type that may be used by a setTimeout implementation.

#### Defined in

[index.ts:32](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L32)

## Functions

### sleep

▸ **sleep**<`T`\>(`ms`, `config`): `Promise`<`void`\>

Return a Promise that resolves after the specified delay.

The second parameter is a `config` object that can contain a custom timeout API,
providing setTimeout and clearTimeout functions,
and a [ReadonlySignal](https://www.npmjs.com/package/@cdellacqua/signals) that can be used
to cancel the sleep promise before its natural termination.

Overriding the timeout API can be useful in tests or in scenarios where you would want
to use more precise timing than what setTimeout can offer.

Calling `emit` without any parameter will resolve the promise, while
calling it with an Error instance will reject it with the passed Error.

Note: if the delay is 0 the returned Promise will be already resolved.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TimeoutIdentifier`](README.md#timeoutidentifier) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | a delay in milliseconds. |
| `config` | [`SleepConfig`](README.md#sleepconfig)<`T`\> | an object containing a hurry$ signal and custom timeout API providing setTimeout and clearTimeout functions. |

#### Returns

`Promise`<`void`\>

a Promise

#### Defined in

[index.ts:81](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L81)

▸ **sleep**(`ms`): `Promise`<`void`\>

Return a Promise that resolves after the specified delay.

Note: if the delay is 0 the returned Promise will be already resolved.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | a delay in milliseconds. |

#### Returns

`Promise`<`void`\>

a Promise

#### Defined in

[index.ts:91](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L91)

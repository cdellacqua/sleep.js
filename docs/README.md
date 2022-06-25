@cdellacqua/sleep

# @cdellacqua/sleep

## Table of contents

### Type Aliases

- [SleepConfig](README.md#sleepconfig)
- [TimeoutIdentifier](README.md#timeoutidentifier)

### Functions

- [sleep](README.md#sleep)

## Type Aliases

### SleepConfig

Ƭ **SleepConfig**<`T`\>: `Object`

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

[index.ts:31](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L31)

___

### TimeoutIdentifier

Ƭ **TimeoutIdentifier**: `string` \| `number` \| `boolean` \| `symbol` \| `bigint` \| `object` \| ``null``

#### Defined in

[index.ts:29](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L29)

## Functions

### sleep

▸ **sleep**<`T`\>(`ms`, `overrides`): `HastyPromise`<`void`, `Error` \| `void`\>

Return a Promise that resolves after the specified delay.

The returned Promise provides a `hurry` method that can
be used to resolve or reject early. Calling `hurry` without
any parameter will resolve the promise, while calling it with
an Error instance will reject it with the given Error.

This overload takes an `overrides` object as its second parameter
containing custom setTimeout and clearTimeout functions. This
can be useful in tests or in scenarios where you would want
to use more precise timing than what setTimeout can offer.

Note: if the delay is 0 the returned Promise will be already resolved.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TimeoutIdentifier`](README.md#timeoutidentifier) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | a delay in milliseconds. |
| `overrides` | [`SleepConfig`](README.md#sleepconfig)<`T`\> | an object containing custom setTimeout and clearTimeout functions. |

#### Returns

`HastyPromise`<`void`, `Error` \| `void`\>

a {@link HastyPromise}

#### Defined in

[index.ts:55](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L55)

▸ **sleep**(`ms`): `HastyPromise`<`void`, `Error` \| `void`\>

Return a Promise that resolves after the specified delay.

The returned Promise provides a `hurry` method that can
be used to resolve or reject early. Calling `hurry` without
any parameter will resolve the promise, while calling it with
an Error instance will reject it with the given Error.

Note: although using setTimeout under the hood, you can pass a value greater than
its usual limit of 2147483647 (0x7fffffff, ~24.8 days). This implementation
will take care of huge values by using setTimeout multiple times if needed.

Note: if the delay is 0 the returned Promise will be already resolved.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | a delay in milliseconds. |

#### Returns

`HastyPromise`<`void`, `Error` \| `void`\>

a {@link HastyPromise}

#### Defined in

[index.ts:77](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L77)

@cdellacqua/sleep

# @cdellacqua/sleep

## Table of contents

### Type Aliases

- [SleepPromise](README.md#sleeppromise)

### Functions

- [sleep](README.md#sleep)

## Type Aliases

### SleepPromise

Ƭ **SleepPromise**: `Promise`<`void`\> & { `skip`: (`err?`: `unknown`) => `void`  }

A Promise containing a skip method.

#### Defined in

[index.ts:30](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L30)

## Functions

### sleep

▸ **sleep**(`ms`): [`SleepPromise`](README.md#sleeppromise)

Return a Promise that resolves after the specified delay.

The returned Promise provides a `skip` method that can
be used to resolve (or reject) early.

Note: although using setTimeout under the hood, you can pass a value greater than
its usual limit of 2147483647 (0x7fffffff, ~24.8 days). This implementation
will take care of huge values by using setTimeout multiple times if needed.

Note: if the delay is 0 the returned Promise will be already resolved.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | a delay in milliseconds. |

#### Returns

[`SleepPromise`](README.md#sleeppromise)

a [SleepPromise](README.md#sleeppromise)

#### Defined in

[index.ts:59](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L59)

[**@cdellacqua/sleep**](../README.md)

***

[@cdellacqua/sleep](../README.md) / TimeoutAPI

# Type Alias: TimeoutAPI\<T\>

> **TimeoutAPI**\<`T`\> = `object`

Defined in: [index.ts:35](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L35)

A basic timeout API must provide a setTimeout and a clearTimeout function.

## Type Parameters

### T

`T` *extends* [`TimeoutIdentifier`](TimeoutIdentifier.md)

## Methods

### clearTimeout()

> **clearTimeout**(`timeoutId`): `void`

Defined in: [index.ts:37](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L37)

#### Parameters

##### timeoutId

`T`

#### Returns

`void`

***

### setTimeout()

> **setTimeout**(`callback`, `ms`): `T`

Defined in: [index.ts:36](https://github.com/cdellacqua/sleep.js/blob/main/src/lib/index.ts#L36)

#### Parameters

##### callback

() => `void`

##### ms

`number`

#### Returns

`T`

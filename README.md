# @cdellacqua/sleep

Delay execution using Promises.

This library implements a `sleep` function that uses
`setTimeout` under the hood to create a Promise
that resolves after a specified number of milliseconds.

Contrary to the bare `setTimeout` function, this library
also supports delays greater than 2147483647 (0x7fffffff, ~24.8 days).

[NPM Package](https://www.npmjs.com/package/@cdellacqua/sleep)

`npm install @cdellacqua/sleep`

[Documentation](./docs/README.md)

## Highlights

Basic usage example:

```ts
import {sleep} from '@cdellacqua/sleep';

sleep(1000).then(() => console.log('see you in a sec!'));
```

Same example, with await:

```ts
import {sleep} from '@cdellacqua/sleep';

async function example() {
	await sleep(1000);
	console.log('see you in a sec!');
}
```

Skip timeout after 500ms:

```ts
import {sleep} from '@cdellacqua/sleep';

async function example() {
	const sleepPromise = sleep(1000);
	setTimeout(() => sleepPromise.hurry(), 500);
	await sleepPromise;
	console.log('see you in half a sec!');
}
```

Abort timeout after 500ms, rejecting the promise:

```ts
import {sleep} from '@cdellacqua/sleep';

async function example() {
	const sleepPromise = sleep(1000);
	setTimeout(() => sleepPromise.hurry(new Error('ops!')), 500);
	try {
		await sleepPromise;
	} catch (err) {
		console.log('see you in half a sec!');
	}
}
```

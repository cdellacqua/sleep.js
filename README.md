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
import {makeSignal} from '@cdellacqua/signals';

async function example() {
	const hurry$ = makeSignal<void>();
	setTimeout(() => hurry$.emit(), 500);
	await sleep(1000, {hurry$});
	console.log('see you in half a sec!');
}
```

Abort timeout after 500ms, rejecting the promise:

```ts
import {sleep} from '@cdellacqua/sleep';
import {makeSignal} from '@cdellacqua/signals';

async function example() {
	const hurry$ = makeSignal<void | Error>();
	setTimeout(() => hurry$.emit(new Error('ops!')), 500);
	try {
		await sleep(1000, {hurry$});
	} catch (err) {
		console.log('see you in half a sec!');
	}
}
```

Use custom setTimeout/clearTimeout implementation:

```ts
import {sleep} from '@cdellacqua/sleep';

async function example() {
	await sleep(1000, {
		timeoutApi: {
			setTimeout: (callback, ms) => setTimeout(callback, ms * 3),
			clearTimeout: (timeoutId) => clearTimeout(timeoutId),
		},
	});
	console.log('see you in... 3 seconds?');
}
```

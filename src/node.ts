import {sleep} from './lib/index.js';

console.log('waiting one second...');
sleep(1000).then(() => {
	console.log(' ...and here I am!');
}, console.error);

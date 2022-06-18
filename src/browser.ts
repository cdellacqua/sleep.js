import './style.css';
import {sleep} from './lib';

const appDiv = document.getElementById('app') as HTMLDivElement;

appDiv.appendChild(document.createTextNode('waiting one second...'));
sleep(1000).then(() => {
	appDiv.appendChild(document.createTextNode(' ...and here I am!'));
}, console.error);

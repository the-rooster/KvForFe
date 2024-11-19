import { StegoBaseApp } from './index.js';
import pkg from 'websocket';

global.WebSocket = pkg.client;

const app = StegoBaseApp.init('localhost:8000');

app.get(['foo']);
app.set(['foo'], {'bar': 'baz'});
app.update(['foo'], {'bar': 'qux'});
app.get(['foo']);


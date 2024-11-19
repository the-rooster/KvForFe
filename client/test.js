import { StegoBaseApp } from './index.js';

const app = StegoBaseApp.init('http://localhost:3000');

app.get(['foo']);
app.set(['foo'], {'bar': 'baz'});
app.update(['foo'], {'bar': 'qux'});
app.get(['foo']);


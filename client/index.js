
function formatRequest(type, requestId, payload) {
    return JSON.stringify({
        type: type,
        requestId: requestId,
        payload: payload
    });
}

function generateRequestId() {
    return Math.random().toString(36).substring(10);
}

function createWsResponsePromise(ws, requestId, timeout) {
    return new Promise((resolve, reject) => {
        let t = setTimeout(() => {
            reject('timeout');
        }, timeout);
        ws.addEventListener('message', (event) => {
            let response = JSON.parse(event.data);
            if (response.requestId !== requestId) {
                return;
            }
            clearTimeout(t);
            resolve(response);
        });
    });
}

const StegoAppLogger = {
    info: function(...message) {
        console.log('StegoApp: info', message)
    },
    error: function(...message) {
        console.error('StegoApp: error', message)
    },
    warn: function(...message) {
        console.warn('StegoApp: warn', message)
    },
    debug: function(...message) {
        console.debug('StegoApp: debug', message)
    }
}

export const StegoBaseApp = {
    baseUrl: 'http://localhost:3000',
    apiKey: '',
    ws: null,
    timeout: 3000,
    debug: false,

    init: function(
        baseUrl = 'localhos,t:3000',
        apiKey = '',
        settings = {
            timeout: 3000,
            debug: false
        }
    ) {
        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.timeout = settings.timeout ? settings.timeout : 3000
        this.debug = settings.debug ? settings.debug : false

        this.debug && StegoAppLogger.debug('connecting to', `ws://${this.baseUrl}/ws`)

        this.ws = new WebSocket(`ws:/${baseUrl}/ws`)
        this.ws.addEventListener('message', (event) => {
            this.debug && StegoAppLogger.debug('message', event.data)
        });

        return this;
    },
    get: function(path) {
        this.debug && StegoAppLogger.debug('get', path)
        const requestId = generateRequestId()
        this.ws.send(formatRequest('get', requestId, {
            query: {
                path: path
            }
        }));
        return createWsResponsePromise(this.ws, requestId, this.timeout);
    },
    list: function(path) {
        this.debug && StegoAppLogger.debug('list', path)
        const requestId = generateRequestId()
        this.ws.send(formatRequest('list', requestId, {
            query: {
                path: path
            }
        }))
        return createWsResponsePromise(this.ws, requestId, this.timeout);
    },
    set: function(path, value) {
        this.debug && console.log('set', path, value)
        const requestId = generateRequestId()
        this.ws.send(formatRequest('set', requestId, {
            query: {
                path: path
            },
            value: value
        }))
        return createWsResponsePromise(this.ws, requestId, this.timeout);
    },
    update: function(path, value) {
        this.debug && StegoAppLogger.debug('update', path, value)
        const requestId = generateRequestId()
        this.ws.send(formatRequest('update', requestId, {
            query: {
                path: path
            },
            value: value
        }))
        return createWsResponsePromise(this.ws, requestId, this.timeout);
    },
    delete: function(path) {
        this.debug && StegoAppLogger.debug('delete', path)
        const requestId = generateRequestId()
        this.ws.send(formatRequest('delete', requestId, {
            query: {
                path: path
            },
        }))
        return createWsResponsePromise(this.ws, requestId, this.timeout);
    },
    subscribe: function(path) {
        this.debug && StegoAppLogger.debug('subscribe', path)
        // TODO: this
        this.ws.send(JSON.stringify({
            type: "subscribe",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                }
            }}))
        // TODO: stream values back until unsubscribe
        // TODO: return unsubscribe function
    }
}

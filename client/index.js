
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

export const StegoBaseApp = {
    baseUrl: 'http://localhost:3000',
    apiKey: '',
    ws: null,
    timeout: 3000,

    init: function(
        baseUrl = 'localhos,t:3000',
        apiKey = ''
        timeout = 3000
    ) {
        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.timeout = timeout

        console.log('connecting to', `ws://${this.baseUrl}/ws`)

        this.ws = new WebSocket(`ws:/${baseUrl}/ws`)
        this.ws.addEventListener('message', (event) => {
            console.log('Message from server ', event.data)
        });


        return this;
    },
    get: function(path) {
        const requestId = generateRequestId()

        this.ws.send(formatRequest('get', requestId, {
            query: {
                path: path
            }
        }));

        // create a promise (with timeout) which will be resolved when the response is received
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('timeout');
            }, this.timeout);

            this.ws.addEventListener('message', (event) => {
                // check that request id matches
                let response = JSON.parse(event.data);
                if (response.requestId !== requestId) {
                    return;
                }

                clearTimeout(timeout);
                resolve(response);
            });
        });
    },
    list: function(path) {
        const requestId = generateRequestId()
        this.ws.send(formatRequest('list', requestId, {
            query: {
                path: path
            }
        }))

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('timeout');
            }, this.timeout);

            this.ws.addEventListener('message', (event) => {
                // check that request id matches
                let response = JSON.parse(event.data);
                if (response.requestId !== requestId) {
                    return;
                }

                clearTimeout(timeout);
                resolve(response);
            });
        })
    },
    set: function(path, value) {
        const requestId = generateRequestId()
        this.ws.send(formatRequest('set', requestId, {
            query: {
                path: path
            },
            value: value
        }))

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('timeout');
            }, this.timeout);

            this.ws.addEventListener('message', (event) => {
                // check that request id matches
                let response = JSON.parse(event.data);
                if (response.requestId !== requestId) {
                    return;
                }

                clearTimeout(timeout);
                resolve(response);
            });
        });
    },
    update: function(path, value) {
        const requestId = generateRequestId()
        this.ws.send(formatRequest('update', requestId, {
            query: {
                path: path
            },
            value: value
        }))

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('timeout');
            }, this.timeout);

            this.ws.addEventListener('message', (event) => {
                // check that request id matches
                let response = JSON.parse(event.data);
                if (response.requestId !== requestId) {
                    return;
                }

                clearTimeout(timeout);
                resolve(response);
            });
        })
    },
    delete: function(path) {
        const requestId = generateRequestId()
        this.ws.send(formatRequest('delete', requestId, {
            query: {
                path: path
            },
        }))

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('timeout');
            }, this.timeout);

            this.ws.addEventListener('message', (event) => {
                // check that request id matches
                let response = JSON.parse(event.data);
                if (response.requestId !== requestId) {
                    return;
                }

                clearTimeout(timeout);
                resolve(response.payload);
            });
        })
    },
    subscribe: function(path) {
        // todo
        this.ws.send(JSON.stringify({
            type: "subscribe",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                }
            }}))
    },
    unsubscribe: function(path) {
        // todo
        this.ws.send(JSON.stringify({
            type: "unsubscribe",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                },
            }}))
    }
}
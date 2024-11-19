
export const StegoBaseApp = {
    baseUrl: 'http://localhost:3000',
    apiKey: '',
    ws: null,

    init: function(
        baseUrl = 'http://localhost:3000',
        apiKey = ''
    ) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey

        this.ws = new WebSocket(`${this.baseUrl}/ws?apiKey=${this.apiKey}`);
        this.ws.onopen = () => {
            console.log('connected');
        };
        this.ws.onmessage = (event) => {
            console.log(event.data);
        };

        return this;
    },

    get: function(path) {
        this.ws.send(JSON.stringify({
            type: "get",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                }
            }}));
    },

    set: function(path, value) {
        this.ws.send(JSON.stringify({
            type: "set",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                },
                value: value
            }}));
    },
    
    update: function(path, value) {
        this.ws.send(JSON.stringify({
            type: "update",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                },
                value: value
            }}));
        },

    delete: function(path) {
        this.ws.send(JSON.stringify({
            type: "delete",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                }
            }}));
    },

    subscribe: function(path) {
        this.ws.send(JSON.stringify({
            type: "subscribe",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                }
            }}));
    },

    unsubscribe: function(path) {
        this.ws.send(JSON.stringify({
            type: "unsubscribe",
            requestId: Math.random().toString(36).substring(7),
            payload: {
                query: {
                    path: path
                },
            }}));
        }
}
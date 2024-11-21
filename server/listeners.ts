import type { WSContext } from "hono/helpers";
import { WatchChangesRequest, type WatchChangesRequestType } from "./types.ts";
import { kv } from "./main.ts";
import type { UnsubscribeRequestType } from "./types.ts";
import { UnsubscribeRequest } from "./types.ts";

async function listenToChanges(ws: WSContext<WebSocket>, path: any[], listenerId: string) {
    // set up watcher on query and send updates
    for await (const res of kv.watch(path)) {
        ws.send({ listenerId, value: res });
    }

}

export async function watchChanges(wsMessage: unknown, ws: WSContext<WebSocket>, requestId: string) {
    // decode message
    let body: WatchChangesRequestType;
    try {
        body = WatchChangesRequest.parse(wsMessage);
    // deno-lint-ignore no-explicit-any
    } catch (error: any) {
        ws.send(JSON.stringify({ error: error.toString() }));
        return;
    }

    const listenerId = crypto.randomUUID();

    /*
        TODO:
        - create an entry in a listeners table in kv
        - if a unsubscribe message is received on the samee listenerId kv entry, remove the listener
    */

    // set up watcher on query and send updates
    for await (const res of kv.watch([body.query.path])) {
        ws.send({ listenerId, value: res });
    }
}

export async function unwatchChanges(wsMessage: unknown, ws: WSContext<WebSocket>) {
    // decode message
    let body: UnsubscribeRequestType
    try {
        body = UnsubscribeRequest.parse(wsMessage);
    // deno-lint-ignore no-explicit-any
    } catch (error: any) {
        ws.send(JSON.stringify({ error: error.toString() }));
        return;
    }

    const listenerId = body.listenerId;


    // TODO: this should send a message to the kv store to remove the listener
    ws.send(JSON.stringify({ listenerId }));
}
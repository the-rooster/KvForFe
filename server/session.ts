import type { WSContext } from "hono/helper";
import {z} from "zod";
import { WSMessage, WSMessageType } from "./types.ts";
import { delete_, get, set, update } from "./crud.ts";

export const onMessage = (event: MessageEvent, ws: WSContext<WebSocket>) => {
    const wsMessage = WSMessage.parse(JSON.parse(event.data));
    const requestId = wsMessage.requestId;
    switch (wsMessage.type) {
        case WSMessageType.Values.subscribe:
            console.log("subscribe", wsMessage);
            break;
        case WSMessageType.Values.unsubscribe:
            console.log("unsubscribe", wsMessage);
            break;
        case WSMessageType.Values.get:
            console.log("get", wsMessage);
            get(wsMessage.payload, ws, requestId);
            break;
        case WSMessageType.Values.set:
            console.log("set", wsMessage);
            set(wsMessage.payload, ws, requestId);
            break;
        case WSMessageType.Values.update:
            console.log("update", wsMessage);
            update(wsMessage.payload, ws, requestId);
            break;
        case WSMessageType.Values.delete:
            console.log("delete", wsMessage);
            delete_(wsMessage.payload, ws, requestId);
            break;
        default:
            console.error("Unknown message type", wsMessage);
            ws.send(JSON.stringify({ error: "Unknown message type" }));
            break;
    }
};
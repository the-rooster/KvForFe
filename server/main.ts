import { Hono, type Context } from 'npm:hono'
import { upgradeWebSocket } from 'npm:hono/deno'
import { onMessage } from "./session.ts";

const app = new Hono()
export const kv = await Deno.openKv("./kv-local.db")


// todo: auth + crud routes

app.get(
  '/ws',
  upgradeWebSocket((_c : Context) => {
    return {
      onMessage(event, ws) {
        onMessage(event, ws)
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

Deno.serve(app.fetch);
import { z } from "zod"

export const WSMessageType = z.enum(["subscribe", "unsubscribe", "get", "set", "list", "update", "delete"])
export const WSMessage = z.object({
    type: WSMessageType,
    requestId: z.string(),
    payload: z.unknown(),
})


export const Query = z.object({
    path: z.array(z.any()),
})

export const BaseRequest = z.object({
})

export const BaseResponse = z.object({
    requestId: z.string(),
})

// crud
export const GetRequest = BaseRequest.merge(z.object({
    path: z.array(z.any()),
}))
export const GetResponse = BaseResponse.merge(z.object({
    value: z.unknown(),
}))
export type GetRequestType = z.infer<typeof GetRequest>
export type GetResponseType = z.infer<typeof GetResponse>

export const ListRequest = BaseRequest.merge(z.object({
    start: z.array(z.any()), // start key
    end: z.optional(z.array(z.any())), // end key
}))
export const ListResponse = BaseResponse.merge(z.object({
    value: z.unknown(),
}))
export type ListRequestType = z.infer<typeof ListRequest>
export type ListResponseType = z.infer<typeof ListResponse>

export const SetRequest = BaseRequest.merge(z.object({
    query: Query,
    value: z.unknown(),
}))
export const SetResponse = BaseResponse.merge(z.object({
}))
export type SetRequestType = z.infer<typeof SetRequest>
export type SetResponseType = z.infer<typeof SetResponse>

export const UpdateRequest = BaseRequest.merge(z.object({
    query: Query,
    value: z.any(),
}))
export const UpdateResponse = BaseResponse.merge(z.object({
}))
export type UpdateRequestType = z.infer<typeof UpdateRequest>
export type UpdateResponseType = z.infer<typeof UpdateResponse>

export const DeleteRequest = BaseRequest.merge(z.object({
    query: Query,
}))
export const DeleteResponse = BaseResponse.merge(z.object({
}))
export type DeleteRequestType = z.infer<typeof DeleteRequest>
export type DeleteResponseType = z.infer<typeof DeleteResponse>

// listeners
export const WatchChangesRequest = BaseRequest.merge(z.object({
    query: Query,
}))
export const WatchChangesResponse = BaseResponse.merge(z.object({
    listenerId: z.string(),
}))
export type WatchChangesRequestType = z.infer<typeof WatchChangesRequest>

export const UnsubscribeRequest = BaseRequest.merge(z.object({
    listenerId: z.string(),
}))
export const UnsubscribeResponse = BaseResponse.merge(z.object({
}))
export type UnsubscribeRequestType = z.infer<typeof UnsubscribeRequest>
export type UnsubscribeResponseType = z.infer<typeof UnsubscribeResponse>

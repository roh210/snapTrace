import {Response} from 'express'
import { ClickPayload } from './sse.registry'

export const SSE_HEADERS = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
}
export const formatSseData = (payload: ClickPayload): string => {
    return `data:${JSON.stringify(payload)}\n\n`
}
import { Response } from 'express';
import { eventEmitter } from '../events/eventBus';

export interface ClickPayload {
    shortCode: string;
    clickCount: number;
    longUrl: string;
    expiresAt: Date | null;
}

const SseRegistry = () => {
    const connections = new Map<string, Set<Response>>();
    
    const getClients = (shortCode: string): Set<Response> | undefined => connections.get(shortCode)
    
    const add = (shortCode: string, res: Response): void => {
        if (!connections.has(shortCode)) {
            connections.set(shortCode, new Set())
        }
        connections.get(shortCode)?.add(res)
    }

    const remove = (shortCode: string, res: Response): void => {
        const clients = getClients(shortCode)
        if (!clients) return
        clients.delete(res)
        if (clients.size === 0) connections.delete(shortCode)
    }

    const emit = (shortCode: string, payload: ClickPayload): void => {
        const client = getClients(shortCode)
        if (!client) return
        const data = `data:${JSON.stringify(payload)}\n\n`
        client.forEach(res => res.write(data))
    }

    const closeAll = (shortCode: string): void => {
        const client = getClients(shortCode)
        if (!client) return
        client.forEach(res => res.end())
        connections.delete(shortCode)
    }
    
    eventEmitter.on('click', emit)

    return { add, remove, emit, closeAll }
}

export const sseRegistry = SseRegistry()
import z from "zod";

export const urlReqSchema = z.object({
    longUrl: z.url(),
    expiresAt: z.coerce.date().optional()
})
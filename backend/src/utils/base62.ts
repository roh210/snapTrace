import crypto from 'crypto';

export const encodeBase62 = (num: number): string => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let res = ""

    while (num > 0) {
        let remainder = num % 62
        res += chars[remainder]
        num = Math.floor(num / 62)
    }

    return res.split("").reverse().join("").padStart(6, "0")
}

export const generateShortCode = (): string => {
    const randomVal = crypto.randomBytes(4).readUInt32BE(0)
    return encodeBase62(randomVal)
}
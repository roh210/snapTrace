export const isValidShortCode = (shortCode: string): boolean => {
    const shortCodeRegex = /^[a-zA-Z0-9]{6,8}$/;
    return shortCodeRegex.test(shortCode);
}
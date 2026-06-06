import { API_BASE_URL } from './config.js'

//POST method - create short url
export const createShortUrl = async (longUrl, expiresAt) => {
    const response = await fetch(`${API_BASE_URL}/api/urls`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            longUrl,
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
        })
    });

    const data = await response.json()
    if (!response.ok) {
        throw Error(data.errors?.[0]?.message ?? 'Something went wrong')
    }
    return data
}

//GET method - get stats for a short url
export const fetchStats = async (shortCode) => {
    const response = await fetch(`${API_BASE_URL}/api/urls/${shortCode}/stats`, {
        method: 'GET'
    })
    const data = await response.json()
    if (!response.ok) {
        throw Error(data.errors?.[0]?.message ?? 'Something went wrong')
    }
    return data
}

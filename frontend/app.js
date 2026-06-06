const API_BASE_URL = 'http://localhost:3000'
const urlForm = document.querySelector('#urlForm');
const longUrl = document.querySelector('#longUrl');
const expiresAt = document.querySelector('#expiresAt')
const submitBtn = document.querySelector('#submit')
const result = document.querySelector('#result')
const shortUrlDisplay = document.querySelector('#shortUrl')
const errorEl = document.querySelector('#error')
const copyBtn = document.querySelector('#copy')
const statsRes = document.querySelector('#stats');
const viewStatsBtn = document.querySelector('#viewStats')

let currentShortCode = null;

//POST method - create short url
const createShortUrl = async (event) => {
    statsRes.innerHTML = ''
    event.preventDefault();
    try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/urls`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                longUrl: longUrl.value,
                expiresAt: expiresAt.value ? new Date(expiresAt.value).toISOString() : null
            })
        });

        const data = await response.json()
        if (!response.ok) {
            throw Error(data.errors?.[0]?.message ?? 'Something went wrong')
        }
        currentShortCode = data.shortCode
        const shortUrl = `${API_BASE_URL}/${currentShortCode}`;
        shortUrlDisplay.value = shortUrl;
        result.style.display = 'block';
        await viewStats() // Fetch stats immediately after creating the short URL
        errorEl.style.display = 'none'

    } catch (error) {
        errorEl.textContent = error.message
        errorEl.style.display = 'block'
    }
    finally {
        setLoading(false)
    }
};

function setLoading(isLoading) {
    submitBtn.disabled = isLoading
    submitBtn.textContent = isLoading ? 'Shortening... ' : 'Shorten URL'
}

urlForm.addEventListener('submit', createShortUrl);

longUrl.addEventListener('input', () => {
    result.style.display = 'none';
    expiresAt.value = ''
})

//GET method - stats view 

async function viewStats() {
    if (!currentShortCode) return

    try {
        const response = await fetch(`${API_BASE_URL}/api/urls/${currentShortCode}/stats`, {
            method: 'GET'
        })
        const data = await response.json()
        if (!response.ok) {
            throw Error(data.errors?.[0]?.message ?? 'Something went wrong')
        }
        statsRes.innerHTML = `Total Clicks: ${data.clickCount}\nCreated: ${new Date(data.createdAt).toLocaleString()}\nExpires: ${data.expiresAt ? new Date(data.expiresAt).toLocaleString() : 'Never'}`
        errorEl.style.display = 'none'
    } catch (error) {
        errorEl.textContent = error.message
        errorEl.style.display = 'block'
    }
}

viewStatsBtn.addEventListener('click', viewStats)

const copyToClipBoard = () => {
    shortUrlDisplay.select()
    navigator.clipboard.writeText(shortUrlDisplay.value)
    copyBtn.textContent = 'Copied!'
    setTimeout(() => {
        copyBtn.textContent = 'Copy'
    }, 2000)
}

copyBtn.addEventListener('click', copyToClipBoard)



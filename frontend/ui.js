const result = document.querySelector('#result')
const shortUrlDisplay = document.querySelector('#shortUrl')
const errorEl = document.querySelector('#error')
const statsRes = document.querySelector('#stats');
const submitBtn = document.querySelector('#submit')

export const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading
    submitBtn.textContent = isLoading ? 'Shortening... ' : 'Shorten URL'
}

export const showResult = (shortUrl) => {
    shortUrlDisplay.value = shortUrl;
    result.style.display = 'block';
    errorEl.style.display = 'none'
}

export const showError = (message) =>{
    errorEl.textContent = message
    errorEl.style.display = 'block'
}

export const showStats = (data) => {
    statsRes.innerHTML = `
        <span>Total Clicks: ${data.clickCount}</span>
        <br>
        <span>Created: ${new Date(data.createdAt).toLocaleString()}</span>
        <br>
        <span>Expires: ${data.expiresAt ? new Date(data.expiresAt).toLocaleString() : 'Never'}</span>
    `
}

export const resetForm = (expiresAtEl) => {
    result.style.display = 'none'
    statsRes.innerHTML =''
    expiresAtEl && (expiresAtEl.value = '') 
}

export const hideError = () =>{
    errorEl.style.display = 'none'
}
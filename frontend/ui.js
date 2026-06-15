const submitBtn = document.querySelector('#submit')
const result = document.querySelector('#result')
const shortUrlEl = document.querySelector('#shortUrl')
const errorEl = document.querySelector('#error')
const statsEl = document.querySelector('#stats')
const qrCodeEl = document.querySelector('#qrcode')

export const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading
    submitBtn.textContent = isLoading ? '✦ snapping...' : '✦ shorten url'
}

export const showResult = (url) => {
    shortUrlEl.value = url
    result.style.display = 'block'
    qrCodeEl.style.display = 'block'
    new QRCode(qrCodeEl, {
        text: url,
        width: 128,
        height: 128,
        colorDark: '#3D2B1F',
        colorLight: '#FFF2DB',
    })
    errorEl.style.display = 'none'
}

export const showError = (message) => {
    errorEl.textContent = message
    errorEl.style.display = 'block'
}

export const hideError = () => {
    errorEl.style.display = 'none'
}

export const showStats = (data) => {
    const expires = data.expiresAt
        ? new Date(data.expiresAt).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        : 'Never ✦'

    const created = new Date(data.createdAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    statsEl.innerHTML = `
    <span><strong>${data.clickCount}</strong>clicks</span>
    <span><strong>${created}</strong>created</span>
    <span class="stat-wide"><strong>${expires}</strong>expires</span>
  `
}

export const resetForm = (expiresAtEl) => {
    result.style.display = 'none'
    statsEl.innerHTML = ''
    qrCodeEl.innerHTML = ''
    qrCodeEl.style.display = 'none'
    errorEl.style.display = 'none'
    if (expiresAtEl) expiresAtEl.value = ''
}

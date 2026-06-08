const submitBtn = document.querySelector('#submit')
const result = document.querySelector('#result')
const shortUrlEl = document.querySelector('#shortUrl')
const errorEl = document.querySelector('#error')
const statsEl = document.querySelector('#stats')
const catZone = document.querySelector('#catZone')
const catImg = document.querySelector('#catImg')

const CAT_STATES = {
    idle: { file: 'cats/cat-idle.png', cls: 'cat-state-idle' },
    wave: { file: 'cats/cat-wave.png', cls: 'cat-state-wave' },
    peek: { file: 'cats/cat-peek.png', cls: 'cat-state-peek' },
    loading: { file: 'cats/cat-loading.png', cls: 'cat-state-loading' },
    success: { file: 'cats/cat-success.png', cls: 'cat-state-success' },
    celebrate: { file: 'cats/cat-celebrate.png', cls: 'cat-state-celebrate' },
    error: { file: 'cats/cat-error.png', cls: 'cat-state-error' },
}

let idleTimer = null

export const setCatState = (state, returnToIdleAfterMs = null) => {
    clearTimeout(idleTimer)

    const { file, cls } = CAT_STATES[state]

    // swap image
    catImg.src = file

    // swap class
    catZone.className = `cat-zone ${cls}`

    // auto-return to idle after transient states
    if (returnToIdleAfterMs) {
        idleTimer = setTimeout(() => setCatState('idle'), returnToIdleAfterMs)
    }
}

export const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading
    submitBtn.textContent = isLoading ? '✦ snapping...' : '✦ shorten url'
    setCatState(isLoading ? 'loading' : 'idle')
}

export const showResult = (url) => {
    shortUrlEl.value = url
    result.style.display = 'block'
    errorEl.style.display = 'none'
    setCatState('success', 2000)
}

export const showError = (message) => {
    errorEl.textContent = `😿 ${message}`
    errorEl.style.display = 'block'
    setCatState('error', 2500)
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

    const created = new Date(data.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short'
    })

    statsEl.innerHTML = `
    <span><strong>${data.clickCount}</strong>clicks</span>
    <span><strong>${created}</strong>created</span>
    <span class="stat-wide"><strong>${expires}</strong>expires</span>
  `
}

export const showCelebrate = () => {
    setCatState('celebrate', 2000)
}

export const resetForm = (expiresAtEl) => {
    result.style.display = 'none'
    statsEl.innerHTML = ''
    errorEl.style.display = 'none'
    if (expiresAtEl) expiresAtEl.value = ''
    setCatState('idle')
}

export const setCatPeek = () => setCatState('peek')
export const setCatIdle = () => setCatState('idle')
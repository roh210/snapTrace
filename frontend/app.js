import { createShortUrl, fetchStats } from "./api.js";
import { setLoading, showResult, showError, showStats, resetForm, hideError } from "./ui.js";
import { API_BASE_URL, STATS_DEBOUNCE_MS, COPY_RESET_MS } from './config.js'

const viewStatsBtn = document.querySelector('#viewStats')
const copyBtn = document.querySelector('#copy')
const longUrl = document.querySelector('#longUrl');
const urlForm = document.querySelector('#urlForm')
const expiresAt = document.querySelector('#expiresAt')


let currentShortCode = null
let currentShortUrl = null
let resetTimer = null

const createShortUrlHandler = async (e) => {
    e.preventDefault()
    resetForm()
    try {
        setLoading(true)
        const data = await createShortUrl(longUrl.value, expiresAt.value)
        currentShortCode = data.shortCode
        currentShortUrl = `${API_BASE_URL}/${currentShortCode}`
        showResult(currentShortUrl)
        const statsData = await fetchStats(currentShortCode)
        showStats(statsData)
        hideError()
    } catch (error) {
        showError(error.message)
    } finally {
        setLoading(false)
    }
}
urlForm.addEventListener('submit', createShortUrlHandler)


longUrl.addEventListener('input', () => {
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => resetForm(expiresAt), STATS_DEBOUNCE_MS)
})

const createViewStatsHandler = async () => {
    if (!currentShortCode) return;
    try {
        const data = await fetchStats(currentShortCode)
        showStats(data)
        hideError()
    } catch (error) {
        showError(error.message)
    }
}
viewStatsBtn.addEventListener('click', createViewStatsHandler) // we can poll or use sse for dynamic changes instead of fetching on demand, but for simplicity we fetch on demand here

const copyToClipBoardHandler = () => {
    if (!currentShortUrl) return;
    navigator.clipboard.writeText(currentShortUrl)
        .then(() => {
            copyBtn.textContent = 'Copied'
            setTimeout(() => copyBtn.textContent = "Copy", COPY_RESET_MS)
        })
        .catch(() => showError('Failed to copy to clipboard'))
}
copyBtn.addEventListener('click', copyToClipBoardHandler)
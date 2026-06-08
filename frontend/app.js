import { createShortUrl, fetchStats } from "./api.js";
import {
  setLoading, showResult, showError, showStats,
  resetForm, hideError, showCelebrate, setCatState
} from "./ui.js";
import { API_BASE_URL, STATS_DEBOUNCE_MS, COPY_RESET_MS } from './config.js'

const viewStatsBtn = document.querySelector('#viewStats')
const copyBtn      = document.querySelector('#copy')
const longUrl      = document.querySelector('#longUrl')
const urlForm      = document.querySelector('#urlForm')
const expiresAt    = document.querySelector('#expiresAt')

let currentShortCode = null
let currentShortUrl  = null
let resetTimer       = null
let peekTimer        = null

/* ── Form submit ── */
const createShortUrlHandler = async (e) => {
  e.preventDefault()
  resetForm()
  try {
    setLoading(true)
    const data = await createShortUrl(longUrl.value, expiresAt.value)
    currentShortCode = data.shortCode
    currentShortUrl  = `${API_BASE_URL}/${currentShortCode}`
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

/* ── Typing → cat peeks, returns to idle after pause ── */
longUrl.addEventListener('input', () => {
  clearTimeout(peekTimer)
  clearTimeout(resetTimer)

  setCatState('peek')

  peekTimer  = setTimeout(() => setCatState('idle'), 1500)
  resetTimer = setTimeout(() => resetForm(expiresAt), STATS_DEBOUNCE_MS)
})

/* ── View stats ── */
const createViewStatsHandler = async () => {
  if (!currentShortCode) return
  try {
    const data = await fetchStats(currentShortCode)
    showStats(data)
    hideError()
  } catch (error) {
    showError(error.message)
  }
}
viewStatsBtn.addEventListener('click', createViewStatsHandler)

/* ── Copy → cat celebrates ── */
const copyToClipBoardHandler = () => {
  if (!currentShortUrl) return
  navigator.clipboard.writeText(currentShortUrl)
    .then(() => {
      copyBtn.textContent = '✓ copied!'
      setTimeout(() => copyBtn.textContent = '📋 copy', COPY_RESET_MS)
      showCelebrate()
    })
    .catch(() => showError('Failed to copy to clipboard'))
}
copyBtn.addEventListener('click', copyToClipBoardHandler)

/* ── Page load → wave then settle ── */
window.addEventListener('load', () => {
  setCatState('wave')
  setTimeout(() => setCatState('idle'), 3000)
})
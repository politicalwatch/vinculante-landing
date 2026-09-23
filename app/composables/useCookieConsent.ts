/**
 * Analytics cookie consent, stored in localStorage like politicalwatch.es
 * (same `GDPR:accepted` key and "true"/"false" values).
 * `null` means the visitor has not chosen yet, so the banner is shown.
 */
const STORAGE_KEY = 'GDPR:accepted'

export function useCookieConsent() {
  const consent = useState<boolean | null>('cookie-consent', () => null)
  // The stored choice is only readable on the client: keep the banner hidden
  // until it has been read, so it does not flash on every page load.
  const ready = useState('cookie-consent-ready', () => false)

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      consent.value = stored === null ? null : stored === 'true'
    } catch {
      consent.value = null
    }
    ready.value = true
  }

  function set(value: boolean | null) {
    consent.value = value
    try {
      if (value === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, String(value))
      }
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
  }

  return {
    consent: readonly(consent),
    ready: readonly(ready),
    load,
    accept: () => set(true),
    reject: () => set(false),
    // Shows the banner again so the visitor can change their choice.
    reset: () => set(null)
  }
}

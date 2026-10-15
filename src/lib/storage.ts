// Browser storage can be missing or throw (private windows, blocked site data),
// so every access is guarded and the app works without it.

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable; settings just won't persist.
  }
}

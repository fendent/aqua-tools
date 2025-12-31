/**
 * Clear calculator localStorage data if version doesn't match
 * This ensures clean state after breaking changes to storage format
 */

const STORAGE_VERSION_KEY = 'aquaria-calculators-version'
const CURRENT_VERSION = '3' // Increment when making breaking changes to storage format

/**
 * Clear all calculator-related localStorage if version doesn't match
 * @param {string} prefix - Prefix for calculator keys (e.g., 'co2sys-')
 */
export function clearStorageIfVersionMismatch(prefix = '') {
  const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY)

  // Version matches, no need to clear
  if (savedVersion === CURRENT_VERSION) {
    return
  }

  // Clear all localStorage keys that match the prefix
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (prefix === '' || key.startsWith(prefix))) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))

  // Set the current version
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
}

/**
 * Convenience function for CO2SYS calculator
 */
export function migrateLocalStorage() {
  clearStorageIfVersionMismatch('co2sys-')
  clearStorageIfVersionMismatch('dosingImpactSimulatorSettings')
  // Clean up old collapsed states key (now consolidated into co2sys_settings)
  localStorage.removeItem('co2sys_collapsed')
}

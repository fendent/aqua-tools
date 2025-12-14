import { watch } from 'vue'

/**
 * Creates load/save functions for settings persistence
 *
 * @param {string} storageKey - localStorage key
 * @param {Object} schema - mapping of setting names to ref objects with defaults
 *   Example: { temperature: { ref: tempRef, default: 25 } }
 * @param {boolean} autoSave - whether to auto-save on changes
 * @returns {Object} - { loadSettings, saveSettings }
 *
 * @example
 * const { loadSettings, saveSettings } = useSettings('co2sys_settings', {
 *   temperature: { ref: temperature, default: 25 },
 *   salinity: { ref: salinity, default: 35 }
 * }, true)
 */
export function useSettings(storageKey, schema, autoSave = false) {
  function loadSettings() {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        for (const [key, config] of Object.entries(schema)) {
          if (settings[key] !== undefined) {
            config.ref.value = settings[key]
          } else if (config.default !== undefined) {
            config.ref.value = config.default
          }
        }
      } catch (e) {
        console.error(`Failed to load settings from ${storageKey}:`, e)
      }
    }
  }

  function saveSettings() {
    const settings = {}
    for (const [key, config] of Object.entries(schema)) {
      settings[key] = config.ref.value
    }
    localStorage.setItem(storageKey, JSON.stringify(settings))
  }

  if (autoSave) {
    // Watch all refs and auto-save
    for (const config of Object.values(schema)) {
      watch(config.ref, saveSettings)
    }
  }

  return { loadSettings, saveSettings }
}

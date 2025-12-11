import { watch } from 'vue'

export const useLocalStorage = (key, refs, defaults) => {
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch {
      return defaults
    }
  }

  const saveSettings = () => {
    try {
      const data = {}
      Object.keys(refs).forEach(refKey => {
        data[refKey] = refs[refKey].value
      })
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const resetToDefaults = () => {
    Object.keys(refs).forEach(refKey => {
      refs[refKey].value = defaults[refKey]
    })
  }

  // Watch all refs for changes
  const refValues = Object.values(refs)
  watch(refValues, saveSettings, { deep: true })

  return {
    loadSettings,
    saveSettings,
    resetToDefaults
  }
}

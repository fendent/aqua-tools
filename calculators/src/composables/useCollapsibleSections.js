import { ref, watch } from 'vue'

/**
 * Manages collapsible section states with localStorage persistence
 *
 * @param {string} storageKey - localStorage key for saving collapsed states
 * @param {Object} sections - object mapping section names to default collapsed states
 *   Example: { inputParams: false, environmental: false, nutrients: true }
 * @returns {Object} - object with collapsed state refs for each section
 *
 * @example
 * const collapsed = useCollapsibleSections('co2sys_collapsed', {
 *   inputParams: false,
 *   environmental: false,
 *   nutrients: true
 * })
 * // Access: collapsed.inputParams, collapsed.environmental, etc.
 */
export function useCollapsibleSections(storageKey, sections) {
  const collapsed = {}

  // Load saved states
  const saved = localStorage.getItem(storageKey)
  let savedStates = {}
  if (saved) {
    try {
      savedStates = JSON.parse(saved)
    } catch (e) {
      console.error(`Failed to load collapsed states from ${storageKey}:`, e)
    }
  }

  // Initialize refs with saved or default values
  for (const [name, defaultValue] of Object.entries(sections)) {
    collapsed[name] = ref(savedStates[name] !== undefined ? savedStates[name] : defaultValue)
  }

  // Watch all collapsed states and save to localStorage
  const saveCollapsedStates = () => {
    const states = {}
    for (const [name, collapsedRef] of Object.entries(collapsed)) {
      states[name] = collapsedRef.value
    }
    localStorage.setItem(storageKey, JSON.stringify(states))
  }

  for (const collapsedRef of Object.values(collapsed)) {
    watch(collapsedRef, saveCollapsedStates)
  }

  return collapsed
}

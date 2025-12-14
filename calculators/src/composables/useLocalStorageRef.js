import { ref, watch } from 'vue'

/**
 * Creates a reactive ref that syncs with localStorage
 *
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if localStorage is empty
 * @param {function} [parser] - optional parser function (e.g., parseFloat, JSON.parse)
 * @returns {Ref} - reactive ref synced with localStorage
 *
 * @example
 * const tempUnit = useLocalStorageRef('co2sys_temp_unit', '°C')
 * const volume = useLocalStorageRef('tank_volume', 100, parseFloat)
 */
export function useLocalStorageRef(key, defaultValue, parser = null) {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue !== null
    ? (parser ? parser(storedValue) : storedValue)
    : defaultValue

  const refValue = ref(initialValue)

  watch(refValue, (newValue) => {
    localStorage.setItem(key, newValue)
  })

  return refValue
}

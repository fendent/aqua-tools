/**
 * Composable for handling precision-preserving unit conversions
 *
 * This composable implements the pattern where:
 * - User inputs are stored with their original unit
 * - When units change, values convert from base value
 * - When changing back to original unit, exact user input is preserved
 * - Base values are stored in standard units for calculations
 *
 * @param {Object} options
 * @param {Function} options.convertToBase - Function to convert from any unit to base unit
 * @param {Function} options.convertFromBase - Function to convert from base unit to any unit
 * @param {*} options.initialValue - Initial display value
 * @param {String} options.initialUnit - Initial unit
 * @param {*} options.defaultBaseValue - Default value in base units if no initial value
 * @param {Ref} options.currentUnit - Ref to current unit
 * @param {Function} options.onUpdate - Callback when base value is updated
 * @returns {Object} { displayValue, baseValue, focused, handleFocus, handleBlur }
 */
import { ref, watch } from 'vue'

export function useUnitConversion({
  convertToBase,
  convertFromBase,
  initialValue,
  initialUnit,
  defaultBaseValue,
  currentUnit,
  onUpdate = () => {}
}) {
  // Track original user input to avoid precision loss on round-trip conversions
  const originalValue = ref(initialValue !== undefined && initialValue !== null ? initialValue : null)
  const originalUnit = ref(initialUnit || null)

  // Base value stored in standard unit
  const baseValue = ref(
    initialValue !== undefined && initialValue !== null && initialUnit
      ? convertToBase(initialValue, initialUnit)
      : defaultBaseValue
  )

  // Display value - use saved value if in same unit, otherwise convert from base
  const displayValue = ref(
    originalUnit.value === currentUnit.value && originalValue.value !== null
      ? originalValue.value
      : convertFromBase(baseValue.value, currentUnit.value)
  )

  // Focus tracking to prevent updates while typing
  const focused = ref(false)

  // Blur handler - update base value and store original input
  function handleBlur() {
    focused.value = false
    // Store the user's input as the original to avoid precision loss
    originalValue.value = parseFloat(displayValue.value)
    originalUnit.value = currentUnit.value
    const newBaseValue = convertToBase(originalValue.value, currentUnit.value)
    baseValue.value = newBaseValue
    onUpdate(newBaseValue)
  }

  // Focus handler
  function handleFocus() {
    focused.value = true
  }

  // Watch base value changes (from external sources) and update display when not focused
  function syncFromBase(newBaseValue) {
    if (!focused.value) {
      baseValue.value = newBaseValue
      // If displaying in the original unit the user typed, use the original value
      if (originalUnit.value === currentUnit.value && originalValue.value !== null) {
        displayValue.value = originalValue.value
      } else {
        displayValue.value = convertFromBase(baseValue.value, currentUnit.value)
      }
    }
  }

  // Watch unit changes and convert display value
  watch(currentUnit, (newUnit) => {
    if (!focused.value) {
      // If switching back to the original unit the user typed, use the original value
      if (originalUnit.value === newUnit && originalValue.value !== null) {
        displayValue.value = originalValue.value
      } else {
        displayValue.value = convertFromBase(baseValue.value, newUnit)
      }
    }
  })

  return {
    displayValue,
    baseValue,
    focused,
    handleFocus,
    handleBlur,
    syncFromBase
  }
}

import { ref, computed } from 'vue'

/**
 * Manages display unit selection with precision-preserving value conversion
 *
 * @param {Object} config
 * @param {Function} config.baseValue - function that returns base value in standard units
 * @param {Function} config.convertFromBase - function to convert from base units to display unit
 * @param {string} config.parameterType - the parameter type (e.g., 'TA', 'DIC', 'pCO2')
 * @param {string} config.defaultUnit - default display unit
 * @param {Function} config.inputParams - function that returns input parameters
 * @param {Function} [config.formatValue] - optional format function for display value
 * @returns {Object} - { displayUnit, displayValue }
 *
 * @example
 * const { displayUnit, displayValue } = useDisplayUnit({
 *   baseValue: () => results.value.TA,
 *   convertFromBase: convertTA,
 *   parameterType: 'TA',
 *   defaultUnit: 'dKH',
 *   inputParams: () => inputParams.value,
 *   formatValue: (val) => val.toFixed(2)
 * })
 */
export function useDisplayUnit({
  baseValue,
  convertFromBase,
  parameterType,
  defaultUnit,
  inputParams,
  formatValue = (val) => val
}) {
  const displayUnit = ref(defaultUnit)

  const displayValue = computed(() => {
    const inputs = inputParams()
    const base = baseValue()

    // If displaying in the same unit as the input, show the original input value
    if (inputs && inputs.param1Type === parameterType && inputs.param1Unit === displayUnit.value) {
      return formatValue(inputs.param1Value)
    }
    if (inputs && inputs.param2Type === parameterType && inputs.param2Unit === displayUnit.value) {
      return formatValue(inputs.param2Value)
    }

    // Otherwise convert from base units
    return formatValue(convertFromBase(base, displayUnit.value))
  })

  return { displayUnit, displayValue }
}

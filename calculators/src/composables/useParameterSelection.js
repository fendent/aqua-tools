import { computed } from 'vue'
import { DOSING_PARAMETERS } from '../utils/dosingChemicals.js'

/**
 * Shared composable for parameter selection logic across dosing calculators
 * Provides parameter definitions and Jim Welsh Mode pluralization
 */
export const useParameterSelection = (selectedParameter, jimWelshMode) => {
  // Parameter definitions
  const parameters = {
    [DOSING_PARAMETERS.CALCIUM]: { label: 'Calcium' },
    [DOSING_PARAMETERS.ALKALINITY]: { label: 'Alkalinity' },
    [DOSING_PARAMETERS.MAGNESIUM]: { label: 'Magnesium' },
    [DOSING_PARAMETERS.NITRATE]: { label: 'Nitrate' },
    [DOSING_PARAMETERS.PHOSPHATE]: { label: 'Phosphate' },
    [DOSING_PARAMETERS.AMMONIA]: { label: 'Ammonia' }
  }

  /**
   * Get parameter label with optional Jim Welsh Mode pluralization
   * @param {string} paramKey - The parameter key
   * @returns {string} The formatted parameter label
   */
  const getParameterLabel = (paramKey) => {
    const baseLabel = parameters[paramKey].label
    if (!jimWelshMode.value) return baseLabel

    // Pluralize with proper English rules
    // Words ending in consonant + 'y' -> replace 'y' with 'ies'
    if (baseLabel.endsWith('y')) {
      const beforeY = baseLabel[baseLabel.length - 2]
      const vowels = 'aeiouAEIOU'
      if (!vowels.includes(beforeY)) {
        return baseLabel.slice(0, -1) + 'ies'
      }
    }

    // Default: just add 's'
    return baseLabel + 's'
  }

  /**
   * Get the current parameter label
   */
  const parameterLabel = computed(() => {
    if (!selectedParameter.value) return ''
    return getParameterLabel(selectedParameter.value)
  })

  return {
    parameters,
    getParameterLabel,
    parameterLabel
  }
}

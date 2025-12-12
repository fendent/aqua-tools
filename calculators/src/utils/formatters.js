/**
 * Shared formatting utilities for dosing calculators
 */

/**
 * Format a range for display
 * @param {Object} range - Range object with min and max properties
 * @returns {string} Formatted range string
 */
export const formatRange = (range) => {
  if (!range) return ''
  if (range.min === range.max) return range.min
  return `${range.min}-${range.max}`
}

/**
 * Format concentration value and unit for display
 * @param {number} value - Concentration value
 * @param {string} unit - Concentration unit
 * @returns {string} Formatted concentration string
 */
export const formatConcentration = (value, unit) => {
  // Parse the unit to make it more readable
  if (unit.includes('ppm/ml/gal')) {
    return `${value} ppm per mL (per gallon system)`
  } else if (unit.includes('ppm/g/gal')) {
    return `${value} ppm per gram (per gallon system)`
  } else if (unit.includes('meq/L/ml/gal')) {
    return `${value} meq/L per mL (per gallon system)`
  } else if (unit.includes('meq/L/g/gal')) {
    return `${value} meq/L per gram (per gallon system)`
  } else if (unit.includes('ppm/ml')) {
    return `${value} ppm per mL dosed`
  } else if (unit.includes('ppm/g')) {
    return `${value} ppm per gram dosed`
  } else if (unit.includes('meq/L/ml')) {
    return `${value} meq/L per mL dosed`
  } else if (unit.includes('meq/L/g')) {
    return `${value} meq/L per gram dosed`
  }
  return `${value} ${unit}`
}

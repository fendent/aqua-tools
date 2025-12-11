// Weight conversion utilities

const GRAMS_PER_OUNCE = 28.3495
const GRAMS_PER_POUND = 453.592
const MILLIGRAMS_PER_GRAM = 1000

/**
 * Convert grams to other weight units
 * @param {number} grams - Weight in grams
 * @param {string} toUnit - Target unit (milligrams, grams, ounces, pounds)
 * @returns {number} Converted weight
 */
export const convertWeight = (grams, toUnit) => {
  switch (toUnit) {
    case 'milligrams':
      return grams * MILLIGRAMS_PER_GRAM
    case 'grams':
      return grams
    case 'ounces':
      return grams / GRAMS_PER_OUNCE
    case 'pounds':
      return grams / GRAMS_PER_POUND
    default:
      return grams
  }
}

/**
 * Get abbreviated weight unit
 * @param {string} unit - Full unit name
 * @returns {string} Abbreviated unit
 */
export const getWeightUnitAbbrev = (unit) => {
  const unitMap = {
    'milligrams': 'mg',
    'grams': 'g',
    'ounces': 'oz',
    'pounds': 'lb'
  }
  return unitMap[unit] || unit
}

/**
 * Get appropriate decimal places for weight unit
 * @param {string} unit - Weight unit
 * @returns {number} Number of decimal places
 */
export const getWeightPrecision = (unit) => {
  switch (unit) {
    case 'milligrams':
      return 0
    case 'grams':
      return 2
    case 'ounces':
      return 3
    case 'pounds':
      return 4
    default:
      return 2
  }
}

/**
 * Value Formatting Functions
 */

/**
 * Format a number for display with appropriate precision
 * @param {number} value - Value to format
 * @param {string} paramType - Parameter type
 * @param {number} decimals - Override decimal places
 * @returns {string} Formatted value
 */
export function formatValue(value, paramType, decimals = null) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }

  // Special handling for minor species with adaptive precision
  if (paramType === 'minor') {
    if (value < 0.001) return value.toExponential(2)
    if (value < 0.1) return value.toFixed(4)
    if (value < 1) return value.toFixed(3)
    if (value < 10) return value.toFixed(2)
    return value.toFixed(1)
  }

  // Default decimal places by parameter type
  const defaultDecimals = {
    pH: 3,
    TA: 0,
    DIC: 0,
    pCO2: 0,
    CO3: 1,
    HCO3: 0,
    aqCO2: 2,
    omega: 2,
    revelle: 1
  }

  const places = decimals !== null ? decimals : (defaultDecimals[paramType] || 2)
  return value.toFixed(places)
}

/**
 * Format saturation state with warnings
 * @param {number} omega - Saturation state value
 * @param {string} mineral - 'calcite' or 'aragonite'
 * @returns {Object} {value, status, warning}
 */
export function formatSaturationState(omega, mineral = 'aragonite') {
  const thresholds = {
    aragonite: { critical: 3.0, low: 3.5, ideal: 4.0 },
    calcite: { critical: 4.5, low: 5.0, ideal: 6.0 }
  }

  const t = thresholds[mineral]
  let status = 'good'
  let warning = null

  if (omega < t.critical) {
    status = 'critical'
    warning = `Saturation below ${t.critical} - dissolution risk`
  } else if (omega < t.low) {
    status = 'low'
    warning = `Saturation below ${t.low} - suboptimal for coral growth`
  } else if (omega < t.ideal) {
    status = 'fair'
    warning = null
  } else {
    status = 'excellent'
    warning = null
  }

  return {
    value: formatValue(omega, 'omega'),
    status,
    warning
  }
}

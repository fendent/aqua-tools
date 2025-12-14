/**
 * Formulation Range Validation Helper
 *
 * Checks if current temperature and salinity are within valid ranges
 * for different equilibrium constant formulations
 */

/**
 * Parse a validRange string like "S: 19-43, T: 2-35°C"
 * @param {string} rangeStr - Range string from formulation metadata
 * @returns {Object} Parsed ranges {salinity: {min, max}, temperature: {min, max}}
 */
function parseRange(rangeStr) {
  if (rangeStr === 'All salinities') {
    return { salinity: { min: 0, max: Infinity }, temperature: { min: -Infinity, max: Infinity } }
  }

  const result = { salinity: null, temperature: null }

  // Extract salinity range (S: min-max)
  const sMatch = rangeStr.match(/S:\s*(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/)
  if (sMatch) {
    result.salinity = { min: parseFloat(sMatch[1]), max: parseFloat(sMatch[2]) }
  } else if (rangeStr.includes('S: 0')) {
    result.salinity = { min: 0, max: 0 }
  }

  // Extract temperature range (T: min-max°C)
  const tMatch = rangeStr.match(/T:\s*(-?\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/)
  if (tMatch) {
    result.temperature = { min: parseFloat(tMatch[1]), max: parseFloat(tMatch[2]) }
  }

  return result
}

/**
 * Check if a value is within a range
 * @param {number} value - Value to check
 * @param {Object} range - Range object {min, max}
 * @param {number} tolerance - How far outside range is "acceptable" (default: 10%)
 * @returns {string} 'optimal', 'acceptable', or 'outside'
 */
function checkValueInRange(value, range, tolerance = 0.1) {
  if (!range) return 'unknown'

  const rangeSize = range.max - range.min
  const toleranceAmount = rangeSize * tolerance

  if (value >= range.min && value <= range.max) {
    return 'optimal'
  } else if (
    value >= (range.min - toleranceAmount) &&
    value <= (range.max + toleranceAmount)
  ) {
    return 'acceptable'
  } else {
    return 'outside'
  }
}

/**
 * Check if current conditions are within formulation's valid range
 * @param {Object} formulation - Formulation object with validRange property
 * @param {number} temperature - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {Object} {status: 'optimal'|'acceptable'|'outside', salinity: status, temperature: status}
 */
export function checkFormulationRange(formulation, temperature, salinity) {
  const ranges = parseRange(formulation.validRange)

  const salinityStatus = checkValueInRange(salinity, ranges.salinity)
  const temperatureStatus = checkValueInRange(temperature, ranges.temperature)

  // Overall status is the worst of the two
  let overallStatus = 'optimal'
  if (salinityStatus === 'outside' || temperatureStatus === 'outside') {
    overallStatus = 'outside'
  } else if (salinityStatus === 'acceptable' || temperatureStatus === 'acceptable') {
    overallStatus = 'acceptable'
  }

  return {
    overall: overallStatus,
    salinity: salinityStatus,
    temperature: temperatureStatus,
    ranges
  }
}

/**
 * Get recommended formulations based on current conditions
 * @param {Object} formulations - Object containing all formulations
 * @param {number} temperature - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {Array} Array of {code, name, status, reason} sorted by suitability
 */
export function getRecommendedFormulations(formulations, temperature, salinity) {
  const results = Object.entries(formulations).map(([code, formulation]) => {
    const check = checkFormulationRange(formulation, temperature, salinity)

    let reason = ''
    if (check.overall === 'optimal') {
      reason = 'Within valid range'
    } else if (check.overall === 'acceptable') {
      const issues = []
      if (check.salinity === 'acceptable') issues.push('salinity slightly outside')
      if (check.temperature === 'acceptable') issues.push('temperature slightly outside')
      reason = `Acceptable (${issues.join(', ')})`
    } else {
      const issues = []
      if (check.salinity === 'outside') issues.push('salinity')
      if (check.temperature === 'outside') issues.push('temperature')
      reason = `Outside range (${issues.join(', ')})`
    }

    return {
      code,
      name: formulation.name,
      description: formulation.description,
      status: check.overall,
      reason,
      ranges: check.ranges
    }
  })

  // Sort by status (optimal first, then acceptable, then outside)
  const statusOrder = { optimal: 0, acceptable: 1, outside: 2, unknown: 3 }
  return results.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}

/**
 * Get status icon for display
 * @param {string} status - Status string ('optimal', 'acceptable', 'outside')
 * @returns {string} Icon character
 */
export function getStatusIcon(status) {
  switch (status) {
    case 'optimal': return '✓'
    case 'acceptable': return '⚠'
    case 'outside': return '✗'
    default: return '?'
  }
}

/**
 * Get status color class for Tailwind
 * @param {string} status - Status string ('optimal', 'acceptable', 'outside')
 * @returns {string} Tailwind color class
 */
export function getStatusColor(status) {
  switch (status) {
    case 'optimal': return 'text-green-600'
    case 'acceptable': return 'text-yellow-600'
    case 'outside': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

/**
 * pH Scale Conversions
 *
 * Converts pH between different scales: Total, Seawater (SWS), Free, and NBS
 *
 * Ported from PyCO2SYS convert.py
 *
 * pH scales differ in how they account for complexation:
 * - Free scale: [H+]_F = free protons only
 * - Total scale: [H+]_T = [H+]_F + [HSO4-]
 * - Seawater scale: [H+]_SWS = [H+]_F + [HSO4-] + [HF]
 * - NBS scale: activity-based scale using buffer solutions
 */

/**
 * Calculate total sulfate concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Total sulfate in mol/kg-SW
 */
export function calculateTotalSulfate(salinity) {
  // Morris & Riley (1966)
  return (0.14 / 96.062) * (salinity / 1.80655)
}

/**
 * Calculate total fluoride concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Total fluoride in mol/kg-SW
 */
export function calculateTotalFluoride(salinity) {
  // Riley (1965)
  return (0.000067 / 18.998) * (salinity / 1.80655)
}

/**
 * Activity coefficient for NBS scale (fH)
 * Following Peng et al. (1987)
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} fH activity coefficient
 */
export function calculateActivityCoefficient(tempC, salinity) {
  const TK = tempC + 273.15
  // Peng et al., Tellus 39B:439-458, 1987
  return 1.29 - 0.00204 * TK + (0.00046 - 0.00000148 * TK) * salinity * salinity
}

/**
 * Free to Total pH scale conversion factor
 *
 * Multiplies [H+]_Free to get [H+]_Total
 * [H+]_T = [H+]_F * (1 + [SO4]/KSO4)
 *
 * @param {Object} constants - Equilibrium constants object with KSO4, totalSulfate
 * @returns {number} Conversion factor
 */
export function pHFreeToTotal(constants) {
  return 1.0 + constants.totalSulfate / constants.KSO4
}

/**
 * Free to Seawater pH scale conversion factor
 *
 * Multiplies [H+]_Free to get [H+]_SWS
 * [H+]_SWS = [H+]_F * (1 + [SO4]/KSO4 + [F]/KF)
 *
 * @param {Object} constants - Equilibrium constants object with KSO4, KF, totalSulfate, totalFluoride
 * @returns {number} Conversion factor
 */
export function pHFreeToSws(constants) {
  return 1.0 + constants.totalSulfate / constants.KSO4 + constants.totalFluoride / constants.KF
}

/**
 * Seawater to Free pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHSwsToFree(constants) {
  return 1.0 / pHFreeToSws(constants)
}

/**
 * Seawater to Total pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHSwsToTotal(constants) {
  return pHSwsToFree(constants) * pHFreeToTotal(constants)
}

/**
 * Total to Free pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHTotalToFree(constants) {
  return 1.0 / pHFreeToTotal(constants)
}

/**
 * Total to Seawater pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHTotalToSws(constants) {
  return 1.0 / pHSwsToTotal(constants)
}

/**
 * Seawater to NBS pH scale conversion factor
 * @param {Object} constants - Equilibrium constants with fH
 * @returns {number} Conversion factor
 */
export function pHSwsToNbs(constants) {
  return constants.fH
}

/**
 * NBS to Seawater pH scale conversion factor
 * @param {Object} constants - Equilibrium constants with fH
 * @returns {number} Conversion factor
 */
export function pHNbsToSws(constants) {
  return 1.0 / pHSwsToNbs(constants)
}

/**
 * Total to NBS pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHTotalToNbs(constants) {
  return pHTotalToSws(constants) * pHSwsToNbs(constants)
}

/**
 * NBS to Total pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHNbsToTotal(constants) {
  return 1.0 / pHTotalToNbs(constants)
}

/**
 * Free to NBS pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHFreeToNbs(constants) {
  return pHFreeToSws(constants) * pHSwsToNbs(constants)
}

/**
 * NBS to Free pH scale conversion factor
 * @param {Object} constants - Equilibrium constants
 * @returns {number} Conversion factor
 */
export function pHNbsToFree(constants) {
  return 1.0 / pHFreeToNbs(constants)
}

/**
 * Convert H+ concentration between pH scales
 *
 * @param {number} H - H+ concentration on source scale (mol/kg)
 * @param {string} fromScale - Source pH scale ('total', 'sws', 'free', 'nbs')
 * @param {string} toScale - Target pH scale ('total', 'sws', 'free', 'nbs')
 * @param {Object} constants - Equilibrium constants object
 * @returns {number} H+ concentration on target scale (mol/kg)
 */
export function convertHConcentration(H, fromScale, toScale, constants) {
  if (fromScale === toScale) {
    return H
  }

  // Convert to lowercase for consistency
  const from = fromScale.toLowerCase()
  const to = toScale.toLowerCase()

  // Define conversion function mapping
  const conversions = {
    'free-total': pHFreeToTotal,
    'free-sws': pHFreeToSws,
    'free-nbs': pHFreeToNbs,
    'total-free': pHTotalToFree,
    'total-sws': pHTotalToSws,
    'total-nbs': pHTotalToNbs,
    'sws-free': pHSwsToFree,
    'sws-total': pHSwsToTotal,
    'sws-nbs': pHSwsToNbs,
    'nbs-free': pHNbsToFree,
    'nbs-total': pHNbsToTotal,
    'nbs-sws': pHNbsToSws
  }

  const key = `${from}-${to}`
  const conversionFn = conversions[key]

  if (!conversionFn) {
    throw new Error(`Unsupported pH scale conversion: ${fromScale} to ${toScale}`)
  }

  return H * conversionFn(constants)
}

/**
 * Convert pH value between pH scales
 *
 * @param {number} pH - pH value on source scale
 * @param {string} fromScale - Source pH scale ('total', 'sws', 'free', 'nbs')
 * @param {string} toScale - Target pH scale ('total', 'sws', 'free', 'nbs')
 * @param {Object} constants - Equilibrium constants object
 * @returns {number} pH value on target scale
 */
export function convertPH(pH, fromScale, toScale, constants) {
  if (fromScale === toScale) {
    return pH
  }

  // Convert pH to H+ concentration
  const H = Math.pow(10, -pH)

  // Convert H+ concentration between scales
  const H_converted = convertHConcentration(H, fromScale, toScale, constants)

  // Convert back to pH
  return -Math.log10(H_converted)
}

/**
 * Calculate pH on all scales from a given pH on one scale
 *
 * @param {number} pH - pH value on source scale
 * @param {string} sourceScale - Source pH scale ('total', 'sws', 'free', 'nbs')
 * @param {Object} constants - Equilibrium constants object
 * @returns {Object} pH values on all scales {pH_total, pH_sws, pH_free, pH_nbs}
 */
export function pHToAllScales(pH, sourceScale, constants) {
  const scales = ['total', 'sws', 'free', 'nbs']
  const result = {}

  for (const scale of scales) {
    const key = `pH_${scale}`
    result[key] = convertPH(pH, sourceScale, scale, constants)
  }

  return result
}

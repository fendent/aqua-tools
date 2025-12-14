/**
 * Pressure Correction Functions
 *
 * Applies pressure corrections to equilibrium constants
 * following Millero (1995) methodology
 */

/**
 * Apply pressure correction to equilibrium constants
 * Uses Millero (1995) formulation
 *
 * @param {number} K0 - Equilibrium constant at 1 atm
 * @param {number} tempC - Temperature in Celsius
 * @param {number} pressureBar - Pressure in bar (1 bar = 1 dbar ≈ 1 m depth)
 * @param {Object} params - Volume change parameters {deltaV, deltaK, deltaKT}
 * @returns {number} Pressure-corrected equilibrium constant
 */
export function applyPressureCorrection(K0, tempC, pressureBar, params) {
  if (pressureBar <= 0) return K0

  const TK = tempC + 273.15
  const R = 83.1451 // Gas constant in cm³·bar·K⁻¹·mol⁻¹
  const P = pressureBar

  const { deltaV, deltaK, deltaKT = 0 } = params

  // Calculate volume change
  const deltaVadj = deltaV + deltaKT * tempC

  // Pressure effect on log K
  const lnKfactor = -(deltaVadj / (R * TK)) * P +
                    (0.5 * deltaK / (R * TK)) * P * P

  return K0 * Math.exp(lnKfactor)
}

/**
 * Get pressure correction parameters for K1
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsK1() {
  return {
    deltaV: -25.5,      // cm³/mol
    deltaK: -0.1271,    // cm³/(mol·bar)
    deltaKT: 0          // cm³/(mol·°C)
  }
}

/**
 * Get pressure correction parameters for K2
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsK2() {
  return {
    deltaV: -15.82,     // cm³/mol
    deltaK: -0.0219,    // cm³/(mol·bar)
    deltaKT: -0.321     // cm³/(mol·°C)
  }
}

/**
 * Get pressure correction parameters for KB
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsKB() {
  return {
    deltaV: -29.48,     // cm³/mol
    deltaK: 0.1622,     // cm³/(mol·bar)
    deltaKT: -2.608     // cm³/(mol·°C)
  }
}

/**
 * Get pressure correction parameters for KW
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsKW() {
  return {
    deltaV: -25.6,      // cm³/mol
    deltaK: -0.2324,    // cm³/(mol·bar)
    deltaKT: -3.6246    // cm³/(mol·°C)
  }
}

/**
 * Get pressure correction parameters for KspCalcite
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsKspCalcite() {
  return {
    deltaV: -48.76,     // cm³/mol
    deltaK: -0.5304,    // cm³/(mol·bar)
    deltaKT: 0          // cm³/(mol·°C)
  }
}

/**
 * Get pressure correction parameters for KspAragonite
 * @returns {Object} Parameters {deltaV, deltaK, deltaKT}
 */
export function getPressureParamsKspAragonite() {
  return {
    deltaV: -46.0,      // cm³/mol
    deltaK: -0.5304,    // cm³/(mol·bar)
    deltaKT: 0          // cm³/(mol·°C)
  }
}

/**
 * Calculate pressure correction factor for K0 (CO2 solubility)
 * Following Weiss 1974 equation 5
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} pressureBar - Pressure in bar (hydrostatic)
 * @param {number} pressureAtm - Atmospheric pressure in atm (default 1.0)
 * @returns {number} Pressure correction factor to multiply K0 by
 */
export function calculateK0PressureFactor(tempC, pressureBar, pressureAtm = 1.0) {
  if (pressureBar <= 0) return 1.0

  const TK = tempC + 273.15
  const R = 83.1451  // Gas constant in cm³·bar·K⁻¹·mol⁻¹
  const vCO2 = 32.3  // Partial molar volume of CO2 in ml/mol

  // Weiss 1974 equation 5
  // Note: All pressures converted to bar (1 atm = 1.01325 bar)
  const factor = Math.exp(
    (1.01325 - (pressureBar + pressureAtm * 1.01325)) * vCO2 / (R * TK)
  )

  return factor
}

/**
 * pH Scale Conversion Factors
 *
 * pH scales used in marine chemistry:
 * - Total: [H+]T = [H+]F + [HSO4-]
 * - Seawater (SWS): [H+]SWS = [H+]F + [HSO4-] + [HF]
 * - Free: [H+]F = free proton concentration
 * - NBS: National Bureau of Standards (activity-based)
 */

import { calculateKSO4, calculateTotalSulfate } from './kso4.js'
import { calculateKF, calculateTotalFluoride } from './kf.js'

/**
 * Convert pH from Total scale to Free scale
 * @param {number} pHTotal - pH on Total scale
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} pH on Free scale
 */
export function convertpHTotalToFree(pHTotal, tempC, salinity) {
  const KSO4 = calculateKSO4(tempC, salinity)
  const totalSulfate = calculateTotalSulfate(salinity)

  const H_total = Math.pow(10, -pHTotal)
  const sulfateFactor = 1 + totalSulfate / KSO4
  const H_free = H_total * sulfateFactor

  return -Math.log10(H_free)
}

/**
 * Convert pH from Free scale to Total scale
 * @param {number} pHFree - pH on Free scale
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} pH on Total scale
 */
export function convertpHFreeToTotal(pHFree, tempC, salinity) {
  const KSO4 = calculateKSO4(tempC, salinity)
  const totalSulfate = calculateTotalSulfate(salinity)

  const H_free = Math.pow(10, -pHFree)
  const sulfateFactor = 1 + totalSulfate / KSO4
  const H_total = H_free / sulfateFactor

  return -Math.log10(H_total)
}

/**
 * Convert pH from Total scale to Seawater scale
 * @param {number} pHTotal - pH on Total scale
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} pH on Seawater scale
 */
export function convertpHTotalToSWS(pHTotal, tempC, salinity) {
  const KF = calculateKF(tempC, salinity)
  const totalFluoride = calculateTotalFluoride(salinity)

  const H_total = Math.pow(10, -pHTotal)
  const fluorideFactor = 1 + totalFluoride / KF
  const H_sws = H_total / fluorideFactor

  return -Math.log10(H_sws)
}

/**
 * Convert pH from Seawater scale to Total scale
 * @param {number} pHSWS - pH on Seawater scale
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} pH on Total scale
 */
export function convertpHSWSToTotal(pHSWS, tempC, salinity) {
  const KF = calculateKF(tempC, salinity)
  const totalFluoride = calculateTotalFluoride(salinity)

  const H_sws = Math.pow(10, -pHSWS)
  const fluorideFactor = 1 + totalFluoride / KF
  const H_total = H_sws * fluorideFactor

  return -Math.log10(H_total)
}

/**
 * Convert pH to any scale
 * @param {number} pH - Input pH value
 * @param {string} fromScale - Source scale: 'total', 'sws', 'free', 'nbs'
 * @param {string} toScale - Target scale: 'total', 'sws', 'free', 'nbs'
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} pH on target scale
 */
export function convertpH(pH, fromScale, toScale, tempC, salinity) {
  if (fromScale === toScale) return pH

  // Convert to Total scale first (if not already)
  let pHTotal = pH
  if (fromScale === 'free') {
    pHTotal = convertpHFreeToTotal(pH, tempC, salinity)
  } else if (fromScale === 'sws') {
    pHTotal = convertpHSWSToTotal(pH, tempC, salinity)
  } else if (fromScale === 'nbs') {
    // NBS to Total conversion (simplified)
    // More complex conversion needed for high accuracy
    pHTotal = pH - 0.014 // Approximate correction
  }

  // Convert from Total scale to target
  if (toScale === 'total') {
    return pHTotal
  } else if (toScale === 'free') {
    return convertpHTotalToFree(pHTotal, tempC, salinity)
  } else if (toScale === 'sws') {
    return convertpHTotalToSWS(pHTotal, tempC, salinity)
  } else if (toScale === 'nbs') {
    // Total to NBS conversion (simplified)
    return pHTotal + 0.014 // Approximate correction
  }

  return pHTotal
}

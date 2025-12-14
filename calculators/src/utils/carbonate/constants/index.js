/**
 * Carbonate System Equilibrium Constants
 *
 * Re-exports all constants and formulations for easy importing
 */

// Import functions for internal use by calculateAllConstants
import { calculateK1, calculateK2 } from './k12.js'
import { calculateKSO4, calculateTotalSulfate } from './kso4.js'
import { calculateKF, calculateTotalFluoride } from './kf.js'
import { calculateTotalBoron } from './boron.js'
import {
  calculateKB,
  calculateKW,
  calculateKspCalcite,
  calculateKspAragonite,
  calculateActivityCoefficient
} from './other.js'
import {
  applyPressureCorrection,
  getPressureParamsK1,
  getPressureParamsK2,
  getPressureParamsKB,
  getPressureParamsKW,
  getPressureParamsKspCalcite,
  getPressureParamsKspAragonite
} from './pressure.js'

// K1/K2 constants
export {
  K12_FORMULATIONS,
  calculateK1,
  calculateK2
} from './k12.js'

// KSO4 constants
export {
  KSO4_FORMULATIONS,
  calculateKSO4,
  calculateTotalSulfate
} from './kso4.js'

// KF constants
export {
  KF_FORMULATIONS,
  calculateKF,
  calculateTotalFluoride
} from './kf.js'

// Total Boron
export {
  BORON_FORMULATIONS,
  calculateTotalBoron
} from './boron.js'

// Other constants (KB, KW, K0, Ksp, Ca)
export {
  calculateK0,
  calculateFugacityCoefficient,
  calculateKB,
  calculateKW,
  calculateKspCalcite,
  calculateKspAragonite,
  calculateCalciumFromSalinity
} from './other.js'

// Pressure corrections and pH scale conversions
export {
  applyPressureCorrection,
  getPressureParamsK1,
  getPressureParamsK2,
  getPressureParamsKB,
  getPressureParamsKW,
  getPressureParamsKspCalcite,
  getPressureParamsKspAragonite,
  convertpH,
  convertpHTotalToFree,
  convertpHFreeToTotal,
  convertpHTotalToSWS,
  convertpHSWSToTotal
} from './pressure.js'

/**
 * Calculate all equilibrium constants with pressure corrections
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @param {number} pressureBar - Pressure in bar (0 for surface)
 * @param {string} k12Formulation - K1/K2 formulation code (default: 'RRV93')
 * @param {string} kso4Formulation - KSO4 formulation code (default: 'D90a')
 * @param {string} kfFormulation - KF formulation code (default: 'DR79')
 * @param {string} boronFormulation - Total Boron formulation code (default: 'U74')
 * @returns {Object} All equilibrium constants
 */
export function calculateAllConstants(
  tempC,
  salinity,
  pressureBar = 0,
  k12Formulation = 'RRV93',
  kso4Formulation = 'D90a',
  kfFormulation = 'DR79',
  boronFormulation = 'U74'
) {
  // Calculate constants at 1 atm
  const K1_0 = calculateK1(tempC, salinity, k12Formulation)
  const K2_0 = calculateK2(tempC, salinity, k12Formulation)
  const KB_0 = calculateKB(tempC, salinity)
  const KW_0 = calculateKW(tempC, salinity)
  const KSO4 = calculateKSO4(tempC, salinity, kso4Formulation) // Already on Free scale
  const KF = calculateKF(tempC, salinity, kfFormulation) // Already on Free scale
  const KspCalcite_0 = calculateKspCalcite(tempC, salinity)
  const KspAragonite_0 = calculateKspAragonite(tempC, salinity)

  // Apply pressure corrections if needed
  const K1 = applyPressureCorrection(K1_0, tempC, pressureBar, getPressureParamsK1())
  const K2 = applyPressureCorrection(K2_0, tempC, pressureBar, getPressureParamsK2())
  const KB = applyPressureCorrection(KB_0, tempC, pressureBar, getPressureParamsKB())
  const KW = applyPressureCorrection(KW_0, tempC, pressureBar, getPressureParamsKW())
  const KspCalcite = applyPressureCorrection(KspCalcite_0, tempC, pressureBar, getPressureParamsKspCalcite())
  const KspAragonite = applyPressureCorrection(KspAragonite_0, tempC, pressureBar, getPressureParamsKspAragonite())

  // Calculate total concentrations
  const totalSulfate = calculateTotalSulfate(salinity)
  const totalFluoride = calculateTotalFluoride(salinity)
  const totalBoron = calculateTotalBoron(salinity, boronFormulation)

  // Calculate activity coefficient for NBS scale conversions
  const fH = calculateActivityCoefficient(tempC, salinity)

  return {
    K1,
    K2,
    KB,
    KW,
    KSO4,
    KF,
    KspCalcite,
    KspAragonite,
    totalSulfate,
    totalFluoride,
    totalBoron,
    fH,
    temperature: tempC,
    salinity,
    pressure: pressureBar,
    k12Formulation,
    kso4Formulation,
    kfFormulation,
    boronFormulation
  }
}

/**
 * pH Solver using Newton-Raphson Method
 *
 * Solves for pH given any two non-pH carbonate parameters
 */

import {
  calculateAlkalinity,
  calculateDICFromCO2andpH,
  calculateDICFromCO3andpH,
  calculateDICFromHCO3andpH,
  calculateCO2FromDICandpH,
  calculateHCO3FromDICandpH,
  calculateCO3FromDICandpH
} from './speciation.js'
import { calculateK0, calculateFugacityCoefficient } from '../constants/other.js'

/**
 * Solve for pH using Newton's method
 * Given two non-pH parameters, iterate to find pH
 *
 * @param {string} param1Type - First parameter type
 * @param {number} param1Value - First parameter value
 * @param {string} param2Type - Second parameter type
 * @param {number} param2Value - Second parameter value
 * @param {Object} constants - All equilibrium constants
 * @param {number} initialGuess - Initial pH guess (default 8.0)
 * @returns {number} pH on Total scale
 */
export function solvepH(param1Type, param1Value, param2Type, param2Value, constants, initialGuess = null) {
  const maxIterations = 200
  const tolerance = 1e-9

  // Choose better initial guess based on parameter types and values
  if (initialGuess === null) {
    // Special handling for TA + DIC pair
    if ((param1Type === 'TA' && param2Type === 'DIC') || (param1Type === 'DIC' && param2Type === 'TA')) {
      const TA = param1Type === 'TA' ? param1Value : param2Value
      const DIC = param1Type === 'DIC' ? param1Value : param2Value

      // Use TA/DIC ratio to estimate initial pH
      // Low TA/DIC ratio (< 0.5) suggests acidic conditions
      // High TA/DIC ratio (> 1.5) suggests basic conditions
      const ratio = TA / DIC

      if (ratio < 0.2) {
        initialGuess = 5.0  // Very acidic
      } else if (ratio < 0.5) {
        initialGuess = 6.5  // Acidic
      } else if (ratio < 1.0) {
        initialGuess = 7.5  // Slightly acidic
      } else if (ratio < 1.3) {
        initialGuess = 8.0  // Normal seawater
      } else {
        initialGuess = 8.5  // Basic
      }
    } else if (['CO3', 'HCO3', 'aqCO2'].includes(param1Type) && ['CO3', 'HCO3', 'aqCO2'].includes(param2Type)) {
      initialGuess = 8.0
    } else if (['pCO2', 'aqCO2'].includes(param1Type) || ['pCO2', 'aqCO2'].includes(param2Type)) {
      initialGuess = 8.0
    } else {
      initialGuess = 8.0
    }
  }

  let pH = initialGuess

  for (let i = 0; i < maxIterations; i++) {
    let f, fprime

    // Calculate residual and derivative based on parameter pair
    if (param1Type === 'TA' && param2Type === 'DIC') {
      const TA_calc = calculateAlkalinity(pH, param2Value, constants)
      f = TA_calc - param1Value

      // Numerical derivative
      const dpH = 1e-6
      const TA_plus = calculateAlkalinity(pH + dpH, param2Value, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if (param1Type === 'DIC' && param2Type === 'TA') {
      const TA_calc = calculateAlkalinity(pH, param1Value, constants)
      f = TA_calc - param2Value

      const dpH = 1e-6
      const TA_plus = calculateAlkalinity(pH + dpH, param1Value, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if (param1Type === 'TA' && param2Type === 'pCO2') {
      const K0 = calculateK0(constants.temperature, constants.salinity)
      const fugacity = calculateFugacityCoefficient(constants.temperature)
      const CO2aq = param2Value * K0 * fugacity // µmol/kg
      const DIC_calc = calculateDICFromCO2andpH(CO2aq, pH, constants)
      const TA_calc = calculateAlkalinity(pH, DIC_calc, constants)
      f = TA_calc - param1Value

      const dpH = 1e-6
      const DIC_plus = calculateDICFromCO2andpH(CO2aq, pH + dpH, constants)
      const TA_plus = calculateAlkalinity(pH + dpH, DIC_plus, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if ((param1Type === 'TA' && param2Type === 'CO3') ||
               (param1Type === 'CO3' && param2Type === 'TA')) {
      const TA = param1Type === 'TA' ? param1Value : param2Value
      const CO3 = param1Type === 'CO3' ? param1Value : param2Value
      const DIC_calc = calculateDICFromCO3andpH(CO3, pH, constants)
      const TA_calc = calculateAlkalinity(pH, DIC_calc, constants)
      f = TA_calc - TA

      const dpH = 1e-6
      const DIC_plus = calculateDICFromCO3andpH(CO3, pH + dpH, constants)
      const TA_plus = calculateAlkalinity(pH + dpH, DIC_plus, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if ((param1Type === 'TA' && param2Type === 'HCO3') ||
               (param1Type === 'HCO3' && param2Type === 'TA')) {
      const TA = param1Type === 'TA' ? param1Value : param2Value
      const HCO3 = param1Type === 'HCO3' ? param1Value : param2Value
      const DIC_calc = calculateDICFromHCO3andpH(HCO3, pH, constants)
      const TA_calc = calculateAlkalinity(pH, DIC_calc, constants)
      f = TA_calc - TA

      const dpH = 1e-6
      const DIC_plus = calculateDICFromHCO3andpH(HCO3, pH + dpH, constants)
      const TA_plus = calculateAlkalinity(pH + dpH, DIC_plus, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if ((param1Type === 'DIC' && param2Type === 'pCO2') ||
               (param1Type === 'pCO2' && param2Type === 'DIC')) {
      const DIC = param1Type === 'DIC' ? param1Value : param2Value
      const pCO2 = param1Type === 'pCO2' ? param1Value : param2Value
      const K0 = calculateK0(constants.temperature, constants.salinity)
      const fugacity = calculateFugacityCoefficient(constants.temperature)
      const CO2aq_target = pCO2 * K0 * fugacity
      const CO2aq_calc = calculateCO2FromDICandpH(DIC, pH, constants)
      f = CO2aq_calc - CO2aq_target

      const dpH = 1e-6
      const CO2aq_plus = calculateCO2FromDICandpH(DIC, pH + dpH, constants)
      fprime = (CO2aq_plus - CO2aq_calc) / dpH

    } else if ((param1Type === 'DIC' && param2Type === 'CO3') ||
               (param1Type === 'CO3' && param2Type === 'DIC')) {
      const DIC = param1Type === 'DIC' ? param1Value : param2Value
      const CO3_target = param1Type === 'CO3' ? param1Value : param2Value
      const CO3_calc = calculateCO3FromDICandpH(DIC, pH, constants)
      f = CO3_calc - CO3_target

      const dpH = 1e-6
      const CO3_plus = calculateCO3FromDICandpH(DIC, pH + dpH, constants)
      fprime = (CO3_plus - CO3_calc) / dpH

    } else if ((param1Type === 'TA' && param2Type === 'aqCO2') ||
               (param1Type === 'aqCO2' && param2Type === 'TA')) {
      // TA + aqCO2: Similar to TA + pCO2 but aqCO2 is already the aqueous concentration
      const TA = param1Type === 'TA' ? param1Value : param2Value
      const aqCO2 = param1Type === 'aqCO2' ? param1Value : param2Value
      const DIC_calc = calculateDICFromCO2andpH(aqCO2, pH, constants)
      const TA_calc = calculateAlkalinity(pH, DIC_calc, constants)
      f = TA_calc - TA

      const dpH = 1e-6
      const DIC_plus = calculateDICFromCO2andpH(aqCO2, pH + dpH, constants)
      const TA_plus = calculateAlkalinity(pH + dpH, DIC_plus, constants)
      fprime = (TA_plus - TA_calc) / dpH

    } else if ((param1Type === 'DIC' && param2Type === 'HCO3') ||
               (param1Type === 'HCO3' && param2Type === 'DIC')) {
      // DIC + HCO3: Calculate HCO3 from DIC and pH, compare to target
      const DIC = param1Type === 'DIC' ? param1Value : param2Value
      const HCO3_target = param1Type === 'HCO3' ? param1Value : param2Value
      const HCO3_calc = calculateHCO3FromDICandpH(DIC, pH, constants)
      f = HCO3_calc - HCO3_target

      const dpH = 1e-6
      const HCO3_plus = calculateHCO3FromDICandpH(DIC, pH + dpH, constants)
      fprime = (HCO3_plus - HCO3_calc) / dpH

    } else if ((param1Type === 'DIC' && param2Type === 'aqCO2') ||
               (param1Type === 'aqCO2' && param2Type === 'DIC')) {
      // DIC + aqCO2: Calculate aqCO2 from DIC and pH, compare to target
      const DIC = param1Type === 'DIC' ? param1Value : param2Value
      const aqCO2_target = param1Type === 'aqCO2' ? param1Value : param2Value
      const aqCO2_calc = calculateCO2FromDICandpH(DIC, pH, constants)
      f = aqCO2_calc - aqCO2_target

      const dpH = 1e-6
      const aqCO2_plus = calculateCO2FromDICandpH(DIC, pH + dpH, constants)
      fprime = (aqCO2_plus - aqCO2_calc) / dpH

    } else if ((param1Type === 'pCO2' && param2Type === 'CO3') ||
               (param1Type === 'CO3' && param2Type === 'pCO2')) {
      // pCO2 + CO3: Algebraic solution H = sqrt(K0 * K1 * K2 * fCO2 / CO3)
      // From equilibria: CO3 = K1 * K2 * CO2(aq) / H^2, and CO2(aq) = K0 * fCO2
      const pCO2 = param1Type === 'pCO2' ? param1Value : param2Value
      const CO3 = param1Type === 'CO3' ? param1Value : param2Value
      const K0 = calculateK0(constants.temperature, constants.salinity)
      const fugacity = calculateFugacityCoefficient(constants.temperature)
      const { K1, K2 } = constants
      const fCO2 = pCO2 * fugacity
      const H = Math.sqrt(K0 * K1 * K2 * fCO2 / CO3) // mol/kg
      return -Math.log10(H)

    } else if ((param1Type === 'pCO2' && param2Type === 'HCO3') ||
               (param1Type === 'HCO3' && param2Type === 'pCO2')) {
      // pCO2 + HCO3: Algebraic solution H = K0 * K1 * fCO2 / HCO3
      // From equilibria: HCO3 = K1 * CO2(aq) / H, and CO2(aq) = K0 * fCO2
      const pCO2 = param1Type === 'pCO2' ? param1Value : param2Value
      const HCO3 = param1Type === 'HCO3' ? param1Value : param2Value
      const K0 = calculateK0(constants.temperature, constants.salinity)
      const fugacity = calculateFugacityCoefficient(constants.temperature)
      const { K1 } = constants
      const fCO2 = pCO2 * fugacity
      const H = K0 * K1 * fCO2 / HCO3 // mol/kg
      return -Math.log10(H)

    } else if ((param1Type === 'pCO2' && param2Type === 'aqCO2') ||
               (param1Type === 'aqCO2' && param2Type === 'pCO2')) {
      // pCO2 + aqCO2: These are related by K0 (aqCO2 = pCO2 * K0 * fugacity)
      // This is pH-independent - just check consistency
      const pCO2 = param1Type === 'pCO2' ? param1Value : param2Value
      const aqCO2_target = param1Type === 'aqCO2' ? param1Value : param2Value
      const K0 = calculateK0(constants.temperature, constants.salinity)
      const fugacity = calculateFugacityCoefficient(constants.temperature)
      const aqCO2_from_pCO2 = pCO2 * K0 * fugacity
      const consistency = Math.abs(aqCO2_from_pCO2 - aqCO2_target) / aqCO2_target

      if (consistency > 0.10) { // More than 10% inconsistency
        throw new Error(`pCO2 and aqCO2 values are inconsistent (${(consistency * 100).toFixed(1)}% difference)`)
      }

      // Values are reasonably consistent - return initial pH since this pair doesn't constrain pH
      return initialGuess

    } else if ((param1Type === 'CO3' && param2Type === 'HCO3') ||
               (param1Type === 'HCO3' && param2Type === 'CO3')) {
      // CO3 + HCO3: Algebraic solution H = K2 * HCO3 / CO3
      // From equilibrium: CO3 = K2 * HCO3 / H
      const CO3 = param1Type === 'CO3' ? param1Value : param2Value
      const HCO3 = param1Type === 'HCO3' ? param1Value : param2Value
      const { K2 } = constants
      const H = K2 * HCO3 / CO3 // mol/kg
      return -Math.log10(H)

    } else if ((param1Type === 'CO3' && param2Type === 'aqCO2') ||
               (param1Type === 'aqCO2' && param2Type === 'CO3')) {
      // CO3 + aqCO2: Algebraic solution H = sqrt(K1 * K2 * aqCO2 / CO3)
      // From equilibria: CO3 = K1 * K2 * CO2(aq) / H^2
      const CO3 = param1Type === 'CO3' ? param1Value : param2Value
      const aqCO2 = param1Type === 'aqCO2' ? param1Value : param2Value
      const { K1, K2 } = constants
      const H = Math.sqrt(K1 * K2 * aqCO2 / CO3) // mol/kg
      return -Math.log10(H)

    } else if ((param1Type === 'HCO3' && param2Type === 'aqCO2') ||
               (param1Type === 'aqCO2' && param2Type === 'HCO3')) {
      // HCO3 + aqCO2: Algebraic solution H = K1 * aqCO2 / HCO3
      // From equilibrium: HCO3 = K1 * CO2(aq) / H
      const HCO3 = param1Type === 'HCO3' ? param1Value : param2Value
      const aqCO2 = param1Type === 'aqCO2' ? param1Value : param2Value
      const { K1 } = constants
      const H = K1 * aqCO2 / HCO3 // mol/kg
      return -Math.log10(H)

    } else {
      // For other pairs, use a generic approach
      throw new Error(`pH solver not yet implemented for ${param1Type}-${param2Type} pair`)
    }

    // Newton's method step
    let delta = f / fprime

    // Limit step size to prevent overshooting (PyCO2SYS default approach)
    // Cap jumps at ±1.0 pH units for stability
    if (Math.abs(delta) > 1.0) {
      delta = Math.sign(delta) * 1.0
    }

    pH = pH - delta

    // Check convergence
    if (Math.abs(delta) < tolerance) {
      return pH
    }

    // Keep pH in reasonable range (wider range for extreme cases)
    // Allow pH 2-12 to handle unusual conditions like zero alkalinity
    if (pH < 2) pH = 2
    if (pH > 12) pH = 12
  }

  throw new Error('pH solver did not converge')
}

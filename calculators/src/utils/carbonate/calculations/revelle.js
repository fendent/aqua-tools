/**
 * Revelle Factor Calculation
 *
 * Buffer capacity indicator for the carbonate system
 */

import { solvepH } from './solver.js'
import { calculateCO2FromDICandpH } from './speciation.js'
import { calculateK0 } from '../constants/other.js'

/**
 * Calculate Revelle factor (buffer capacity)
 * R = (∂ln(fCO2)/∂ln(DIC))_TA
 *
 * Uses central finite difference method following PyCO2SYS
 * Revelle = (fCO2_plus - fCO2_minus) / dTC / ((fCO2_plus + fCO2_minus) / TC)
 *
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {number} TA - Total Alkalinity in µmol/kg
 * @param {number} pH - pH on Total scale (used as initial guess)
 * @param {Object} constants - All equilibrium constants
 * @returns {number} Revelle factor (dimensionless)
 */
export function calculateRevelleFactor(DIC, TA, pH, constants) {
  // Perturbation size (0.01 µmol/kg as per PyCO2SYS)
  const dTC = 0.01

  // Calculate K0 for fCO2 conversion
  const K0 = calculateK0(constants.temperature, constants.salinity)

  // Calculate fCO2 at DIC + dTC
  const DIC_plus = DIC + dTC
  const pH_plus = solvepH('TA', TA, 'DIC', DIC_plus, constants, pH)
  const CO2aq_plus = calculateCO2FromDICandpH(DIC_plus, pH_plus, constants)
  const fCO2_plus = CO2aq_plus / K0

  // Calculate fCO2 at DIC - dTC
  const DIC_minus = DIC - dTC
  const pH_minus = solvepH('TA', TA, 'DIC', DIC_minus, constants, pH)
  const CO2aq_minus = calculateCO2FromDICandpH(DIC_minus, pH_minus, constants)
  const fCO2_minus = CO2aq_minus / K0

  // Central finite difference formula (PyCO2SYS method)
  // Revelle = (dfCO2/dTC) * TC / fCO2_avg
  const Revelle = (fCO2_plus - fCO2_minus) / dTC / ((fCO2_plus + fCO2_minus) / DIC)

  return Revelle
}

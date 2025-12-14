/**
 * Carbonate System Calculations
 *
 * Main solver for the marine carbonate system.
 * Accepts any 2 of 7 carbonate parameters and calculates the complete system.
 *
 * Parameter types:
 * - pH: pH on specified scale
 * - TA: Total Alkalinity (µmol/kg)
 * - DIC: Dissolved Inorganic Carbon (µmol/kg)
 * - pCO2: Partial pressure of CO2 (µatm)
 * - CO3: Carbonate ion concentration (µmol/kg)
 * - HCO3: Bicarbonate ion concentration (µmol/kg)
 * - aqCO2: Aqueous CO2 concentration (µmol/kg)
 *
 * References:
 * - Zeebe & Wolf-Gladrow (2001) - CO2 in Seawater: Equilibrium, Kinetics, Isotopes
 * - Dickson et al. (2007) - Guide to Best Practices for Ocean CO2 Measurements
 */

// Import calculation functions
export {
  calculateAlkalinity,
  calculateDIC,
  calculateCO2FromDICandpH,
  calculateHCO3FromDICandpH,
  calculateCO3FromDICandpH,
  calculatepCO2FromDICandpH,
  calculateDICFromCO2andpH,
  calculateDICFromCO3andpH,
  calculateDICFromHCO3andpH
} from './speciation.js'

export { solvepH } from './solver.js'
export { calculateSaturationStates } from './saturation.js'
export { calculateRevelleFactor } from './revelle.js'
export { calculateMinorSpecies } from './minorSpecies.js'

// Import constants
import { calculateAllConstants } from '../constants/index.js'
import { K12_FORMULATIONS } from '../constants/k12.js'
import { KSO4_FORMULATIONS } from '../constants/kso4.js'
import { KF_FORMULATIONS } from '../constants/kf.js'
import { BORON_FORMULATIONS } from '../constants/boron.js'
import { calculateK0, calculateFugacityCoefficient } from '../constants/other.js'
import { calculateK0PressureFactor } from '../constants/pressure.js'
import { convertPH } from '../conversions/pHScales.js'
import {
  calculateAlkalinity,
  calculateDIC,
  calculateCO2FromDICandpH,
  calculateHCO3FromDICandpH,
  calculateCO3FromDICandpH,
  calculateDICFromCO2andpH,
  calculateDICFromCO3andpH,
  calculateDICFromHCO3andpH
} from './speciation.js'
import { solvepH } from './solver.js'
import { calculateSaturationStates } from './saturation.js'
import { calculateRevelleFactor } from './revelle.js'
import { calculateMinorSpecies } from './minorSpecies.js'

/**
 * Main carbonate system calculator
 * Accepts any 2 of 7 parameters and calculates the complete system
 *
 * @param {Object} inputs - Input parameters
 * @param {string} inputs.param1Type - First parameter type
 * @param {number} inputs.param1Value - First parameter value
 * @param {string} inputs.param2Type - Second parameter type
 * @param {number} inputs.param2Value - Second parameter value
 * @param {number} inputs.temperature - Temperature in Celsius
 * @param {number} inputs.salinity - Salinity in PSU
 * @param {number} inputs.pressure - Pressure in bar (0 for surface)
 * @param {number} inputs.calcium - Calcium in mmol/kg (optional, calculated from salinity if not provided)
 * @param {number} inputs.totalPhosphate - Total phosphate in µmol/kg (default 0)
 * @param {number} inputs.totalSilicate - Total silicate in µmol/kg (default 0)
 * @param {string} inputs.pHScale - pH scale for input/output ('total', 'sws', 'free', 'nbs')
 * @returns {Object} Complete carbonate system results
 */
export function calculateCarbonateSystem(inputs) {
  const {
    param1Type,
    param1Value,
    param2Type,
    param2Value,
    temperature,
    salinity,
    pressure = 0,
    calcium = null,
    totalPhosphate = 0,
    totalSilicate = 0,
    pHScale = 'total',
    k12Formulation = 'RRV93',
    kso4Formulation = 'D90a',
    kfFormulation = 'DR79',
    boronFormulation = 'U74',
    pressuredKCO2 = false
  } = inputs

  // Validate inputs
  if (!param1Type || !param2Type) {
    throw new Error('Two parameters are required')
  }
  if (param1Type === param2Type) {
    throw new Error('Parameters must be different')
  }

  // Calculate all equilibrium constants
  const constants = calculateAllConstants(temperature, salinity, pressure, k12Formulation, kso4Formulation, kfFormulation, boronFormulation)

  // Calculate K0 with optional pressure correction
  let K0 = calculateK0(temperature, salinity)
  if (pressuredKCO2 && pressure > 0) {
    const pressureFactor = calculateK0PressureFactor(temperature, pressure)
    K0 = K0 * pressureFactor
  }

  const fugacity = calculateFugacityCoefficient(temperature)

  // Determine if pH is given or needs to be solved
  let pH_total
  let DIC, TA, pCO2, CO3, HCO3, aqCO2

  if (param1Type === 'pH') {
    // Convert pH to Total scale if needed
    pH_total = convertPH(param1Value, pHScale, 'total', constants)
  } else if (param2Type === 'pH') {
    pH_total = convertPH(param2Value, pHScale, 'total', constants)
  } else {
    // Solve for pH using Newton's method
    pH_total = solvepH(param1Type, param1Value, param2Type, param2Value, constants)
  }

  // Now calculate all species based on which parameters were given
  if (param1Type === 'pH' || param2Type === 'pH') {
    const otherParam = param1Type === 'pH' ? param2Type : param1Type
    const otherValue = param1Type === 'pH' ? param2Value : param1Value

    if (otherParam === 'TA') {
      DIC = calculateDIC(pH_total, otherValue, constants)
    } else if (otherParam === 'DIC') {
      DIC = otherValue
    } else if (otherParam === 'pCO2') {
      aqCO2 = otherValue * K0 * fugacity
      DIC = calculateDICFromCO2andpH(aqCO2, pH_total, constants)
    } else if (otherParam === 'CO3') {
      DIC = calculateDICFromCO3andpH(otherValue, pH_total, constants)
    } else if (otherParam === 'HCO3') {
      DIC = calculateDICFromHCO3andpH(otherValue, pH_total, constants)
    } else if (otherParam === 'aqCO2') {
      DIC = calculateDICFromCO2andpH(otherValue, pH_total, constants)
    }

    TA = calculateAlkalinity(pH_total, DIC, constants)
  } else {
    // Neither parameter is pH - we solved for it
    if ((param1Type === 'TA' && param2Type === 'DIC') ||
        (param1Type === 'DIC' && param2Type === 'TA')) {
      TA = param1Type === 'TA' ? param1Value : param2Value
      DIC = param1Type === 'DIC' ? param1Value : param2Value
    } else {
      // For other pairs, calculate DIC and TA
      // This is handled in the solver, but we need to recalculate
      if (param1Type === 'TA' || param2Type === 'TA') {
        TA = param1Type === 'TA' ? param1Value : param2Value
        DIC = calculateDIC(pH_total, TA, constants)
      } else if (param1Type === 'DIC' || param2Type === 'DIC') {
        DIC = param1Type === 'DIC' ? param1Value : param2Value
        TA = calculateAlkalinity(pH_total, DIC, constants)
      } else {
        // For exotic pairs (pCO2, CO3, HCO3, aqCO2 combinations without TA/DIC)
        // Calculate DIC from the given parameters, then TA from DIC and pH
        if (param1Type === 'pCO2' || param2Type === 'pCO2') {
          const pCO2Val = param1Type === 'pCO2' ? param1Value : param2Value
          aqCO2 = pCO2Val * K0 * fugacity
          DIC = calculateDICFromCO2andpH(aqCO2, pH_total, constants)
        } else if (param1Type === 'aqCO2' || param2Type === 'aqCO2') {
          const aqCO2Val = param1Type === 'aqCO2' ? param1Value : param2Value
          DIC = calculateDICFromCO2andpH(aqCO2Val, pH_total, constants)
        } else if (param1Type === 'CO3' || param2Type === 'CO3') {
          const CO3Val = param1Type === 'CO3' ? param1Value : param2Value
          DIC = calculateDICFromCO3andpH(CO3Val, pH_total, constants)
        } else if (param1Type === 'HCO3' || param2Type === 'HCO3') {
          const HCO3Val = param1Type === 'HCO3' ? param1Value : param2Value
          DIC = calculateDICFromHCO3andpH(HCO3Val, pH_total, constants)
        }
        TA = calculateAlkalinity(pH_total, DIC, constants)
      }
    }
  }

  // Calculate all carbonate species
  aqCO2 = calculateCO2FromDICandpH(DIC, pH_total, constants)
  HCO3 = calculateHCO3FromDICandpH(DIC, pH_total, constants)
  CO3 = calculateCO3FromDICandpH(DIC, pH_total, constants)
  pCO2 = aqCO2 / (K0 * fugacity)

  // Calculate saturation states
  const { omegaCalcite, omegaAragonite } = calculateSaturationStates(CO3, calcium, constants)

  // Calculate buffer factors
  const revelleFactor = calculateRevelleFactor(DIC, TA, pH_total, constants)

  // Calculate minor species
  const minorSpecies = calculateMinorSpecies(pH_total, { ...constants, totalPhosphate, totalSilicate })

  // Convert pH to requested scale
  const pH_output = convertPH(pH_total, 'total', pHScale, constants)

  // Return complete results
  return {
    // Input conditions
    temperature,
    salinity,
    pressure,

    // pH on all scales
    pH: pH_output,
    pH_total,
    pH_sws: convertPH(pH_total, 'total', 'sws', constants),
    pH_free: convertPH(pH_total, 'total', 'free', constants),
    pH_nbs: convertPH(pH_total, 'total', 'nbs', constants),

    // Main parameters
    TA, // µmol/kg
    DIC, // µmol/kg
    pCO2, // µatm

    // Carbonate species
    aqCO2, // µmol/kg
    HCO3, // µmol/kg
    CO3, // µmol/kg

    // Fractions
    fCO2: aqCO2 / DIC,
    fHCO3: HCO3 / DIC,
    fCO3: CO3 / DIC,

    // Saturation states
    omegaCalcite,
    omegaAragonite,

    // Buffer capacity
    revelleFactor,

    // Minor species
    minorSpecies,

    // Equilibrium constants (for reference)
    K0,
    K1: constants.K1,
    K2: constants.K2,
    KB: constants.KB,
    KW: constants.KW,

    // Full constants object (for pH conversions and advanced calculations)
    constants,

    // Calculation metadata (formulations used)
    k12Formulation: constants.k12Formulation,
    formulationInfo: {
      k12: K12_FORMULATIONS[constants.k12Formulation]?.name || constants.k12Formulation,
      k0: 'Weiss (1974)',
      kb: 'Dickson (1990)',
      kw: 'Millero (1995)',
      kso4: KSO4_FORMULATIONS[constants.kso4Formulation]?.name || constants.kso4Formulation,
      kf: KF_FORMULATIONS[constants.kfFormulation]?.name || constants.kfFormulation,
      ksp: 'Mucci (1983)',
      calcium: 'Riley & Tongudai (1967)',
      totalBoron: BORON_FORMULATIONS[constants.boronFormulation]?.name || constants.boronFormulation
    }
  }
}

/**
 * Calculate carbonate system for multiple time points
 * Useful for tracking changes over time or simulating dosing
 *
 * @param {Array} timeSeriesInputs - Array of input objects with time property
 * @returns {Array} Array of results for each time point
 */
export function calculateCarbonateTimeSeries(timeSeriesInputs) {
  return timeSeriesInputs.map(inputs => {
    try {
      const results = calculateCarbonateSystem(inputs)
      return {
        ...results,
        time: inputs.time,
        success: true
      }
    } catch (error) {
      return {
        time: inputs.time,
        success: false,
        error: error.message
      }
    }
  })
}

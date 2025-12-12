// Concentration calculation and conversion utilities

import { toMilliliters } from './volumeUtils.js'
import { getChemicalByForm } from './dosingChemicals.js'

// ============================================================================
// ALKALINITY UNIT CONVERSIONS
// ============================================================================

// Alkalinity conversion constants
// 1 dKH = 0.357 meq/L = 17.86 ppm CaCO₃
const DKH_TO_MEQL = 0.357
const DKH_TO_PPM_CACO3 = 17.86
const MEQL_TO_DKH = 1 / DKH_TO_MEQL
const MEQL_TO_PPM_CACO3 = DKH_TO_PPM_CACO3 / DKH_TO_MEQL
const PPM_CACO3_TO_DKH = 1 / DKH_TO_PPM_CACO3
const PPM_CACO3_TO_MEQL = 1 / MEQL_TO_PPM_CACO3

/**
 * Convert alkalinity between units
 * @param {number} value - Alkalinity value
 * @param {string} fromUnit - Source unit (dKH, meq/L, ppm)
 * @param {string} toUnit - Target unit (dKH, meq/L, ppm)
 * @returns {number} Converted value
 */
export const convertAlkalinityUnits = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value

  // Convert to meq/L first (base unit)
  let meqL = value
  if (fromUnit === 'dKH') {
    meqL = value * DKH_TO_MEQL
  } else if (fromUnit === 'ppm') {
    meqL = value * PPM_CACO3_TO_MEQL
  }

  // Convert from meq/L to target unit
  if (toUnit === 'dKH') {
    return meqL * MEQL_TO_DKH
  } else if (toUnit === 'ppm') {
    return meqL * MEQL_TO_PPM_CACO3
  }
  return meqL
}

/**
 * Convert level units for any parameter
 * Handles alkalinity units (dKH, meq/L) and other parameter units (ppm, ppt)
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertLevelUnits = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value

  // For alkalinity conversions
  if ((fromUnit === 'dKH' || fromUnit === 'meq/L') && (toUnit === 'dKH' || toUnit === 'meq/L')) {
    if (fromUnit === 'dKH' && toUnit === 'meq/L') return value * DKH_TO_MEQL
    if (fromUnit === 'meq/L' && toUnit === 'dKH') return value * MEQL_TO_DKH
  }

  // For other parameters (ppm/ppt)
  if (fromUnit === 'ppm' && toUnit === 'ppt') return value / 1000
  if (fromUnit === 'ppt' && toUnit === 'ppm') return value * 1000

  return value
}

// ============================================================================
// CONCENTRATION CALCULATIONS
// ============================================================================

/**
 * Calculate concentration from compound weight and solution volume
 * Uses chemical data from dosingChemicals.js
 *
 * @param {string} parameter - Parameter being dosed (calcium, alkalinity, etc.)
 * @param {object} chemical - Chemical object from dosingChemicals.js
 * @param {number} compoundWeight - Weight of compound
 * @param {string} weightUnit - Unit of weight (grams, milligrams, etc.)
 * @param {number} solutionVolume - Volume of solution
 * @param {string} volumeUnit - Unit of volume (milliliters, liters, etc.)
 * @returns {object} { value, unit, description }
 */
export const calculateConcentrationFromRecipe = (
  parameter,
  chemical,
  compoundWeight,
  weightUnit,
  solutionVolume,
  volumeUnit
) => {
  // Convert weight to grams
  let weightGrams = compoundWeight
  if (weightUnit === 'milligrams') {
    weightGrams = compoundWeight / 1000
  } else if (weightUnit === 'ounces') {
    weightGrams = compoundWeight * 28.3495
  } else if (weightUnit === 'pounds') {
    weightGrams = compoundWeight * 453.592
  }

  // Convert volume to milliliters
  const volumeML = toMilliliters(solutionVolume, volumeUnit)

  // Calculate element mass in grams
  const elementMassGrams = weightGrams * (chemical.elementPercentage / 100)

  // Calculate concentration in ppm of element per mL of solution
  const concentrationPpmPerML = (elementMassGrams / volumeML) * 1000

  // For alkalinity, convert to meq/L per mL
  if (parameter === 'alkalinity') {
    // Alkalinity is special - use molecular weight to calculate meq/L
    // meq = moles * equivalents per mole
    // For carbonates/bicarbonates, typically 1 eq per mole
    const moles = weightGrams / chemical.molecularWeight
    const meq = moles * 1000 // convert to meq
    const concentrationMeqLPerML = meq / volumeML

    return {
      value: concentrationMeqLPerML,
      unit: 'meq/L/ml',
      description: `${concentrationMeqLPerML.toFixed(3)} meq/L per mL dosed`
    }
  }

  // For other parameters (Ca, Mg, etc.), return ppm per mL
  return {
    value: concentrationPpmPerML,
    unit: 'ppm/ml',
    description: `${concentrationPpmPerML.toFixed(2)} ppm per mL dosed`
  }
}

/**
 * Convert concentration units from "per gallon" to "per system volume"
 * Commercial products list concentration as "ppm/ml/gal" meaning "ppm increase per mL additive per gallon of system water"
 * We need to convert this to work with any system volume
 *
 * @param {number} concValue - Concentration value
 * @param {string} concUnit - Concentration unit (e.g., "ppm/ml/gal", "meq/L/ml/gal")
 * @param {number} systemVolume - System volume
 * @param {string} systemVolumeUnit - System volume unit
 * @returns {number} Concentration per mL of additive for the system
 */
export const convertConcentrationToSystem = (concValue, concUnit, systemVolume, systemVolumeUnit) => {
  // Convert system volume to gallons for calculation
  const systemVolumeML = toMilliliters(systemVolume, systemVolumeUnit)
  const systemVolumeGal = systemVolumeML / 3785.41

  // Most concentrations are listed as "per gallon"
  // So we scale by the system volume in gallons
  if (concUnit.includes('/gal')) {
    return concValue * systemVolumeGal
  }

  // If already per mL or similar, return as-is
  return concValue
}

// ============================================================================
// DOSING CALCULATIONS
// ============================================================================

/**
 * Calculate dose volume needed to reach target level
 *
 * @param {string} parameter - Parameter being dosed
 * @param {number} currentLevel - Current parameter level
 * @param {number} targetLevel - Target parameter level
 * @param {string} levelUnit - Unit of levels (ppm, dKH, meq/L)
 * @param {number} systemVolume - System volume
 * @param {string} systemVolumeUnit - System volume unit
 * @param {number} concentration - Supplement concentration
 * @param {string} concentrationUnit - Concentration unit
 * @returns {object} { doseVolumeML, resultingLevel, levelIncrease, warnings }
 */
export const calculateDoseVolume = (
  parameter,
  currentLevel,
  targetLevel,
  levelUnit,
  systemVolume,
  systemVolumeUnit,
  concentration,
  concentrationUnit
) => {
  // Calculate level increase needed
  const levelIncrease = targetLevel - currentLevel

  if (levelIncrease <= 0) {
    return {
      doseVolumeML: 0,
      resultingLevel: currentLevel,
      levelIncrease: 0,
      warnings: ['Target level is not higher than current level - no dosing needed']
    }
  }

  // Convert system volume to milliliters
  const systemVolumeML = toMilliliters(systemVolume, systemVolumeUnit)

  // For alkalinity in dKH, convert to meq/L for calculation
  let levelIncreaseCalc = levelIncrease
  let concentrationCalc = concentration

  if (parameter === 'alkalinity') {
    if (levelUnit === 'dKH') {
      levelIncreaseCalc = levelIncrease * DKH_TO_MEQL
    } else if (levelUnit === 'ppm') {
      levelIncreaseCalc = levelIncrease * PPM_CACO3_TO_MEQL
    }
    // Concentration should already be in meq/L per mL or meq/L per g
  }

  // Calculate dose volume
  // Formula: dose_mL = (level_increase * system_volume_mL) / concentration_per_mL
  // But concentration might be "per gallon", so we need to adjust

  // If concentration is per gallon, convert it to per mL of system
  if (concentrationUnit.includes('/gal')) {
    const systemVolumeGal = systemVolumeML / 3785.41
    concentrationCalc = concentration / systemVolumeGal
  }

  // If concentration is per gram (powder), we return dose in grams, then convert to mL equivalent
  const doseAmount = levelIncreaseCalc / concentrationCalc

  // Generate warnings
  const warnings = validateDosingSafety(
    parameter,
    currentLevel,
    targetLevel,
    doseAmount,
    systemVolume,
    systemVolumeUnit,
    concentrationUnit
  )

  return {
    doseVolumeML: doseAmount,
    resultingLevel: targetLevel,
    levelIncrease: levelIncrease,
    warnings
  }
}

// ============================================================================
// SAFETY VALIDATION
// ============================================================================

/**
 * Validate dosing safety and return warnings
 *
 * @param {string} parameter - Parameter being dosed
 * @param {number} currentLevel - Current level
 * @param {number} targetLevel - Target level
 * @param {number} doseAmount - Dose amount (mL or g)
 * @param {number} systemVolume - System volume
 * @param {string} systemVolumeUnit - System volume unit
 * @param {string} concentrationUnit - Concentration unit (to determine if liquid or powder)
 * @returns {Array<string>} Array of warning messages
 */
export const validateDosingSafety = (
  parameter,
  currentLevel,
  targetLevel,
  doseAmount,
  systemVolume,
  systemVolumeUnit,
  concentrationUnit
) => {
  const warnings = []
  const systemVolumeML = toMilliliters(systemVolume, systemVolumeUnit)
  const levelIncrease = targetLevel - currentLevel

  // Check if dose volume is too large (>5% of system volume)
  // Only for liquids (concentrationUnit contains 'ml')
  if (concentrationUnit.includes('ml')) {
    const dosePercentage = (doseAmount / systemVolumeML) * 100
    if (dosePercentage > 5) {
      warnings.push(
        `Dose volume is ${dosePercentage.toFixed(1)}% of system volume (>${5}%). Consider splitting into multiple doses over several hours.`
      )
    }
  }

  // Parameter-specific warnings
  if (parameter === 'magnesium') {
    if (levelIncrease > 100) {
      warnings.push(
        `Magnesium increase of ${levelIncrease.toFixed(0)} ppm exceeds recommended maximum of 100 ppm per 24 hours. Dose over multiple days for safety.`
      )
    }
  }

  if (parameter === 'alkalinity') {
    // Estimate pH change (rough approximation)
    // Large alkalinity swings can cause pH swings
    const alkChange = levelIncrease // in dKH or meq/L
    if (alkChange > 2) {
      warnings.push(
        `Large alkalinity increase (${alkChange.toFixed(1)} ${concentrationUnit.includes('meq') ? 'meq/L' : 'dKH'}) may cause pH fluctuations. Consider dosing gradually.`
      )
    }
  }

  if (parameter === 'calcium') {
    if (levelIncrease > 50) {
      warnings.push(
        `Large calcium increase (${levelIncrease.toFixed(0)} ppm). Consider dosing gradually to avoid precipitation.`
      )
    }
  }

  if (parameter === 'nitrate' || parameter === 'phosphate') {
    if (levelIncrease > 5) {
      warnings.push(
        `Adding ${levelIncrease.toFixed(2)} ppm of ${parameter} at once may shock corals. Consider dosing gradually over several days.`
      )
    }
  }

  if (parameter === 'ammonia') {
    if (levelIncrease > 2) {
      warnings.push(
        `Adding ${levelIncrease.toFixed(2)} ppm of ammonia is only recommended for fishless cycling. NEVER add ammonia to a system with livestock.`
      )
    }
  }

  return warnings
}

/**
 * Get appropriate units for a parameter
 * @param {string} parameter - Parameter name
 * @returns {object} { levelUnits, concentrationUnits }
 */
export const getParameterUnits = (parameter) => {
  switch (parameter) {
    case 'alkalinity':
      return {
        levelUnits: ['dKH', 'meq/L', 'ppm'],
        concentrationUnits: ['meq/L/ml/gal', 'meq/L/g/gal', 'meq/L/ml', 'meq/L/g']
      }
    case 'calcium':
    case 'magnesium':
    case 'nitrate':
    case 'phosphate':
    case 'ammonia':
      return {
        levelUnits: ['ppm'],
        concentrationUnits: ['ppm/ml/gal', 'ppm/g/gal', 'ppm/ml', 'ppm/g']
      }
    default:
      return {
        levelUnits: ['ppm'],
        concentrationUnits: ['ppm/ml/gal', 'ppm/g/gal']
      }
  }
}

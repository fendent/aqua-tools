import { toMilliliters } from './volumeUtils.js'

// Calculation constants
const LITERS_PER_GALLON = 3.78541
const MG_PER_GRAM = 1000
const ML_PER_LITER = 1000

// Randy's Balanced Magnesium Recipe ratios (grams per gram of Mg)
const RANDYS_MGCL2_RATIO = 7.58
const RANDYS_MGSO4_RATIO = 0.95

/**
 * Calculate the amount of compound needed to create a dosing solution
 *
 * @param {number} systemVolume - Total system volume
 * @param {string} systemVolumeUnit - Unit of system volume (gallons, liters, etc.)
 * @param {number} targetChange - Desired parameter change per dose (in ppm or dKH)
 * @param {number} doseVolume - Volume of each dose (in mL)
 * @param {object} chemical - Chemical object from dosingChemicals.js
 * @param {number} solutionVolume - Total volume of solution to prepare (in mL)
 * @returns {object} Calculation results
 */
export const calculateCompoundAmount = (
  systemVolume,
  systemVolumeUnit,
  targetChange,
  doseVolume,
  chemical,
  solutionVolume
) => {
  // Convert system volume to liters
  const systemVolumeL = toMilliliters(systemVolume, systemVolumeUnit) / ML_PER_LITER

  // Handle special case: Balanced Magnesium Recipe
  if (chemical.isRecipe && chemical.id === 'mg-balanced') {
    return calculateBalancedMagnesium(systemVolumeL, targetChange, doseVolume, solutionVolume)
  }

  // Calculate total element needed to achieve target change in the system
  // targetChange is in ppm, systemVolumeL is in liters
  // Total mg of element needed = ppm * liters
  const totalElementMg = targetChange * systemVolumeL

  // Calculate how much element is delivered per dose
  const elementPerDoseMg = totalElementMg

  // Calculate how many doses the solution will provide
  const totalDoses = solutionVolume / doseVolume

  // Total element needed in entire solution
  const totalElementInSolutionMg = elementPerDoseMg * totalDoses

  // Convert mg to grams
  const totalElementG = totalElementInSolutionMg / MG_PER_GRAM

  // Calculate compound needed based on element percentage
  // elementPercentage is the percentage of the target element in the compound
  const compoundNeededG = totalElementG / (chemical.elementPercentage / 100)

  // Calculate final solution concentration (ppm of element in the solution)
  const solutionConcentrationPpm = (totalElementInSolutionMg / solutionVolume) * ML_PER_LITER

  // Calculate how much this dose will change the parameter
  const changePerDose = (elementPerDoseMg / systemVolumeL)

  return {
    compoundNeeded: compoundNeededG,
    solutionConcentration: solutionConcentrationPpm,
    changePerDose: changePerDose,
    dosesInSolution: totalDoses,
    systemVolumeL: systemVolumeL,
    warnings: checkForWarnings(chemical, compoundNeededG, solutionVolume, solutionConcentrationPpm),
    preparationInstruction: `Dissolve ${compoundNeededG.toFixed(2)}g of ${chemical.name} in RODI water`
  }
}

/**
 * Calculate balanced magnesium recipe (Randy's formula)
 */
const calculateBalancedMagnesium = (systemVolumeL, targetChange, doseVolume, solutionVolume) => {
  // Calculate total Mg needed
  const totalMgMg = targetChange * systemVolumeL
  const totalDoses = solutionVolume / doseVolume
  const totalMgInSolutionMg = (totalMgMg / systemVolumeL) * (solutionVolume / ML_PER_LITER)
  const totalMgG = (totalMgInSolutionMg / MG_PER_GRAM) * totalDoses

  // Randy's ratio: MgCl2·6H2O + MgSO4·7H2O per gram of Mg
  const mgcl2Needed = totalMgG * RANDYS_MGCL2_RATIO
  const mgso4Needed = totalMgG * RANDYS_MGSO4_RATIO

  const solutionConcentrationPpm = (totalMgInSolutionMg / solutionVolume) * ML_PER_LITER * totalDoses
  const changePerDose = targetChange
  const dosePerGallon = doseVolume / (systemVolumeL / LITERS_PER_GALLON)

  return {
    compoundNeeded: mgcl2Needed + mgso4Needed,
    mgcl2Needed: mgcl2Needed,
    mgso4Needed: mgso4Needed,
    solutionConcentration: solutionConcentrationPpm,
    changePerDose: changePerDose,
    dosesInSolution: totalDoses,
    dosePerGallon: dosePerGallon,
    systemVolumeL: systemVolumeL,
    warnings: [],
    preparationInstruction: `Mix ${mgcl2Needed.toFixed(2)}g magnesium chloride hexahydrate (MgCl₂·6H₂O) with ${mgso4Needed.toFixed(2)}g magnesium sulfate heptahydrate (MgSO₄·7H₂O, Epsom salt)`
  }
}

/**
 * Check for potential issues with the dosing solution
 */
const checkForWarnings = (chemical, compoundNeededG, solutionVolume, concentrationPpm) => {
  const warnings = []

  // Check solubility limit
  if (chemical.solubilityLimit) {
    const concentrationGL = (compoundNeededG / solutionVolume) * 1000
    const solubilityPercent = (concentrationGL / chemical.solubilityLimit) * 100

    if (solubilityPercent > 90) {
      warnings.push({
        type: 'error',
        message: `Concentration (${concentrationGL.toFixed(1)} g/L) exceeds solubility limit (${chemical.solubilityLimit} g/L). compound may not fully dissolve.`
      })
    } else if (solubilityPercent > 70) {
      warnings.push({
        type: 'warning',
        message: `Concentration is ${solubilityPercent.toFixed(0)}% of solubility limit. May take time to fully dissolve.`
      })
    }
  }

  // Check for pH concerns
  if (chemical.phEffect.includes('Very High') || chemical.phEffect.includes('Very Low')) {
    warnings.push({
      type: 'warning',
      message: `This chemical has ${chemical.phEffect.toLowerCase()} pH. Handle with care and add slowly to tank.`
    })
  }

  // Check for very small compound amounts
  if (compoundNeededG < 0.1) {
    warnings.push({
      type: 'info',
      message: `Very small amount of compound (${compoundNeededG.toFixed(3)}g). Consider increasing solution volume or reducing dose amount for easier measurement.`
    })
  }

  // Check for very large compound amounts
  if (compoundNeededG > 500) {
    warnings.push({
      type: 'info',
      message: `Large amount of compound needed (${compoundNeededG.toFixed(1)}g). Consider reducing solution volume or increasing dose size.`
    })
  }

  return warnings
}

/**
 * Format dosing instructions as human-readable text
 */
export const formatDosingInstructions = (results, doseVolume, systemVolume, systemVolumeUnit, userUnit, baseUnit) => {
  const instructions = []

  // Convert changePerDose to user's selected unit if different from base unit
  let changePerDose = results.changePerDose
  if (baseUnit === 'dKH' && userUnit === 'meq/L') {
    changePerDose = results.changePerDose / 2.8039 // Convert dKH to meq/L
  }

  instructions.push(results.preparationInstruction)
  instructions.push(`Total solution volume: ${parseFloat((results.dosesInSolution * doseVolume / ML_PER_LITER).toFixed(2))}L (${parseFloat((results.dosesInSolution * doseVolume / 29.5735).toFixed(1))} fl oz)`)
  instructions.push(`**Dosing Instructions:**`)
  instructions.push(`- Add ${parseFloat(doseVolume.toFixed(2))}mL per ${systemVolume} ${systemVolumeUnit}`)
  instructions.push(`- This will raise the parameter by ${parseFloat(changePerDose.toFixed(3))} ${userUnit}`)
  instructions.push(`- Solution provides ${results.dosesInSolution.toFixed(0)} total doses`)

  return instructions
}

/**
 * Validate inputs before calculation
 */
export const validateInputs = (systemVolume, targetChange, doseVolume, solutionVolume) => {
  const errors = []

  if (!systemVolume || systemVolume <= 0) {
    errors.push('System volume must be greater than 0')
  }

  if (!targetChange || targetChange <= 0) {
    errors.push('Target change must be greater than 0')
  }

  if (!doseVolume || doseVolume <= 0) {
    errors.push('Dose volume must be greater than 0')
  }

  if (!solutionVolume || solutionVolume <= 0) {
    errors.push('Solution volume must be greater than 0')
  }

  if (doseVolume > solutionVolume) {
    errors.push('Dose volume cannot be larger than solution volume')
  }

  return errors
}

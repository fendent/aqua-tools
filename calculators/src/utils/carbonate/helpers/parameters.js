/**
 * Parameter Type Metadata and Validation
 */

import { convertAlkalinity, convertConcentration } from './units.js'

/**
 * Parameter type metadata
 */
export const PARAMETER_TYPES = {
  pH: {
    id: 'pH',
    name: 'pH',
    description: 'Measure of acidity/alkalinity',
    units: ['nbs', 'free', 'total', 'sws'],
    unitLabels: { total: 'Total', sws: 'Seawater (SWS)', free: 'Free', nbs: 'NBS' },
    defaultUnit: 'nbs',
    typical: { min: 7.8, max: 8.4, reef: 8.1 },
    category: 'measured'
  },
  TA: {
    id: 'TA',
    name: 'Total Alkalinity',
    description: 'Buffer capacity of seawater',
    units: ['µmol/kg', 'meq/L', 'dKH'],
    defaultUnit: 'dKH',
    typical: { min: 2000, max: 3000, reef: 2500 }, // µmol/kg
    category: 'measured'
  },
  DIC: {
    id: 'DIC',
    name: 'Dissolved Inorganic Carbon',
    description: 'Total dissolved CO2 species',
    units: ['µmol/kg', 'mmol/kg', 'dKH'],
    defaultUnit: 'mmol/kg',
    typical: { min: 1800, max: 2200, reef: 2000 }, // µmol/kg
    category: 'calculated'
  },
  pCO2: {
    id: 'pCO2',
    name: 'CO₂ Partial Pressure',
    description: 'CO2 gas pressure',
    units: ['µatm', 'ppm'],
    defaultUnit: 'µatm',
    typical: { min: 300, max: 500, reef: 400 }, // µatm
    category: 'measured'
  },
  CO3: {
    id: 'CO3',
    name: 'Carbonate Ion',
    description: 'CO₃²⁻ concentration',
    units: ['µmol/kg', 'mmol/kg'],
    defaultUnit: 'µmol/kg',
    typical: { min: 200, max: 300, reef: 250 }, // µmol/kg
    category: 'calculated'
  },
  HCO3: {
    id: 'HCO3',
    name: 'Bicarbonate Ion',
    description: 'HCO₃⁻ concentration',
    units: ['µmol/kg', 'mmol/kg'],
    defaultUnit: 'µmol/kg',
    typical: { min: 1600, max: 1900, reef: 1750 }, // µmol/kg
    category: 'calculated'
  },
  aqCO2: {
    id: 'aqCO2',
    name: 'Aqueous CO₂',
    description: 'Dissolved CO2 (aq) concentration',
    units: ['µmol/kg', 'mmol/kg'],
    defaultUnit: 'µmol/kg',
    typical: { min: 5, max: 15, reef: 10 }, // µmol/kg
    category: 'calculated'
  }
}

/**
 * Get all valid parameter pair combinations
 * Returns array of [param1, param2] pairs
 */
export function getValidParameterPairs() {
  const params = ['pH', 'TA', 'DIC', 'pCO2', 'CO3', 'HCO3', 'aqCO2']
  const pairs = []

  for (let i = 0; i < params.length; i++) {
    for (let j = i + 1; j < params.length; j++) {
      pairs.push([params[i], params[j]])
    }
  }

  return pairs // 21 total pairs
}

/**
 * Check if a parameter pair is valid
 */
export function isValidParameterPair(param1, param2) {
  if (!param1 || !param2 || param1 === param2) return false
  return PARAMETER_TYPES[param1] && PARAMETER_TYPES[param2]
}

/**
 * Validate parameter value is in reasonable range
 * @param {string} paramType - Parameter type
 * @param {number} value - Value to validate
 * @param {string} unit - Unit of value
 * @returns {Object} {valid, warning}
 */
export function validateParameter(paramType, value, unit) {
  const param = PARAMETER_TYPES[paramType]
  if (!param) return { valid: true }

  // Convert to default unit for comparison
  let checkValue = value
  if (paramType === 'TA') {
    checkValue = convertAlkalinity(value, unit, 'umol_kg')
  } else if (['DIC', 'CO3', 'HCO3', 'aqCO2'].includes(paramType)) {
    checkValue = convertConcentration(value, unit, 'umol_kg')
  }

  const { min, max } = param.typical

  if (paramType === 'pH') {
    if (value < 5 || value > 11) {
      return { valid: false, warning: 'pH must be between 5 and 11' }
    }
    if (value < 7.5 || value > 8.8) {
      return { valid: true, warning: 'pH outside typical range (7.8-8.4)' }
    }
  } else {
    if (checkValue < min * 0.5 || checkValue > max * 2) {
      return { valid: false, warning: `Value outside reasonable range` }
    }
    if (checkValue < min * 0.8 || checkValue > max * 1.2) {
      return { valid: true, warning: `Value outside typical range (${min}-${max} ${param.defaultUnit})` }
    }
  }

  return { valid: true }
}

/**
 * Educational content and tooltips
 */
export const TOOLTIPS = {
  pH: 'Measure of acidity/alkalinity. Reef tanks typically maintain 7.8-8.4. Lower values indicate more acidic conditions.',

  TA: 'Total Alkalinity (TA) is the buffering capacity of seawater. Maintains stable pH and provides carbonate for coral calcification. Reef target: 7-10 dKH (2500-3500 µmol/kg).',

  DIC: 'Dissolved Inorganic Carbon is the sum of all dissolved CO2 species (CO2(aq), HCO3-, CO3--). Primary carbon source for photosynthesis and calcification.',

  pCO2: 'Partial pressure of CO2 gas. Higher values indicate more CO2 dissolution. Atmospheric level ~400 µatm. Reef aquariums may have elevated pCO2 due to respiration.',

  CO3: 'Carbonate ion (CO3--) concentration. Essential for coral skeleton formation (CaCO3). Higher pH increases carbonate availability.',

  HCO3: 'Bicarbonate ion (HCO3-) is the dominant dissolved carbon species in seawater. Used by corals and algae for photosynthesis.',

  aqCO2: 'Dissolved CO2 in molecular form. Small fraction of DIC but important for gas exchange and photosynthesis.',

  omegaAragonite: 'Aragonite saturation state (Ω). Indicates likelihood of aragonite precipitation (coral skeleton). Ω > 3.5 ideal for coral growth.',

  omegaCalcite: 'Calcite saturation state (Ω). Similar to aragonite but for calcite mineral form. Calcite is more stable than aragonite.',

  revelleFactor: 'Buffer factor - indicates how much pH changes with CO2 addition. Higher values mean pH is more sensitive to CO2 changes. Typical range: 8-15.',

  pHScale: 'Different pH scales account for different ion interactions. Total scale includes HSO4- in proton concentration. SWS also includes HF.',

  temperature: 'Temperature affects all equilibrium constants. Typical reef: 24-26°C. Higher temperature generally decreases CO2 solubility.',

  salinity: 'Salinity affects equilibrium constants and total ion concentrations. Typical seawater: 35 PSU. Reef tanks: 33-36 PSU.',

  pressure: 'Pressure affects equilibrium constants. Surface = 1 atm. Increases ~1 bar per 10m depth. Important for deep water calculations.',

  calcium: 'Calcium concentration affects saturation states. Typical seawater: ~10.3 mmol/kg. Reef target: 400-450 ppm (10-11 mmol/kg).'
}

/**
 * Get tooltip text for a parameter
 * @param {string} paramType - Parameter type
 * @returns {string} Tooltip text
 */
export function getTooltip(paramType) {
  return TOOLTIPS[paramType] || ''
}

/**
 * Calculate recommended parameter ranges for reef aquariums
 * @returns {Object} Recommended ranges by parameter
 */
export function getReefRanges() {
  return {
    pH_total: { min: 7.8, max: 8.4, ideal: 8.1, unit: '' },
    TA: { min: 7, max: 10, ideal: 8.5, unit: 'dKH' },
    DIC: { min: 1800, max: 2200, ideal: 2000, unit: 'µmol/kg' },
    pCO2: { min: 350, max: 500, ideal: 400, unit: 'µatm' },
    CO3: { min: 200, max: 300, ideal: 250, unit: 'µmol/kg' },
    omegaAragonite: { min: 3.5, max: 5.0, ideal: 4.0, unit: '' },
    calcium: { min: 400, max: 450, ideal: 420, unit: 'ppm' }
  }
}

/**
 * Calculate if parameter is within reef range
 * @param {string} paramType - Parameter type
 * @param {number} value - Parameter value
 * @returns {Object} {inRange, status, message}
 */
export function checkReefRange(paramType, value) {
  const ranges = getReefRanges()
  const range = ranges[paramType]

  if (!range) {
    return { inRange: true, status: 'unknown', message: null }
  }

  if (value < range.min) {
    return {
      inRange: false,
      status: 'low',
      message: `Below recommended range (${range.min}-${range.max} ${range.unit})`
    }
  } else if (value > range.max) {
    return {
      inRange: false,
      status: 'high',
      message: `Above recommended range (${range.min}-${range.max} ${range.unit})`
    }
  } else {
    const deviation = Math.abs(value - range.ideal) / (range.max - range.min)
    if (deviation < 0.2) {
      return { inRange: true, status: 'excellent', message: 'Ideal range' }
    } else {
      return { inRange: true, status: 'good', message: 'Within acceptable range' }
    }
  }
}

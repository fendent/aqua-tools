/**
 * Unit Conversion Functions
 */

/**
 * Unit conversion constants
 */
const UMOL_TO_MEQ = 0.001 // µmol/kg to meq/L
const MEQ_TO_UMOL = 1000 // meq/L to µmol/kg
const DKH_TO_MEQ = 0.357143 // dKH to meq/L (1 dKH = 0.357143 meq/L)
const MEQ_TO_DKH = 2.8 // meq/L to dKH

/**
 * Convert alkalinity between units
 * @param {number} value - Alkalinity value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertAlkalinity(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // Convert to µmol/kg first
  let umolkg = value
  if (fromUnit === 'meq/L') {
    umolkg = value * MEQ_TO_UMOL
  } else if (fromUnit === 'dKH') {
    umolkg = value * DKH_TO_MEQ * MEQ_TO_UMOL
  }

  // Convert to target unit
  if (toUnit === 'µmol/kg') {
    return umolkg
  } else if (toUnit === 'meq/L') {
    return umolkg * UMOL_TO_MEQ
  } else if (toUnit === 'dKH') {
    return umolkg * UMOL_TO_MEQ * MEQ_TO_DKH
  }

  return value
}

/**
 * Convert DIC/CO3/HCO3/aqCO2 between units
 * @param {number} value - Concentration value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertConcentration(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // Convert to µmol/kg first
  let umolkg = value
  if (fromUnit === 'mmol/kg') {
    umolkg = value * 1000
  } else if (fromUnit === 'dKH') {
    umolkg = value * DKH_TO_MEQ * MEQ_TO_UMOL
  }

  // Convert from µmol/kg to target unit
  if (toUnit === 'µmol/kg') {
    return umolkg
  } else if (toUnit === 'mmol/kg') {
    return umolkg / 1000
  } else if (toUnit === 'dKH') {
    return umolkg * UMOL_TO_MEQ * MEQ_TO_DKH
  }

  return value
}

/**
 * Convert pCO2 between units
 * @param {number} value - pCO2 value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {number} totalPressure - Total pressure in atm (default: 1)
 * @returns {number} Converted value
 */
export function convertpCO2(value, fromUnit, toUnit, totalPressure = 1) {
  if (fromUnit === toUnit) return value

  // Convert between µatm (partial pressure) and ppm (volume fraction)
  // ppm = (pCO2_atm / total_pressure) × 10^6
  // µatm = pCO2_atm × 10^6
  if (fromUnit === 'µatm' && toUnit === 'ppm') {
    // µatm to ppm: divide by total pressure
    return value / totalPressure
  } else if (fromUnit === 'ppm' && toUnit === 'µatm') {
    // ppm to µatm: multiply by total pressure
    return value * totalPressure
  }

  return value
}

/**
 * Convert temperature between units
 * @param {number} value - Temperature value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  if (fromUnit === '°C' && toUnit === '°F') {
    return (value * 9 / 5) + 32
  } else if (fromUnit === '°F' && toUnit === '°C') {
    return (value - 32) * 5 / 9
  }

  return value
}

/**
 * Convert calcium between units
 * @param {number} value - Calcium value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertCalcium(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // 1 mmol/kg = 40.078 mg/L (ppm) for calcium
  if (fromUnit === 'mmol/kg' && toUnit === 'ppm') {
    return value * 40.078
  } else if (fromUnit === 'ppm' && toUnit === 'mmol/kg') {
    return value / 40.078
  }

  return value
}

/**
 * Convert pressure between units
 * @param {number} value - Pressure value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertPressure(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // Base conversion: 1 atm = 1.01325 bar = 10.1325 dbar
  const ATM_TO_BAR = 1.01325
  const BAR_TO_DBAR = 10

  // Conversion factors (calculated to avoid precision loss)
  const conversions = {
    'bar_to_atm': 1 / ATM_TO_BAR,
    'atm_to_bar': ATM_TO_BAR,
    'bar_to_dbar': BAR_TO_DBAR,
    'dbar_to_bar': 1 / BAR_TO_DBAR,
    'atm_to_dbar': ATM_TO_BAR * BAR_TO_DBAR,
    'dbar_to_atm': 1 / (ATM_TO_BAR * BAR_TO_DBAR)
  }

  const key = `${fromUnit}_to_${toUnit}`
  return conversions[key] ? value * conversions[key] : value
}

/**
 * Convert salinity between units
 * @param {number} value - Salinity value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertSalinity(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // First convert to PSU (base unit)
  let psu = value
  if (fromUnit === 'ppt') {
    psu = value // PSU and ppt are numerically equivalent
  } else if (fromUnit === 'SG') {
    // SG to salinity: S ≈ (SG@25°C - 1.000) * 1360
    psu = (value - 1.000) * 1360
  }

  // Then convert from PSU to target unit
  if (toUnit === 'PSU') {
    return psu
  } else if (toUnit === 'ppt') {
    return psu // PSU and ppt are numerically equivalent
  } else if (toUnit === 'SG') {
    // Salinity to SG: SG@25°C ≈ 1.000 + S / 1360
    return 1.000 + psu / 1360
  }

  return value
}

/**
 * Convert phosphate between units
 * @param {number} value - Phosphate value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertPhosphate(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // Molecular weight of PO4 = 94.97 g/mol
  const MW_PO4 = 94.97

  // First convert to µmol/kg (base unit)
  let umolkg = value
  if (fromUnit === 'ppm') {
    umolkg = (value * 1000) / MW_PO4
  } else if (fromUnit === 'ppb') {
    umolkg = value / MW_PO4
  }

  // Then convert from µmol/kg to target unit
  if (toUnit === 'µmol/kg') {
    return umolkg
  } else if (toUnit === 'ppm') {
    return (umolkg * MW_PO4) / 1000
  } else if (toUnit === 'ppb') {
    return umolkg * MW_PO4
  }

  return value
}

/**
 * Convert silicate between units
 * @param {number} value - Silicate value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertSilicate(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value

  // Molecular weight of SiO2 = 60.08 g/mol
  const MW_SiO2 = 60.08

  // First convert to µmol/kg (base unit)
  let umolkg = value
  if (fromUnit === 'ppm') {
    umolkg = (value * 1000) / MW_SiO2
  } else if (fromUnit === 'ppb') {
    umolkg = value / MW_SiO2
  }

  // Then convert from µmol/kg to target unit
  if (toUnit === 'µmol/kg') {
    return umolkg
  } else if (toUnit === 'ppm') {
    return (umolkg * MW_SiO2) / 1000
  } else if (toUnit === 'ppb') {
    return umolkg * MW_SiO2
  }

  return value
}

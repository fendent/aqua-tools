/**
 * KSO4 Equilibrium Constant
 *
 * Dissociation of hydrogen sulfate: HSO4- ⇌ SO4-- + H+
 */

/**
 * KSO4 Formulation options
 */
export const KSO4_FORMULATIONS = {
  D90a: {
    code: 'D90a',
    name: 'Dickson (1990a)',
    description: 'Standard formulation',
    validRange: 'S: 5-45, T: 0-45°C',
    scale: 'Free'
  },
  KRCB77: {
    code: 'KRCB77',
    name: 'Khoo et al. (1977)',
    description: 'Alternative formulation',
    validRange: 'S: 5-45, T: 0-45°C',
    scale: 'Free'
  }
}

/**
 * Calculate ionic strength from salinity
 * Uses simplified relationship for seawater
 *
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Ionic strength in mol/kg-SW
 */
function calculateIonicStrength(salinity) {
  // Approximation: I ≈ 0.00147 + 0.01992 * S + 0.0001 * S^2
  return 0.00147 + 0.01992 * salinity + 0.0001 * salinity * salinity
}

/**
 * Dissociation constant of hydrogen sulfate (KSO4)
 * HSO4- ⇌ SO4-- + H+
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @param {string} formulation - KSO4 formulation code (default: 'D90a')
 * @returns {number} KSO4 in mol/kg-SW
 */
export function calculateKSO4(tempC, salinity, formulation = 'D90a') {
  const TK = tempC + 273.15
  const I = calculateIonicStrength(salinity)
  const sqrtI = Math.sqrt(I)

  switch (formulation) {
    case 'D90a': {
      // Dickson (1990a) formulation on Free pH scale
      const lnKSO4 = (
        -4276.1 / TK + 141.328 - 23.093 * Math.log(TK) +
        (-13856 / TK + 324.57 - 47.986 * Math.log(TK)) * sqrtI +
        (35474 / TK - 771.54 + 114.723 * Math.log(TK)) * I +
        (-2698 / TK) * Math.pow(I, 1.5) +
        (1776 / TK) * I * I +
        Math.log(1 - 0.001005 * salinity)
      )
      return Math.exp(lnKSO4)
    }

    case 'KRCB77': {
      // Khoo et al. (1977) formulation on Free pH scale
      const pKSO4 = (
        647.59 / TK -
        6.3451 +
        0.019085 * TK -
        0.5208 * sqrtI
      )
      const KSO4 = Math.pow(10, -pKSO4) * (1 - 0.001005 * salinity)
      return KSO4
    }

    default:
      throw new Error(`Unknown KSO4 formulation: ${formulation}`)
  }
}

/**
 * Calculate total sulfate concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Total sulfate in mol/kg-SW
 */
export function calculateTotalSulfate(salinity) {
  // Morris and Riley (1966)
  return 0.14 * salinity / 96.062 / 1.80655
}

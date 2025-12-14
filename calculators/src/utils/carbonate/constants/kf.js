/**
 * KF Equilibrium Constant
 *
 * Dissociation of hydrogen fluoride: HF ⇌ F- + H+
 */

/**
 * KF Formulation options
 */
export const KF_FORMULATIONS = {
  DR79: {
    code: 'DR79',
    name: 'Dickson & Riley (1979)',
    description: 'Standard formulation',
    validRange: 'S: 0-45, T: 0-45°C',
    scale: 'Free'
  },
  PF87: {
    code: 'PF87',
    name: 'Perez & Fraga (1987)',
    description: 'Alternative formulation',
    validRange: 'S: 10-40, T: 9-33°C',
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
 * Dissociation constant of hydrogen fluoride (KF)
 * HF ⇌ F- + H+
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @param {string} formulation - KF formulation code (default: 'DR79')
 * @returns {number} KF in mol/kg-SW
 */
export function calculateKF(tempC, salinity, formulation = 'DR79') {
  const TK = tempC + 273.15
  const I = calculateIonicStrength(salinity)
  const sqrtI = Math.sqrt(I)
  const sqrtS = Math.sqrt(salinity)

  switch (formulation) {
    case 'DR79': {
      // Dickson and Riley (1979) / Dickson and Goyet (1994) - uses ionic strength
      const lnKF = (
        1590.2 / TK - 12.641 + 1.525 * sqrtI +
        Math.log(1 - 0.001005 * salinity)
      )
      return Math.exp(lnKF)
    }

    case 'PF87': {
      // Perez & Fraga (1987) - uses salinity directly
      const lnKF = (
        874 / TK - 9.68 + 0.111 * sqrtS
      )
      return Math.exp(lnKF)
    }

    default:
      throw new Error(`Unknown KF formulation: ${formulation}`)
  }
}

/**
 * Calculate total fluoride concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Total fluoride in mol/kg-SW
 */
export function calculateTotalFluoride(salinity) {
  // Riley (1965)
  return 0.000067 * salinity / 35.0
}

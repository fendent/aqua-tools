/**
 * Total Boron Concentration
 *
 * Total boron as a function of salinity
 */

/**
 * Total Boron Formulation options
 */
export const BORON_FORMULATIONS = {
  U74: {
    code: 'U74',
    name: 'Uppström (1974)',
    description: 'Standard formulation',
    validRange: 'All salinities'
  },
  LKB10: {
    code: 'LKB10',
    name: 'Lee et al. (2010)',
    description: 'Updated formulation',
    validRange: 'All salinities'
  },
  C65: {
    code: 'C65',
    name: 'Culkin (1965)',
    description: 'GEOSECS formulation',
    validRange: 'All salinities'
  },
  KSK18: {
    code: 'KSK18',
    name: 'Recent calibration (2018)',
    description: 'Latest formulation',
    validRange: 'All salinities'
  }
}

/**
 * Calculate total boron concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @param {string} formulation - Total Boron formulation to use (U74, LKB10, C65, KSK18)
 * @returns {number} Total boron in mol/kg-SW
 */
export function calculateTotalBoron(salinity, formulation = 'U74') {
  switch (formulation) {
    case 'U74': {
      // Uppström (1974) - Standard formulation
      return 0.0004157 * salinity / 35.0
    }

    case 'LKB10': {
      // Lee et al. (2010) - Updated formulation
      return 0.0004326 * salinity / 35.0
    }

    case 'C65': {
      // Culkin (1965) - GEOSECS formulation
      return 0.0004106 * salinity / 35.0
    }

    case 'KSK18': {
      // Recent calibration (2018)
      return (10.838 * salinity + 13.821) / 1e6
    }

    default:
      throw new Error(`Unknown Total Boron formulation: ${formulation}`)
  }
}

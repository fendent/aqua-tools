/**
 * K1/K2 Equilibrium Constants for Carbonic Acid
 *
 * First dissociation: H2CO3 ⇌ HCO3- + H+
 * Second dissociation: HCO3- ⇌ CO3-- + H+
 *
 * Supports 17 different formulations as in PyCO2SYS
 */

/**
 * K1/K2 Formulation options (17 total, matching PyCO2SYS)
 */
export const K12_FORMULATIONS = {
  RRV93: {
    code: 'RRV93',
    name: 'Roy et al. (1993)',
    description: 'Recommended for modern work',
    validRange: 'S: 19-43, T: 2-35°C',
    scale: 'Total'
  },
  GP89: {
    code: 'GP89',
    name: 'Goyet & Poisson (1989)',
    description: 'Alternative formulation',
    validRange: 'S: 10-50, T: -1-40°C',
    scale: 'Seawater'
  },
  H73_DM87: {
    code: 'H73_DM87',
    name: 'Hansson (1973) refit by Dickson & Millero (1987)',
    description: 'Historical data with modern refit',
    validRange: 'S: 20-40, T: 2-35°C',
    scale: 'Seawater'
  },
  MCHP73_DM87: {
    code: 'MCHP73_DM87',
    name: 'Mehrbach (1973) refit by Dickson & Millero (1987)',
    description: 'GEOSECS data with modern refit',
    validRange: 'S: 20-40, T: 2-35°C',
    scale: 'Seawater'
  },
  HM_DM87: {
    code: 'HM_DM87',
    name: 'Hansson & Mehrbach refit by Dickson & Millero (1987)',
    description: 'Combined dataset refit',
    validRange: 'S: 20-40, T: 2-35°C',
    scale: 'Seawater'
  },
  MCHP73_GEOSECS: {
    code: 'MCHP73_GEOSECS',
    name: 'Mehrbach et al. (1973) - Original GEOSECS',
    description: 'Original GEOSECS formulation',
    validRange: 'S: 19-43, T: 2-35°C',
    scale: 'NBS'
  },
  M79: {
    code: 'M79',
    name: 'Millero (1979) - Freshwater',
    description: 'Pure water/freshwater formulation',
    validRange: 'S: 0, T: 0-50°C',
    scale: 'Thermodynamic'
  },
  CW98: {
    code: 'CW98',
    name: 'Cai & Wang (1998)',
    description: 'Estuarine/low salinity formulation',
    validRange: 'S: 0-40, T: 0.2-30°C',
    scale: 'NBS'
  },
  LDK00: {
    code: 'LDK00',
    name: 'Lueker et al. (2000)',
    description: 'Widely used, high precision',
    validRange: 'S: 19-43, T: 2-35°C',
    scale: 'Total'
  },
  MM02: {
    code: 'MM02',
    name: 'Mojica Prieto & Millero (2002)',
    description: 'Deep water formulation',
    validRange: 'S: 5-42, T: 0-45°C',
    scale: 'Seawater'
  },
  MPL02: {
    code: 'MPL02',
    name: 'Millero et al. (2002)',
    description: 'Simplified freshwater formulation',
    validRange: 'S: 0-50, T: 1-50°C',
    scale: 'Seawater'
  },
  MGH06: {
    code: 'MGH06',
    name: 'Millero et al. (2006)',
    description: 'Extended salinity range',
    validRange: 'S: 1-50, T: 0-50°C',
    scale: 'Seawater'
  },
  M10: {
    code: 'M10',
    name: 'Millero (2010)',
    description: 'Updated MGH06 formulation',
    validRange: 'S: 1-50, T: 0-50°C',
    scale: 'Seawater'
  },
  WMW14: {
    code: 'WMW14',
    name: 'Waters et al. (2014)',
    description: 'Updated for broad conditions',
    validRange: 'S: 1-50, T: 0-50°C',
    scale: 'Seawater'
  },
  SLH20: {
    code: 'SLH20',
    name: 'Sulpis et al. (2020)',
    description: 'High-pressure formulation',
    validRange: 'S: 30-37, T: 0-25°C',
    scale: 'Total'
  },
  SB21: {
    code: 'SB21',
    name: 'Shao & Byrne (2021)',
    description: 'Latest K2 update',
    validRange: 'S: 19-43, T: 15-35°C',
    scale: 'Total'
  },
  MCHP73: {
    code: 'MCHP73',
    name: 'Mehrbach et al. (1973) - Lueker refit',
    description: 'Alternative DM87 refit',
    validRange: 'S: 19-43, T: 2-35°C',
    scale: 'Total'
  },
  PLR18: {
    code: 'PLR18',
    name: 'Papadimitriou et al. (2018)',
    description: 'Formulation for low temperatures and high salinities',
    validRange: 'S: 33-100, T: -6-25°C',
    scale: 'Total'
  }
}

/**
 * First dissociation constant of carbonic acid (K1)
 * H2CO3 ⇌ HCO3- + H+
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @param {string} formulation - K1/K2 formulation code (default: 'RRV93')
 * @returns {number} K1 in mol/kg-SW
 */
export function calculateK1(tempC, salinity, formulation = 'RRV93') {
  const TK = tempC + 273.15
  const S = salinity
  const sqrtS = Math.sqrt(S)

  switch (formulation) {
    case 'RRV93': {
      // Roy, Roy, Vogel (1993) - ln(K) formulation on Total scale
      const lnK1 = (
        -2307.1266 / TK +
        2.83655 -
        1.5529413 * Math.log(TK) +
        (-4.0484 / TK - 0.20760841) * sqrtS +
        0.08468345 * S -
        0.00654208 * sqrtS * S +
        Math.log(1 - 0.001005 * S)
      )
      return Math.exp(lnK1)
    }

    case 'LDK00': {
      // Lueker, Dickson, Keeling (2000) - pK formulation on Total scale
      const pK1 = (
        3633.86 / TK -
        61.2172 +
        9.6777 * Math.log(TK) -
        0.011555 * S +
        0.0001152 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'MCHP73': {
      // Mehrbach et al. (1973) refit by Lueker et al. (2000)
      const pK1 = (
        3670.7 / TK -
        62.008 +
        9.7944 * Math.log(TK) -
        0.0118 * S +
        0.000116 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'GP89': {
      // Goyet & Poisson (1989) - pK formulation on SWS scale
      const pK1 = (
        812.27 / TK +
        3.356 -
        0.00171 * S * Math.log(TK) +
        0.000091 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'H73_DM87': {
      // Hansson (1973) refit by Dickson & Millero (1987)
      const pK1 = (
        851.4 / TK +
        3.237 -
        0.0106 * S +
        0.000105 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'MCHP73_DM87': {
      // Mehrbach (1973) refit by Dickson & Millero (1987)
      const pK1 = (
        3670.7 / TK -
        62.008 +
        9.7944 * Math.log(TK) -
        0.0118 * S +
        0.000116 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'HM_DM87': {
      // Hansson & Mehrbach refit by Dickson & Millero (1987)
      const pK1 = (
        845 / TK +
        3.248 -
        0.0098 * S +
        0.000087 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'MCHP73_GEOSECS': {
      // Mehrbach et al. (1973) - Original GEOSECS formulation on NBS scale
      const pK1 = (
        -13.7201 +
        0.031334 * TK +
        3235.76 / TK +
        1.3e-5 * S * TK -
        0.1032 * sqrtS
      )
      return Math.pow(10, -pK1)
    }

    case 'M79': {
      // Millero (1979) - Pure water/freshwater
      const lnK1 = (
        290.9097 -
        14554.21 / TK -
        45.0575 * Math.log(TK)
      )
      return Math.exp(lnK1)
    }

    case 'CW98': {
      // Cai & Wang (1998) - Estuarine/low salinity
      const F1 = 200.1 / TK + 0.3220
      const pK1 = (
        3404.71 / TK +
        0.032786 * TK -
        14.8435 -
        0.071692 * F1 * sqrtS +
        0.0021487 * S
      )
      return Math.pow(10, -pK1)
    }

    case 'MM02': {
      // Mojica Prieto & Millero (2002)
      const pK1 = (
        -43.6977 -
        0.0129037 * S +
        1.364e-4 * S * S +
        2885.378 / TK +
        7.045159 * Math.log(TK)
      )
      return Math.pow(10, -pK1)
    }

    case 'MPL02': {
      // Millero et al. (2002)
      const tempC = TK - 273.15
      const pK1 = (
        6.359 -
        0.00664 * S -
        0.01322 * tempC +
        4.989e-5 * tempC * tempC
      )
      return Math.pow(10, -pK1)
    }

    case 'MGH06': {
      // Millero, Graham, Huang (2006)
      const pK1_0 = -126.34048 + 6320.813 / TK + 19.568224 * Math.log(TK)
      const A1 = 13.4191 * sqrtS + 0.0331 * S - 5.33e-5 * S * S
      const B1 = -530.123 * sqrtS - 6.103 * S
      const C1 = -2.06950 * sqrtS
      const pK1 = A1 + B1 / TK + C1 * Math.log(TK) + pK1_0
      return Math.pow(10, -pK1)
    }

    case 'M10': {
      // Millero (2010)
      const pK10 = -126.34048 + 6320.813 / TK + 19.568224 * Math.log(TK)
      const A1 = 13.4038 * sqrtS + 0.03206 * S - 5.242e-5 * S * S
      const B1 = -530.659 * sqrtS - 5.8210 * S
      const C1 = -2.0664 * sqrtS
      const pK1 = pK10 + A1 + B1 / TK + C1 * Math.log(TK)
      return Math.pow(10, -pK1)
    }

    case 'WMW14': {
      // Waters, Millero, Woosley (2014) - Seawater scale
      const pK10 = -126.34048 + 6320.813 / TK + 19.568224 * Math.log(TK)
      const A1 = 13.409160 * sqrtS + 0.031646 * S - 5.1895e-5 * S * S
      const B1 = -531.3642 * sqrtS - 5.713 * S
      const C1 = -2.0669166 * sqrtS
      const pK1 = pK10 + A1 + B1 / TK + C1 * Math.log(TK)
      return Math.pow(10, -pK1)
    }

    case 'SLH20': {
      // Sulpis, Lauvset, Humphreys (2020)
      const pK1 = (
        8510.63 / TK -
        172.4493 +
        26.32996 * Math.log(TK) -
        0.011555 * S +
        0.0001152 * S * S
      )
      return Math.pow(10, -pK1)
    }

    case 'SB21': {
      // Shao & Byrne (2021) - Uses WMW14 K1 (Total scale)
      const pK10 = -126.34048 + 6320.813 / TK + 19.568224 * Math.log(TK)
      const A1 = 13.568513 * sqrtS + 0.031645 * S - 5.3834e-5 * S * S
      const B1 = -539.2304 * sqrtS - 5.635 * S
      const C1 = -2.0901396 * sqrtS
      const pK1 = pK10 + A1 + B1 / TK + C1 * Math.log(TK)
      return Math.pow(10, -pK1)
    }

    case 'PLR18': {
      // Papadimitriou, Loucaides, Rérolle (2018)
      // For 33 < salinity < 100, -6 < temperature < 25 °C
      const pK1 = (
        -176.48 +
        6.14528 * Math.pow(S, 0.5) -
        0.127714 * S +
        7.396e-5 * S * S +
        (9914.37 - 622.886 * Math.pow(S, 0.5) + 29.714 * S) / TK +
        (26.05129 - 0.666812 * Math.pow(S, 0.5)) * Math.log(TK)
      )
      return Math.pow(10, -pK1)
    }

    default:
      throw new Error(`Unknown K1/K2 formulation: ${formulation}`)
  }
}

/**
 * Second dissociation constant of carbonic acid (K2)
 * HCO3- ⇌ CO3-- + H+
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @param {string} formulation - K1/K2 formulation code (default: 'RRV93')
 * @returns {number} K2 in mol/kg-SW
 */
export function calculateK2(tempC, salinity, formulation = 'RRV93') {
  const TK = tempC + 273.15
  const S = salinity
  const sqrtS = Math.sqrt(S)

  switch (formulation) {
    case 'RRV93': {
      // Roy, Roy, Vogel (1993) - ln(K) formulation on Total scale
      const lnK2 = (
        -3351.6106 / TK -
        9.226508 -
        0.2005743 * Math.log(TK) +
        (-23.9722 / TK - 0.106901773) * sqrtS +
        0.1130822 * S -
        0.00846934 * sqrtS * S +
        Math.log(1 - 0.001005 * S)
      )
      return Math.exp(lnK2)
    }

    case 'LDK00': {
      // Lueker, Dickson, Keeling (2000) - pK formulation on Total scale
      const pK2 = (
        471.78 / TK +
        25.929 -
        3.16967 * Math.log(TK) -
        0.01781 * S +
        0.0001122 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'MCHP73': {
      // Mehrbach et al. (1973) refit by Lueker et al. (2000)
      const pK2 = (
        1394.7 / TK +
        4.777 -
        0.0184 * S +
        0.000118 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'GP89': {
      // Goyet & Poisson (1989) - pK formulation on SWS scale
      const pK2 = (
        1450.87 / TK +
        4.604 -
        0.00385 * S * Math.log(TK) +
        0.000182 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'H73_DM87': {
      // Hansson (1973) refit by Dickson & Millero (1987)
      const pK2 = (
        -3885.4 / TK +
        125.844 -
        18.141 * Math.log(TK) -
        0.0192 * S +
        0.000132 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'MCHP73_DM87': {
      // Mehrbach (1973) refit by Dickson & Millero (1987)
      const pK2 = (
        1394.7 / TK +
        4.777 -
        0.0184 * S +
        0.000118 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'HM_DM87': {
      // Hansson & Mehrbach refit by Dickson & Millero (1987)
      const pK2 = (
        1377.3 / TK +
        4.824 -
        0.0185 * S +
        0.000122 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'MCHP73_GEOSECS': {
      // Mehrbach et al. (1973) - Original GEOSECS formulation on NBS scale
      const pK2 = (
        5371.9645 +
        1.671221 * TK +
        0.22913 * S +
        18.3802 * Math.log10(S) -
        128375.28 / TK -
        2194.3055 * Math.log10(TK) -
        8.0944e-4 * S * TK -
        5617.11 * Math.log10(S) / TK +
        2.136 * S / TK
      )
      return Math.pow(10, -pK2)
    }

    case 'M79': {
      // Millero (1979) - Pure water/freshwater
      const lnK2 = (
        207.6548 -
        11843.79 / TK -
        33.6485 * Math.log(TK)
      )
      return Math.exp(lnK2)
    }

    case 'CW98': {
      // Cai & Wang (1998) - Estuarine/low salinity
      const F2 = -129.24 / TK + 1.4381
      const pK2 = (
        2902.39 / TK +
        0.02379 * TK -
        6.4980 -
        0.3191 * F2 * sqrtS +
        0.0198 * S
      )
      return Math.pow(10, -pK2)
    }

    case 'MM02': {
      // Mojica Prieto & Millero (2002)
      const pK2 = (
        -452.0940 +
        13.142162 * S -
        8.101e-4 * S * S +
        21263.61 / TK +
        68.483143 * Math.log(TK) +
        (-581.4428 * S + 0.259601 * S * S) / TK -
        1.967035 * S * Math.log(TK)
      )
      return Math.pow(10, -pK2)
    }

    case 'MPL02': {
      // Millero et al. (2002)
      const tempC = TK - 273.15
      const pK2 = (
        9.867 -
        0.01314 * S -
        0.01904 * tempC +
        2.448e-5 * tempC * tempC
      )
      return Math.pow(10, -pK2)
    }

    case 'MGH06': {
      // Millero, Graham, Huang (2006)
      const pK2_0 = -90.18333 + 5143.692 / TK + 14.613358 * Math.log(TK)
      const A2 = 21.0894 * sqrtS + 0.1248 * S - 3.687e-4 * S * S
      const B2 = -772.483 * sqrtS - 20.051 * S
      const C2 = -3.3336 * sqrtS
      const pK2 = A2 + B2 / TK + C2 * Math.log(TK) + pK2_0
      return Math.pow(10, -pK2)
    }

    case 'M10': {
      // Millero (2010)
      const pK20 = -90.18333 + 5143.692 / TK + 14.613358 * Math.log(TK)
      const A2 = 21.3728 * sqrtS + 0.1218 * S - 3.688e-4 * S * S
      const B2 = -788.289 * sqrtS - 19.189 * S
      const C2 = -3.374 * sqrtS
      const pK2 = pK20 + A2 + B2 / TK + C2 * Math.log(TK)
      return Math.pow(10, -pK2)
    }

    case 'WMW14': {
      // Waters, Millero, Woosley (2014) - Seawater scale
      const pK20 = -90.18333 + 5143.692 / TK + 14.613358 * Math.log(TK)
      const A2 = 21.225890 * sqrtS + 0.12450870 * S - 3.7243e-4 * S * S
      const B2 = -779.3444 * sqrtS - 19.91739 * S
      const C2 = -3.3534679 * sqrtS
      const pK2 = pK20 + A2 + B2 / TK + C2 * Math.log(TK)
      return Math.pow(10, -pK2)
    }

    case 'SLH20': {
      // Sulpis, Lauvset, Humphreys (2020)
      const pK2 = (
        4226.23 / TK -
        59.4636 +
        9.60817 * Math.log(TK) -
        0.01781 * S +
        0.0001122 * S * S
      )
      return Math.pow(10, -pK2)
    }

    case 'SB21': {
      // Shao & Byrne (2021) - Updated K2 formulation
      const pK2 = (
        116.8067 -
        3655.02 / TK -
        16.45817 * Math.log(TK) +
        0.04523 * S -
        0.615 * sqrtS -
        0.0002799 * S * S +
        4.969 * S / TK
      )
      return Math.pow(10, -pK2)
    }

    case 'PLR18': {
      // Papadimitriou, Loucaides, Rérolle (2018)
      // For 33 < salinity < 100, -6 < temperature < 25 °C
      const pK2 = (
        -323.52692 +
        27.557655 * Math.pow(S, 0.5) +
        0.154922 * S -
        2.48396e-4 * S * S +
        (14763.287 - 1014.819 * Math.pow(S, 0.5) - 14.35223 * S) / TK +
        (50.385807 - 4.4630415 * Math.pow(S, 0.5)) * Math.log(TK)
      )
      return Math.pow(10, -pK2)
    }

    default:
      throw new Error(`Unknown K1/K2 formulation: ${formulation}`)
  }
}

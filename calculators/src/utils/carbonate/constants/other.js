/**
 * Other Equilibrium Constants
 *
 * KB (boric acid), KW (water), K0 (CO2 solubility), Ksp (calcite/aragonite), etc.
 */

/**
 * Henry's Law constant for CO2 solubility
 * K0 = [CO2*] / fCO2
 *
 * Uses Weiss (1974) formulation
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} K0 in mol/(kg·atm)
 */
export function calculateK0(tempC, salinity) {
  const TK = tempC + 273.15
  const T100 = TK / 100

  // Weiss (1974)
  const lnK0 = (
    -60.2409 + 93.4517 / T100 + 23.3585 * Math.log(T100) +
    salinity * (0.023517 - 0.023656 * T100 + 0.0047036 * T100 * T100)
  )

  return Math.exp(lnK0)
}

/**
 * Calculate fugacity coefficient for CO2
 * Converts between pCO2 and fCO2
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} pressureAtm - Total pressure in atmospheres
 * @returns {number} Fugacity coefficient (dimensionless)
 */
export function calculateFugacityCoefficient(tempC, pressureAtm = 1) {
  const TK = tempC + 273.15

  // Weiss (1974) - simplified for typical conditions
  const B = -1636.75 + 12.0408 * TK - 0.0327957 * TK * TK + 3.16528e-5 * TK * TK * TK
  const delta = 57.7 - 0.118 * TK

  const fugacity = Math.exp((B + 2 * delta) * pressureAtm / (82.057 * TK))

  return fugacity
}

/**
 * Dissociation constant of boric acid (KB)
 * B(OH)3 + H2O ⇌ B(OH)4- + H+
 *
 * Uses Dickson (1990) formulation on Total pH scale
 * Valid for: S = 20-45, T = 0-45°C
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} KB in mol/kg-SW
 */
export function calculateKB(tempC, salinity) {
  const TK = tempC + 273.15 // Convert to Kelvin
  const sqrtS = Math.sqrt(salinity)
  const S = salinity

  // Dickson (1990) formulation
  const lnKB = (
    (-8966.90 - 2890.53 * sqrtS - 77.942 * S + 1.728 * S * sqrtS - 0.0996 * S * S) / TK +
    148.0248 + 137.1942 * sqrtS + 1.62142 * S +
    (-24.4344 - 25.085 * sqrtS - 0.2474 * S) * Math.log(TK) +
    0.053105 * sqrtS * TK
  )

  const KB = Math.exp(lnKB)
  return KB
}

/**
 * Ion product of water (KW)
 * H2O ⇌ H+ + OH-
 *
 * Uses Millero (1995) formulation on Seawater pH scale
 * Valid for: S = 0.5-43, T = 0-45°C
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} KW in (mol/kg-SW)^2
 */
export function calculateKW(tempC, salinity) {
  const TK = tempC + 273.15 // Convert to Kelvin
  const sqrtS = Math.sqrt(salinity)

  // Millero (1995) formulation
  const lnKW = (
    148.96502 - 13847.26 / TK - 23.6521 * Math.log(TK) +
    (-5.977 + 118.67 / TK + 1.0495 * Math.log(TK)) * sqrtS -
    0.01615 * salinity
  )

  const KW = Math.exp(lnKW)
  return KW
}

/**
 * Solubility product for calcite (KspCalcite)
 * CaCO3 (calcite) ⇌ Ca++ + CO3--
 *
 * Uses Mucci (1983) formulation
 * Valid for: S = 5-43, T = 0-40°C
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} KspCalcite in (mol/kg-SW)^2
 */
export function calculateKspCalcite(tempC, salinity) {
  const TK = tempC + 273.15 // Convert to Kelvin
  const logTK = Math.log10(TK)
  const S = salinity

  // Mucci (1983) formulation
  const logKspCalcite = (
    -171.9065 - 0.077993 * TK + 2839.319 / TK + 71.595 * logTK +
    (-0.77712 + 0.0028426 * TK + 178.34 / TK) * Math.sqrt(S) +
    -0.07711 * S + 0.0041249 * S * Math.sqrt(S)
  )

  const KspCalcite = Math.pow(10, logKspCalcite)
  return KspCalcite
}

/**
 * Solubility product for aragonite (KspAragonite)
 * CaCO3 (aragonite) ⇌ Ca++ + CO3--
 *
 * Uses Mucci (1983) formulation
 * Valid for: S = 5-43, T = 0-40°C
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} KspAragonite in (mol/kg-SW)^2
 */
export function calculateKspAragonite(tempC, salinity) {
  const TK = tempC + 273.15 // Convert to Kelvin
  const logTK = Math.log10(TK)
  const S = salinity

  // Mucci (1983) formulation
  const logKspAragonite = (
    -171.945 - 0.077993 * TK + 2903.293 / TK + 71.595 * logTK +
    (-0.068393 + 0.0017276 * TK + 88.135 / TK) * Math.sqrt(S) +
    -0.10018 * S + 0.0059415 * S * Math.sqrt(S)
  )

  const KspAragonite = Math.pow(10, logKspAragonite)
  return KspAragonite
}

/**
 * Calculate calcium concentration from salinity
 * @param {number} salinity - Salinity in PSU
 * @returns {number} Calcium in mol/kg-SW
 */
export function calculateCalciumFromSalinity(salinity) {
  // Default calcium from salinity (Riley and Tongudai 1967)
  // Ca (mol/kg) = (0.02128 / 40.087) × S / 1.80655
  return (0.02128 / 40.087 * salinity / 1.80655)
}

/**
 * Activity coefficient for NBS pH scale (fH)
 * Used for converting between activity-based (NBS) and concentration-based pH scales
 *
 * Following Peng et al. (1987)
 *
 * @param {number} tempC - Temperature in Celsius
 * @param {number} salinity - Salinity in PSU
 * @returns {number} fH activity coefficient (dimensionless)
 */
export function calculateActivityCoefficient(tempC, salinity) {
  const TK = tempC + 273.15

  // Peng et al., Tellus 39B:439-458, 1987
  // They reference the GEOSECS report, but round the value
  return 1.29 - 0.00204 * TK + (0.00046 - 0.00000148 * TK) * salinity * salinity
}

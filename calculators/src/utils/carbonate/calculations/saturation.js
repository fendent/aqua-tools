/**
 * Saturation State Calculations
 *
 * Calculate saturation states for calcite and aragonite
 */

/**
 * Calculate saturation states
 * Ω = [Ca++][CO3--] / Ksp
 *
 * @param {number} CO3 - Carbonate ion concentration in µmol/kg
 * @param {number} calcium - Calcium concentration in mmol/kg (default from salinity)
 * @param {Object} constants - All equilibrium constants
 * @returns {Object} Saturation states {omegaCalcite, omegaAragonite}
 */
export function calculateSaturationStates(CO3, calcium, constants) {
  const { KspCalcite, KspAragonite, salinity } = constants

  // Convert calcium from mmol/kg to mol/kg, or calculate default from salinity (Riley and Tongudai 1967)
  // Ca (mol/kg) = (0.02128 / 40.087) × S / 1.80655
  const Ca = calcium !== null ? calcium / 1000 : (0.02128 / 40.087 * salinity / 1.80655) // mol/kg

  // Convert CO3 from µmol/kg to mol/kg
  const CO3_mol = CO3 * 1e-6

  // Ion product
  const ionProduct = Ca * CO3_mol

  const omegaCalcite = ionProduct / KspCalcite
  const omegaAragonite = ionProduct / KspAragonite

  return { omegaCalcite, omegaAragonite }
}

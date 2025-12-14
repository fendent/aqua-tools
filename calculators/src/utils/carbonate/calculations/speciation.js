/**
 * Carbonate Speciation Calculations
 *
 * Functions to calculate individual carbonate species concentrations
 * and interconvert between different parameters
 */

/**
 * Calculate CO2(aq) from DIC and pH
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} CO2(aq) in µmol/kg
 */
export function calculateCO2FromDICandpH(DIC, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return DIC * H * H / denom
}

/**
 * Calculate HCO3 from DIC and pH
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} HCO3 in µmol/kg
 */
export function calculateHCO3FromDICandpH(DIC, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return DIC * K1 * H / denom
}

/**
 * Calculate CO3 from DIC and pH
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} CO3 in µmol/kg
 */
export function calculateCO3FromDICandpH(DIC, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return DIC * K1 * K2 / denom
}

/**
 * Calculate pCO2 from DIC and pH
 * pCO2 = CO2(aq) / K0
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants including K0
 * @returns {number} pCO2 in µatm
 */
export function calculatepCO2FromDICandpH(DIC, pH, constants) {
  const CO2aq = calculateCO2FromDICandpH(DIC, pH, constants)
  return CO2aq / constants.K0
}

/**
 * Calculate DIC from CO2(aq) and pH
 * @param {number} CO2aq - Aqueous CO2 concentration in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} DIC in µmol/kg
 */
export function calculateDICFromCO2andpH(CO2aq, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return CO2aq * denom / (H * H)
}

/**
 * Calculate DIC from CO3 and pH
 * @param {number} CO3 - Carbonate ion concentration in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} DIC in µmol/kg
 */
export function calculateDICFromCO3andpH(CO3, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return CO3 * denom / (K1 * K2)
}

/**
 * Calculate DIC from HCO3 and pH
 * @param {number} HCO3 - Bicarbonate ion concentration in µmol/kg
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - Equilibrium constants {K1, K2}
 * @returns {number} DIC in µmol/kg
 */
export function calculateDICFromHCO3andpH(HCO3, pH, constants) {
  const { K1, K2 } = constants
  const H = Math.pow(10, -pH) // mol/kg
  const denom = H * H + K1 * H + K1 * K2
  return HCO3 * denom / (K1 * H)
}

/**
 * Calculate alkalinity from carbonate species and pH
 * TA = [HCO3-] + 2[CO3--] + [B(OH)4-] + [OH-] - [H+] - [HSO4-] - [HF]
 *
 * @param {number} pH - pH on Total scale
 * @param {number} DIC - Dissolved Inorganic Carbon in µmol/kg
 * @param {Object} constants - All equilibrium constants
 * @returns {number} Total Alkalinity in µmol/kg
 */
export function calculateAlkalinity(pH, DIC, constants) {
  const { K1, K2, KB, KW, KSO4, KF, totalBoron, totalSulfate, totalFluoride } = constants

  const H = Math.pow(10, -pH) // mol/kg

  // Carbonate alkalinity (all in µmol/kg)
  const denom = H * H + K1 * H + K1 * K2
  const HCO3 = DIC * K1 * H / denom
  const CO3 = DIC * K1 * K2 / denom
  const carbAlk = HCO3 + 2 * CO3

  // Borate alkalinity (convert from mol/kg to µmol/kg)
  const BAlk = totalBoron * KB / (KB + H) * 1e6

  // Water alkalinity (convert from mol/kg to µmol/kg)
  const OH = KW / H * 1e6

  // Hydrogen ion (negative contribution, convert to µmol/kg)
  const Hplus = H * 1e6

  // Sulfate (negative contribution, convert to µmol/kg)
  const HSO4 = totalSulfate * H / (KSO4 + H) * 1e6

  // Fluoride (negative contribution, convert to µmol/kg)
  const HF = totalFluoride * H / (KF + H) * 1e6

  const TA = carbAlk + BAlk + OH - Hplus - HSO4 - HF

  return TA
}

/**
 * Calculate DIC from alkalinity and pH
 * @param {number} pH - pH on Total scale
 * @param {number} TA - Total Alkalinity in µmol/kg
 * @param {Object} constants - All equilibrium constants
 * @returns {number} DIC in µmol/kg
 */
export function calculateDIC(pH, TA, constants) {
  const { K1, K2, KB, KW, KSO4, KF, totalBoron, totalSulfate, totalFluoride } = constants

  const H = Math.pow(10, -pH) * 1e6 // Convert to µmol/kg

  // Borate alkalinity
  const BAlk = totalBoron * KB / (KB + H * 1e-6) * 1e6

  // Water alkalinity
  const OH = KW / (H * 1e-6) * 1e6

  // Hydrogen ion
  const Hplus = H

  // Sulfate
  const HSO4 = totalSulfate * H * 1e-6 / (KSO4 + H * 1e-6) * 1e6

  // Fluoride
  const HF = totalFluoride * H * 1e-6 / (KF + H * 1e-6) * 1e6

  // Carbonate alkalinity
  const carbAlk = TA - BAlk - OH + Hplus + HSO4 + HF

  // Solve for DIC from carbonate alkalinity
  // carbAlk = [HCO3-] + 2[CO3--] = DIC * (K1*H + 2*K1*K2) / (H^2 + K1*H + K1*K2)
  const H_mol = H * 1e-6
  const denom = H_mol * H_mol + K1 * H_mol + K1 * K2
  const alkRatio = (K1 * H_mol + 2 * K1 * K2) / denom

  const DIC = carbAlk / alkRatio

  return DIC
}

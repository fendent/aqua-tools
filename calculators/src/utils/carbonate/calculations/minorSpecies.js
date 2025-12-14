/**
 * Minor Species Calculations
 *
 * Calculate concentrations of minor alkalinity contributors
 */

/**
 * Calculate all minor species concentrations
 * @param {number} pH - pH on Total scale
 * @param {Object} constants - All equilibrium constants
 * @returns {Object} Minor species concentrations in µmol/kg
 */
export function calculateMinorSpecies(pH, constants) {
  const { KB, KW, KSO4, KF, totalBoron, totalSulfate, totalFluoride, totalPhosphate, totalSilicate, KP1, KP2, KP3, KSi } = constants

  const H = Math.pow(10, -pH) // mol/kg

  // Borate species (B(OH)4-)
  const borate = totalBoron * KB / (KB + H) * 1e6 // µmol/kg

  // Hydroxide
  const hydroxide = KW / H * 1e6 // µmol/kg

  // Hydrogen ion
  const hydrogen = H * 1e6 // µmol/kg

  // Bisulfate (HSO4-)
  const bisulfate = totalSulfate * H / (KSO4 + H) * 1e6 // µmol/kg

  // Hydrogen fluoride
  const hf = totalFluoride * H / (KF + H) * 1e6 // µmol/kg

  // Phosphate species (if constants available)
  let phosphate = {
    H3PO4: 0,
    H2PO4: 0,
    HPO4: 0,
    PO4: 0
  }

  if (totalPhosphate > 0 && KP1 && KP2 && KP3) {
    const denom = H * H * H + KP1 * H * H + KP1 * KP2 * H + KP1 * KP2 * KP3
    phosphate.H3PO4 = totalPhosphate * H * H * H / denom
    phosphate.H2PO4 = totalPhosphate * KP1 * H * H / denom
    phosphate.HPO4 = totalPhosphate * KP1 * KP2 * H / denom
    phosphate.PO4 = totalPhosphate * KP1 * KP2 * KP3 / denom
  }

  // Silicate species (if constants available)
  let silicate = {
    Si_OH4: 0,
    SiO_OH3: 0
  }

  if (totalSilicate > 0 && KSi) {
    silicate.Si_OH4 = totalSilicate * H / (H + KSi) // µmol/kg
    silicate.SiO_OH3 = totalSilicate * KSi / (H + KSi) // µmol/kg
  }

  return {
    borate,
    hydroxide,
    hydrogen,
    bisulfate,
    hf,
    phosphate,
    silicate
  }
}

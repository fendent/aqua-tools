/**
 * Unit normalization mappings
 * Maps user-friendly display units to normalized keys (alphanumeric + underscore only)
 */

export const UNIT_MAPPINGS = {
  // Temperature
  degC: '°C',
  degF: '°F',

  // Alkalinity
  dKH: 'dKH',
  meq_L: 'meq/L',
  umol_kg: 'µmol/kg',

  // Calcium
  ppm: 'ppm',
  ppt: 'ppt',
  mmol_kg: 'mmol/kg',

  // pCO2
  uatm: 'µatm',
  atm: 'atm',
  Pa: 'Pa',

  // Pressure
  bar: 'bar',
  dbar: 'dbar',

  // Salinity
  PSU: 'PSU',
  SG: 'SG',

  // pH Scale
  total: 'total',
  sws: 'sws',
  free: 'free',
  nbs: 'nbs'
}

/**
 * Reverse mapping: display units to normalized keys
 */
export const DISPLAY_TO_NORMALIZED = Object.fromEntries(
  Object.entries(UNIT_MAPPINGS).map(([key, value]) => [value, key])
)

/**
 * Get display unit from normalized key
 */
export function getDisplayUnit(normalizedKey) {
  return UNIT_MAPPINGS[normalizedKey] || normalizedKey
}

/**
 * Get normalized key from display unit
 */
export function getNormalizedUnit(displayUnit) {
  return DISPLAY_TO_NORMALIZED[displayUnit] || displayUnit
}

/**
 * Migrate old localStorage values that used special characters
 */
export function migrateUnitValue(oldValue) {
  return getNormalizedUnit(oldValue)
}

/**
 * Carbonate System Module
 *
 * Main entry point for carbonate chemistry calculations
 * Provides backward compatibility with old imports
 */

// Main calculation functions
export {
  calculateCarbonateSystem,
  calculateCarbonateTimeSeries
} from './calculations/index.js'

// All constants and formulations
export * from './constants/index.js'

// All helper functions
export * from './helpers/index.js'

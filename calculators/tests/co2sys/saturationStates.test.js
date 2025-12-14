/**
 * Saturation State Tests
 *
 * Tests calculation of calcium carbonate saturation states (Ω)
 * for calcite and aragonite minerals
 */

import { describe, it, expect } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('Saturation States', () => {
  describe('Basic Calculations', () => {
    it('should calculate aragonite saturation state', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Typical reef aquarium: Ω_arag ~ 3-5
      expect(result.omegaAragonite).toBeGreaterThan(2)
      expect(result.omegaAragonite).toBeLessThan(8)
    })

    it('should calculate calcite saturation state', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Typical reef aquarium: Ω_calc ~ 4-7
      expect(result.omegaCalcite).toBeGreaterThan(3)
      expect(result.omegaCalcite).toBeLessThan(12)
    })

    it('should show Ω_calcite > Ω_aragonite', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'TA',
        param2Value: 2400,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Calcite is always more supersaturated than aragonite
      expect(result.omegaCalcite).toBeGreaterThan(result.omegaAragonite)

      // Ratio should be ~1.5-1.7
      const ratio = result.omegaCalcite / result.omegaAragonite
      expect(ratio).toBeGreaterThan(1.3)
      expect(ratio).toBeLessThan(2.0)
    })
  })

  describe('pH Effects on Saturation', () => {
    it('should increase saturation with increasing pH', () => {
      const result_pH75 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.5,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_pH80 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_pH85 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.5,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result_pH80.omegaAragonite).toBeGreaterThan(result_pH75.omegaAragonite)
      expect(result_pH85.omegaAragonite).toBeGreaterThan(result_pH80.omegaAragonite)
    })
  })

  describe('Alkalinity Effects on Saturation', () => {
    it('should increase saturation with increasing alkalinity', () => {
      const result_TA2000 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_TA2500 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_TA3000 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 3000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result_TA2500.omegaAragonite).toBeGreaterThan(result_TA2000.omegaAragonite)
      expect(result_TA3000.omegaAragonite).toBeGreaterThan(result_TA2500.omegaAragonite)
    })
  })

  describe('Temperature Effects on Saturation', () => {
    it('should vary saturation with temperature', () => {
      const result_10C = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 10,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_25C = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_35C = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 35,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Temperature affects saturation (all should be positive and in reasonable range)
      expect(result_10C.omegaAragonite).toBeGreaterThan(0)
      expect(result_25C.omegaAragonite).toBeGreaterThan(0)
      expect(result_35C.omegaAragonite).toBeGreaterThan(0)

      // They should not all be equal
      const allEqual = result_10C.omegaAragonite === result_25C.omegaAragonite &&
                       result_25C.omegaAragonite === result_35C.omegaAragonite
      expect(allEqual).toBe(false)
    })
  })

  describe('Pressure Effects on Saturation', () => {
    it('should vary saturation with pressure (depth)', () => {
      const result_surface = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_100m = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 100, // ~100 meters depth
        pHScale: 'total'
      })

      const result_500m = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 500, // ~500 meters depth
        pHScale: 'total'
      })

      // Pressure affects saturation (all should be positive)
      expect(result_surface.omegaAragonite).toBeGreaterThan(0)
      expect(result_100m.omegaAragonite).toBeGreaterThan(0)
      expect(result_500m.omegaAragonite).toBeGreaterThan(0)

      // They should not all be equal
      const allEqual = result_surface.omegaAragonite === result_100m.omegaAragonite &&
                       result_100m.omegaAragonite === result_500m.omegaAragonite
      expect(allEqual).toBe(false)
    })
  })

  describe('Reef Aquarium Conditions', () => {
    it('should show healthy saturation for typical reef conditions', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.2,
        param2Type: 'TA',
        param2Value: 2800, // ~8 dKH
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Healthy reef tank: Ω_arag > 3.5
      expect(result.omegaAragonite).toBeGreaterThan(3.5)

      // Ideal range: 3.5-5.0
      expect(result.omegaAragonite).toBeLessThan(6.0)
    })

    it('should show low saturation for stressed reef conditions', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.8,
        param2Type: 'TA',
        param2Value: 2000,
        temperature: 28,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Stressed conditions: Ω_arag < 3
      expect(result.omegaAragonite).toBeLessThan(3.5)

      // Still above dissolution threshold (Ω > 1)
      expect(result.omegaAragonite).toBeGreaterThan(1.0)
    })

    it('should show undersaturation threshold', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.0,
        param2Type: 'TA',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // At very low pH, should approach or be below saturation (Ω < 1)
      expect(result.omegaAragonite).toBeLessThan(1.5)
    })
  })

  describe('Edge Cases', () => {
    it('should handle high CO2 conditions (low pH)', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.2,
        param2Type: 'pCO2',
        param2Value: 2000, // Very high pCO2
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.omegaAragonite).toBeGreaterThan(0)
      expect(result.omegaCalcite).toBeGreaterThan(0)
      expect(result.omegaCalcite).toBeGreaterThan(result.omegaAragonite)
    })

    it('should handle very high alkalinity', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.3,
        param2Type: 'TA',
        param2Value: 3500, // Very high alkalinity
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Should have very high saturation
      expect(result.omegaAragonite).toBeGreaterThan(5)
      expect(result.omegaCalcite).toBeGreaterThan(7)
    })
  })
})

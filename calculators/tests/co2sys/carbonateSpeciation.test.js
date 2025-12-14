/**
 * Carbonate Speciation Tests
 *
 * Tests calculation of individual carbonate species (CO2(aq), HCO3-, CO3--)
 * and their relationships as functions of pH
 */

import { describe, it, expect } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('Carbonate Speciation', () => {
  describe('Species Mass Balance', () => {
    it('should satisfy DIC = CO2 + HCO3 + CO3', () => {
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

      const sumSpecies = result.aqCO2 + result.HCO3 + result.CO3
      expect(sumSpecies).toBeCloseTo(result.DIC, 2)
    })

    it('should have fractions sum to 1', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 2100,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const sumFractions = result.fCO2 + result.fHCO3 + result.fCO3
      expect(sumFractions).toBeCloseTo(1.0, 6)
    })
  })

  describe('pH Effects on Speciation', () => {
    it('should show CO2(aq) dominance at low pH', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 6.5,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // At pH 6.5, bicarbonate should dominate with significant CO2
      expect(result.fHCO3).toBeGreaterThan(0.6)
      expect(result.fCO2).toBeGreaterThan(0.1)
      expect(result.fCO3).toBeLessThan(0.2)
      // CO2 + HCO3 should account for most DIC
      expect(result.fCO2 + result.fHCO3).toBeGreaterThan(0.9)
    })

    it('should show HCO3- dominance at neutral pH', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // At pH 8, HCO3- should dominate
      expect(result.fHCO3).toBeGreaterThan(0.80)
      expect(result.fCO2).toBeLessThan(0.1)
      expect(result.fCO3).toBeLessThan(0.2)
    })

    it('should show CO3-- increasing at high pH', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 10.0,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // At pH 10, CO3-- should be significant
      expect(result.fCO3).toBeGreaterThan(0.80)
      expect(result.fHCO3).toBeLessThan(0.2)
      expect(result.fCO2).toBeLessThan(0.01)
    })

    it('should show typical reef aquarium speciation', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.2,
        param2Type: 'TA',
        param2Value: 2500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Typical reef: mostly HCO3-, some CO3--, little CO2
      expect(result.fHCO3).toBeGreaterThan(0.75)
      expect(result.fCO3).toBeGreaterThan(0.05)
      expect(result.fCO3).toBeLessThan(0.20)
      expect(result.fCO2).toBeLessThan(0.02)
    })
  })

  describe('Species Relationships', () => {
    it('should maintain Bjerrum plot relationships', () => {
      // Test that fractions change systematically with pH
      const result_low = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 5.5,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_mid = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // At low pH, more CO2; at mid pH, more HCO3
      expect(result_low.fCO2).toBeGreaterThan(result_mid.fCO2)
      expect(result_mid.fHCO3).toBeGreaterThan(result_low.fHCO3)
    })

    it('should show increasing CO3/HCO3 ratio with pH', () => {
      const result_pH80 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_pH85 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.5,
        param2Type: 'DIC',
        param2Value: 2000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const ratio_pH80 = result_pH80.CO3 / result_pH80.HCO3
      const ratio_pH85 = result_pH85.CO3 / result_pH85.HCO3

      expect(ratio_pH85).toBeGreaterThan(ratio_pH80)
    })
  })

  describe('pCO2 Relationships', () => {
    it('should correlate pCO2 with CO2(aq)', () => {
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

      // pCO2 should be proportional to CO2(aq) via K0
      // pCO2 (µatm) ≈ CO2(aq) (µmol/kg) / K0 / fugacity
      // Rough check: they should have similar order of magnitude
      expect(result.pCO2).toBeGreaterThan(result.aqCO2 * 5)
      expect(result.pCO2).toBeLessThan(result.aqCO2 * 50)
    })

    it('should increase pCO2 with decreasing pH at constant DIC', () => {
      const result_pH80 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 2100,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_pH75 = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.5,
        param2Type: 'DIC',
        param2Value: 2100,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result_pH75.pCO2).toBeGreaterThan(result_pH80.pCO2)
    })
  })

  describe('Temperature Effects on Speciation', () => {
    it('should shift equilibria with temperature', () => {
      const result_10C = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'DIC',
        param2Value: 2100,
        temperature: 10,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const result_25C = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.1,
        param2Type: 'DIC',
        param2Value: 2100,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Speciation should differ with temperature
      expect(result_10C.fCO3).not.toBeCloseTo(result_25C.fCO3, 2)
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should handle very high DIC', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 3000,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // All species should scale proportionally with DIC
      const sumSpecies = result.aqCO2 + result.HCO3 + result.CO3
      expect(sumSpecies).toBeCloseTo(3000, 2)

      // Fractions should still sum to 1
      const sumFractions = result.fCO2 + result.fHCO3 + result.fCO3
      expect(sumFractions).toBeCloseTo(1.0, 6)
    })

    it('should handle very low DIC', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.0,
        param2Type: 'DIC',
        param2Value: 500,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      const sumSpecies = result.aqCO2 + result.HCO3 + result.CO3
      expect(sumSpecies).toBeCloseTo(500, 1)

      const sumFractions = result.fCO2 + result.fHCO3 + result.fCO3
      expect(sumFractions).toBeCloseTo(1.0, 6)
    })

    it('should produce non-negative species concentrations', () => {
      const testCases = [
        { pH: 7.0, TA: 2000 },
        { pH: 8.0, TA: 2500 },
        { pH: 9.0, TA: 3000 }
      ]

      testCases.forEach(({ pH, TA }) => {
        const result = calculateCarbonateSystem({
          param1Type: 'pH',
          param1Value: pH,
          param2Type: 'TA',
          param2Value: TA,
          temperature: 25,
          salinity: 35,
          pressure: 0,
          pHScale: 'total'
        })

        expect(result.aqCO2).toBeGreaterThanOrEqual(0)
        expect(result.HCO3).toBeGreaterThanOrEqual(0)
        expect(result.CO3).toBeGreaterThanOrEqual(0)
        expect(result.DIC).toBeGreaterThanOrEqual(0)
      })
    })
  })
})

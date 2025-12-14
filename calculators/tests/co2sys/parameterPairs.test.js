/**
 * Parameter Pair Validation Tests
 *
 * Tests all 21 valid parameter pair combinations for the CO2SYS calculator
 * Validates against known reference values and round-trip consistency
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('CO2SYS Parameter Pairs', () => {
  let referenceValues

  beforeAll(() => {
    // Calculate reference values from pH + TA (most reliable pair)
    const baseCalc = calculateCarbonateSystem({
      param1Type: 'pH',
      param1Value: 8.1,
      param2Type: 'TA',
      param2Value: 2500,
      temperature: 25,
      salinity: 35,
      pressure: 0,
      pHScale: 'total'
    })

    referenceValues = {
      pH_total: baseCalc.pH_total,
      TA: baseCalc.TA,
      DIC: baseCalc.DIC,
      pCO2: baseCalc.pCO2,
      CO3: baseCalc.CO3,
      HCO3: baseCalc.HCO3,
      aqCO2: baseCalc.aqCO2,
      omegaAragonite: baseCalc.omegaAragonite,
      omegaCalcite: baseCalc.omegaCalcite,
      revelleFactor: baseCalc.revelleFactor
    }
  })

  describe('Common Parameter Pairs', () => {
    it('pH + TA should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: referenceValues.pH_total,
        param2Type: 'TA',
        param2Value: referenceValues.TA,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 6)
      expect(result.TA).toBeCloseTo(referenceValues.TA, 3)
      expect(result.DIC).toBeCloseTo(referenceValues.DIC, 3)
      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
    })

    it('pH + DIC should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: referenceValues.pH_total,
        param2Type: 'DIC',
        param2Value: referenceValues.DIC,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 6)
      expect(result.DIC).toBeCloseTo(referenceValues.DIC, 3)
      expect(result.TA).toBeCloseTo(referenceValues.TA, 3)
    })

    it('pH + pCO2 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: referenceValues.pH_total,
        param2Type: 'pCO2',
        param2Value: referenceValues.pCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 6)
      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
    })

    it('TA + DIC should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'TA',
        param1Value: referenceValues.TA,
        param2Type: 'DIC',
        param2Value: referenceValues.DIC,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.TA).toBeCloseTo(referenceValues.TA, 3)
      expect(result.DIC).toBeCloseTo(referenceValues.DIC, 3)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 5)
    })

    it('TA + pCO2 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'TA',
        param1Value: referenceValues.TA,
        param2Type: 'pCO2',
        param2Value: referenceValues.pCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.TA).toBeCloseTo(referenceValues.TA, 3)
      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 4)
    })

    it('DIC + pCO2 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'DIC',
        param1Value: referenceValues.DIC,
        param2Type: 'pCO2',
        param2Value: referenceValues.pCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.DIC).toBeCloseTo(referenceValues.DIC, 3)
      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 4)
    })
  })

  describe('Exotic Parameter Pairs (Algebraic Solutions)', () => {
    it('pCO2 + CO3 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pCO2',
        param1Value: referenceValues.pCO2,
        param2Type: 'CO3',
        param2Value: referenceValues.CO3,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
      expect(result.CO3).toBeCloseTo(referenceValues.CO3, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 3)
    })

    it('pCO2 + HCO3 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pCO2',
        param1Value: referenceValues.pCO2,
        param2Type: 'HCO3',
        param2Value: referenceValues.HCO3,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
      expect(result.HCO3).toBeCloseTo(referenceValues.HCO3, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 3)
    })

    it('CO3 + HCO3 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'CO3',
        param1Value: referenceValues.CO3,
        param2Type: 'HCO3',
        param2Value: referenceValues.HCO3,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.CO3).toBeCloseTo(referenceValues.CO3, 2)
      expect(result.HCO3).toBeCloseTo(referenceValues.HCO3, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 3)
    })

    it('CO3 + aqCO2 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'CO3',
        param1Value: referenceValues.CO3,
        param2Type: 'aqCO2',
        param2Value: referenceValues.aqCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.CO3).toBeCloseTo(referenceValues.CO3, 2)
      expect(result.aqCO2).toBeCloseTo(referenceValues.aqCO2, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 3)
    })

    it('HCO3 + aqCO2 should calculate correctly', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'HCO3',
        param1Value: referenceValues.HCO3,
        param2Type: 'aqCO2',
        param2Value: referenceValues.aqCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.HCO3).toBeCloseTo(referenceValues.HCO3, 2)
      expect(result.aqCO2).toBeCloseTo(referenceValues.aqCO2, 2)
      expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, 3)
    })

    it('pCO2 + aqCO2 should verify consistency', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pCO2',
        param1Value: referenceValues.pCO2,
        param2Type: 'aqCO2',
        param2Value: referenceValues.aqCO2,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pCO2).toBeCloseTo(referenceValues.pCO2, 2)
      expect(result.aqCO2).toBeCloseTo(referenceValues.aqCO2, 2)
    })
  })

  describe('Round-Trip Consistency', () => {
    it('should maintain consistency across all parameter pairs', () => {
      const pairs = [
        ['pH', 'TA'], ['pH', 'DIC'], ['pH', 'pCO2'], ['pH', 'CO3'], ['pH', 'HCO3'], ['pH', 'aqCO2'],
        ['TA', 'DIC'], ['TA', 'pCO2'], ['TA', 'CO3'], ['TA', 'HCO3'], ['TA', 'aqCO2'],
        ['DIC', 'pCO2'], ['DIC', 'CO3'], ['DIC', 'HCO3'], ['DIC', 'aqCO2'],
        ['pCO2', 'CO3'], ['pCO2', 'HCO3'],
        // Excluding pCO2 + aqCO2 as it's pH-independent
        ['CO3', 'HCO3'], ['CO3', 'aqCO2'], ['HCO3', 'aqCO2']
      ]

      pairs.forEach(([param1Type, param2Type]) => {
        const param1Value = referenceValues[param1Type === 'pH' ? 'pH_total' : param1Type]
        const param2Value = referenceValues[param2Type === 'pH' ? 'pH_total' : param2Type]

        const result = calculateCarbonateSystem({
          param1Type,
          param1Value,
          param2Type,
          param2Value,
          temperature: 25,
          salinity: 35,
          pressure: 0,
          pHScale: 'total'
        })

        // Verify pH is within tolerance
        // Exotic pairs use algebraic solutions (more accurate)
        // Standard pairs use iterative Newton-Raphson (less accurate due to numerical iterations)
        const isExotic = ['pCO2', 'CO3', 'HCO3', 'aqCO2'].filter(t =>
          [param1Type, param2Type].includes(t)).length === 2
        const pHTolerance = isExotic ? 8 : 5  // Exotic pairs should be more accurate
        expect(result.pH_total).toBeCloseTo(referenceValues.pH_total, pHTolerance)

        // Verify TA and DIC are calculated
        expect(result.TA).toBeGreaterThan(1000)
        expect(result.TA).toBeLessThan(4000)
        expect(result.DIC).toBeGreaterThan(1000)
        expect(result.DIC).toBeLessThan(3000)
      })
    })
  })

  describe('Physical Constraints', () => {
    it('should produce realistic values for reef aquarium conditions', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 8.2,
        param2Type: 'TA',
        param2Value: 2800,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: 'total'
      })

      // Reef aquarium typical ranges
      expect(result.pH_total).toBeGreaterThan(7.8)
      expect(result.pH_total).toBeLessThan(8.5)
      expect(result.pCO2).toBeGreaterThan(200)
      expect(result.pCO2).toBeLessThan(600)
      expect(result.omegaAragonite).toBeGreaterThan(2)
      expect(result.omegaAragonite).toBeLessThan(10)
      expect(result.DIC).toBeGreaterThan(1500)
      expect(result.DIC).toBeLessThan(2500)
    })

    it('should handle extreme but valid conditions', () => {
      const result = calculateCarbonateSystem({
        param1Type: 'pH',
        param1Value: 7.5,
        param2Type: 'TA',
        param2Value: 3500,
        temperature: 10,
        salinity: 25,
        pressure: 0,
        pHScale: 'total'
      })

      expect(result.pH_total).toBeCloseTo(7.5, 5)
      expect(result.TA).toBeCloseTo(3500, 1)
      expect(result.pCO2).toBeGreaterThan(0)
      expect(result.DIC).toBeGreaterThan(0)
    })
  })
})

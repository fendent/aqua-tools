/**
 * Pressured K0/kCO2 Test
 *
 * Simplified port of PyCO2SYS test_pressured_kCO2.py
 *
 * Tests that the opt_pressured_kCO2 option correctly applies pressure
 * corrections to K0 (CO2 solubility constant) following Weiss 1974 eq. 5.
 *
 * The full PyCO2SYS test compares arrays of results against MATLAB outputs.
 * This simplified version tests the core functionality: that K0 and derived
 * parameters (pCO2, fCO2, etc.) change appropriately when pressure corrections
 * are applied.
 */

import { describe, it, expect } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('Pressured K0/kCO2', () => {
  it('should apply pressure correction to K0 when pressuredKCO2 is enabled', () => {
    // Test conditions from PyCO2SYS test
    const baseParams = {
      param1Type: 'TA',
      param1Value: 2300,
      param2Type: 'DIC',
      param2Value: 2100,
      temperature: 25,
      salinity: 35,
      pressure: 1500,  // 1500 bar ≈ 1500 m depth
      k12Formulation: 'M10'  // opt_k_carbonic=10 in PyCO2SYS
    }

    // Calculate without pressure correction on K0 (default)
    const resultNoPressure = calculateCarbonateSystem(baseParams)

    // Calculate with pressure correction on K0
    const resultWithPressure = calculateCarbonateSystem({
      ...baseParams,
      pressuredKCO2: true
    })

    // K0 should be different when pressure correction is applied
    // At high pressure, K0 decreases (per Weiss 1974 eq. 5)
    expect(resultWithPressure.K0).not.toBeCloseTo(resultNoPressure.K0, 6)
    expect(resultWithPressure.K0).toBeLessThan(resultNoPressure.K0)

    // pCO2 should also be affected
    // When K0 decreases, pCO2 increases for the same aqCO2
    expect(resultWithPressure.pCO2).not.toBeCloseTo(resultNoPressure.pCO2, 3)

    // pH, DIC, and TA should be essentially the same
    // (they're input parameters or derived from them, not from K0)
    expect(resultWithPressure.pH).toBeCloseTo(resultNoPressure.pH, 8)
    expect(resultWithPressure.DIC).toBeCloseTo(resultNoPressure.DIC, 8)
    expect(resultWithPressure.TA).toBeCloseTo(resultNoPressure.TA, 8)
  })

  it('should not apply pressure correction when pressure is zero', () => {
    const params = {
      param1Type: 'TA',
      param1Value: 2300,
      param2Type: 'DIC',
      param2Value: 2100,
      temperature: 25,
      salinity: 35,
      pressure: 0  // Surface conditions
    }

    const resultNoPressure = calculateCarbonateSystem(params)
    const resultWithOption = calculateCarbonateSystem({
      ...params,
      pressuredKCO2: true
    })

    // At zero pressure, K0 should be the same regardless of the option
    expect(resultWithOption.K0).toBeCloseTo(resultNoPressure.K0, 12)
    expect(resultWithOption.pCO2).toBeCloseTo(resultNoPressure.pCO2, 10)
  })

  it('should decrease K0 with increasing pressure', () => {
    const baseParams = {
      param1Type: 'TA',
      param1Value: 2300,
      param2Type: 'DIC',
      param2Value: 2100,
      temperature: 25,
      salinity: 35,
      pressuredKCO2: true
    }

    // Test at different pressures (up to 3000 bar ≈ 3000 m depth)
    const result0 = calculateCarbonateSystem({ ...baseParams, pressure: 0 })
    const result500 = calculateCarbonateSystem({ ...baseParams, pressure: 500 })
    const result1500 = calculateCarbonateSystem({ ...baseParams, pressure: 1500 })
    const result3000 = calculateCarbonateSystem({ ...baseParams, pressure: 3000 })

    // K0 should decrease monotonically with pressure (Weiss 1974 eq. 5)
    expect(result500.K0).toBeLessThan(result0.K0)
    expect(result1500.K0).toBeLessThan(result500.K0)
    expect(result3000.K0).toBeLessThan(result1500.K0)
  })
})

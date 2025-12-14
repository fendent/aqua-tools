/**
 * Alkalinity Solver pH Scale Consistency Tests
 *
 * Direct port of PyCO2SYS test_alkalinity_solver_pH.py
 *
 * Tests that pH calculations from alkalinity and DIC produce consistent
 * results across all pH scales (Total, SWS, Free, NBS)
 */

import { describe, it, expect } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('Alkalinity Solver pH Scale Consistency', () => {
  it('should maintain pH scale consistency (test_pH_scale_consistency)', () => {
    // Exact conditions from PyCO2SYS test
    const alkalinity = 0
    const dic = 2500

    // In PyCO2SYS, opt_pH_scale values: 1=Total, 2=SWS, 3=Free, 4=NBS
    // The test calculates for each scale and verifies consistency

    // Calculate carbonate system
    // Our implementation always calculates on Total scale internally,
    // then converts to all scales in the output
    const result = calculateCarbonateSystem({
      param1Type: 'TA',
      param1Value: alkalinity,
      param2Type: 'DIC',
      param2Value: dic,
      temperature: 25,
      salinity: 35,
      pressure: 0,
      pHScale: 'total'
    })

    // PyCO2SYS test checks:
    // assert np.all(np.isclose(results["pH_total"], results["pH"][opt_pH_scale == 1]))
    // assert np.all(np.isclose(results["pH_sws"], results["pH"][opt_pH_scale == 2]))
    // assert np.all(np.isclose(results["pH_free"], results["pH"][opt_pH_scale == 3]))
    // assert np.all(np.isclose(results["pH_nbs"], results["pH"][opt_pH_scale == 4]))

    // In our implementation, pH on all scales should be present in the result
    expect(result.pH_total).toBeDefined()
    expect(result.pH_sws).toBeDefined()
    expect(result.pH_free).toBeDefined()
    expect(result.pH_nbs).toBeDefined()

    // The key test: When we calculate with different scale options,
    // the pH_total, pH_sws, pH_free, and pH_nbs values should be the same
    // as when we specify that scale as the working scale

    // Calculate again with each scale option and verify consistency
    const scales = [
      { name: 'total', key: 'pH_total' },
      { name: 'sws', key: 'pH_sws' },
      { name: 'free', key: 'pH_free' },
      { name: 'nbs', key: 'pH_nbs' }
    ]

    scales.forEach(({ name, key }) => {
      const resultWithScale = calculateCarbonateSystem({
        param1Type: 'TA',
        param1Value: alkalinity,
        param2Type: 'DIC',
        param2Value: dic,
        temperature: 25,
        salinity: 35,
        pressure: 0,
        pHScale: name
      })

      // The pH on each specific scale should match regardless of pHScale option
      expect(resultWithScale[key]).toBeCloseTo(result[key], 12)
      expect(resultWithScale.pH_total).toBeCloseTo(result.pH_total, 12)
      expect(resultWithScale.pH_sws).toBeCloseTo(result.pH_sws, 12)
      expect(resultWithScale.pH_free).toBeCloseTo(result.pH_free, 12)
      expect(resultWithScale.pH_nbs).toBeCloseTo(result.pH_nbs, 12)
    })
  })
})

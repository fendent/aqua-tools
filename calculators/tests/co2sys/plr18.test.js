/**
 * PLR18 K1/K2 Formulation Test
 *
 * Direct port of PyCO2SYS test_PLR18.py
 *
 * Tests that the Papadimitriou, Loucaides, Rérolle (2018) formulation
 * for K1 and K2 produces the expected check values from PLR18 Table 3.
 *
 * Reference: Papadimitriou et al. (2018) Geochim. Cosmochim. Acta 220:55-70
 * doi:10.1016/j.gca.2017.09.020
 */

import { describe, it, expect } from 'vitest'
import { calculateCarbonateSystem } from '../../src/utils/carbonate/index.js'

describe('PLR18 K1/K2 Formulation', () => {
  it('should match PLR18 Table 3 check values (test_PLR18)', () => {
    // Exact conditions from PyCO2SYS test
    // pyco2.sys(temperature=0, salinity=35, opt_k_carbonic=18)
    const result = calculateCarbonateSystem({
      param1Type: 'TA',
      param1Value: 2300,
      param2Type: 'DIC',
      param2Value: 2100,
      temperature: 0,
      salinity: 35,
      pressure: 0,
      k12Formulation: 'PLR18'
    })

    // Calculate pK1 and pK2 from the K1 and K2 constants
    const pK1 = -Math.log10(result.constants.K1)
    const pK2 = -Math.log10(result.constants.K2)

    // PyCO2SYS test checks:
    // assert np.round(pK1, 4) == 6.1267
    // assert np.round(pK2, 4) == 9.3940

    // Round to 4 decimal places and compare
    expect(Math.round(pK1 * 10000) / 10000).toBeCloseTo(6.1267, 4)
    expect(Math.round(pK2 * 10000) / 10000).toBeCloseTo(9.3940, 4)
  })
})

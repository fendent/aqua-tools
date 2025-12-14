/**
 * Equilibrium Constants Tests
 *
 * Tests calculation of equilibrium constants at various conditions
 * Validates against known reference values from literature
 */

import { describe, it, expect } from 'vitest'
import {
  calculateK0,
  calculateK1,
  calculateK2,
  calculateKB,
  calculateKW,
  calculateKspCalcite,
  calculateKspAragonite,
  calculateAllConstants
} from '../../src/utils/carbonate/constants/index.js'

describe('Equilibrium Constants', () => {
  describe('K0 (CO2 Solubility)', () => {
    it('should calculate K0 at standard conditions', () => {
      // Weiss (1974) - reference value at 25°C, S=35
      const K0 = calculateK0(25, 35)
      // Expected: ~0.034 mol/(kg·atm) at 25°C
      expect(K0).toBeGreaterThan(0.028)
      expect(K0).toBeLessThan(0.040)
      expect(K0).toBeCloseTo(0.034, 1)
    })

    it('should decrease with increasing temperature', () => {
      const K0_10 = calculateK0(10, 35)
      const K0_25 = calculateK0(25, 35)
      const K0_40 = calculateK0(40, 35)

      expect(K0_10).toBeGreaterThan(K0_25)
      expect(K0_25).toBeGreaterThan(K0_40)
    })

    it('should decrease with increasing salinity', () => {
      const K0_S20 = calculateK0(25, 20)
      const K0_S35 = calculateK0(25, 35)
      const K0_S45 = calculateK0(25, 45)

      expect(K0_S20).toBeGreaterThan(K0_S35)
      expect(K0_S35).toBeGreaterThan(K0_S45)
    })
  })

  describe('K1 and K2 (Carbonic Acid Dissociation)', () => {
    it('should calculate K1 with default formulation (RRV93)', () => {
      const K1 = calculateK1(25, 35, 'RRV93')
      // Roy et al. 1993: K1 ~ 1.4e-6 at 25°C, S=35
      expect(K1).toBeGreaterThan(1.0e-6)
      expect(K1).toBeLessThan(2.0e-6)
    })

    it('should calculate K2 with default formulation (RRV93)', () => {
      const K2 = calculateK2(25, 35, 'RRV93')
      // Roy et al. 1993: K2 ~ 1.3e-9 at 25°C, S=35
      expect(K2).toBeGreaterThan(0.5e-9)
      expect(K2).toBeLessThan(2.0e-9)
    })

    it('should show K1 > K2', () => {
      const K1 = calculateK1(25, 35, 'RRV93')
      const K2 = calculateK2(25, 35, 'RRV93')

      // K1 should be ~1000x larger than K2
      expect(K1).toBeGreaterThan(K2)
      expect(K1 / K2).toBeGreaterThan(100)
    })

    it('should increase K1 and K2 with temperature', () => {
      const K1_10 = calculateK1(10, 35, 'RRV93')
      const K1_25 = calculateK1(25, 35, 'RRV93')

      const K2_10 = calculateK2(10, 35, 'RRV93')
      const K2_25 = calculateK2(25, 35, 'RRV93')

      expect(K1_25).toBeGreaterThan(K1_10)
      expect(K2_25).toBeGreaterThan(K2_10)
    })

    it('should support multiple K1/K2 formulations', () => {
      const formulations = ['RRV93', 'LDK00', 'GP89']
      const results = formulations.map(form => ({
        form,
        K1: calculateK1(25, 35, form),
        K2: calculateK2(25, 35, form)
      }))

      results.forEach(({ K1, K2 }) => {
        expect(K1).toBeGreaterThan(0)
        expect(K2).toBeGreaterThan(0)
        expect(K1).toBeGreaterThan(K2)
      })
    })
  })

  describe('KB (Boric Acid Dissociation)', () => {
    it('should calculate KB at standard conditions', () => {
      const KB = calculateKB(25, 35)
      // Dickson (1990): KB ~ 2.5e-9 at 25°C, S=35
      expect(KB).toBeGreaterThan(1.0e-9)
      expect(KB).toBeLessThan(4.0e-9)
    })

    it('should increase with temperature', () => {
      const KB_10 = calculateKB(10, 35)
      const KB_25 = calculateKB(25, 35)

      expect(KB_25).toBeGreaterThan(KB_10)
    })
  })

  describe('KW (Water Dissociation)', () => {
    it('should calculate KW at standard conditions', () => {
      const KW = calculateKW(25, 35)
      // Millero (1995): KW ~ 6e-14 at 25°C, S=35
      expect(KW).toBeGreaterThan(1.0e-14)
      expect(KW).toBeLessThan(15.0e-14)
    })

    it('should increase with temperature', () => {
      const KW_10 = calculateKW(10, 35)
      const KW_25 = calculateKW(25, 35)

      expect(KW_25).toBeGreaterThan(KW_10)
    })
  })

  describe('Ksp (Mineral Solubility)', () => {
    it('should calculate Ksp for calcite', () => {
      const KspCalcite = calculateKspCalcite(25, 35)
      // Mucci (1983): Ksp ~ 4.5e-7 at 25°C, S=35
      expect(KspCalcite).toBeGreaterThan(1.0e-7)
      expect(KspCalcite).toBeLessThan(10.0e-7)
    })

    it('should calculate Ksp for aragonite', () => {
      const KspAragonite = calculateKspAragonite(25, 35)
      // Mucci (1983): Ksp ~ 3e-7 at 25°C, S=35
      expect(KspAragonite).toBeGreaterThan(1.0e-7)
      expect(KspAragonite).toBeLessThan(8.0e-7)
    })

    it('should show Ksp relationship between polymorphs', () => {
      const KspCalcite = calculateKspCalcite(25, 35)
      const KspAragonite = calculateKspAragonite(25, 35)

      // Both should be of similar magnitude
      expect(KspCalcite / KspAragonite).toBeGreaterThan(0.5)
      expect(KspCalcite / KspAragonite).toBeLessThan(2.0)
    })

    it('should vary Ksp with temperature', () => {
      const KspCalcite_10 = calculateKspCalcite(10, 35)
      const KspCalcite_25 = calculateKspCalcite(25, 35)

      // Ksp should change with temperature (direction depends on formulation)
      expect(KspCalcite_10).not.toEqual(KspCalcite_25)
      expect(KspCalcite_10).toBeGreaterThan(0)
      expect(KspCalcite_25).toBeGreaterThan(0)
    })
  })

  describe('Pressure Corrections', () => {
    it('should modify constants with pressure', () => {
      const constants_0bar = calculateAllConstants(25, 35, 0)
      const constants_100bar = calculateAllConstants(25, 35, 100)

      // Pressure increases equilibrium constants
      expect(constants_100bar.K1).toBeGreaterThan(constants_0bar.K1)
      expect(constants_100bar.K2).toBeGreaterThan(constants_0bar.K2)
      expect(constants_100bar.KB).toBeGreaterThan(constants_0bar.KB)
    })

    it('should return all required constants', () => {
      const constants = calculateAllConstants(25, 35, 0)

      expect(constants.K1).toBeGreaterThan(0)
      expect(constants.K2).toBeGreaterThan(0)
      expect(constants.KB).toBeGreaterThan(0)
      expect(constants.KW).toBeGreaterThan(0)
      expect(constants.KSO4).toBeGreaterThan(0)
      expect(constants.KF).toBeGreaterThan(0)
      expect(constants.KspCalcite).toBeGreaterThan(0)
      expect(constants.KspAragonite).toBeGreaterThan(0)
      expect(constants.totalBoron).toBeGreaterThan(0)
      expect(constants.totalSulfate).toBeGreaterThan(0)
      expect(constants.totalFluoride).toBeGreaterThan(0)
    })
  })

  describe('Temperature and Salinity Effects', () => {
    const testConditions = [
      { temp: 5, sal: 30 },
      { temp: 15, sal: 33 },
      { temp: 25, sal: 35 },
      { temp: 30, sal: 38 }
    ]

    testConditions.forEach(({ temp, sal }) => {
      it(`should calculate valid constants at T=${temp}°C, S=${sal}`, () => {
        const constants = calculateAllConstants(temp, sal, 0)

        // All constants should be positive
        expect(constants.K1).toBeGreaterThan(0)
        expect(constants.K2).toBeGreaterThan(0)
        expect(constants.KB).toBeGreaterThan(0)
        expect(constants.KW).toBeGreaterThan(0)
        expect(constants.KSO4).toBeGreaterThan(0)
        expect(constants.KF).toBeGreaterThan(0)

        // K1 > K2
        expect(constants.K1).toBeGreaterThan(constants.K2)

        // Both Ksp values should be positive and similar order of magnitude
        expect(constants.KspCalcite).toBeGreaterThan(0)
        expect(constants.KspAragonite).toBeGreaterThan(0)
      })
    })
  })
})

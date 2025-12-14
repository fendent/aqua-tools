/**
 * pH Scale Conversion Tests
 *
 * Tests conversion between pH scales: Total, Seawater (SWS), Free, and NBS
 *
 * Direct port of PyCO2SYS test_pHconversions.py
 *
 * Tests that pH conversions are internally consistent by:
 * 1. Converting in a loop forwards: Total → SWS → NBS → Free → Total
 * 2. Converting in a loop backwards: Total → Free → NBS → SWS → Total
 * 3. Testing all direct conversion pairs
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { calculateAllConstants } from '../../src/utils/carbonate/constants/index.js'
import {
  convertHConcentration,
  pHFreeToTotal,
  pHFreeToSws,
  pHFreeToNbs,
  pHTotalToFree,
  pHTotalToSws,
  pHTotalToNbs,
  pHSwsToFree,
  pHSwsToTotal,
  pHSwsToNbs,
  pHNbsToFree,
  pHNbsToTotal,
  pHNbsToSws
} from '../../src/utils/carbonate/conversions/pHScales.js'

describe('pH Scale Conversions', () => {
  let testData
  const npts = 100

  beforeAll(() => {
    // Prepare test conditions matching PyCO2SYS test
    const conditions = {
      salinity: 31.0,
      temperature: 22.3,
      pressure: 100.0, // dbar, convert to bar
      totalSilicate: 12.0,
      totalPhosphate: 1.5,
      totalAmmonia: 2.0,
      totalSulfide: 0.5
    }

    // Get equilibrium constants
    const constants = calculateAllConstants(
      conditions.temperature,
      conditions.salinity,
      conditions.pressure / 10.0 // Convert dbar to bar
    )

    // Generate random pH values around 8.0 with stddev of 1.0
    // Using deterministic "random" for reproducibility
    const pH_Total_initial = []
    for (let i = 0; i < npts; i++) {
      // Simple deterministic pseudo-random using sine
      const seed = i * 0.1
      const value = 8.0 + Math.sin(seed) * Math.cos(seed * 2) * 1.0
      pH_Total_initial.push(value)
    }

    // Convert pH to H+ concentration (mol/kg)
    const H_Total_initial = pH_Total_initial.map(pH => Math.pow(10, -pH))

    testData = {
      constants,
      H_Total_initial,
      npts
    }
  })

  it('should convert pH in a loop forwards (Total → SWS → NBS → Free → Total)', () => {
    const { constants, H_Total_initial } = testData

    for (let i = 0; i < H_Total_initial.length; i++) {
      const H_T_i = H_Total_initial[i]

      // Forward loop: Total => Seawater => NBS => Free => Total
      const H_S_f = H_T_i * pHTotalToSws(constants)
      const H_N_f = H_S_f * pHSwsToNbs(constants)
      const H_F_f = H_N_f * pHNbsToFree(constants)
      const H_T_f = H_F_f * pHFreeToTotal(constants)

      // Should return to initial value
      expect(H_T_f).toBeCloseTo(H_T_i, 15)
    }
  })

  it('should convert pH in a loop backwards (Total → Free → NBS → SWS → Total)', () => {
    const { constants, H_Total_initial } = testData

    for (let i = 0; i < H_Total_initial.length; i++) {
      const H_T_i = H_Total_initial[i]

      // Backward loop: Total => Free => NBS => Seawater => Total
      const H_F_b = H_T_i * pHTotalToFree(constants)
      const H_N_b = H_F_b * pHFreeToNbs(constants)
      const H_S_b = H_N_b * pHNbsToSws(constants)
      const H_T_b = H_S_b * pHSwsToTotal(constants)

      // Should return to initial value
      expect(H_T_b).toBeCloseTo(H_T_i, 15)
    }
  })

  it('should have consistent direct conversion pairs', () => {
    const { constants, H_Total_initial } = testData

    for (let i = 0; i < H_Total_initial.length; i++) {
      const H_T_i = H_Total_initial[i]

      // Forward conversions
      const H_F_f = H_T_i * pHTotalToFree(constants)
      const H_S_f = H_T_i * pHTotalToSws(constants)
      const H_N_f = H_T_i * pHTotalToNbs(constants)

      // Test Total ↔ NBS direct conversion
      const H_N_m = H_T_i * pHTotalToNbs(constants)
      const H_T_m = H_N_m * pHNbsToTotal(constants)
      expect(H_T_m).toBeCloseTo(H_T_i, 15)
      expect(H_N_m).toBeCloseTo(H_N_f, 15)

      // Test Free ↔ SWS direct conversion
      const H_S_m = H_F_f * pHFreeToSws(constants)
      const H_F_m = H_S_f * pHSwsToFree(constants)
      expect(H_F_m).toBeCloseTo(H_F_f, 15)
      expect(H_S_m).toBeCloseTo(H_S_f, 15)
    }
  })

  it('should convert using the convertHConcentration helper function', () => {
    const { constants, H_Total_initial } = testData

    for (let i = 0; i < Math.min(10, H_Total_initial.length); i++) {
      const H_T_i = H_Total_initial[i]

      // Test Total to all scales
      const H_free = convertHConcentration(H_T_i, 'total', 'free', constants)
      const H_sws = convertHConcentration(H_T_i, 'total', 'sws', constants)
      const H_nbs = convertHConcentration(H_T_i, 'total', 'nbs', constants)

      // Convert back to total
      const H_T_from_free = convertHConcentration(H_free, 'free', 'total', constants)
      const H_T_from_sws = convertHConcentration(H_sws, 'sws', 'total', constants)
      const H_T_from_nbs = convertHConcentration(H_nbs, 'nbs', 'total', constants)

      expect(H_T_from_free).toBeCloseTo(H_T_i, 15)
      expect(H_T_from_sws).toBeCloseTo(H_T_i, 15)
      expect(H_T_from_nbs).toBeCloseTo(H_T_i, 15)
    }
  })

  it('should return same value when converting to same scale', () => {
    const { constants, H_Total_initial } = testData
    const H = H_Total_initial[0]

    expect(convertHConcentration(H, 'total', 'total', constants)).toBe(H)
    expect(convertHConcentration(H, 'free', 'free', constants)).toBe(H)
    expect(convertHConcentration(H, 'sws', 'sws', constants)).toBe(H)
    expect(convertHConcentration(H, 'nbs', 'nbs', constants)).toBe(H)
  })
})

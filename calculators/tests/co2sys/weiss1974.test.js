/**
 * Weiss 1974 K0 (CO2 Solubility) Tests
 *
 * Tests CO2 solubility constant calculation against reference values from
 * Weiss (1974) Table III: "Carbon dioxide in water and seawater: the solubility
 * of a non-ideal gas"
 *
 * This is a direct port of PyCO2SYS test_weiss1974.py
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { calculateK0 } from '../../src/utils/carbonate/constants/other.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Weiss 1974 K0 Validation', () => {
  let weiss1974Data
  let temperatures
  let salinities
  let expectedK0Values

  beforeAll(() => {
    // Read and parse the Weiss 1974 Table III CSV data
    const csvPath = join(__dirname, 'data', 'weiss1974_tableIII.csv')
    const csvContent = readFileSync(csvPath, 'utf-8')
    const lines = csvContent.trim().split('\n')

    // Parse CSV: first row is salinities, first column is temperatures
    const rows = lines.map(line => line.split(',').map(val => val.trim()))

    // Extract salinities from first row (skip first cell which is empty)
    salinities = rows[0].slice(1).map(Number)

    // Extract temperatures and K0 values from remaining rows
    temperatures = []
    expectedK0Values = []

    for (let i = 1; i < rows.length; i++) {
      const temp = Number(rows[i][0])
      temperatures.push(temp)

      // Get K0 values for this temperature across all salinities
      const k0Row = rows[i].slice(1).map(val => {
        const num = Number(val)
        return isNaN(num) || val === '' ? NaN : num
      })
      expectedK0Values.push(k0Row)
    }

    weiss1974Data = {
      temperatures,
      salinities,
      expectedK0Values
    }
  })

  it('should match Weiss 1974 Table III K0 values', () => {
    const { temperatures, salinities, expectedK0Values } = weiss1974Data

    for (let i = 0; i < temperatures.length; i++) {
      const tempC = temperatures[i]

      for (let j = 0; j < salinities.length; j++) {
        const salinity = salinities[j]
        const expected = expectedK0Values[i][j]

        // Skip NaN values in the table
        if (isNaN(expected)) {
          continue
        }

        // Calculate K0 using our implementation
        const tempK = tempC + 273.15
        const k0 = calculateK0(tempC, salinity)

        // Convert K0 to match Weiss 1974 table units (multiply by 100)
        // The table appears to be in units of 10^2 * mol/(kg·atm)
        const k0Scaled = Math.round(k0 * 1e2 * 1000) / 1000

        // Compare with tolerance
        expect(k0Scaled).toBeCloseTo(expected, 2)
      }
    }
  })

  it('should calculate K0 at standard conditions', () => {
    // Test at 25°C, S=35 (typical seawater)
    const k0 = calculateK0(25, 35)

    // From Weiss 1974 Table III, at 24°C and S=35: 2.912
    // At 26°C and S=35: 2.769
    // Interpolating for 25°C: approximately 2.84
    const k0Scaled = k0 * 1e2

    expect(k0Scaled).toBeGreaterThan(2.7)
    expect(k0Scaled).toBeLessThan(3.0)
  })

  it('should show K0 decreases with increasing temperature', () => {
    const salinity = 35
    const k0_10C = calculateK0(10, salinity)
    const k0_25C = calculateK0(25, salinity)
    const k0_40C = calculateK0(40, salinity)

    // K0 decreases with temperature (CO2 less soluble at higher temp)
    expect(k0_10C).toBeGreaterThan(k0_25C)
    expect(k0_25C).toBeGreaterThan(k0_40C)
  })

  it('should show K0 decreases with increasing salinity', () => {
    const tempC = 25
    const k0_S0 = calculateK0(tempC, 0)
    const k0_S20 = calculateK0(tempC, 20)
    const k0_S35 = calculateK0(tempC, 35)

    // K0 decreases with salinity (salting-out effect)
    expect(k0_S0).toBeGreaterThan(k0_S20)
    expect(k0_S20).toBeGreaterThan(k0_S35)
  })
})

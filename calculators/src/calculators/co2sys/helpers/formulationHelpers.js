import { computed } from 'vue'

/**
 * Creates a computed property that maps formulation status for all formulations
 *
 * @param {Object} formulations - formulation constants object
 * @param {Function} checkRangeFn - function to check formulation range
 * @param {import('vue').Ref} temperature - temperature ref
 * @param {import('vue').Ref} salinity - salinity ref
 * @returns {import('vue').ComputedRef} - computed formulation status map
 *
 * @example
 * const k12FormulationStatus = createFormulationStatus(
 *   K12_FORMULATIONS,
 *   checkFormulationRange,
 *   temperature,
 *   salinity
 * )
 */
export function createFormulationStatus(formulations, checkRangeFn, temperature, salinity) {
  return computed(() => {
    return Object.fromEntries(
      Object.entries(formulations).map(([code, formulation]) => [
        code,
        checkRangeFn(formulation, temperature.value, salinity.value)
      ])
    )
  })
}

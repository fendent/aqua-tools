<template>
  <CardSection title="Species Distribution" :collapsible="true" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)">
    <div>
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Species</th>
            <th class="px-4 py-2 text-right font-semibold text-gray-700">Concentration (µmol/kg)</th>
            <th class="px-4 py-2 text-right font-semibold text-gray-700">% of Total</th>
            <th class="px-4 py-2 text-left font-semibold text-gray-700">Role</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Major Carbonate Species -->
          <tr class="bg-blue-50">
            <td colspan="4" class="px-4 py-2 font-semibold text-gray-700">Carbonate Species (DIC)</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2">CO₂ (aq)</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.aqCO2, 'aqCO2') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent(results.fCO2 * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Dissolved CO₂, gas exchange
                  </div>
                </div>
                <span class="hidden md:inline">Dissolved CO₂, gas exchange</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2">HCO₃⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.HCO3, 'HCO3') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent(results.fHCO3 * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Bicarbonate, dominant form
                  </div>
                </div>
                <span class="hidden md:inline">Bicarbonate, dominant form</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2">CO₃²⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.CO3, 'CO3') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent(results.fCO3 * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Carbonate, calcification
                  </div>
                </div>
                <span class="hidden md:inline">Carbonate, calcification</span>
              </div>
            </td>
          </tr>

          <!-- Minor Alkalinity Contributors -->
          <tr class="bg-green-50" v-if="results.minorSpecies">
            <td colspan="4" class="px-4 py-2 font-semibold text-gray-700">Minor Alkalinity Contributors</td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies">
            <td class="px-4 py-2">B(OH)₄⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.borate, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent((results.minorSpecies.borate / results.TA) * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Borate ion, ~2% of alkalinity
                  </div>
                </div>
                <span class="hidden md:inline">Borate ion, ~2% of alkalinity</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies">
            <td class="px-4 py-2">OH⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.hydroxide, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent((results.minorSpecies.hydroxide / results.TA) * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Hydroxide, increases with pH
                  </div>
                </div>
                <span class="hidden md:inline">Hydroxide, increases with pH</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies && results.minorSpecies.silicate.SiO_OH3 > 0.01">
            <td class="px-4 py-2">SiO(OH)₃⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.silicate.SiO_OH3, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent((results.minorSpecies.silicate.SiO_OH3 / results.TA) * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Silicate alkalinity
                  </div>
                </div>
                <span class="hidden md:inline">Silicate alkalinity</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies && results.minorSpecies.phosphate.HPO4 > 0.01">
            <td class="px-4 py-2">HPO₄²⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.phosphate.HPO4, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent((results.minorSpecies.phosphate.HPO4 / results.TA) * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Phosphate alkalinity
                  </div>
                </div>
                <span class="hidden md:inline">Phosphate alkalinity</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies && results.minorSpecies.phosphate.PO4 > 0.01">
            <td class="px-4 py-2">PO₄³⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.phosphate.PO4, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatPercent((results.minorSpecies.phosphate.PO4 / results.TA) * 100, 2) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Phosphate alkalinity
                  </div>
                </div>
                <span class="hidden md:inline">Phosphate alkalinity</span>
              </div>
            </td>
          </tr>

          <!-- Negative Contributors -->
          <tr class="bg-orange-50" v-if="results.minorSpecies">
            <td colspan="4" class="px-4 py-2 font-semibold text-gray-700">Negative Alkalinity Contributors</td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies">
            <td class="px-4 py-2">H⁺</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.hydrogen, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatNegativePercent((results.minorSpecies.hydrogen / results.TA) * 100, 3) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Free protons
                  </div>
                </div>
                <span class="hidden md:inline">Free protons</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies">
            <td class="px-4 py-2">HSO₄⁻</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.bisulfate, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatNegativePercent((results.minorSpecies.bisulfate / results.TA) * 100, 3) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Bisulfate
                  </div>
                </div>
                <span class="hidden md:inline">Bisulfate</span>
              </div>
            </td>
          </tr>
          <tr class="hover:bg-gray-50" v-if="results.minorSpecies">
            <td class="px-4 py-2">HF</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.minorSpecies.hf, 'minor') }}</td>
            <td class="px-4 py-2 text-right font-mono">{{ formatNegativePercent((results.minorSpecies.hf / results.TA) * 100, 4) }}%</td>
            <td class="px-4 py-2 text-gray-600 text-xs">
              <div class="flex items-center gap-1">
                <div class="relative group md:hidden">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none">
                    Hydrogen fluoride
                  </div>
                </div>
                <span class="hidden md:inline">Hydrogen fluoride</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
      <strong>Distribution:</strong> In seawater at pH ~8, bicarbonate (HCO₃⁻) dominates DIC (~90%), with carbonate (CO₃²⁻) ~9% and dissolved CO₂ ~1%.
      Borate contributes ~2% to total alkalinity. Higher pH shifts equilibrium toward CO₃²⁻, essential for coral calcification.
    </div>
  </CardSection>
</template>

<script setup>
import { formatValue } from '../../../utils/carbonate/index.js'
import CardSection from '../../../components/CardSection.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

defineProps({
  results: { type: Object, required: true },
  collapsed: { type: Boolean, default: false }
})

defineEmits(['update:collapsed'])

function formatPercent(value, decimals) {
  const formatted = value.toFixed(decimals)
  return formatted === '0.' + '0'.repeat(decimals) ? '0' : formatted
}

function formatNegativePercent(value, decimals) {
  const formatted = formatPercent(value, decimals)
  return '-' + formatted
}
</script>

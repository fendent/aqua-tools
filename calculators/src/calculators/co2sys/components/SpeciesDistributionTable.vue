<template>
  <CardSection title="Species Distribution" :collapsible="true" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)">
    <div class="space-y-5">
      <table class="w-full text-sm table-fixed">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[40%]">Species</th>
            <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[35%]">Concentration</th>
            <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[25%]">% of Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Major Carbonate Species -->
          <tr class="bg-blue-50">
            <td colspan="3" class="px-4 py-2 font-semibold text-gray-700">Carbonate Species (DIC)</td>
          </tr>
          <SpeciesRow
            species="CO₂ (aq)"
            :percent="`${formatPercent(results.fCO2 * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.aqCO2, displaySpeciesUnit), 'aqCO2')"
            role="Dissolved CO₂, gas exchange"
          />
          <SpeciesRow
            species="HCO₃⁻"
            :percent="`${formatPercent(results.fHCO3 * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.HCO3, displaySpeciesUnit), 'HCO3')"
            role="Bicarbonate, dominant form"
          />
          <SpeciesRow
            species="CO₃²⁻"
            :percent="`${formatPercent(results.fCO3 * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.CO3, displaySpeciesUnit), 'CO3')"
            role="Carbonate, calcification"
          />

          <!-- Minor Alkalinity Contributors -->
          <tr class="bg-green-50" v-if="results.minorSpecies">
            <td colspan="3" class="px-4 py-2 font-semibold text-gray-700">Minor Alkalinity Contributors</td>
          </tr>
          <SpeciesRow
            v-if="results.minorSpecies"
            species="B(OH)₄⁻"
            :percent="`${formatPercent((results.minorSpecies.borate / results.TA) * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.borate, displaySpeciesUnit), 'minor')"
            role="Borate ion, ~2% of alkalinity"
          />
          <SpeciesRow
            v-if="results.minorSpecies"
            species="OH⁻"
            :percent="`${formatPercent((results.minorSpecies.hydroxide / results.TA) * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.hydroxide, displaySpeciesUnit), 'minor')"
            role="Hydroxide, increases with pH"
          />
          <SpeciesRow
            v-if="results.minorSpecies && results.minorSpecies.silicate.SiO_OH3 > 0.01"
            species="SiO(OH)₃⁻"
            :percent="`${formatPercent((results.minorSpecies.silicate.SiO_OH3 / results.TA) * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.silicate.SiO_OH3, displaySpeciesUnit), 'minor')"
            role="Silicate alkalinity"
          />
          <SpeciesRow
            v-if="results.minorSpecies && results.minorSpecies.phosphate.HPO4 > 0.01"
            species="HPO₄²⁻"
            :percent="`${formatPercent((results.minorSpecies.phosphate.HPO4 / results.TA) * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.phosphate.HPO4, displaySpeciesUnit), 'minor')"
            role="Phosphate alkalinity"
          />
          <SpeciesRow
            v-if="results.minorSpecies && results.minorSpecies.phosphate.PO4 > 0.01"
            species="PO₄³⁻"
            :percent="`${formatPercent((results.minorSpecies.phosphate.PO4 / results.TA) * 100, 2)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.phosphate.PO4, displaySpeciesUnit), 'minor')"
            role="Phosphate alkalinity"
          />

          <!-- Negative Contributors -->
          <tr class="bg-orange-50" v-if="results.minorSpecies">
            <td colspan="3" class="px-4 py-2 font-semibold text-gray-700">Negative Alkalinity Contributors</td>
          </tr>
          <SpeciesRow
            v-if="results.minorSpecies"
            species="H⁺"
            :percent="`${formatNegativePercent((results.minorSpecies.hydrogen / results.TA) * 100, 3)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.hydrogen, displaySpeciesUnit), 'minor')"
            role="Free protons"
          />
          <SpeciesRow
            v-if="results.minorSpecies"
            species="HSO₄⁻"
            :percent="`${formatNegativePercent((results.minorSpecies.bisulfate / results.TA) * 100, 3)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.bisulfate, displaySpeciesUnit), 'minor')"
            role="Bisulfate"
          />
          <SpeciesRow
            v-if="results.minorSpecies"
            species="HF"
            :percent="`${formatNegativePercent((results.minorSpecies.hf / results.TA) * 100, 4)}%`"
            :concentration="formatValue(convertSpeciesConcentration(results.minorSpecies.hf, displaySpeciesUnit), 'minor')"
            role="Hydrogen fluoride"
          />
        </tbody>
      </table>

      <div class="flex items-center justify-end gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
        <label class="text-sm font-medium text-gray-700">Concentration Unit:</label>
        <select
          v-model="displaySpeciesUnit"
          class="px-4 py-2 text-sm border rounded-lg bg-white min-w-[140px]"
        >
          <option value="µmol/kg">µmol/kg</option>
          <option value="mmol/kg">mmol/kg</option>
        </select>
      </div>
    </div>

    <div class="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
      <strong>Distribution:</strong> In seawater at pH ~8, bicarbonate (HCO₃⁻) dominates DIC (~90%), with carbonate (CO₃²⁻) ~9% and dissolved CO₂ ~1%.
      Borate contributes ~2% to total alkalinity. Higher pH shifts equilibrium toward CO₃²⁻, essential for coral calcification.
    </div>
  </CardSection>
</template>

<script setup>
import { ref } from 'vue'
import { formatValue, convertConcentration } from '../../../utils/carbonate/index.js'
import CardSection from '../../../components/CardSection.vue'
import SpeciesRow from './SpeciesRow.vue'

defineProps({
  results: { type: Object, required: true },
  collapsed: { type: Boolean, default: false }
})

defineEmits(['update:collapsed'])

const displaySpeciesUnit = ref('µmol/kg')

function convertSpeciesConcentration(value, toUnit) {
  return convertConcentration(value, 'µmol/kg', toUnit)
}

function formatPercent(value, decimals) {
  const formatted = value.toFixed(decimals)
  return formatted === '0.' + '0'.repeat(decimals) ? '0' : formatted
}

function formatNegativePercent(value, decimals) {
  const formatted = formatPercent(value, decimals)
  return '-' + formatted
}
</script>

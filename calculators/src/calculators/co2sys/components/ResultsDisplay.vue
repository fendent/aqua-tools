<template>
  <div class="space-y-6">
    <!-- pH Values -->
    <CardSection
      title="pH Values (Multiple Scales)"
      :collapsible="true"
      :collapsed="phValuesCollapsed"
      @update:collapsed="$emit('update:phValuesCollapsed', $event)"
    >
      <div class="grid grid-cols-2 gap-4">
        <StatCard
          label="pH (Total)"
          :value="formatValue(results.pH_total, 'pH')"
          :color="getpHColor(results.pH_total)"
        />
        <StatCard
          label="pH (Seawater)"
          :value="formatValue(results.pH_sws, 'pH')"
          color="blue"
        />
        <StatCard
          label="pH (Free)"
          :value="formatValue(results.pH_free, 'pH')"
          color="purple"
        />
        <StatCard
          label="pH (NBS)"
          :value="formatValue(results.pH_nbs, 'pH')"
          color="orange"
        />
      </div>
      <div class="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
        Different pH scales account for different ion interactions. Total scale (most common) includes HSO4- in proton concentration.
      </div>
    </CardSection>

    <!-- Main Parameters -->
    <CardSection
      title="Main Parameters"
      :collapsible="true"
      :collapsed="mainParametersCollapsed"
      @update:collapsed="$emit('update:mainParametersCollapsed', $event)"
    >
      <div class="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Alkalinity (TA)"
          :value="`${formatValue(convertTA(results.TA, displayTAUnit), 'TA')} ${displayTAUnit}`"
          color="cyan"
        >
          <div>
            <label class="block text-xs text-gray-600 mb-1">Unit</label>
            <select
              v-model="displayTAUnit"
              class="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="dKH">dKH</option>
              <option value="meq/L">meq/L</option>
              <option value="µmol/kg">µmol/kg</option>
            </select>
          </div>
        </StatCard>

        <StatCard
          label="Dissolved Inorganic Carbon (DIC)"
          :value="`${formatValue(results.DIC, 'DIC')} µmol/kg`"
          color="green"
        />

        <StatCard
          label="pCO2"
          :value="`${formatValue(results.pCO2, 'pCO2')} µatm`"
          :color="getpCO2Color(results.pCO2)"
        />

        <StatCard
          label="Revelle Factor"
          :value="formatValue(results.revelleFactor, 'revelle')"
          color="orange"
        />
      </div>
    </CardSection>

    <!-- Carbonate Species -->
    <SpeciesDistributionTable
      :results="results"
      :collapsed="speciesDistributionCollapsed"
      @update:collapsed="$emit('update:speciesDistributionCollapsed', $event)"
    />

    <!-- Saturation States -->
    <MineralSaturationStates
      :results="results"
      :collapsed="mineralSaturationCollapsed"
      @update:collapsed="$emit('update:mineralSaturationCollapsed', $event)"
    />

    <!-- Calculation Metadata -->
    <CalculationMethods
      :results="results"
      :collapsed="calculationMethodsCollapsed"
      @update:collapsed="$emit('update:calculationMethodsCollapsed', $event)"
    />

    <!-- Export Button -->
    <button
      @click="$emit('export')"
      class="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
    >
      Export Results
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatValue, convertAlkalinity } from '../../../utils/carbonate/index.js'
import CardSection from '../../../components/CardSection.vue'
import StatCard from '../../../components/StatCard.vue'
import SpeciesDistributionTable from './SpeciesDistributionTable.vue'
import MineralSaturationStates from './MineralSaturationStates.vue'
import CalculationMethods from './CalculationMethods.vue'

const props = defineProps({
  results: { type: Object, required: true },
  phScale: { type: String, default: 'total' },
  phValuesCollapsed: { type: Boolean, default: false },
  mainParametersCollapsed: { type: Boolean, default: false },
  speciesDistributionCollapsed: { type: Boolean, default: false },
  mineralSaturationCollapsed: { type: Boolean, default: false },
  calculationMethodsCollapsed: { type: Boolean, default: true }
})

defineEmits(['export', 'update:phValuesCollapsed', 'update:mainParametersCollapsed', 'update:speciesDistributionCollapsed', 'update:mineralSaturationCollapsed', 'update:calculationMethodsCollapsed'])

const displayTAUnit = ref('dKH')

function convertTA(value, toUnit) {
  return convertAlkalinity(value, 'µmol/kg', toUnit)
}

function getpHColor(pH) {
  if (pH < 7.8) return 'red'
  if (pH < 8.0) return 'orange'
  if (pH > 8.4) return 'orange'
  if (pH > 8.0 && pH < 8.2) return 'green'
  return 'blue'
}

function getpCO2Color(pCO2) {
  if (pCO2 > 600) return 'red'
  if (pCO2 > 500) return 'orange'
  if (pCO2 < 300) return 'blue'
  return 'green'
}
</script>

<template>
  <div class="space-y-6">
    <!-- pH Values -->
    <CardSection
      title="pH Values"
      :collapsible="true"
      :collapsed="phValuesCollapsed"
      @update:collapsed="$emit('update:phValuesCollapsed', $event)"
    >
      <div class="space-y-4">
        <div class="border border-gray-400 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-400">Scale</th>
                <th class="px-4 py-2 text-right font-semibold text-gray-700 border-b border-gray-400">Value</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-400">
              <tr class="even:bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-2">Total</td>
                <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.pH_total, 'pH') }}</td>
              </tr>
              <tr class="even:bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-2">Seawater (SWS)</td>
                <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.pH_sws, 'pH') }}</td>
              </tr>
              <tr class="even:bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-2">Free</td>
                <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.pH_free, 'pH') }}</td>
              </tr>
              <tr class="even:bg-gray-50 hover:bg-gray-100">
                <td class="px-4 py-2">NBS</td>
                <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.pH_nbs, 'pH') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          Different pH scales account for different ion interactions. Total scale (most common) includes HSO4- in proton concentration. NBS scale is commonly used for probe calibration.
        </div>
      </div>
    </CardSection>

    <!-- Main Parameters -->
    <CardSection
      title="Main Parameters"
      :collapsible="true"
      :collapsed="mainParametersCollapsed"
      @update:collapsed="$emit('update:mainParametersCollapsed', $event)"
    >
      <div class="border border-gray-400 rounded-lg overflow-hidden">
        <table class="w-full text-sm table-fixed">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[32%] border-b border-gray-400">Parameter</th>
              <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[40%] border-b border-gray-400">Value</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[28%] border-b border-gray-400">Unit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-400">
            <tr class="even:bg-gray-50 hover:bg-gray-100">
              <td class="px-4 py-2">Total Alkalinity (TA)</td>
              <td class="px-4 py-2 text-right font-mono">{{ displayTAValue }}</td>
              <td class="px-4 py-2">
                <select
                  v-model="displayTAUnit"
                  class="w-full px-2 py-1 text-xs border rounded bg-white"
                >
                  <option value="dKH">dKH</option>
                  <option value="meq/L">meq/L</option>
                  <option value="µmol/kg">µmol/kg</option>
                </select>
              </td>
            </tr>
            <tr class="even:bg-gray-50 hover:bg-gray-100">
              <td class="px-4 py-2">Dissolved Inorganic Carbon (DIC)</td>
              <td class="px-4 py-2 text-right font-mono">{{ displayDICValue }}</td>
              <td class="px-4 py-2">
                <select
                  v-model="displayDICUnit"
                  class="w-full px-2 py-1 text-xs border rounded bg-white"
                >
                  <option value="µmol/kg">µmol/kg</option>
                  <option value="mmol/kg">mmol/kg</option>
                  <option value="dKH">dKH</option>
                </select>
              </td>
            </tr>
            <tr class="even:bg-gray-50 hover:bg-gray-100">
              <td class="px-4 py-2">pCO₂</td>
              <td class="px-4 py-2 text-right font-mono">{{ displayPCO2Value }}</td>
              <td class="px-4 py-2">
                <select
                  v-model="displayPCO2Unit"
                  class="w-full px-2 py-1 text-xs border rounded bg-white"
                >
                  <option value="µatm">µatm</option>
                  <option value="atm">atm</option>
                  <option value="Pa">Pa</option>
                  <option value="ppm">ppm</option>
                </select>
              </td>
            </tr>
            <tr class="even:bg-gray-50 hover:bg-gray-100">
              <td class="px-4 py-2">Revelle Factor</td>
              <td class="px-4 py-2 text-right font-mono">{{ formatValue(results.revelleFactor, 'revelle') }}</td>
              <td class="px-4 py-2 text-center text-gray-500">—</td>
            </tr>
          </tbody>
        </table>
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
import { ref, computed } from 'vue'
import { formatValue, convertAlkalinity, convertConcentration, convertpCO2, convertPressure } from '../../../utils/carbonate/index.js'
import CardSection from '../../../components/CardSection.vue'
import SpeciesDistributionTable from './SpeciesDistributionTable.vue'
import MineralSaturationStates from './MineralSaturationStates.vue'
import CalculationMethods from './CalculationMethods.vue'

const props = defineProps({
  results: { type: Object, required: true },
  phScale: { type: String, default: 'total' },
  inputParams: { type: Object, default: null },
  pressure: { type: Number, required: true },
  phValuesCollapsed: { type: Boolean, default: false },
  mainParametersCollapsed: { type: Boolean, default: false },
  speciesDistributionCollapsed: { type: Boolean, default: false },
  mineralSaturationCollapsed: { type: Boolean, default: false },
  calculationMethodsCollapsed: { type: Boolean, default: true }
})

defineEmits(['export', 'update:phScale', 'update:phValuesCollapsed', 'update:mainParametersCollapsed', 'update:speciesDistributionCollapsed', 'update:mineralSaturationCollapsed', 'update:calculationMethodsCollapsed'])

const displayTAUnit = ref('dKH')
const displayDICUnit = ref('mmol/kg')
const displayPCO2Unit = ref('µatm')

function convertTA(value, toUnit) {
  return convertAlkalinity(value, 'µmol/kg', toUnit)
}

function convertDIC(value, toUnit) {
  return convertConcentration(value, 'µmol/kg', toUnit)
}

function convertPCO2(value, toUnit) {
  // Convert pressure from bar to atm for pCO2 conversion
  const pressureInAtm = convertPressure(props.pressure, 'bar', 'atm')
  return convertpCO2(value, 'µatm', toUnit, pressureInAtm)
}

const displayTAValue = computed(() => {
  // If displaying in the same unit as the input, show the original input value
  if (props.inputParams && props.inputParams.param1Type === 'TA' && props.inputParams.param1Unit === displayTAUnit.value) {
    return formatValue(props.inputParams.param1Value, 'TA')
  }
  if (props.inputParams && props.inputParams.param2Type === 'TA' && props.inputParams.param2Unit === displayTAUnit.value) {
    return formatValue(props.inputParams.param2Value, 'TA')
  }
  return formatValue(convertTA(props.results.TA, displayTAUnit.value), 'TA')
})

const displayDICValue = computed(() => {
  // If displaying in the same unit as the input, show the original input value
  if (props.inputParams && props.inputParams.param1Type === 'DIC' && props.inputParams.param1Unit === displayDICUnit.value) {
    return formatValue(props.inputParams.param1Value, 'DIC')
  }
  if (props.inputParams && props.inputParams.param2Type === 'DIC' && props.inputParams.param2Unit === displayDICUnit.value) {
    return formatValue(props.inputParams.param2Value, 'DIC')
  }
  return formatValue(convertDIC(props.results.DIC, displayDICUnit.value), 'DIC')
})

const displayPCO2Value = computed(() => {
  let value
  // If displaying in the same unit as the input, show the original input value
  if (props.inputParams && props.inputParams.param1Type === 'pCO2' && props.inputParams.param1Unit === displayPCO2Unit.value) {
    value = props.inputParams.param1Value
  } else if (props.inputParams && props.inputParams.param2Type === 'pCO2' && props.inputParams.param2Unit === displayPCO2Unit.value) {
    value = props.inputParams.param2Value
  } else {
    value = convertPCO2(props.results.pCO2, displayPCO2Unit.value)
  }

  // Format with appropriate precision based on unit
  const precision = displayPCO2Unit.value === 'atm' ? 6 : displayPCO2Unit.value === 'Pa' ? 1 : 0
  return value.toFixed(precision)
})
</script>

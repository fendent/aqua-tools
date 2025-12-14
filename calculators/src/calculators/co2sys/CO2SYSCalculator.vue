<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">CO2SYS Calculator</h1>
      <p class="text-gray-600">
        Marine carbonate system calculator - Calculate complete carbonate chemistry from any 2 parameters
      </p>
    </div>

    <!-- Disclaimer -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            <strong>Scientific Calculator:</strong> This calculator uses peer-reviewed formulations for marine carbonate chemistry.
            Results are for educational and research purposes. Always verify critical measurements with laboratory analysis.
            Based on CO2SYS methodology (Lewis & Wallace 1998, van Heuven et al. 2011).
          </p>
        </div>
      </div>
    </div>

    <!-- Mode Selection -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="mode in modes"
        :key="mode.id"
        @click="selectedMode = mode.id"
        class="px-4 py-2 rounded-lg font-medium transition-colors"
        :class="selectedMode === mode.id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        {{ mode.name }}
      </button>
    </div>

    <!-- Normal Mode -->
    <template v-if="selectedMode === 'normal'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Inputs -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">Inputs</h2>
          <!-- Parameter Selection -->
          <CardSection title="Input Parameters" :collapsible="true" v-model:collapsed="inputParamsCollapsed">
            <template #header-actions>
              <button
                @click.stop="resetParameters"
                class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                title="Reset to defaults"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                Reset
              </button>
            </template>
            <div class="space-y-4">
              <ParameterInputCard
                v-model:parameter="param1Type"
                v-model:value="param1Value"
                v-model:unit="param1Unit"
                parameter-number="1"
                :exclude-parameter="param2Type"
              />

              <ParameterInputCard
                v-model:parameter="param2Type"
                v-model:value="param2Value"
                v-model:unit="param2Unit"
                parameter-number="2"
                :exclude-parameter="param1Type"
              />
            </div>
          </CardSection>

          <!-- Environmental Conditions -->
          <CardSection title="Environmental Conditions" :collapsible="true" v-model:collapsed="environmentalCollapsed">
            <template #header-actions>
              <button
                @click.stop="resetEnvironmental"
                class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                title="Reset to defaults"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                Reset
              </button>
            </template>
            <EnvironmentalInputs
              v-model:temperature="temperature"
              v-model:salinity="salinity"
              v-model:pressure="pressure"
              v-model:calcium="calcium"
            />
          </CardSection>

          <!-- Nutrients (Optional) -->
          <CardSection title="Nutrients (Optional)" :collapsible="true" v-model:collapsed="nutrientsCollapsed">
            <template #header-actions>
              <button
                @click.stop="resetNutrients"
                class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                title="Reset to defaults"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                Reset
              </button>
            </template>
            <NutrientInputs
              v-model:phosphate="totalPhosphate"
              v-model:silicate="totalSilicate"
            />
          </CardSection>

          <!-- pH Scale Selection -->
          <CardSection title="pH Scale" :collapsible="true" v-model:collapsed="pHScaleCollapsed">
            <template #header-actions>
              <button
                @click.stop="resetpHScale"
                class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                title="Reset to default"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                Reset
              </button>
            </template>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                pH Scale for Input/Output
              </label>
              <select
                v-model="pHScale"
                class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="total">Total Scale</option>
                <option value="sws">Seawater Scale (SWS)</option>
                <option value="free">Free Scale</option>
                <option value="nbs">NBS Scale (default)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                NBS scale is commonly used for probe calibration
              </p>
            </div>
          </CardSection>

          <!-- Equilibrium Constants Formulation Selection -->
          <CardSection title="Equilibrium Constants" :collapsible="true" v-model:collapsed="constantsCollapsed">
            <template #header-actions>
              <button
                @click.stop="resetConstants"
                class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                title="Reset to defaults"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
                Reset
              </button>
            </template>

            <div class="space-y-4">
              <!-- K1/K2 -->
              <div class="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <FormulationSelector
                  label="K1 & K2 (Carbonic Acid)"
                  v-model="k12Formulation"
                  :formulations="K12_FORMULATIONS"
                  :formulation-status="k12FormulationStatus"
                />
              </div>

              <!-- KSO4 -->
              <div class="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <FormulationSelector
                  label="KSO4 (Bisulfate)"
                  v-model="kso4Formulation"
                  :formulations="KSO4_FORMULATIONS"
                  :formulation-status="kso4FormulationStatus"
                />
              </div>

              <!-- KF -->
              <div class="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <FormulationSelector
                  label="KF (Hydrogen Fluoride)"
                  v-model="kfFormulation"
                  :formulations="KF_FORMULATIONS"
                  :formulation-status="kfFormulationStatus"
                />
              </div>

              <!-- Total Boron -->
              <div class="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <FormulationSelector
                  label="Total Boron"
                  v-model="boronFormulation"
                  :formulations="BORON_FORMULATIONS"
                  :formulation-status="boronFormulationStatus"
                />
              </div>
            </div>
          </CardSection>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Right Column: Results -->
        <div class="space-y-6 mt-12 lg:mt-0">
          <h2 class="text-2xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">Results</h2>
          <ResultsDisplay
            v-if="results"
            :results="results"
            :ph-scale="pHScale"
            v-model:ph-values-collapsed="pHValuesCollapsed"
            v-model:main-parameters-collapsed="mainParametersCollapsed"
            v-model:species-distribution-collapsed="speciesDistributionCollapsed"
            v-model:mineral-saturation-collapsed="mineralSaturationCollapsed"
            v-model:calculation-methods-collapsed="calculationMethodsCollapsed"
            @export="showExportDialog = true"
          />

          <div v-else class="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p class="text-lg mb-2">No results yet</p>
            <p class="text-sm">Enter two parameters to see results</p>
            <p class="text-xs mt-2 text-gray-400">Calculations update automatically</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Dosing Impact Simulator -->
    <template v-if="selectedMode === 'dosing'">
      <DosingImpactSimulator
        v-model:temperature="temperature"
        v-model:salinity="salinity"
        v-model:ph-scale="pHScale"
      />
    </template>

    <!-- Export Dialog -->
    <ExportDialog
      v-if="showExportDialog"
      :results="results"
      @close="showExportDialog = false"
    />

    <!-- Educational Info Panel -->
    <ParameterInfoPanel class="mt-8" v-model:collapsed="aboutToolCollapsed" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { calculateCarbonateSystem } from '../../utils/carbonate/index.js'
import { isValidParameterPair, PARAMETER_TYPES } from '../../utils/carbonate/index.js'
import { K12_FORMULATIONS, KSO4_FORMULATIONS, KF_FORMULATIONS, BORON_FORMULATIONS } from '../../utils/carbonate/index.js'
import { checkFormulationRange } from '../../utils/carbonate/helpers/formulationRanges.js'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import CardSection from '../../components/CardSection.vue'
import ParameterInputCard from './components/ParameterInputCard.vue'
import EnvironmentalInputs from './components/EnvironmentalInputs.vue'
import NutrientInputs from './components/NutrientInputs.vue'
import ResultsDisplay from './components/ResultsDisplay.vue'
import ParameterInfoPanel from './components/ParameterInfoPanel.vue'
import DosingImpactSimulator from './components/DosingImpactSimulator.vue'
import ExportDialog from './components/ExportDialog.vue'
import FormulationSelector from './components/FormulationSelector.vue'

// Mode selection
const modes = [
  { id: 'normal', name: 'Single Calculation' },
  { id: 'dosing', name: 'Dosing Simulator' }
]
const selectedMode = ref('normal')

// Input parameters
const param1Type = ref('pH')
const param1Value = ref(8.1)
const param1Unit = ref('total')

const param2Type = ref('TA')
const param2Value = ref(8.0) // dKH
const param2Unit = ref('dKH')

// Store last-used unit for each parameter type
const parameterUnitPreferences = ref({})

// Environmental conditions
const temperature = ref(25)
const salinity = ref(35)
const pressure = ref(0)
const calcium = ref(null) // Will be calculated from salinity if null

// Nutrients (optional)
const totalPhosphate = ref(0)
const totalSilicate = ref(0)

// pH scale
const pHScale = ref('nbs')

// Equilibrium constant formulations
const k12Formulation = ref('RRV93')
const kso4Formulation = ref('D90a')
const kfFormulation = ref('DR79')
const boronFormulation = ref('U74')

// Results
const results = ref(null)
const errorMessage = ref('')
const showExportDialog = ref(false)

// Collapsed states for sections
const inputParamsCollapsed = ref(false)
const environmentalCollapsed = ref(false)
const nutrientsCollapsed = ref(false)
const pHScaleCollapsed = ref(false)
const constantsCollapsed = ref(false)
const pHValuesCollapsed = ref(false)
const mainParametersCollapsed = ref(false)
const speciesDistributionCollapsed = ref(false)
const mineralSaturationCollapsed = ref(false)
const calculationMethodsCollapsed = ref(false)
const aboutToolCollapsed = ref(false)

// Computed
const canCalculate = computed(() => {
  return param1Type.value &&
         param2Type.value &&
         param1Value.value !== null &&
         param2Value.value !== null &&
         param1Type.value !== param2Type.value &&
         temperature.value > 0 &&
         salinity.value > 0
})

// Formulation range checks
const k12FormulationStatus = computed(() => {
  return Object.fromEntries(
    Object.entries(K12_FORMULATIONS).map(([code, formulation]) => [
      code,
      checkFormulationRange(formulation, temperature.value, salinity.value)
    ])
  )
})

const kso4FormulationStatus = computed(() => {
  return Object.fromEntries(
    Object.entries(KSO4_FORMULATIONS).map(([code, formulation]) => [
      code,
      checkFormulationRange(formulation, temperature.value, salinity.value)
    ])
  )
})

const kfFormulationStatus = computed(() => {
  return Object.fromEntries(
    Object.entries(KF_FORMULATIONS).map(([code, formulation]) => [
      code,
      checkFormulationRange(formulation, temperature.value, salinity.value)
    ])
  )
})

const boronFormulationStatus = computed(() => {
  return Object.fromEntries(
    Object.entries(BORON_FORMULATIONS).map(([code, formulation]) => [
      code,
      checkFormulationRange(formulation, temperature.value, salinity.value)
    ])
  )
})

// Methods
function calculate() {
  errorMessage.value = ''

  try {
    // Validate parameter pair
    if (!isValidParameterPair(param1Type.value, param2Type.value)) {
      throw new Error('Invalid parameter pair')
    }

    // Prepare inputs
    const inputs = {
      param1Type: param1Type.value,
      param1Value: convertToInternalUnits(param1Type.value, param1Value.value, param1Unit.value),
      param2Type: param2Type.value,
      param2Value: convertToInternalUnits(param2Type.value, param2Value.value, param2Unit.value),
      temperature: temperature.value,
      salinity: salinity.value,
      pressure: pressure.value,
      calcium: calcium.value,
      totalPhosphate: totalPhosphate.value,
      totalSilicate: totalSilicate.value,
      pHScale: pHScale.value,
      k12Formulation: k12Formulation.value,
      kso4Formulation: kso4Formulation.value,
      kfFormulation: kfFormulation.value,
      boronFormulation: boronFormulation.value
    }

    // Calculate
    results.value = calculateCarbonateSystem(inputs)

    // Debug output
    console.log('Calculation inputs:', inputs)
    console.log('Calculation results:', results.value)
    console.log('DIC:', results.value.DIC, 'aqCO2:', results.value.aqCO2, 'pCO2:', results.value.pCO2)
    console.log('K0:', results.value.K0, 'K1:', results.value.K1, 'K2:', results.value.K2)

    // Save to localStorage
    saveSettings()

  } catch (error) {
    errorMessage.value = error.message
    console.error('Calculation error:', error)
  }
}

function convertToInternalUnits(paramType, value, unit) {
  // Convert to internal units (µmol/kg for concentrations, specified scale for pH)
  if (paramType === 'pH') {
    return value // pH is already in the correct format
  }

  if (paramType === 'TA') {
    // Convert alkalinity to µmol/kg
    if (unit === 'dKH') {
      return value * 0.357143 * 1000 // dKH -> meq/L -> µmol/kg
    } else if (unit === 'meq/L') {
      return value * 1000
    }
    return value // Already in µmol/kg
  }

  if (['DIC', 'CO3', 'HCO3', 'aqCO2'].includes(paramType)) {
    if (unit === 'mmol/kg') {
      return value * 1000
    }
    return value // Already in µmol/kg
  }

  if (paramType === 'pCO2') {
    return value // µatm (same as ppm for our purposes)
  }

  return value
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('co2sys_settings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      param1Type.value = settings.param1Type || 'pH'
      param1Value.value = settings.param1Value || 8.1
      param1Unit.value = settings.param1Unit || 'nbs'
      param2Type.value = settings.param2Type || 'TA'
      param2Value.value = settings.param2Value || 8.0
      param2Unit.value = settings.param2Unit || 'dKH'
      temperature.value = settings.temperature || 25
      salinity.value = settings.salinity || 35
      pressure.value = settings.pressure || 0
      calcium.value = settings.calcium !== undefined ? settings.calcium : null
      totalPhosphate.value = settings.totalPhosphate || 0
      totalSilicate.value = settings.totalSilicate || 0
      pHScale.value = settings.pHScale || 'nbs'
      k12Formulation.value = settings.k12Formulation || 'RRV93'
      kso4Formulation.value = settings.kso4Formulation || 'D90a'
      kfFormulation.value = settings.kfFormulation || 'DR79'
      boronFormulation.value = settings.boronFormulation || 'U74'
      // Load collapsed states
      inputParamsCollapsed.value = settings.inputParamsCollapsed !== undefined ? settings.inputParamsCollapsed : false
      environmentalCollapsed.value = settings.environmentalCollapsed !== undefined ? settings.environmentalCollapsed : false
      nutrientsCollapsed.value = settings.nutrientsCollapsed !== undefined ? settings.nutrientsCollapsed : false
      pHScaleCollapsed.value = settings.pHScaleCollapsed !== undefined ? settings.pHScaleCollapsed : false
      constantsCollapsed.value = settings.constantsCollapsed !== undefined ? settings.constantsCollapsed : false
      pHValuesCollapsed.value = settings.pHValuesCollapsed !== undefined ? settings.pHValuesCollapsed : false
      mainParametersCollapsed.value = settings.mainParametersCollapsed !== undefined ? settings.mainParametersCollapsed : false
      speciesDistributionCollapsed.value = settings.speciesDistributionCollapsed !== undefined ? settings.speciesDistributionCollapsed : false
      mineralSaturationCollapsed.value = settings.mineralSaturationCollapsed !== undefined ? settings.mineralSaturationCollapsed : false
      calculationMethodsCollapsed.value = settings.calculationMethodsCollapsed !== undefined ? settings.calculationMethodsCollapsed : false
      aboutToolCollapsed.value = settings.aboutToolCollapsed !== undefined ? settings.aboutToolCollapsed : false
      selectedMode.value = settings.selectedMode || 'normal'
      // Load parameter unit preferences
      parameterUnitPreferences.value = settings.parameterUnitPreferences || {}
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }
}

// Save settings to localStorage
function saveSettings() {
  const settings = {
    param1Type: param1Type.value,
    param1Value: param1Value.value,
    param1Unit: param1Unit.value,
    param2Type: param2Type.value,
    param2Value: param2Value.value,
    param2Unit: param2Unit.value,
    temperature: temperature.value,
    salinity: salinity.value,
    pressure: pressure.value,
    calcium: calcium.value,
    totalPhosphate: totalPhosphate.value,
    totalSilicate: totalSilicate.value,
    pHScale: pHScale.value,
    k12Formulation: k12Formulation.value,
    kso4Formulation: kso4Formulation.value,
    kfFormulation: kfFormulation.value,
    boronFormulation: boronFormulation.value,
    // Save collapsed states
    inputParamsCollapsed: inputParamsCollapsed.value,
    environmentalCollapsed: environmentalCollapsed.value,
    nutrientsCollapsed: nutrientsCollapsed.value,
    pHScaleCollapsed: pHScaleCollapsed.value,
    constantsCollapsed: constantsCollapsed.value,
    pHValuesCollapsed: pHValuesCollapsed.value,
    mainParametersCollapsed: mainParametersCollapsed.value,
    speciesDistributionCollapsed: speciesDistributionCollapsed.value,
    mineralSaturationCollapsed: mineralSaturationCollapsed.value,
    calculationMethodsCollapsed: calculationMethodsCollapsed.value,
    aboutToolCollapsed: aboutToolCollapsed.value,
    selectedMode: selectedMode.value,
    // Save parameter unit preferences
    parameterUnitPreferences: parameterUnitPreferences.value
  }
  localStorage.setItem('co2sys_settings', JSON.stringify(settings))
}

// Auto-calculation: debounced watcher for all input changes
let autoCalcTimeout = null
const autoCalculate = () => {
  // Clear existing timeout
  if (autoCalcTimeout) {
    clearTimeout(autoCalcTimeout)
  }

  // Set new timeout to calculate after 500ms of no changes
  autoCalcTimeout = setTimeout(() => {
    if (canCalculate.value) {
      calculate()
    }
  }, 500)
}

// Watch for unit changes and save preferences
watch(param1Unit, (newUnit) => {
  if (param1Type.value) {
    parameterUnitPreferences.value[param1Type.value] = newUnit
  }
})

watch(param2Unit, (newUnit) => {
  if (param2Type.value) {
    parameterUnitPreferences.value[param2Type.value] = newUnit
  }
})

// Watch for parameter type changes and restore saved units or use defaults
watch(param1Type, (newType) => {
  if (newType && PARAMETER_TYPES[newType]) {
    // Use saved preference if available, otherwise use default
    param1Unit.value = parameterUnitPreferences.value[newType] || PARAMETER_TYPES[newType].defaultUnit
  }
})

watch(param2Type, (newType) => {
  if (newType && PARAMETER_TYPES[newType]) {
    // Use saved preference if available, otherwise use default
    param2Unit.value = parameterUnitPreferences.value[newType] || PARAMETER_TYPES[newType].defaultUnit
  }
})

// Watch for parameter changes and auto-calculate
watch([
  param1Type, param1Value, param1Unit,
  param2Type, param2Value, param2Unit,
  temperature, salinity, pressure, calcium,
  totalPhosphate, totalSilicate,
  pHScale,
  k12Formulation, kso4Formulation, kfFormulation, boronFormulation
], () => {
  autoCalculate()
})

// Watch for collapsed state changes and mode changes, then save
watch([
  selectedMode,
  inputParamsCollapsed,
  environmentalCollapsed,
  nutrientsCollapsed,
  pHScaleCollapsed,
  constantsCollapsed,
  pHValuesCollapsed,
  mainParametersCollapsed,
  speciesDistributionCollapsed,
  mineralSaturationCollapsed,
  calculationMethodsCollapsed,
  aboutToolCollapsed
], () => {
  saveSettings()
})

// Reset functions
function resetParameters() {
  param1Type.value = 'pH'
  param1Value.value = 8.1
  param1Unit.value = 'nbs'
  param2Type.value = 'TA'
  param2Value.value = 8.0
  param2Unit.value = 'dKH'
}

function resetEnvironmental() {
  temperature.value = 25
  salinity.value = 35
  pressure.value = 0
  calcium.value = null
}

function resetNutrients() {
  totalPhosphate.value = 0
  totalSilicate.value = 0
}

function resetpHScale() {
  pHScale.value = 'nbs'
}

function resetConstants() {
  k12Formulation.value = 'RRV93'
  kso4Formulation.value = 'D90a'
  kfFormulation.value = 'DR79'
  boronFormulation.value = 'U74'
}

// Load settings on mount
onMounted(() => {
  loadSettings()
  // Auto-calculate on initial load if valid inputs
  if (canCalculate.value) {
    calculate()
  }
})
</script>

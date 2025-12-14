<template>
  <div class="space-y-6">
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-purple-900 mb-2">Dosing Impact Simulator</h3>
      <p class="text-sm text-purple-700">
        Simulate how alkalinity or calcium dosing affects carbonate system parameters.
        Calculate exact dose amounts and predict pH, saturation state, and DIC changes before dosing.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Inputs -->
      <div class="space-y-6">
        <CardSection title="Current Tank Parameters" :collapsible="true" v-model:collapsed="tankParamsCollapsed">
          <div class="space-y-4">
            <div class="grid md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Current pH
                </label>
                <input
                  v-model.number="currentpH"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Current Alkalinity
                </label>
                <input
                  v-model.number="currentAlk"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <select
                  v-model="alkUnit"
                  class="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="dKH">dKH</option>
                  <option value="meq/L">meq/L</option>
                  <option value="µmol/kg">µmol/kg</option>
                </select>
              </div>
            </div>

            <VolumeInput
              v-model="tankVolume"
              v-model:unit="tankVolumeUnit"
              label="Tank Volume"
              :step="getVolumeStep(tankVolumeUnit)"
              min="0.1"
              grid-class="grid md:grid-cols-3 gap-4 items-end"
              input-col-class="md:col-span-2"
            />

            <div class="grid md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Current Calcium
                </label>
                <input
                  v-model.number="currentCalcium"
                  type="number"
                  step="1"
                  class="w-full px-3 py-2 border rounded-lg"
                  placeholder="420"
                />
              </div>
              <div>
                <select
                  v-model="calciumUnit"
                  class="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="ppm">ppm</option>
                  <option value="ppt">ppt</option>
                </select>
              </div>
            </div>
          </div>
        </CardSection>

        <CardSection title="Dosing Supplement" :collapsible="true" v-model:collapsed="dosingSupplementCollapsed">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parameter to Dose
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="doseParameter = 'alkalinity'"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 font-medium transition-all',
                    doseParameter === 'alkalinity'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Alkalinity
                </button>
                <button
                  @click="doseParameter = 'calcium'"
                  :class="[
                    'px-4 py-3 rounded-lg border-2 font-medium transition-all',
                    doseParameter === 'calcium'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Calcium
                </button>
              </div>
            </div>

            <ChemicalSelect
              :parameter="doseParameter"
              v-model:base-compound="selectedCompound"
              v-model:form="selectedFormId"
              compound-label="Supplement Compound"
              :auto-select-compound="true"
            />

            <div v-if="selectedChemical" class="p-3 bg-gray-50 rounded-lg text-sm">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="font-medium">Formula:</span> {{ selectedChemical.formula }}
                </div>
                <div>
                  <span class="font-medium">MW:</span> {{ selectedChemical.molecularWeight }}g/mol
                </div>
              </div>
            </div>
          </div>
        </CardSection>

        <CardSection title="Dose Configuration" :collapsible="true" v-model:collapsed="doseConfigCollapsed">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Calculation Mode
              </label>
              <div class="space-y-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="calculationMode"
                    type="radio"
                    value="target-change"
                    class="mr-2"
                  />
                  <span class="text-sm">Enter target change (calculator determines dose amount)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="calculationMode"
                    type="radio"
                    value="dose-amount"
                    class="mr-2"
                  />
                  <span class="text-sm">Enter dose amount (calculator determines impact)</span>
                </label>
              </div>
            </div>

            <div v-if="calculationMode === 'target-change'" class="grid md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Target {{ doseParameter === 'alkalinity' ? 'Alkalinity' : 'Calcium' }} Change
                </label>
                <input
                  v-model.number="targetChange"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border rounded-lg"
                  :placeholder="doseParameter === 'alkalinity' ? '0.5' : '10'"
                />
              </div>
              <div>
                <select
                  v-model="targetChangeUnit"
                  class="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option v-if="doseParameter === 'alkalinity'" value="dKH">dKH</option>
                  <option v-if="doseParameter === 'alkalinity'" value="meq/L">meq/L</option>
                  <option v-if="doseParameter === 'calcium'" value="ppm">ppm</option>
                  <option v-if="doseParameter === 'calcium'" value="ppt">ppt</option>
                </select>
              </div>
            </div>

            <div v-if="calculationMode === 'dose-amount'" class="grid md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dose Amount
                </label>
                <input
                  v-model.number="doseAmount"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border rounded-lg"
                  placeholder="10"
                />
              </div>
              <div>
                <WeightUnitSelect v-model="doseAmountUnit" />
              </div>
            </div>

            <button
              @click="simulateImpact"
              :disabled="!canSimulate"
              :class="[
                'w-full py-3 rounded-lg font-medium transition-colors',
                canSimulate
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              Simulate Impact
            </button>
          </div>
        </CardSection>
      </div>

      <!-- Right Column: Results -->
      <div class="space-y-6">
        <div v-if="simulationResults">
          <!-- Dose Amount Card (if calculated) -->
          <CardSection v-if="calculatedDoseAmount" title="Required Dose" :collapsible="true" v-model:collapsed="doseAmountCollapsed">
            <StatCard
              :label="`${selectedChemical?.name || 'Compound'} Needed`"
              :value="`${displayDoseAmount.amount} ${displayDoseAmount.unit}`"
              color="blue"
            >
              <div>
                <label class="block text-xs text-gray-600 mb-1">Display unit</label>
                <WeightUnitSelect v-model="displayWeightUnit" label-format="abbrev" />
              </div>
            </StatCard>

            <div v-if="simulationWarnings.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(warning, idx) in simulationWarnings"
                :key="idx"
                class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex gap-3"
              >
                <InformationCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />
                <p class="text-sm text-yellow-800">{{ warning }}</p>
              </div>
            </div>
          </CardSection>

          <!-- Main Parameters -->
          <CardSection title="Main Parameters" :collapsible="true" v-model:collapsed="mainParamsCollapsed">
            <div class="grid grid-cols-2 gap-4">
              <StatCard
                label="pH"
                :value="`${currentpH.toFixed(3)} → ${simulationResults.newpH.toFixed(3)}`"
                :color="getpHChangeColor(simulationResults.newpH - currentpH)"
              />
              <StatCard
                :label="`Alkalinity (${alkUnit})`"
                :value="`${displayCurrentAlk} → ${displayNewAlk}`"
                color="cyan"
              />
              <StatCard
                :label="`Calcium (${calciumUnit})`"
                :value="`${displayCurrentCalcium} → ${displayNewCalcium}`"
                color="orange"
              />
              <StatCard
                label="pCO₂ (µatm)"
                :value="`${simulationResults.currentState.pCO2.toFixed(0)} → ${simulationResults.newState.pCO2.toFixed(0)}`"
                color="green"
              />
            </div>
          </CardSection>

          <!-- Saturation States -->
          <CardSection title="Saturation States" :collapsible="true" v-model:collapsed="saturationCollapsed">
            <div class="grid grid-cols-2 gap-4">
              <StatCard
                label="Ω Aragonite"
                :value="`${simulationResults.currentState.omegaAragonite.toFixed(2)} → ${simulationResults.newState.omegaAragonite.toFixed(2)}`"
                :color="getOmegaChangeColor(simulationResults.newState.omegaAragonite - simulationResults.currentState.omegaAragonite)"
              />
              <StatCard
                label="Ω Calcite"
                :value="`${simulationResults.currentState.omegaCalcite.toFixed(2)} → ${simulationResults.newState.omegaCalcite.toFixed(2)}`"
                color="green"
              />
            </div>
          </CardSection>

          <!-- Carbonate Chemistry -->
          <CardSection title="Carbonate Chemistry" :collapsible="true" v-model:collapsed="carbonateChemCollapsed">
            <div class="grid grid-cols-2 gap-4">
              <StatCard
                label="DIC (µmol/kg)"
                :value="`${simulationResults.currentState.DIC.toFixed(0)} → ${simulationResults.newState.DIC.toFixed(0)}`"
                color="purple"
              />
              <StatCard
                label="HCO₃⁻ (%)"
                :value="`${(simulationResults.currentState.fHCO3 * 100).toFixed(1)}% → ${(simulationResults.newState.fHCO3 * 100).toFixed(1)}%`"
                color="blue"
              />
              <StatCard
                label="CO₃²⁻ (%)"
                :value="`${(simulationResults.currentState.fCO3 * 100).toFixed(1)}% → ${(simulationResults.newState.fCO3 * 100).toFixed(1)}%`"
                color="cyan"
              />
              <StatCard
                label="CO₂ (aq) (%)"
                :value="`${(simulationResults.currentState.fCO2 * 100).toFixed(2)}% → ${(simulationResults.newState.fCO2 * 100).toFixed(2)}%`"
                color="orange"
              />
            </div>
          </CardSection>

          <!-- Impact Summary -->
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p class="text-sm text-blue-900 font-medium mb-2">Impact Summary</p>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• pH will {{ simulationResults.newpH > currentpH ? 'increase' : 'decrease' }} by {{ Math.abs(simulationResults.newpH - currentpH).toFixed(3) }} units</li>
              <li>• Aragonite Ω will {{ simulationResults.newState.omegaAragonite > simulationResults.currentState.omegaAragonite ? 'increase' : 'decrease' }} by {{ Math.abs(simulationResults.newState.omegaAragonite - simulationResults.currentState.omegaAragonite).toFixed(2) }}</li>
              <li>• pCO₂ will {{ simulationResults.newState.pCO2 > simulationResults.currentState.pCO2 ? 'increase' : 'decrease' }} by {{ Math.abs(simulationResults.newState.pCO2 - simulationResults.currentState.pCO2).toFixed(0) }} µatm</li>
              <li v-if="doseParameter === 'alkalinity'">• Carbonate (CO₃²⁻) will {{ simulationResults.newState.fCO3 > simulationResults.currentState.fCO3 ? 'increase' : 'decrease' }} from {{ (simulationResults.currentState.fCO3 * 100).toFixed(1) }}% to {{ (simulationResults.newState.fCO3 * 100).toFixed(1) }}%</li>
            </ul>
          </div>
        </div>

        <div v-else class="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p class="text-lg mb-2">No simulation yet</p>
          <p class="text-sm">Configure parameters and click Simulate</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { calculateCarbonateSystem } from '../../../utils/carbonate/index.js'
import { convertAlkalinity } from '../../../utils/carbonate/index.js'
import { getChemicalByForm } from '../../../utils/dosingChemicals.js'
import { getVolumeStep, toGallons } from '../../../utils/volumeUtils.js'
import { convertWeight, getWeightUnitAbbrev, getWeightPrecision } from '../../../utils/weightUtils.js'
import CardSection from '../../../components/CardSection.vue'
import StatCard from '../../../components/StatCard.vue'
import ChemicalSelect from '../../../components/ChemicalSelect.vue'
import VolumeInput from '../../../components/VolumeInput.vue'
import WeightUnitSelect from '../../../components/WeightUnitSelect.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  temperature: { type: Number, required: true },
  salinity: { type: Number, required: true },
  phScale: { type: String, required: true }
})

const STORAGE_KEY = 'dosingImpactSimulatorSettings'

// Load saved settings
const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const settings = loadSettings()

// Tank parameters
const currentpH = ref(settings.currentpH || 8.1)
const currentAlk = ref(settings.currentAlk || 8.0)
const alkUnit = ref(settings.alkUnit || 'dKH')
const tankVolume = ref(settings.tankVolume || 100)
const tankVolumeUnit = ref(settings.tankVolumeUnit || 'gallons')
const currentCalcium = ref(settings.currentCalcium || 420)
const calciumUnit = ref(settings.calciumUnit || 'ppm')

// Dosing configuration
const doseParameter = ref(settings.doseParameter || 'alkalinity')
const selectedCompound = ref(settings.selectedCompound || '')
const selectedFormId = ref(settings.selectedFormId || '')
const calculationMode = ref(settings.calculationMode || 'target-change')
const targetChange = ref(settings.targetChange || 0.5)
const targetChangeUnit = ref(settings.targetChangeUnit || 'dKH')
const doseAmount = ref(settings.doseAmount || 10)
const doseAmountUnit = ref(settings.doseAmountUnit || 'grams')
const displayWeightUnit = ref(settings.displayWeightUnit || 'grams')

// Results
const simulationResults = ref(null)
const calculatedDoseAmount = ref(null)
const simulationWarnings = ref([])

// Collapsed states
const tankParamsCollapsed = ref(settings.tankParamsCollapsed !== undefined ? settings.tankParamsCollapsed : false)
const dosingSupplementCollapsed = ref(settings.dosingSupplementCollapsed !== undefined ? settings.dosingSupplementCollapsed : false)
const doseConfigCollapsed = ref(settings.doseConfigCollapsed !== undefined ? settings.doseConfigCollapsed : false)
const doseAmountCollapsed = ref(settings.doseAmountCollapsed !== undefined ? settings.doseAmountCollapsed : false)
const mainParamsCollapsed = ref(settings.mainParamsCollapsed !== undefined ? settings.mainParamsCollapsed : false)
const saturationCollapsed = ref(settings.saturationCollapsed !== undefined ? settings.saturationCollapsed : false)
const carbonateChemCollapsed = ref(settings.carbonateChemCollapsed !== undefined ? settings.carbonateChemCollapsed : false)

// Computed
const selectedChemical = computed(() => {
  if (!doseParameter.value || !selectedFormId.value) return null
  return getChemicalByForm(doseParameter.value, selectedFormId.value)
})

const canSimulate = computed(() => {
  if (!currentpH.value || !currentAlk.value || !tankVolume.value) return false
  if (doseParameter.value === 'calcium' && !currentCalcium.value) return false

  if (calculationMode.value === 'target-change') {
    return targetChange.value !== null && targetChange.value !== 0
  } else {
    return selectedChemical.value && doseAmount.value > 0
  }
})

const displayCurrentAlk = computed(() => {
  return currentAlk.value.toFixed(2)
})

const displayNewAlk = computed(() => {
  if (!simulationResults.value) return '—'
  const newAlkInBase = convertAlkalinity(simulationResults.value.newState.TA, 'µmol/kg', alkUnit.value)
  return newAlkInBase.toFixed(2)
})

const displayCurrentCalcium = computed(() => {
  if (!currentCalcium.value) return '—'
  return currentCalcium.value.toFixed(0)
})

const displayNewCalcium = computed(() => {
  if (!simulationResults.value || doseParameter.value !== 'calcium') {
    return displayCurrentCalcium.value
  }
  return simulationResults.value.newCalcium.toFixed(0)
})

const displayDoseAmount = computed(() => {
  if (!calculatedDoseAmount.value) return { amount: '—', unit: '' }

  const converted = convertWeight(calculatedDoseAmount.value, displayWeightUnit.value)
  const precision = getWeightPrecision(displayWeightUnit.value)

  return {
    amount: converted.toFixed(precision),
    unit: getWeightUnitAbbrev(displayWeightUnit.value)
  }
})

// Watch parameter changes
watch(doseParameter, () => {
  selectedCompound.value = ''
  selectedFormId.value = ''

  if (doseParameter.value === 'alkalinity') {
    targetChangeUnit.value = 'dKH'
  } else {
    targetChangeUnit.value = 'ppm'
  }
})

watch(selectedCompound, () => {
  selectedFormId.value = ''
})

// Save settings
const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentpH: currentpH.value,
      currentAlk: currentAlk.value,
      alkUnit: alkUnit.value,
      tankVolume: tankVolume.value,
      tankVolumeUnit: tankVolumeUnit.value,
      currentCalcium: currentCalcium.value,
      calciumUnit: calciumUnit.value,
      doseParameter: doseParameter.value,
      selectedCompound: selectedCompound.value,
      selectedFormId: selectedFormId.value,
      calculationMode: calculationMode.value,
      targetChange: targetChange.value,
      targetChangeUnit: targetChangeUnit.value,
      doseAmount: doseAmount.value,
      doseAmountUnit: doseAmountUnit.value,
      displayWeightUnit: displayWeightUnit.value,
      tankParamsCollapsed: tankParamsCollapsed.value,
      dosingSupplementCollapsed: dosingSupplementCollapsed.value,
      doseConfigCollapsed: doseConfigCollapsed.value,
      doseAmountCollapsed: doseAmountCollapsed.value,
      mainParamsCollapsed: mainParamsCollapsed.value,
      saturationCollapsed: saturationCollapsed.value,
      carbonateChemCollapsed: carbonateChemCollapsed.value
    }))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

watch([
  currentpH, currentAlk, alkUnit, tankVolume, tankVolumeUnit, currentCalcium, calciumUnit,
  doseParameter, selectedCompound, selectedFormId, calculationMode, targetChange, targetChangeUnit,
  doseAmount, doseAmountUnit, displayWeightUnit,
  tankParamsCollapsed, dosingSupplementCollapsed, doseConfigCollapsed, doseAmountCollapsed,
  mainParamsCollapsed, saturationCollapsed, carbonateChemCollapsed
], saveSettings, { deep: true })

function getpHChangeColor(change) {
  if (Math.abs(change) < 0.05) return 'blue'
  if (change > 0) return 'green'
  return 'orange'
}

function getOmegaChangeColor(change) {
  if (change > 0.1) return 'green'
  if (change < -0.1) return 'red'
  return 'blue'
}

function simulateImpact() {
  try {
    simulationWarnings.value = []
    calculatedDoseAmount.value = null

    // Convert current alkalinity to µmol/kg
    const currentTA = convertAlkalinity(currentAlk.value, alkUnit.value, 'µmol/kg')

    // Calculate current state
    const currentState = calculateCarbonateSystem({
      param1Type: 'pH',
      param1Value: currentpH.value,
      param2Type: 'TA',
      param2Value: currentTA,
      temperature: props.temperature,
      salinity: props.salinity,
      pressure: 0,
      pHScale: props.phScale,
      calcium: currentCalcium.value || null
    })

    let newTA = currentTA
    let newCalcium = currentCalcium.value || 420
    let doseAmountGrams = 0

    if (calculationMode.value === 'target-change') {
      // Calculate dose amount from target change
      if (doseParameter.value === 'alkalinity') {
        const changeInBase = targetChangeUnit.value === 'dKH'
          ? convertAlkalinity(targetChange.value, 'dKH', 'µmol/kg')
          : convertAlkalinity(targetChange.value, 'meq/L', 'µmol/kg')

        newTA = currentTA + changeInBase

        // Calculate grams needed if chemical is selected
        if (selectedChemical.value) {
          const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
            ? tankVolume.value
            : toGallons(tankVolume.value, tankVolumeUnit.value)

          const alkChangeInDKH = convertAlkalinity(changeInBase, 'µmol/kg', 'dKH')

          // Simplified calculation: grams = (tank_gallons * dKH_change * element_content_factor) / element_percentage
          const elementFactor = 2.8 // Approximate conversion factor for carbonate alkalinity
          doseAmountGrams = (tankVolumeGallons * alkChangeInDKH * elementFactor) / (selectedChemical.value.elementPercentage / 100)
          calculatedDoseAmount.value = doseAmountGrams

          // Add warnings
          if (alkChangeInDKH > 1.5) {
            simulationWarnings.value.push('Large alkalinity change (>1.5 dKH). Consider dosing in smaller increments.')
          }
        }
      } else if (doseParameter.value === 'calcium') {
        const changePPM = targetChangeUnit.value === 'ppm'
          ? targetChange.value
          : targetChange.value * 1000

        newCalcium = (currentCalcium.value || 420) + changePPM

        // Calculate grams needed if chemical is selected
        if (selectedChemical.value) {
          const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
            ? tankVolume.value
            : toGallons(tankVolume.value, tankVolumeUnit.value)

          // Simplified: grams = (tank_gallons * ppm_change * 3.8) / (element_percentage / 100)
          doseAmountGrams = (tankVolumeGallons * changePPM * 3.8) / (selectedChemical.value.elementPercentage / 100)
          calculatedDoseAmount.value = doseAmountGrams

          if (changePPM > 30) {
            simulationWarnings.value.push('Large calcium change (>30 ppm). Consider dosing in smaller increments.')
          }
        }
      }
    } else {
      // Calculate impact from dose amount
      if (!selectedChemical.value) {
        throw new Error('Please select a chemical compound')
      }

      const doseGrams = convertWeight(doseAmount.value, doseAmountUnit.value, 'grams')
      const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
        ? tankVolume.value
        : toGallons(tankVolume.value, tankVolumeUnit.value)

      if (doseParameter.value === 'alkalinity') {
        // Calculate alkalinity change from dose
        const elementFactor = 2.8
        const dKHChange = (doseGrams * (selectedChemical.value.elementPercentage / 100)) / (tankVolumeGallons * elementFactor)
        const changeInMicromol = convertAlkalinity(dKHChange, 'dKH', 'µmol/kg')
        newTA = currentTA + changeInMicromol
      } else if (doseParameter.value === 'calcium') {
        const ppmChange = (doseGrams * (selectedChemical.value.elementPercentage / 100)) / (tankVolumeGallons * 3.8)
        newCalcium = (currentCalcium.value || 420) + ppmChange
      }
    }

    // Calculate new state after dosing
    const newState = calculateCarbonateSystem({
      param1Type: 'DIC',
      param1Value: currentState.DIC,
      param2Type: 'TA',
      param2Value: newTA,
      temperature: props.temperature,
      salinity: props.salinity,
      pressure: 0,
      pHScale: props.phScale,
      calcium: newCalcium
    })

    simulationResults.value = {
      currentState,
      newState,
      newCalcium
    }

  } catch (error) {
    console.error('Simulation error:', error)
    simulationWarnings.value.push(`Simulation error: ${error.message}`)
  }
}

onMounted(() => {
  loadSettings()
})
</script>

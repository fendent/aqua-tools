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
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div class="font-medium text-blue-900 mb-2">Environmental Conditions (from main calculator)</div>
              <div class="grid grid-cols-3 gap-2 text-blue-800">
                <div>Temp: {{ temperature }}°C</div>
                <div>Salinity: {{ salinity }}</div>
                <div>pH Scale: {{ phScale }}</div>
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

            <!-- Commercial Products -->
            <div class="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Commercial Product
              </label>
              <select
                v-model="selectedCommercialProduct"
                class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="">Select commercial product...</option>
                <option
                  v-for="product in commercialProducts"
                  :key="product.id"
                  :value="product.id"
                >
                  {{ product.name }} ({{ product.manufacturer }})
                </option>
              </select>
              <div v-if="commercialProducts.length === 0" class="text-sm text-gray-500 mt-2">
                No commercial products available - use DIY supplement
              </div>
              <div v-if="selectedProduct" class="mt-3 p-4 bg-white rounded-lg border-2 border-blue-300 shadow-sm">
                <div class="font-semibold text-gray-900 text-base mb-3">{{ selectedProduct.name }}</div>

                <div class="space-y-2.5">
                  <div class="flex items-start gap-2">
                    <BuildingStorefrontIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div class="text-sm">
                      <span class="text-gray-500">Manufacturer:</span>
                      <span class="text-gray-900 font-medium ml-1">{{ selectedProduct.manufacturer }}</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <BeakerIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div class="text-sm">
                      <span class="text-gray-500">Form:</span>
                      <span class="text-gray-900 font-medium ml-1">{{ selectedProduct.form }}</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <ScaleIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div class="text-sm">
                      <span class="text-gray-500">Concentration:</span>
                      <div class="text-gray-900 font-medium mt-0.5">
                        {{ formatConcentration(selectedProduct.concentration.value, selectedProduct.concentration.unit) }}
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedProduct.notes" class="flex items-start gap-2 pt-1 mt-1 border-t border-gray-200">
                    <InformationCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div class="text-xs text-gray-600 italic">{{ selectedProduct.notes }}</div>
                  </div>

                  <div v-if="selectedProduct.recipeUrl" class="flex items-start gap-2 pt-1 mt-1 border-t border-gray-200">
                    <InformationCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <a
                      :href="selectedProduct.recipeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      View recipe instructions →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- DIY Supplements -->
            <div class="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <ChemicalSelect
                :parameter="doseParameter"
                v-model:base-compound="selectedCompound"
                v-model:form="selectedFormId"
                compound-label="DIY Supplement"
                :auto-select-compound="true"
              />

              <div v-if="selectedChemical" class="mt-3 p-3 bg-white rounded-lg border-2 border-purple-300 text-sm">
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
                <VolumeUnitSelect v-if="selectedProduct?.form === 'liquid'" v-model="doseAmountUnit" />
                <WeightUnitSelect v-else v-model="doseAmountUnit" />
              </div>
            </div>
          </div>
        </CardSection>
      </div>

      <!-- Right Column: Results -->
      <div class="space-y-6">
        <div v-if="simulationResults" class="space-y-6">
          <!-- Dose Amount Card (if calculated) -->
          <CardSection v-if="calculatedDoseAmount" title="Required Dose" :collapsible="true" v-model:collapsed="doseAmountCollapsed">
            <StatCard
              :label="`${selectedProduct?.name || selectedChemical?.name || 'Supplement'} Needed`"
              :value="`${displayDoseAmount.amount} ${displayDoseAmount.unit}`"
              color="blue"
            >
              <div>
                <label class="block text-xs text-gray-600 mb-1">Display unit</label>
                <VolumeUnitSelect v-if="selectedProduct?.form === 'liquid'" v-model="displayVolumeUnit" label-format="abbrev" />
                <WeightUnitSelect v-else v-model="displayWeightUnit" label-format="abbrev" />
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
            <div class="border border-gray-400 rounded-lg overflow-hidden">
              <table class="w-full text-sm table-fixed">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Parameter</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">Before</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">After</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Units</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-400">
                <ParameterTableRow
                  label="pH"
                  :before-value="currentpH.toFixed(3)"
                  :after-value="simulationResults.newpH.toFixed(3)"
                  unit="—"
                />
                <ParameterTableRow
                  label="Alkalinity"
                  :before-value="displayCurrentAlk"
                  :after-value="displayNewAlk"
                  :unit="displayAlkUnit"
                  :unit-options="alkUnitOptions"
                  @update:unit="displayAlkUnit = $event"
                />
                <ParameterTableRow
                  label="Calcium"
                  :before-value="displayCurrentCalcium"
                  :after-value="displayNewCalcium"
                  :unit="displayCalciumUnit"
                  :unit-options="calciumUnitOptions"
                  @update:unit="displayCalciumUnit = $event"
                />
                <ParameterTableRow
                  label="pCO₂"
                  :before-value="displayCurrentPCO2"
                  :after-value="displayNewPCO2"
                  :unit="pco2Unit"
                  :unit-options="pco2UnitOptions"
                  @update:unit="pco2Unit = $event"
                />
              </tbody>
              </table>
            </div>
          </CardSection>

          <!-- Carbonate Chemistry -->
          <CardSection title="Carbonate Chemistry" :collapsible="true" v-model:collapsed="carbonateChemCollapsed">
            <div class="border border-gray-400 rounded-lg overflow-hidden">
              <table class="w-full text-sm table-fixed">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Species</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">Before</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">After</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Units</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-400">
                <ParameterTableRow
                  label="DIC"
                  :before-value="displayCurrentDIC"
                  :after-value="displayNewDIC"
                  :unit="dicUnit"
                  :unit-options="dicUnitOptions"
                  @update:unit="dicUnit = $event"
                />
                <ParameterTableRow
                  label="HCO₃⁻"
                  :before-value="`${(simulationResults.currentState.fHCO3 * 100).toFixed(1)}%`"
                  :after-value="`${(simulationResults.newState.fHCO3 * 100).toFixed(1)}%`"
                  unit="%"
                />
                <ParameterTableRow
                  label="CO₃²⁻"
                  :before-value="`${(simulationResults.currentState.fCO3 * 100).toFixed(1)}%`"
                  :after-value="`${(simulationResults.newState.fCO3 * 100).toFixed(1)}%`"
                  unit="%"
                />
                <ParameterTableRow
                  label="CO₂ (aq)"
                  :before-value="`${(simulationResults.currentState.fCO2 * 100).toFixed(2)}%`"
                  :after-value="`${(simulationResults.newState.fCO2 * 100).toFixed(2)}%`"
                  unit="%"
                />
              </tbody>
              </table>
            </div>
          </CardSection>

          <!-- Saturation States -->
          <CardSection title="Saturation States" :collapsible="true" v-model:collapsed="saturationCollapsed">
            <div class="border border-gray-400 rounded-lg overflow-hidden">
              <table class="w-full text-sm table-fixed">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Mineral</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">Before</th>
                    <th class="px-4 py-2 text-right font-semibold text-gray-700 w-[24%] border-b border-gray-400">After</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700 w-[26%] border-b border-gray-400">Units</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-400">
                <ParameterTableRow
                  label="Ω Aragonite"
                  :before-value="simulationResults.currentState.omegaAragonite.toFixed(2)"
                  :after-value="simulationResults.newState.omegaAragonite.toFixed(2)"
                  unit="—"
                />
                <ParameterTableRow
                  label="Ω Calcite"
                  :before-value="simulationResults.currentState.omegaCalcite.toFixed(2)"
                  :after-value="simulationResults.newState.omegaCalcite.toFixed(2)"
                  unit="—"
                />
              </tbody>
              </table>
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
          <p class="text-lg mb-2">No simulation available</p>
          <p class="text-sm">Configure tank parameters and select a supplement to see results</p>
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
import { getProductsByParameter, getProductById } from '../../../utils/commercialProducts.js'
import { formatConcentration } from '../../../utils/formatters.js'
import { getVolumeStep, convertVolume, getUnitAbbrev } from '../../../utils/volumeUtils.js'
import { convertWeight, getWeightUnitAbbrev, getWeightPrecision } from '../../../utils/weightUtils.js'
import CardSection from '../../../components/CardSection.vue'
import StatCard from '../../../components/StatCard.vue'
import ChemicalSelect from '../../../components/ChemicalSelect.vue'
import VolumeInput from '../../../components/VolumeInput.vue'
import VolumeUnitSelect from '../../../components/VolumeUnitSelect.vue'
import WeightUnitSelect from '../../../components/WeightUnitSelect.vue'
import ParameterTableRow from '../../../components/ParameterTableRow.vue'
import { InformationCircleIcon, BuildingStorefrontIcon, BeakerIcon, ScaleIcon } from '@heroicons/vue/24/outline'

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

// Display units for results tables (separate from input units)
const displayAlkUnit = ref(settings.displayAlkUnit || alkUnit.value)
const displayCalciumUnit = ref(settings.displayCalciumUnit || calciumUnit.value)
const pco2Unit = ref(settings.pco2Unit || 'µatm')
const dicUnit = ref(settings.dicUnit || 'µmol/kg')

// Dosing configuration
const doseParameter = ref(settings.doseParameter || 'alkalinity')
const selectedCommercialProduct = ref(settings.selectedCommercialProduct || '')
const selectedCompound = ref(settings.selectedCompound || '')
const selectedFormId = ref(settings.selectedFormId || '')
const calculationMode = ref(settings.calculationMode || 'target-change')
const targetChange = ref(settings.targetChange || 0.5)
const targetChangeUnit = ref(settings.targetChangeUnit || 'dKH')
const doseAmount = ref(settings.doseAmount || 10)
const doseAmountUnit = ref(settings.doseAmountUnit || 'grams')
const displayWeightUnit = ref(settings.displayWeightUnit || 'grams')
const displayVolumeUnit = ref(settings.displayVolumeUnit || 'milliliters')

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
const commercialProducts = computed(() => {
  return getProductsByParameter(doseParameter.value)
})

const selectedProduct = computed(() => {
  if (!selectedCommercialProduct.value) return null
  return getProductById(selectedCommercialProduct.value)
})

const selectedChemical = computed(() => {
  if (!doseParameter.value || !selectedFormId.value) return null
  return getChemicalByForm(doseParameter.value, selectedFormId.value)
})

const canSimulate = computed(() => {
  if (!currentpH.value || !currentAlk.value || !tankVolume.value) return false
  if (doseParameter.value === 'calcium' && !currentCalcium.value) return false

  const hasSupplementSelected = selectedProduct.value || selectedChemical.value

  if (calculationMode.value === 'target-change') {
    return hasSupplementSelected && targetChange.value !== null && targetChange.value !== 0
  } else {
    return hasSupplementSelected && doseAmount.value > 0
  }
})

const displayCurrentAlk = computed(() => {
  // Convert from input unit to display unit
  const valueInMicromol = convertAlkalinity(currentAlk.value, alkUnit.value, 'µmol/kg')
  const valueInDisplayUnit = convertAlkalinity(valueInMicromol, 'µmol/kg', displayAlkUnit.value)
  return valueInDisplayUnit.toFixed(2)
})

const displayNewAlk = computed(() => {
  if (!simulationResults.value) return '—'
  const newAlkInDisplayUnit = convertAlkalinity(simulationResults.value.newState.TA, 'µmol/kg', displayAlkUnit.value)
  return newAlkInDisplayUnit.toFixed(2)
})

const displayCurrentCalcium = computed(() => {
  if (!currentCalcium.value) return '—'
  // Convert from input unit to display unit
  let valueInPpm = currentCalcium.value
  if (calciumUnit.value === 'ppt') {
    valueInPpm = currentCalcium.value * 1000
  }
  return convertCalcium(valueInPpm, displayCalciumUnit.value)
})

const displayNewCalcium = computed(() => {
  if (!simulationResults.value || doseParameter.value !== 'calcium') {
    return displayCurrentCalcium.value
  }
  // simulationResults.value.newCalcium is always in ppm
  return convertCalcium(simulationResults.value.newCalcium, displayCalciumUnit.value)
})

function convertCalcium(valueInPpm, unit) {
  if (unit === 'ppm') {
    return valueInPpm.toFixed(0)
  } else if (unit === 'ppt') {
    return (valueInPpm / 1000).toFixed(3)
  }
  return valueInPpm.toFixed(0)
}

// Unit options for selectors
const alkUnitOptions = [
  { value: 'dKH', label: 'dKH' },
  { value: 'meq/L', label: 'meq/L' },
  { value: 'µmol/kg', label: 'µmol/kg' }
]

const calciumUnitOptions = [
  { value: 'ppm', label: 'ppm' },
  { value: 'ppt', label: 'ppt' }
]

const pco2UnitOptions = [
  { value: 'µatm', label: 'µatm' },
  { value: 'atm', label: 'atm' },
  { value: 'Pa', label: 'Pa' }
]

const dicUnitOptions = [
  { value: 'µmol/kg', label: 'µmol/kg' },
  { value: 'mmol/kg', label: 'mmol/kg' },
  { value: 'mg/L', label: 'mg/L' }
]

const displayDoseAmount = computed(() => {
  if (!calculatedDoseAmount.value) return { amount: '—', unit: '' }

  // Check if it's a liquid product (commercial liquid or DIY powder both use appropriate units)
  const isLiquid = selectedProduct.value?.form === 'liquid'

  if (isLiquid) {
    // Liquid products: calculatedDoseAmount is in mL, show in volume units
    const converted = convertVolume(calculatedDoseAmount.value, 'milliliters', displayVolumeUnit.value)
    const precision = displayVolumeUnit.value === 'milliliters' ? 1 : 2
    return {
      amount: converted.toFixed(precision),
      unit: getUnitAbbrev(displayVolumeUnit.value)
    }
  } else {
    // Powder products or DIY chemicals: calculatedDoseAmount is in grams, show in weight units
    const converted = convertWeight(calculatedDoseAmount.value, displayWeightUnit.value)
    const precision = getWeightPrecision(displayWeightUnit.value)
    return {
      amount: converted.toFixed(precision),
      unit: getWeightUnitAbbrev(displayWeightUnit.value)
    }
  }
})

const displayCurrentPCO2 = computed(() => {
  if (!simulationResults.value) return '—'
  return convertPCO2(simulationResults.value.currentState.pCO2, pco2Unit.value)
})

const displayNewPCO2 = computed(() => {
  if (!simulationResults.value) return '—'
  return convertPCO2(simulationResults.value.newState.pCO2, pco2Unit.value)
})

function convertPCO2(valueInMicroatm, unit) {
  if (unit === 'µatm') {
    return valueInMicroatm.toFixed(0)
  } else if (unit === 'atm') {
    return (valueInMicroatm / 1000000).toFixed(6)
  } else if (unit === 'Pa') {
    return (valueInMicroatm * 0.101325).toFixed(1)
  }
  return valueInMicroatm.toFixed(0)
}

const displayCurrentDIC = computed(() => {
  if (!simulationResults.value) return '—'
  return convertDIC(simulationResults.value.currentState.DIC, dicUnit.value)
})

const displayNewDIC = computed(() => {
  if (!simulationResults.value) return '—'
  return convertDIC(simulationResults.value.newState.DIC, dicUnit.value)
})

function convertDIC(valueInMicromolPerKg, unit) {
  if (unit === 'µmol/kg') {
    return valueInMicromolPerKg.toFixed(0)
  } else if (unit === 'mmol/kg') {
    return (valueInMicromolPerKg / 1000).toFixed(2)
  } else if (unit === 'mg/L') {
    // Convert µmol/kg to mg/L (assuming molecular weight of C = 12)
    return (valueInMicromolPerKg * 12 / 1000).toFixed(1)
  }
  return valueInMicromolPerKg.toFixed(0)
}

// Watch parameter changes
watch(doseParameter, () => {
  selectedCommercialProduct.value = ''
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

// Mutual exclusivity: commercial product clears DIY
watch(selectedCommercialProduct, (newVal) => {
  if (newVal) {
    selectedCompound.value = ''
    selectedFormId.value = ''
  }
})

// Mutual exclusivity: DIY clears commercial product
watch([selectedCompound, selectedFormId], ([compound, form]) => {
  if (compound || form) {
    selectedCommercialProduct.value = ''
  }
})

// Reset dose amount unit when switching between liquid/powder products
watch(() => selectedProduct.value?.form, (newForm, oldForm) => {
  if (newForm !== oldForm) {
    if (newForm === 'liquid') {
      doseAmountUnit.value = 'milliliters'
      displayVolumeUnit.value = 'milliliters'
    } else if (newForm === 'powder') {
      doseAmountUnit.value = 'grams'
      displayWeightUnit.value = 'grams'
    }
  }
})

// Reset dose amount unit when switching from commercial to DIY
watch(selectedChemical, (newVal) => {
  if (newVal) {
    doseAmountUnit.value = 'grams'
    displayWeightUnit.value = 'grams'
  }
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
      displayAlkUnit: displayAlkUnit.value,
      displayCalciumUnit: displayCalciumUnit.value,
      pco2Unit: pco2Unit.value,
      dicUnit: dicUnit.value,
      doseParameter: doseParameter.value,
      selectedCommercialProduct: selectedCommercialProduct.value,
      selectedCompound: selectedCompound.value,
      selectedFormId: selectedFormId.value,
      calculationMode: calculationMode.value,
      targetChange: targetChange.value,
      targetChangeUnit: targetChangeUnit.value,
      doseAmount: doseAmount.value,
      doseAmountUnit: doseAmountUnit.value,
      displayWeightUnit: displayWeightUnit.value,
      displayVolumeUnit: displayVolumeUnit.value,
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
  displayAlkUnit, displayCalciumUnit, pco2Unit, dicUnit,
  doseParameter, selectedCompound, selectedFormId, calculationMode, targetChange, targetChangeUnit,
  doseAmount, doseAmountUnit, displayWeightUnit,
  tankParamsCollapsed, dosingSupplementCollapsed, doseConfigCollapsed, doseAmountCollapsed,
  mainParamsCollapsed, saturationCollapsed, carbonateChemCollapsed
], saveSettings, { deep: true })

// Realtime simulation watch
watch([
  currentpH, currentAlk, alkUnit, tankVolume, tankVolumeUnit, currentCalcium, calciumUnit,
  doseParameter, selectedCommercialProduct, selectedCompound, selectedFormId,
  calculationMode, targetChange, targetChangeUnit, doseAmount, doseAmountUnit,
  () => props.temperature, () => props.salinity, () => props.phScale
], () => {
  if (canSimulate.value) {
    simulateImpact()
  }
}, { deep: true })

function simulateImpact() {
  try {
    simulationWarnings.value = []
    calculatedDoseAmount.value = null

    // Convert current alkalinity to µmol/kg
    const currentTA = convertAlkalinity(currentAlk.value, alkUnit.value, 'µmol/kg')

    // Convert current calcium to ppm
    let currentCalciumPpm = currentCalcium.value || 420
    if (calciumUnit.value === 'ppt') {
      currentCalciumPpm = currentCalcium.value * 1000
    }

    // Convert calcium from ppm to mmol/L for the carbonate system calculator
    // Ca in mmol/L = Ca in ppm / molecular weight
    // MW of Ca = 40.08 g/mol
    const currentCalciumMmolL = currentCalciumPpm / 40.08

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
      calcium: currentCalciumMmolL
    })

    let newTA = currentTA
    let newCalcium = currentCalciumPpm
    let doseAmountGrams = 0

    if (calculationMode.value === 'target-change') {
      // Calculate dose amount from target change
      if (doseParameter.value === 'alkalinity') {
        const changeInBase = targetChangeUnit.value === 'dKH'
          ? convertAlkalinity(targetChange.value, 'dKH', 'µmol/kg')
          : convertAlkalinity(targetChange.value, 'meq/L', 'µmol/kg')

        newTA = currentTA + changeInBase

        // Calculate grams/mL needed if supplement is selected
        if (selectedProduct.value || selectedChemical.value) {
          const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
            ? tankVolume.value
            : convertVolume(tankVolume.value, tankVolumeUnit.value, 'gallons')

          const alkChangeInDKH = convertAlkalinity(changeInBase, 'µmol/kg', 'dKH')

          if (selectedProduct.value) {
            // Commercial product: use concentration directly
            const concentrationInMeqL = selectedProduct.value.concentration.value
            const alkChangeInMeqL = convertAlkalinity(alkChangeInDKH, 'dKH', 'meq/L')
            const amountNeeded = (alkChangeInMeqL * tankVolumeGallons) / concentrationInMeqL
            // Unit depends on form: liquid = mL, powder = grams
            calculatedDoseAmount.value = amountNeeded
          } else {
            // DIY chemical: calculate from element percentage
            const elementFactor = 2.8 // Approximate conversion factor for carbonate alkalinity
            doseAmountGrams = (tankVolumeGallons * alkChangeInDKH * elementFactor) / (selectedChemical.value.elementPercentage / 100)
            calculatedDoseAmount.value = doseAmountGrams
          }

          // Add warnings
          if (alkChangeInDKH > 1.5) {
            simulationWarnings.value.push('Large alkalinity change (>1.5 dKH). Consider dosing in smaller increments.')
          }
        }
      } else if (doseParameter.value === 'calcium') {
        const changePPM = targetChangeUnit.value === 'ppm'
          ? targetChange.value
          : targetChange.value * 1000

        newCalcium = currentCalciumPpm + changePPM

        // Calculate grams/mL needed if supplement is selected
        if (selectedProduct.value || selectedChemical.value) {
          const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
            ? tankVolume.value
            : convertVolume(tankVolume.value, tankVolumeUnit.value, 'gallons')

          if (selectedProduct.value) {
            // Commercial product: use concentration directly
            const concentrationPpm = selectedProduct.value.concentration.value
            const amountNeeded = (changePPM * tankVolumeGallons) / concentrationPpm
            // Unit depends on form: liquid = mL, powder = grams
            calculatedDoseAmount.value = amountNeeded
          } else {
            // DIY chemical: calculate from element percentage
            doseAmountGrams = (tankVolumeGallons * changePPM * 3.8) / (selectedChemical.value.elementPercentage / 100)
            calculatedDoseAmount.value = doseAmountGrams
          }

          if (changePPM > 30) {
            simulationWarnings.value.push('Large calcium change (>30 ppm). Consider dosing in smaller increments.')
          }
        }
      }
    } else {
      // Calculate impact from dose amount
      if (!selectedChemical.value && !selectedProduct.value) {
        throw new Error('Please select a supplement')
      }

      const tankVolumeGallons = tankVolumeUnit.value === 'gallons'
        ? tankVolume.value
        : convertVolume(tankVolume.value, tankVolumeUnit.value, 'gallons')

      if (doseParameter.value === 'alkalinity') {
        let dKHChange

        if (selectedProduct.value) {
          // Commercial product: dose amount unit depends on form (liquid=mL, powder=grams)
          const isLiquid = selectedProduct.value.form === 'liquid'
          const doseInAppropriateUnit = isLiquid
            ? convertVolume(doseAmount.value, doseAmountUnit.value, 'milliliters')
            : convertWeight(doseAmount.value, doseAmountUnit.value, 'grams')
          const concentrationInMeqL = selectedProduct.value.concentration.value
          const meqLChange = (doseInAppropriateUnit * concentrationInMeqL) / tankVolumeGallons
          dKHChange = convertAlkalinity(meqLChange, 'meq/L', 'dKH')
        } else {
          // DIY chemical: calculate from grams and element percentage
          const doseGrams = convertWeight(doseAmount.value, doseAmountUnit.value, 'grams')
          const elementFactor = 2.8
          dKHChange = (doseGrams * (selectedChemical.value.elementPercentage / 100)) / (tankVolumeGallons * elementFactor)
        }

        const changeInMicromol = convertAlkalinity(dKHChange, 'dKH', 'µmol/kg')
        newTA = currentTA + changeInMicromol
      } else if (doseParameter.value === 'calcium') {
        let ppmChange

        if (selectedProduct.value) {
          // Commercial product: dose amount unit depends on form (liquid=mL, powder=grams)
          const isLiquid = selectedProduct.value.form === 'liquid'
          const doseInAppropriateUnit = isLiquid
            ? convertVolume(doseAmount.value, doseAmountUnit.value, 'milliliters')
            : convertWeight(doseAmount.value, doseAmountUnit.value, 'grams')
          const concentrationPpm = selectedProduct.value.concentration.value
          ppmChange = (doseInAppropriateUnit * concentrationPpm) / tankVolumeGallons
        } else {
          // DIY chemical: calculate from grams and element percentage
          const doseGrams = convertWeight(doseAmount.value, doseAmountUnit.value, 'grams')
          ppmChange = (doseGrams * (selectedChemical.value.elementPercentage / 100)) / (tankVolumeGallons * 3.8)
        }

        newCalcium = currentCalciumPpm + ppmChange
      }
    }

    // Calculate new state after dosing
    // For alkalinity dosing with carbonates/bicarbonates, DIC increases proportionally
    // For calcium dosing, DIC remains constant
    let newDIC = currentState.DIC
    if (doseParameter.value === 'alkalinity') {
      // Assume we're dosing bicarbonate (most common form)
      // For NaHCO3: ΔTA ≈ ΔDIC (in µmol/kg)
      const deltaTA = newTA - currentTA
      newDIC = currentState.DIC + deltaTA
    }

    // Convert new calcium from ppm to mmol/L
    const newCalciumMmolL = newCalcium / 40.08

    const newState = calculateCarbonateSystem({
      param1Type: 'DIC',
      param1Value: newDIC,
      param2Type: 'TA',
      param2Value: newTA,
      temperature: props.temperature,
      salinity: props.salinity,
      pressure: 0,
      pHScale: props.phScale,
      calcium: newCalciumMmolL
    })

    simulationResults.value = {
      currentState,
      newState,
      newpH: newState.pH,
      newCalcium
    }

  } catch (error) {
    console.error('Simulation error:', error)
    simulationWarnings.value.push(`Simulation error: ${error.message}`)
  }
}

onMounted(() => {
  loadSettings()

  // Initialize dose amount unit based on selected product form
  if (selectedProduct.value) {
    if (selectedProduct.value.form === 'liquid') {
      if (!['milliliters', 'liters', 'gallons', 'ouncesUS', 'ouncesUK'].includes(doseAmountUnit.value)) {
        doseAmountUnit.value = 'milliliters'
      }
    } else {
      if (!['grams', 'kilograms', 'ounces', 'pounds'].includes(doseAmountUnit.value)) {
        doseAmountUnit.value = 'grams'
      }
    }
  }

  // Run initial simulation if possible
  if (canSimulate.value) {
    simulateImpact()
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dosing Target Calculator</h1>
      <p class="text-gray-600">
        Calculate supplement dosage to reach target levels of certain water parameters.
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
            <span class="font-medium">Disclaimer:</span> This calculator is provided for educational and informational purposes only.
            Always verify calculations independently and follow manufacturer guidelines for commercial products.
            Improper dosing can harm your aquarium inhabitants. Use at your own risk.
          </p>
        </div>
      </div>
    </div>

    <!-- Parameter Selection -->
    <CardSection title="1. Select Parameter to Dose" color="blue">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          v-for="(_, key) in parameters"
          :key="key"
          @click="selectedParameter = key"
          :class="[
            'px-4 py-3 rounded-lg border-2 font-medium transition-all',
            selectedParameter === key
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ getParameterLabel(key) }}
        </button>
      </div>

      <!-- Parameter Info -->
      <ParameterInfoCard :parameter-info="parameterInfo" />
    </CardSection>

    <!-- Supplement Selection -->
    <CardSection title="2. Choose Supplement" color="green">
      <div class="grid md:grid-cols-2 gap-6">
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
            :parameter="selectedParameter"
            v-model:base-compound="selectedDIYCompound"
            v-model:form="selectedDIYForm"
            compound-label="DIY Supplement"
          />

          <!-- DIY Concentration Options -->
          <div v-if="selectedChemical" class="mt-4 space-y-4">
            <div class="text-sm font-medium text-gray-700">How to specify concentration:</div>

            <div class="space-y-2">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="diyConcentrationMode"
                  type="radio"
                  value="direct"
                  class="mr-2"
                />
                <span>Enter concentration directly</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="diyConcentrationMode"
                  type="radio"
                  value="calculate"
                  class="mr-2"
                />
                <span>Calculate from recipe (weight + volume)</span>
              </label>
            </div>

            <!-- Direct Entry -->
            <div v-if="diyConcentrationMode === 'direct'" class="space-y-3">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Concentration</label>
                <input
                  v-model.number="manualConcentration"
                  type="number"
                  step="0.001"
                  min="0"
                  class="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 95.4"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Unit</label>
                <select
                  v-model="manualConcentrationUnit"
                  class="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="ppm/ml/gal">ppm per mL per gallon</option>
                  <option value="ppm/g/gal">ppm per gram per gallon</option>
                  <option value="ppm/ml">ppm per mL</option>
                  <option value="ppm/g">ppm per gram</option>
                  <option v-if="selectedParameter === 'alkalinity'" value="meq/L/ml/gal">meq/L per mL per gallon</option>
                  <option v-if="selectedParameter === 'alkalinity'" value="meq/L/g/gal">meq/L per gram per gallon</option>
                  <option v-if="selectedParameter === 'alkalinity'" value="meq/L/ml">meq/L per mL</option>
                  <option v-if="selectedParameter === 'alkalinity'" value="meq/L/g">meq/L per gram</option>
                </select>
              </div>
            </div>

            <!-- Calculate from Recipe -->
            <div v-if="diyConcentrationMode === 'calculate'" class="space-y-3">
              <div class="grid md:grid-cols-3 gap-3 items-end">
                <div class="md:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">Compound Weight</label>
                  <input
                    v-model.number="recipeWeight"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="100"
                  />
                </div>
                <div>
                  <WeightUnitSelect v-model="recipeWeightUnit" />
                </div>
              </div>
              <div class="grid md:grid-cols-3 gap-3 items-end">
                <div class="md:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">Solution Volume</label>
                  <input
                    v-model.number="recipeSolutionVolume"
                    type="number"
                    :step="getVolumeStep(recipeSolutionVolumeUnit)"
                    min="0"
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <VolumeUnitSelect v-model="recipeSolutionVolumeUnit" />
                </div>
              </div>
              <div v-if="calculatedConcentration" class="p-3 bg-green-50 border border-green-200 rounded text-sm">
                <div class="font-medium text-green-900">Calculated Concentration:</div>
                <div class="text-green-800">{{ calculatedConcentration.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardSection>

    <!-- System Information -->
    <CardSection title="3. System Information" color="purple">
      <div class="space-y-4">
        <!-- System Volume -->
        <VolumeInput
          v-model="systemVolume"
          v-model:unit="systemVolumeUnit"
          label="System Volume"
          :step="getVolumeStep(systemVolumeUnit)"
          min="0"
          grid-class="grid md:grid-cols-3 gap-4 items-end"
          input-col-class="md:col-span-2"
        />

        <!-- Current Level -->
        <div class="grid md:grid-cols-3 gap-4 items-end">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Current {{ parameterLabel }} Level
            </label>
            <input
              v-model.number="currentLevel"
              type="number"
              step="0.1"
              min="0"
              class="w-full px-3 py-2 border rounded-lg"
              placeholder="400"
            />
          </div>
          <div>
            <select
              v-model="levelUnit"
              class="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option v-for="unit in levelUnits" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
          </div>
        </div>

        <!-- Target Level -->
        <div class="grid md:grid-cols-3 gap-4 items-end">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Target {{ parameterLabel }} Level
            </label>
            <input
              v-model.number="targetLevel"
              type="number"
              step="0.1"
              min="0"
              class="w-full px-3 py-2 border rounded-lg"
              placeholder="420"
            />
          </div>
          <div>
            <select
              v-model="levelUnit"
              class="w-full px-3 py-2 border rounded-lg bg-white"
              disabled
            >
              <option :value="levelUnit">{{ levelUnit }}</option>
            </select>
          </div>
        </div>
      </div>
    </CardSection>

    <!-- Results -->
    <CardSection title="Results" color="orange">
      <div v-if="calculationResults">
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Dose Amount"
            :value="`${displayDoseAmount.amount} ${displayDoseAmount.unit}`"
            color="blue"
          >
            <div v-if="calculationResults.isLiquid">
              <label class="block text-xs text-gray-600 mb-1">Unit</label>
              <VolumeUnitSelect v-model="displayDoseVolumeUnit" />
            </div>
            <div v-else>
              <label class="block text-xs text-gray-600 mb-1">Unit</label>
              <WeightUnitSelect v-model="displayDoseWeightUnit" />
            </div>
          </StatCard>
          <StatCard
            label="Level Increase"
            :value="`${displayLevelIncrease.amount} ${displayLevelIncrease.unit}`"
            color="green"
          >
            <div>
              <label class="block text-xs text-gray-600 mb-1">Unit</label>
              <select
                v-model="levelIncreaseDisplayUnit"
                class="w-full px-3 py-2 border rounded-lg bg-white text-sm"
              >
                <option v-for="unit in levelUnits" :key="unit" :value="unit">
                  {{ unit }}
                </option>
              </select>
            </div>
          </StatCard>
          <StatCard
            label="Resulting Level"
            :value="`${displayResultingLevel.amount} ${displayResultingLevel.unit}`"
            color="purple"
          >
            <div>
              <label class="block text-xs text-gray-600 mb-1">Unit</label>
              <select
                v-model="resultingLevelDisplayUnit"
                class="w-full px-3 py-2 border rounded-lg bg-white text-sm"
              >
                <option v-for="unit in levelUnits" :key="unit" :value="unit">
                  {{ unit }}
                </option>
              </select>
            </div>
          </StatCard>
        </div>

        <!-- Warnings -->
        <div v-if="calculationResults.warnings.length > 0" class="space-y-2">
          <div
            v-for="(warning, index) in calculationResults.warnings"
            :key="index"
            class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex gap-3"
          >
            <InformationCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />
            <p class="text-sm text-yellow-800">{{ warning }}</p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="calculationResults.warnings.length === 0" class="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p class="text-sm text-green-800">
            Dose looks safe! Add {{ displayDoseAmount.amount }} {{ displayDoseAmount.unit }} to raise
            {{ parameterLabel }} from {{ currentLevel }} to {{ targetLevel }} {{ levelUnit }}.
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 text-sm">
        Fill in all fields above to calculate dosing amount
      </div>
    </CardSection>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CardSection from '../../components/CardSection.vue'
import ChemicalSelect from '../../components/ChemicalSelect.vue'
import VolumeInput from '../../components/VolumeInput.vue'
import VolumeUnitSelect from '../../components/VolumeUnitSelect.vue'
import WeightUnitSelect from '../../components/WeightUnitSelect.vue'
import StatCard from '../../components/StatCard.vue'
import ParameterInfoCard from '../../components/ParameterInfoCard.vue'
import { InformationCircleIcon, BuildingStorefrontIcon, BeakerIcon, ScaleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { getVolumeStep, convertVolume } from '../../utils/volumeUtils.js'
import { convertWeight } from '../../utils/weightUtils.js'
import { getProductsByParameter, getProductById } from '../../utils/commercialProducts.js'
import { DOSING_PARAMETERS, getChemicalByForm, getParameterInfo } from '../../utils/dosingChemicals.js'
import {
  calculateConcentrationFromRecipe,
  calculateDoseVolume,
  getParameterUnits,
  convertLevelUnits
} from '../../utils/concentrationUtils.js'
import { useParameterSelection } from '../../composables/useParameterSelection.js'
import { formatConcentration } from '../../utils/formatters.js'

const STORAGE_KEY = 'dosingTargetCalculatorSettings'

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

// Parameter selection
const selectedParameter = ref(settings.selectedParameter || '')
const jimWelshMode = ref(settings.jimWelshMode || false)

// Use parameter selection composable
const { parameters, getParameterLabel, parameterLabel } = useParameterSelection(selectedParameter, jimWelshMode)

// Commercial product selection
const selectedCommercialProduct = ref(settings.selectedCommercialProduct || '')

// DIY supplement selection
const selectedDIYCompound = ref(settings.selectedDIYCompound || '')
const selectedDIYForm = ref(settings.selectedDIYForm || '')
const diyConcentrationMode = ref(settings.diyConcentrationMode || 'calculate')
const manualConcentration = ref(settings.manualConcentration || null)
const manualConcentrationUnit = ref(settings.manualConcentrationUnit || 'ppm/ml/gal')

// Recipe calculation
const recipeWeight = ref(settings.recipeWeight || 100)
const recipeWeightUnit = ref(settings.recipeWeightUnit || 'grams')
const recipeSolutionVolume = ref(settings.recipeSolutionVolume || 1000)
const recipeSolutionVolumeUnit = ref(settings.recipeSolutionVolumeUnit || 'milliliters')

// System information
const systemVolume = ref(settings.systemVolume || 100)
const systemVolumeUnit = ref(settings.systemVolumeUnit || 'gallons')
const currentLevel = ref(settings.currentLevel || null)
const targetLevel = ref(settings.targetLevel || null)
const levelUnit = ref(settings.levelUnit || 'ppm') // For current/target input

// Display units for results
const displayDoseVolumeUnit = ref(settings.displayDoseVolumeUnit || 'milliliters')
const displayDoseWeightUnit = ref(settings.displayDoseWeightUnit || 'grams')
const levelIncreaseDisplayUnit = ref(settings.levelIncreaseDisplayUnit || settings.levelUnit || 'ppm')
const resultingLevelDisplayUnit = ref(settings.resultingLevelDisplayUnit || settings.levelUnit || 'ppm')

// Computed properties
const commercialProducts = computed(() => {
  if (!selectedParameter.value) return []
  return getProductsByParameter(selectedParameter.value)
})

const selectedProduct = computed(() => {
  if (!selectedCommercialProduct.value) return null
  return getProductById(selectedCommercialProduct.value)
})

const selectedChemical = computed(() => {
  if (!selectedParameter.value || !selectedDIYForm.value) {
    return null
  }
  return getChemicalByForm(selectedParameter.value, selectedDIYForm.value)
})

const hasDIYSelection = computed(() => {
  return !!selectedDIYCompound.value || !!selectedDIYForm.value
})

const hasSupplementSelected = computed(() => {
  return !!selectedCommercialProduct.value || (!!selectedChemical.value && !!effectiveConcentration.value)
})

// Get parameter info (natural seawater, recommended range, optimal target)
const parameterInfo = computed(() => {
  if (!selectedParameter.value) return null
  return getParameterInfo(selectedParameter.value)
})

const levelUnits = computed(() => {
  if (!selectedParameter.value) return ['ppm']
  return getParameterUnits(selectedParameter.value).levelUnits
})

const calculatedConcentration = computed(() => {
  if (!selectedChemical.value || diyConcentrationMode.value !== 'calculate') {
    return null
  }
  if (!recipeWeight.value || !recipeSolutionVolume.value) {
    return null
  }

  return calculateConcentrationFromRecipe(
    selectedParameter.value,
    selectedChemical.value,
    recipeWeight.value,
    recipeWeightUnit.value,
    recipeSolutionVolume.value,
    recipeSolutionVolumeUnit.value
  )
})

const effectiveConcentration = computed(() => {
  // Commercial product
  if (selectedProduct.value) {
    return {
      value: selectedProduct.value.concentration.value,
      unit: selectedProduct.value.concentration.unit
    }
  }

  // DIY - direct entry
  if (selectedChemical.value && diyConcentrationMode.value === 'direct' && manualConcentration.value) {
    return {
      value: manualConcentration.value,
      unit: manualConcentrationUnit.value
    }
  }

  // DIY - calculated
  if (calculatedConcentration.value) {
    return {
      value: calculatedConcentration.value.value,
      unit: calculatedConcentration.value.unit
    }
  }

  return null
})

const calculationResults = computed(() => {
  if (!hasSupplementSelected.value) return null
  if (!systemVolume.value || !currentLevel.value || !targetLevel.value) return null
  if (!effectiveConcentration.value) return null

  const result = calculateDoseVolume(
    selectedParameter.value,
    currentLevel.value,
    targetLevel.value,
    levelUnit.value,
    systemVolume.value,
    systemVolumeUnit.value,
    effectiveConcentration.value.value,
    effectiveConcentration.value.unit
  )

  // Determine if this is a liquid (mL) or powder (g)
  // Check for /ml to identify liquids (avoid false match with /gal for gallons)
  const isLiquid = effectiveConcentration.value.unit.includes('/ml')
  const doseUnit = isLiquid ? 'mL' : 'g'
  const doseAmount = result.doseVolumeML.toFixed(isLiquid ? 1 : 2)

  return {
    doseAmount,
    doseUnit,
    doseAmountML: result.doseVolumeML,
    isLiquid,
    resultingLevel: result.resultingLevel,
    levelIncrease: result.levelIncrease,
    warnings: result.warnings
  }
})

// Display dose amount in selected unit
const displayDoseAmount = computed(() => {
  if (!calculationResults.value) return null

  const doseML = calculationResults.value.doseAmountML
  const isLiquid = calculationResults.value.isLiquid

  if (isLiquid) {
    // Convert volume
    const converted = convertVolume(doseML, 'milliliters', displayDoseVolumeUnit.value)
    const precision = displayDoseVolumeUnit.value === 'milliliters' ? 1 : 2
    return {
      amount: converted.toFixed(precision),
      unit: displayDoseVolumeUnit.value
    }
  } else {
    // Convert weight (doseML is actually in grams for powders)
    const converted = convertWeight(doseML, displayDoseWeightUnit.value)
    const precision = displayDoseWeightUnit.value === 'grams' ? 2 : 3
    return {
      amount: converted.toFixed(precision),
      unit: displayDoseWeightUnit.value
    }
  }
})

// Display level increase in selected unit
const displayLevelIncrease = computed(() => {
  if (!calculationResults.value) return null
  const converted = convertLevelUnits(
    calculationResults.value.levelIncrease,
    levelUnit.value,
    levelIncreaseDisplayUnit.value
  )
  return {
    amount: converted.toFixed(2),
    unit: levelIncreaseDisplayUnit.value
  }
})

// Display resulting level in selected unit
const displayResultingLevel = computed(() => {
  if (!calculationResults.value) return null
  const converted = convertLevelUnits(
    calculationResults.value.resultingLevel,
    levelUnit.value,
    resultingLevelDisplayUnit.value
  )
  return {
    amount: converted.toFixed(2),
    unit: resultingLevelDisplayUnit.value
  }
})

// Watch parameter changes to reset selections
watch(selectedParameter, () => {
  selectedCommercialProduct.value = ''
  selectedDIYCompound.value = ''
  selectedDIYForm.value = ''

  // Set default level unit based on parameter
  if (selectedParameter.value === 'alkalinity') {
    levelUnit.value = 'dKH'
    levelIncreaseDisplayUnit.value = 'dKH'
    resultingLevelDisplayUnit.value = 'dKH'
  } else {
    levelUnit.value = 'ppm'
    levelIncreaseDisplayUnit.value = 'ppm'
    resultingLevelDisplayUnit.value = 'ppm'
  }
})

// Watch commercial product selection to reset DIY
watch(selectedCommercialProduct, (newVal) => {
  if (newVal) {
    selectedDIYCompound.value = ''
    selectedDIYForm.value = ''
  }
})

// Watch DIY selection to reset commercial
watch([selectedDIYCompound, selectedDIYForm], () => {
  if (selectedDIYCompound.value || selectedDIYForm.value) {
    selectedCommercialProduct.value = ''
  }
})

// Save settings to localStorage
const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedParameter: selectedParameter.value,
      jimWelshMode: jimWelshMode.value,
      selectedCommercialProduct: selectedCommercialProduct.value,
      selectedDIYCompound: selectedDIYCompound.value,
      selectedDIYForm: selectedDIYForm.value,
      diyConcentrationMode: diyConcentrationMode.value,
      manualConcentration: manualConcentration.value,
      manualConcentrationUnit: manualConcentrationUnit.value,
      recipeWeight: recipeWeight.value,
      recipeWeightUnit: recipeWeightUnit.value,
      recipeSolutionVolume: recipeSolutionVolume.value,
      recipeSolutionVolumeUnit: recipeSolutionVolumeUnit.value,
      systemVolume: systemVolume.value,
      systemVolumeUnit: systemVolumeUnit.value,
      currentLevel: currentLevel.value,
      targetLevel: targetLevel.value,
      levelUnit: levelUnit.value,
      displayDoseVolumeUnit: displayDoseVolumeUnit.value,
      displayDoseWeightUnit: displayDoseWeightUnit.value,
      levelIncreaseDisplayUnit: levelIncreaseDisplayUnit.value,
      resultingLevelDisplayUnit: resultingLevelDisplayUnit.value
    }))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// Watch for changes and save
watch([
  selectedParameter,
  jimWelshMode,
  selectedCommercialProduct,
  selectedDIYCompound,
  selectedDIYForm,
  diyConcentrationMode,
  manualConcentration,
  manualConcentrationUnit,
  recipeWeight,
  recipeWeightUnit,
  recipeSolutionVolume,
  recipeSolutionVolumeUnit,
  systemVolume,
  systemVolumeUnit,
  currentLevel,
  targetLevel,
  levelUnit,
  displayDoseVolumeUnit,
  displayDoseWeightUnit,
  levelIncreaseDisplayUnit,
  resultingLevelDisplayUnit
], saveSettings, { deep: true })
</script>

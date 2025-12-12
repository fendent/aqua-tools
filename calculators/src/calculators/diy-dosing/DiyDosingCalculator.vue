<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">DIY Dosing Calculator</h1>
      <p class="text-gray-600">
        Calculate compound amounts for custom reef tank dosing supplements
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
            Always verify calculations independently and consult manufacturer safety data sheets (SDS) before handling chemicals.
            Improper use of chemicals can harm your aquarium inhabitants or pose safety risks. Use at your own risk.
          </p>
        </div>
      </div>
    </div>

    <!-- Parameter Selection -->
    <CardSection title="1. Select Parameter to Dose">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          v-for="(param, key) in parameters"
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

    <!-- Chemical Selection -->
    <CardSection title="2. Select Chemical Compound">
      <div class="space-y-3">
        <ChemicalSelect
          :parameter="selectedParameter"
          v-model:base-compound="selectedBaseCompound"
          v-model:form="selectedFormId"
          compound-label="Base Compound"
          :auto-select-compound="true"
        />

        <!-- Chemical Details -->
        <div class="p-4 bg-gray-50 rounded-lg space-y-3">
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">Formula:</span> {{ selectedChemical?.formula || '—' }}
            </div>
            <div>
              <span class="font-medium">Molecular Weight:</span> {{ selectedChemical ? `${selectedChemical.molecularWeight}g/mol` : '—' }}
            </div>
            <div v-if="!selectedChemical || !selectedChemical.isRecipe">
              <span class="font-medium">Element Content:</span> {{ selectedChemical ? `${selectedChemical.elementPercentage}%` : '—' }}
            </div>
            <div>
              <span class="font-medium">Common Names:</span> {{ selectedChemical ? selectedChemical.commonNames.join(', ') : '—' }}
            </div>
            <div v-if="selectedChemical && selectedChemical.pubchemLink" class="md:col-span-2">
              <span class="font-medium">Reference:</span>
              <a
                :href="selectedChemical.pubchemLink"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 ml-1"
              >
                View on PubChem
                <ArrowTopRightOnSquareIcon class="w-3 h-3" />
              </a>
            </div>
          </div>

          <!-- Safety & Storage -->
          <div v-if="selectedChemical" class="pt-3 border-t border-gray-200 space-y-2">
            <div class="flex items-start gap-2">
              <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div class="w-full">
                <span class="font-medium text-sm">Safety:</span>
                <p class="text-sm text-gray-700">{{ selectedChemical.safetyNotes }}</p>
                <a
                  v-if="selectedChemical.pubchemLink"
                  :href="`${selectedChemical.pubchemLink}#datasheet=LCSS`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 mt-1"
                >
                  View Lab Chemical Safety Summary (LCSS)
                  <ArrowTopRightOnSquareIcon class="w-3 h-3" />
                </a>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <ArchiveBoxIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span class="font-medium text-sm">Storage:</span>
                <p class="text-sm text-gray-700">{{ selectedChemical.storageNotes }}</p>
              </div>
            </div>
            <div v-if="selectedChemical.notes" class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span class="font-medium text-sm">Notes:</span>
                <p class="text-sm text-gray-700">{{ selectedChemical.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardSection>

    <!-- Configuration -->
    <CardSection title="3. Configuration">
      <div class="grid lg:grid-cols-3 gap-4 mb-4">
        <VolumeInput
          v-model="systemVolume"
          v-model:unit="systemVolumeUnit"
          label="System Volume"
          :step="getVolumeStep(systemVolumeUnit)"
          min="0.1"
          grid-class="grid grid-cols-[1fr_110px] gap-2"
          :unit-select-props="{ labelFormat: 'abbrev' }"
        />
      </div>

      <div class="grid lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2 flex items-center gap-1">
            Target Change
            <span class="group relative">
              <InformationCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
              <span class="invisible group-hover:visible absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                How much you want to raise the parameter with each dose
              </span>
            </span>
          </label>
          <div class="grid grid-cols-[1fr_110px] gap-2">
            <input
              v-model.number="targetChange"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              :step="getChangeStep()"
              min="0.001"
              :disabled="!selectedChemical"
            />
            <select
              v-model="targetChangeUnit"
              class="px-3 py-2 border rounded-lg text-sm"
              :disabled="!selectedChemical"
            >
              <option v-if="parameterInfo?.unit === 'dKH'" value="dKH">dKH</option>
              <option v-if="parameterInfo?.unit === 'dKH'" value="meq/L">meq/L</option>
              <option v-if="parameterInfo?.unit === 'ppm'" value="ppm">ppm</option>
              <option v-if="parameterInfo?.unit === 'ppm'" value="ppt">ppt</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 flex items-center gap-1">
            Dose Volume
            <span class="group relative">
              <InformationCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
              <span class="invisible group-hover:visible absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                The amount of solution to add to your tank per dose
              </span>
            </span>
          </label>
          <div class="grid grid-cols-[1fr_110px] gap-2">
            <input
              v-model.number="doseVolume"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              :step="getVolumeStep(doseVolumeUnit)"
              min="0.001"
            />
            <VolumeUnitSelect
              v-model="doseVolumeUnit"
              label-format="abbrev"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 flex items-center gap-1">
            Solution Volume
            <span class="group relative">
              <InformationCircleIcon class="w-4 h-4 text-gray-400 cursor-help" />
              <span class="invisible group-hover:visible absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                The total amount of solution you want to prepare in advance
              </span>
            </span>
          </label>
          <div class="grid grid-cols-[1fr_110px] gap-2">
            <input
              v-model.number="solutionVolume"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              :step="getVolumeStep(solutionVolumeUnit)"
              min="0.1"
            />
            <VolumeUnitSelect
              v-model="solutionVolumeUnit"
              label-format="abbrev"
            />
          </div>
        </div>
      </div>

      <!-- Configuration Explanation -->
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start gap-2">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-blue-900">
            <p class="font-medium mb-1">What does this mean?</p>
            <p class="text-blue-800">
              You're preparing a dosing solution by dissolving compound(s) in water. Each time you dose,
              you'll add <strong>{{ doseVolume }} {{ doseVolumeUnitAbbrev }}</strong> of this
              solution to your <strong>{{ systemVolume }} {{ systemVolumeUnitSingular }}</strong> tank,

              which will raise <strong>{{ parameterLabel }}</strong>
              by <strong>{{ targetChange }} {{ targetChangeUnit }}</strong>.

              The calculator will tell you how much compound to dissolve to make
              <strong>{{ solutionVolume }} {{ solutionVolumeUnitAbbrev }}</strong> of solution.
            </p>
          </div>
        </div>
      </div>
    </CardSection>

    <!-- Results -->
    <CardSection title="4. Recipe & Instructions" :collapsible="false">
      <!-- No Results Message -->
      <div v-if="!calculationResults" class="text-center py-8 text-gray-500">
        <p>Complete the configuration above to see your recipe and instructions.</p>
      </div>

      <!-- Results Content -->
      <div v-else>
        <!-- Warnings -->
        <div v-if="calculationResults.warnings.length > 0" class="mb-4 space-y-2">
          <div
            v-for="(warning, idx) in calculationResults.warnings"
            :key="idx"
            :class="[
              'p-3 rounded-lg flex items-start gap-2',
              warning.type === 'error' ? 'bg-red-50 text-red-800' :
              warning.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
              'bg-blue-50 text-blue-800'
            ]"
          >
            <InformationCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p class="text-sm">{{ warning.message }}</p>
          </div>
        </div>

      <!-- Main Results -->
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Compound Needed"
          :value="`${displayCompoundNeeded} ${displayCompoundUnit}`"
          color="blue"
        >
          <div class="text-xs text-gray-600 mb-1">Display unit:</div>
          <WeightUnitSelect v-model="displayWeightUnit" label-format="abbrev" />
        </StatCard>
        <StatCard
          label="Solution Needed"
          :value="`${displaySolutionNeeded} ${displaySolutionUnitAbbrev}`"
          color="purple"
        >
          <div class="text-xs text-gray-600 mb-1">Display unit:</div>
          <VolumeUnitSelect v-model="displaySolutionUnit" label-format="abbrev" />
        </StatCard>
      </div>

      <!-- Balanced Recipe Breakdown -->
      <div v-if="calculationResults.isBalancedRecipe" class="mb-6 p-4 bg-green-50 rounded-lg">
        <h4 class="font-medium text-green-900 mb-3">Balanced Magnesium Recipe Breakdown:</h4>
        <div class="grid md:grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between">
            <span>Magnesium Chloride Hexahydrate:</span>
            <span class="font-medium">{{ calculationResults.mgcl2Needed.toFixed(2) }}g</span>
          </div>
          <div class="flex justify-between">
            <span>Magnesium Sulfate Heptahydrate (Epsom):</span>
            <span class="font-medium">{{ calculationResults.mgso4Needed.toFixed(2) }}g</span>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <h4 class="text-base font-medium text-gray-900 mb-3">Preparation Instructions:</h4>
        <div class="space-y-2 text-sm text-gray-700">
          <div v-for="(instruction, idx) in formattedInstructions" :key="idx">
            <div v-if="instruction.startsWith('**')" class="text-base font-medium text-gray-900 mb-3">
              {{ instruction.replace(/\*\*/g, '') }}
            </div>
            <div v-else-if="instruction.startsWith('-')">
              {{ instruction }}
            </div>
            <div v-else>
              <span class="font-medium text-gray-500">{{ idx + 1 }}.</span> {{ instruction }}
            </div>
          </div>
        </div>
      </div>

      <!-- Copy/Export -->
      <div class="mt-4 flex gap-2">
        <button
          @click="copyToClipboard"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <ClipboardDocumentIcon class="w-4 h-4" />
          {{ copyButtonText }}
        </button>
      </div>
      </div>
    </CardSection>

    <!-- Thanks/References -->
    <CardSection title="Credits & References" :collapsible="true">
      <div class="space-y-3 text-sm text-gray-700">
        <div>
          <p class="font-medium text-gray-900 mb-2">Recipe Sources & Chemistry</p>
          <p>
            A great deal of information and methodology used in this calculator is based on the work of Dr. Randy Holmes-Farley. His contributions in the field of chemistry have been invaluable to the reefkeeping community.
          </p>
        </div>
        <div>
          <p>
            If I've missed any other references or resources, please feel free to open an issue or reach out to let me know!
          </p>
        </div>
        <div>
          <p class="font-medium text-gray-900 mb-2">Additional Resources</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>
              <a href="https://www.reef2reef.com/forums/reef-chemistry-by-randy-holmes-farley.295/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">Reef2Reef Chemistry Forum</a>
            </li>

          </ul>
        </div>
      </div>
    </CardSection>

    <!-- Jim Welsh Mode -->
    <div class="flex items-center justify-center pt-4">
      <label class="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
        <input
          v-model="jimWelshMode"
          type="checkbox"
          class="w-3 h-3 rounded border-gray-300"
        />
        Jim Welsh Mode
      </label>
    </div>
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
import {
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  ClipboardDocumentIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import {
  DOSING_PARAMETERS,
  getParameterInfo,
  getChemicalByForm
} from '../../utils/dosingChemicals.js'
import {
  calculateCompoundAmount,
  formatDosingInstructions,
  validateInputs
} from '../../utils/dosingCalculations.js'
import { getVolumeStep, toMilliliters, convertVolume } from '../../utils/volumeUtils.js'
import { convertWeight, getWeightUnitAbbrev, getWeightPrecision } from '../../utils/weightUtils.js'
import { useParameterSelection } from '../../composables/useParameterSelection.js'

const STORAGE_KEY = 'diyDosingCalculatorSettings'

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

const selectedParameter = ref(settings.selectedParameter || '')
const selectedBaseCompound = ref(settings.selectedBaseCompound || '')
const selectedFormId = ref(settings.selectedFormId || '')
const systemVolume = ref(settings.systemVolume || 100)
const systemVolumeUnit = ref(settings.systemVolumeUnit || 'gallons')
const targetChange = ref(settings.targetChange || 10)
const targetChangeUnit = ref(settings.targetChangeUnit || 'ppm')
const doseVolume = ref(settings.doseVolume || 1)
const doseVolumeUnit = ref(settings.doseVolumeUnit || 'milliliters')
const solutionVolume = ref(settings.solutionVolume || 1000)
const solutionVolumeUnit = ref(settings.solutionVolumeUnit || 'milliliters')
const copyButtonText = ref('Copy Recipe')
const jimWelshMode = ref(settings.jimWelshMode || false)

// Use parameter selection composable
const { parameters, getParameterLabel, parameterLabel } = useParameterSelection(selectedParameter, jimWelshMode)

// Display units for recipe section
const displayWeightUnit = ref(settings.displayWeightUnit || 'grams')
const displaySolutionUnit = ref(settings.displaySolutionUnit || 'milliliters')

const selectedChemical = computed(() => {
  if (!selectedParameter.value || !selectedFormId.value) return null
  return getChemicalByForm(selectedParameter.value, selectedFormId.value)
})

const parameterInfo = computed(() => {
  if (!selectedParameter.value) return null
  return getParameterInfo(selectedParameter.value)
})

const calculationResults = computed(() => {
  if (!selectedChemical.value) return null

  // Convert dose volume and solution volume to mL for calculations
  const doseVolumeML = toMilliliters(doseVolume.value, doseVolumeUnit.value)
  const solutionVolumeML = toMilliliters(solutionVolume.value, solutionVolumeUnit.value)

  // Convert target change to base unit (dKH for alkalinity, ppm for others)
  let targetChangeBase = targetChange.value

  if (selectedParameter.value === DOSING_PARAMETERS.ALKALINITY) {
    if (targetChangeUnit.value === 'meq/L') {
      targetChangeBase = targetChange.value * 2.8039 // Convert meq/L to dKH
    }
  } else {
    if (targetChangeUnit.value === 'ppt') {
      targetChangeBase = targetChange.value * 1000 // Convert ppt to ppm
    }
  }

  const errors = validateInputs(
    systemVolume.value,
    targetChangeBase,
    doseVolumeML,
    solutionVolumeML
  )

  if (errors.length > 0) return null

  return calculateCompoundAmount(
    systemVolume.value,
    systemVolumeUnit.value,
    targetChangeBase,
    doseVolumeML,
    selectedChemical.value,
    solutionVolumeML
  )
})

const formattedInstructions = computed(() => {
  if (!calculationResults.value) return []

  // Convert dose volume to mL for instructions
  const doseVolumeML = toMilliliters(doseVolume.value, doseVolumeUnit.value)

  return formatDosingInstructions(
    calculationResults.value,
    doseVolumeML,
    systemVolume.value,
    systemVolumeUnit.value,
    targetChangeUnit.value,
    parameterInfo.value.unit
  )
})

const getChangeStep = () => {
  if (!selectedParameter.value) return 0.1
  if (selectedParameter.value === DOSING_PARAMETERS.PHOSPHATE) return 0.01
  if (selectedParameter.value === DOSING_PARAMETERS.ALKALINITY) return 0.1
  return 1
}

const systemVolumeUnitSingular = computed(() => {
  const unitMap = {
    'gallons': 'gallon',
    'liters': 'liter',
    'milliliters': 'milliliter',
    'ouncesUS': 'ounce',
    'ouncesUK': 'ounce'
  }
  return unitMap[systemVolumeUnit.value] || systemVolumeUnit.value
})

const getAbbreviatedUnit = (unit) => {
  const unitMap = {
    'gallons': 'gal',
    'liters': 'L',
    'milliliters': 'mL',
    'ouncesUS': 'US fl oz',
    'ouncesUK': 'UK fl oz'
  }
  return unitMap[unit] || unit
}

const doseVolumeUnitAbbrev = computed(() => getAbbreviatedUnit(doseVolumeUnit.value))
const solutionVolumeUnitAbbrev = computed(() => getAbbreviatedUnit(solutionVolumeUnit.value))

// Display values with selected units
const displayCompoundNeeded = computed(() => {
  if (!calculationResults.value) return null
  const converted = convertWeight(calculationResults.value.compoundNeeded, displayWeightUnit.value)
  const precision = getWeightPrecision(displayWeightUnit.value)
  return converted.toFixed(precision)
})

const displayCompoundUnit = computed(() => getWeightUnitAbbrev(displayWeightUnit.value))

const displaySolutionNeeded = computed(() => {
  const converted = convertVolume(solutionVolume.value, solutionVolumeUnit.value, displaySolutionUnit.value)
  return converted.toFixed(displaySolutionUnit.value === 'milliliters' ? 0 : 2)
})

const displaySolutionUnitAbbrev = computed(() => getAbbreviatedUnit(displaySolutionUnit.value))

const copyToClipboard = async () => {
  const text = [
    `DIY Dosing Recipe - ${selectedChemical.value.name}`,
    ``,
    ...formattedInstructions.value.map(i => i.replace(/\*\*/g, '')),
    ``,
    `Safety: ${selectedChemical.value.safetyNotes}`,
    `Storage: ${selectedChemical.value.storageNotes}`
  ].join('\n')

  try {
    await navigator.clipboard.writeText(text)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy Recipe'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Save settings to localStorage
const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedParameter: selectedParameter.value,
      selectedBaseCompound: selectedBaseCompound.value,
      selectedFormId: selectedFormId.value,
      systemVolume: systemVolume.value,
      systemVolumeUnit: systemVolumeUnit.value,
      targetChange: targetChange.value,
      targetChangeUnit: targetChangeUnit.value,
      doseVolume: doseVolume.value,
      doseVolumeUnit: doseVolumeUnit.value,
      solutionVolume: solutionVolume.value,
      solutionVolumeUnit: solutionVolumeUnit.value,
      jimWelshMode: jimWelshMode.value,
      displayWeightUnit: displayWeightUnit.value,
      displaySolutionUnit: displaySolutionUnit.value
    }))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// Reset selections when dependencies change
watch(selectedParameter, (newParam) => {
  selectedBaseCompound.value = ''
  selectedFormId.value = ''

  // Set targetChangeUnit to the parameter's base unit
  if (newParam) {
    const paramInfo = getParameterInfo(newParam)
    // Only reset if current unit is invalid for this parameter
    const validUnits = paramInfo.unit === 'dKH'
      ? ['dKH', 'meq/L']
      : ['ppm', 'ppt']
    if (!validUnits.includes(targetChangeUnit.value)) {
      targetChangeUnit.value = paramInfo.unit
    }
  }
})

watch(selectedBaseCompound, () => {
  selectedFormId.value = ''
})

// Watch for changes and save
watch([
  selectedParameter,
  selectedBaseCompound,
  selectedFormId,
  systemVolume,
  systemVolumeUnit,
  targetChange,
  targetChangeUnit,
  doseVolume,
  doseVolumeUnit,
  solutionVolume,
  solutionVolumeUnit,
  jimWelshMode,
  displayWeightUnit,
  displaySolutionUnit
], saveSettings, { deep: true })
</script>

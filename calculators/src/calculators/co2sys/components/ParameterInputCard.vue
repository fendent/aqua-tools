<template>
  <div class="border rounded-lg p-4 bg-gray-50">
    <div class="space-y-4">
      <!-- Parameter Type Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Parameter {{ parameterNumber }}
        </label>
        <select
          :value="parameter"
          @change="$emit('update:parameter', $event.target.value)"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="">Select parameter...</option>
          <option
            v-for="param in availableParameters"
            :key="param.id"
            :value="param.id"
          >
            {{ param.name }} ({{ param.description }})
          </option>
        </select>
      </div>

      <!-- Value and Unit Input -->
      <div v-if="parameter" class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <input
            v-model="localValue"
            type="number"
            :step="getStep(parameter)"
            class="w-full px-3 py-2 border rounded-lg"
            :placeholder="getPlaceholder(parameter)"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown.enter="handleBlur"
          />
        </div>

        <div v-if="parameterMetadata.units.length > 1">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            :value="unit"
            @change="$emit('update:unit', $event.target.value)"
            class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <option
              v-for="u in parameterMetadata.units"
              :key="u"
              :value="u"
            >
              {{ u }}
            </option>
          </select>
        </div>
      </div>

      <!-- Typical Range Info -->
      <div v-if="parameter && parameterMetadata.typical" class="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        <strong>Typical reef range:</strong> {{ formatTypicalRange(parameter) }}
        <span v-if="isOutOfRange" class="text-orange-600 font-medium ml-2">
          ⚠ Outside typical range
        </span>
      </div>

      <!-- Tooltip -->
      <div v-if="parameter && tooltip" class="text-xs text-gray-600 bg-gray-100 p-2 rounded">
        <strong>ℹ️ Info:</strong> {{ tooltip }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PARAMETER_TYPES, getTooltip, validateParameter } from '../../../utils/carbonate/index.js'

const props = defineProps({
  parameter: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  parameterNumber: { type: [String, Number], required: true },
  excludeParameter: { type: String, default: null }
})

const emit = defineEmits(['update:parameter', 'update:value', 'update:unit'])

const localValue = ref(props.value)
const isFocused = ref(false)

// Only sync when not focused (not actively typing)
watch(() => props.value, (newValue) => {
  if (!isFocused.value) {
    localValue.value = newValue
  }
})

// Available parameters (exclude the other parameter)
const availableParameters = computed(() => {
  return Object.values(PARAMETER_TYPES).filter(param =>
    param.id !== props.excludeParameter
  )
})

// Current parameter metadata
const parameterMetadata = computed(() => {
  return PARAMETER_TYPES[props.parameter] || { units: [], typical: null }
})

// Tooltip text
const tooltip = computed(() => {
  if (!props.parameter) return null
  return getTooltip(props.parameter)
})

// Check if value is out of typical range
const isOutOfRange = computed(() => {
  if (!props.parameter || !props.value) return false
  const validation = validateParameter(props.parameter, props.value, props.unit)
  return validation.warning !== null && validation.warning !== undefined
})

// Helper functions
function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
  if (localValue.value !== props.value) {
    emit('update:value', localValue.value || null)
  }
}

function getStep(paramType) {
  const steps = {
    pH: 0.01,
    TA: 0.1,
    DIC: 1,
    pCO2: 1,
    CO3: 1,
    HCO3: 1,
    aqCO2: 0.1
  }
  return steps[paramType] || 0.1
}

function getPlaceholder(paramType) {
  const placeholders = {
    pH: '8.1',
    TA: '8.0',
    DIC: '2000',
    pCO2: '400',
    CO3: '250',
    HCO3: '1750',
    aqCO2: '10'
  }
  return placeholders[paramType] || ''
}

function formatTypicalRange(paramType) {
  const param = PARAMETER_TYPES[paramType]
  if (!param || !param.typical) return ''

  const { min, max, reef } = param.typical
  const unit = param.defaultUnit

  // Convert values to default unit for display
  if (paramType === 'TA' && unit === 'dKH') {
    // Convert from µmol/kg to dKH
    const minDKH = (min * 0.001 / 0.357143).toFixed(1)
    const maxDKH = (max * 0.001 / 0.357143).toFixed(1)
    const reefDKH = (reef * 0.001 / 0.357143).toFixed(1)
    return `${minDKH}-${maxDKH} ${unit} (ideal: ${reefDKH})`
  }

  return `${min}-${max} ${unit} (ideal: ${reef})`
}
</script>

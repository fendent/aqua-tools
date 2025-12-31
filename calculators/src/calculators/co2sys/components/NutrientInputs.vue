<template>
  <div class="space-y-4">
    <!-- Phosphate -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Total Phosphate
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          :value="displayPhosphate"
          @input="handlePhosphateInput"
          type="number"
          :step="getPhosphateStep"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          :value="phosphateUnit"
          @input="$emit('update:phosphateUnit', $event.target.value)"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="umol_kg">µmol/kg</option>
          <option value="ppb">ppb</option>
          <option value="ppm">ppm</option>
        </select>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Optional. Affects minor alkalinity calculations. Typically 0-2 µmol/kg (0-190 ppb) in reef tanks.
      </p>
    </div>

    <!-- Silicate -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Total Silicate
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          :value="displaySilicate"
          @input="handleSilicateInput"
          type="number"
          :step="getSilicateStep"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          :value="silicateUnit"
          @input="$emit('update:silicateUnit', $event.target.value)"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="umol_kg">µmol/kg</option>
          <option value="ppb">ppb</option>
          <option value="ppm">ppm</option>
        </select>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Optional. Affects minor alkalinity calculations. Typically 0-10 µmol/kg (0-600 ppb) in reef tanks.
      </p>
    </div>

    <div class="bg-gray-100 p-3 rounded text-xs text-gray-600">
      <strong>Note:</strong> Nutrient inputs are optional and have minimal effect on carbonate calculations for typical reef conditions. Leave at 0 if unknown.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { convertPhosphate, convertSilicate } from '../../../utils/carbonate/helpers/units.js'

const props = defineProps({
  phosphate: { type: Number, required: true },
  silicate: { type: Number, required: true },
  phosphateUnit: { type: String, required: true },
  silicateUnit: { type: String, required: true }
})

const emit = defineEmits([
  'update:phosphate',
  'update:silicate',
  'update:phosphateUnit',
  'update:silicateUnit'
])

// Display values (converted from base units)
const displayPhosphate = computed(() => {
  return convertPhosphate(props.phosphate, 'umol_kg', props.phosphateUnit)
})

const displaySilicate = computed(() => {
  return convertSilicate(props.silicate, 'umol_kg', props.silicateUnit)
})

// Step sizes for inputs
const getPhosphateStep = computed(() => {
  if (props.phosphateUnit === 'ppm') return 0.0001
  if (props.phosphateUnit === 'ppb') return 0.1
  return 0.01
})

const getSilicateStep = computed(() => {
  if (props.silicateUnit === 'ppm') return 0.001
  if (props.silicateUnit === 'ppb') return 0.1
  return 0.1
})

// Input handlers (convert to base units before emitting)
function handlePhosphateInput(event) {
  const displayValue = parseFloat(event.target.value) || 0
  const baseValue = convertPhosphate(displayValue, props.phosphateUnit, 'umol_kg')
  emit('update:phosphate', baseValue)
}

function handleSilicateInput(event) {
  const displayValue = parseFloat(event.target.value) || 0
  const baseValue = convertSilicate(displayValue, props.silicateUnit, 'umol_kg')
  emit('update:silicate', baseValue)
}
</script>

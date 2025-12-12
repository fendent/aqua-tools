<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <option value="">Select parameter...</option>
    <option
      v-for="param in parameters"
      :key="param.value"
      :value="param.value"
    >
      {{ getLabel(param) }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'
import { DOSING_PARAMETERS } from '../utils/dosingChemicals.js'

const props = defineProps({
  modelValue: { type: String, required: true },
  jimWelshMode: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])

const parameters = [
  { value: DOSING_PARAMETERS.CALCIUM, label: 'Calcium' },
  { value: DOSING_PARAMETERS.ALKALINITY, label: 'Alkalinity' },
  { value: DOSING_PARAMETERS.MAGNESIUM, label: 'Magnesium' },
  { value: DOSING_PARAMETERS.NITRATE, label: 'Nitrate' },
  { value: DOSING_PARAMETERS.PHOSPHATE, label: 'Phosphate' },
  { value: DOSING_PARAMETERS.POTASSIUM, label: 'Potassium' }
]

const getLabel = (param) => {
  if (!props.jimWelshMode) return param.label

  // Pluralize for Jim Welsh Mode
  if (param.label.endsWith('y')) {
    return param.label.slice(0, -1) + 'ies'
  }
  return param.label + 's'
}
</script>

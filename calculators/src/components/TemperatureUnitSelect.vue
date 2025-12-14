<template>
  <select
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="selectClass"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  selectClass: {
    type: String,
    default: 'w-full px-3 py-2 border rounded-lg bg-white'
  },
  labelFormat: {
    type: String,
    default: 'abbrev',
    validator: (value) => ['full', 'abbrev'].includes(value)
  }
})

defineEmits(['update:modelValue'])

const options = computed(() => {
  if (props.labelFormat === 'abbrev') {
    return [
      { value: 'degC', label: '°C' },
      { value: 'degF', label: '°F' }
    ]
  }
  return [
    { value: 'degC', label: 'Celsius (°C)' },
    { value: 'degF', label: 'Fahrenheit (°F)' }
  ]
})
</script>

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
    default: 'w-full px-3 py-2 border rounded-lg'
  },
  includeAuto: {
    type: Boolean,
    default: false
  },
  autoLabel: {
    type: String,
    default: 'Auto'
  },
  labelFormat: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'abbrev', 'short'].includes(value)
  }
})

defineEmits(['update:modelValue'])

const options = computed(() => {
  const volumeUnits = []

  if (props.includeAuto) {
    volumeUnits.push({ value: '', label: props.autoLabel })
  }

  if (props.labelFormat === 'full') {
    volumeUnits.push(
      { value: 'gallons', label: 'Gallons (gal)' },
      { value: 'ouncesUS', label: 'Fluid Ounces (US) (fl oz)' },
      { value: 'ouncesUK', label: 'Fluid Ounces (UK) (fl oz)' },
      { value: 'liters', label: 'Liters (L)' },
      { value: 'milliliters', label: 'Milliliters (mL)' }
    )
  } else if (props.labelFormat === 'short') {
    volumeUnits.push(
      { value: 'gallons', label: 'Gallons' },
      { value: 'ouncesUS', label: 'Fluid Ounces (US)' },
      { value: 'ouncesUK', label: 'Fluid Ounces (UK)' },
      { value: 'liters', label: 'Liters' },
      { value: 'milliliters', label: 'Milliliters' }
    )
  } else {
    volumeUnits.push(
      { value: 'gallons', label: 'gal' },
      { value: 'ouncesUS', label: 'US fl oz' },
      { value: 'ouncesUK', label: 'UK fl oz' },
      { value: 'liters', label: 'L' },
      { value: 'milliliters', label: 'mL' }
    )
  }

  return volumeUnits
})
</script>

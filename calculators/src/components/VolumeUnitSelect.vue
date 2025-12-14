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
    default: 'w-full h-[42px] px-3 py-2 border rounded-lg bg-white'
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

const UNIT_LABELS = {
  full: {
    gallons: 'Gallons (gal)',
    ouncesUS: 'Fluid Ounces (US) (fl oz)',
    ouncesUK: 'Fluid Ounces (UK) (fl oz)',
    liters: 'Liters (L)',
    milliliters: 'Milliliters (mL)'
  },
  short: {
    gallons: 'Gallons',
    ouncesUS: 'Fluid Ounces (US)',
    ouncesUK: 'Fluid Ounces (UK)',
    liters: 'Liters',
    milliliters: 'Milliliters'
  },
  abbrev: {
    gallons: 'gal',
    ouncesUS: 'US fl oz',
    ouncesUK: 'UK fl oz',
    liters: 'L',
    milliliters: 'mL'
  }
}

const UNIT_VALUES = ['gallons', 'ouncesUS', 'ouncesUK', 'liters', 'milliliters']

const options = computed(() => {
  const volumeUnits = []

  if (props.includeAuto) {
    volumeUnits.push({ value: '', label: props.autoLabel })
  }

  const labels = UNIT_LABELS[props.labelFormat]
  UNIT_VALUES.forEach(unitValue => {
    volumeUnits.push({
      value: unitValue,
      label: labels[unitValue]
    })
  })

  return volumeUnits
})
</script>

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
    validator: (value) => ['full', 'abbrev'].includes(value)
  }
})

defineEmits(['update:modelValue'])

const options = computed(() => {
  const timeUnits = []

  if (props.includeAuto) {
    timeUnits.push({ value: '', label: props.autoLabel })
  }

  if (props.labelFormat === 'full') {
    timeUnits.push(
      { value: 'hours', label: 'Hours' },
      { value: 'days', label: 'Days' },
      { value: 'weeks', label: 'Weeks' }
    )
  } else {
    timeUnits.push(
      { value: 'hours', label: 'hr' },
      { value: 'days', label: 'days' },
      { value: 'weeks', label: 'wks' }
    )
  }

  return timeUnits
})
</script>

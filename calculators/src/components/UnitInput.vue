<template>
  <div class="grid" :class="gridClass">
    <div :class="inputColClass">
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
      <input
        v-model.number="internalValue"
        type="number"
        class="w-full px-3 py-2 border rounded-lg"
        :min="min"
        :step="step"
        :max="max"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleBlur"
      />
      <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
    </div>
    <div v-if="showUnitSelect" :class="unitColClass">
      <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
      <component
        :is="unitComponent"
        :model-value="unit"
        @update:model-value="$emit('update:unit', $event)"
        :label-format="unitLabelFormat"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import VolumeUnitSelect from './VolumeUnitSelect.vue'
import WeightUnitSelect from './WeightUnitSelect.vue'
import TimeUnitSelect from './TimeUnitSelect.vue'
import TemperatureUnitSelect from './TemperatureUnitSelect.vue'
import SalinityUnitSelect from './SalinityUnitSelect.vue'
import AlkalinityUnitSelect from './AlkalinityUnitSelect.vue'
import CalciumUnitSelect from './CalciumUnitSelect.vue'
import PHScaleSelect from './PHScaleSelect.vue'
import PCO2UnitSelect from './PCO2UnitSelect.vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  unit: { type: String, required: true },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  min: { type: [Number, String], default: undefined },
  max: { type: [Number, String], default: undefined },
  step: { type: [Number, String], default: 0.1 },
  showUnitSelect: { type: Boolean, default: true },
  unitType: {
    type: String,
    default: 'volume',
    validator: (value) =>
      ['volume', 'weight', 'time', 'temperature', 'salinity', 'alkalinity', 'calcium', 'phScale', 'pco2'].includes(value)
  },
  gridClass: { type: String, default: 'md:grid-cols-3 gap-4 items-end' },
  inputColClass: { type: String, default: 'md:col-span-2' },
  unitColClass: { type: String, default: '' },
  unitLabelFormat: { type: String, default: 'full' },
  focused: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'update:unit', 'update:focused', 'focus', 'blur'])

// Internal value for v-model
const internalValue = ref(props.modelValue)

// Sync internal value from prop when not focused
watch(() => props.modelValue, (newValue) => {
  if (!props.focused) {
    internalValue.value = newValue
  }
})

// Sync internal value to prop when it changes
watch(internalValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
})

// Unit component mapping
const unitComponentMap = {
  volume: VolumeUnitSelect,
  weight: WeightUnitSelect,
  time: TimeUnitSelect,
  temperature: TemperatureUnitSelect,
  salinity: SalinityUnitSelect,
  alkalinity: AlkalinityUnitSelect,
  calcium: CalciumUnitSelect,
  phScale: PHScaleSelect,
  pco2: PCO2UnitSelect
}

const unitComponent = computed(() => unitComponentMap[props.unitType])

function handleFocus() {
  emit('update:focused', true)
  emit('focus')
}

function handleBlur() {
  emit('update:focused', false)
  emit('blur')
}
</script>

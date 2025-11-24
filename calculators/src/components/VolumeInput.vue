<template>
  <div class="grid" :class="gridClass">
    <div :class="inputColClass">
      <label class="block text-sm font-medium mb-2">{{ label }}</label>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', parseFloat($event.target.value))"
        type="number"
        class="w-full px-3 py-2 border rounded-lg"
        :min="min"
        :step="step"
        :max="max"
      />
      <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
    </div>
    <div v-if="showUnitSelect">
      <label class="block text-sm font-medium mb-2">&nbsp;</label>
      <component
        :is="unitSelectComponent"
        :model-value="unit"
        @update:model-value="$emit('update:unit', $event)"
        v-bind="unitSelectProps"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VolumeUnitSelect from './VolumeUnitSelect.vue'
import TimeUnitSelect from './TimeUnitSelect.vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  unit: { type: String, default: '' },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: undefined },
  step: { type: [Number, String], default: 0.1 },
  showUnitSelect: { type: Boolean, default: true },
  unitType: { type: String, default: 'volume' },
  gridClass: { type: String, default: 'grid-cols-[2fr_1fr] gap-2' },
  inputColClass: { type: String, default: '' },
  unitSelectProps: { type: Object, default: () => ({}) }
})

defineEmits(['update:modelValue', 'update:unit'])

const unitSelectComponent = computed(() =>
  props.unitType === 'time' ? TimeUnitSelect : VolumeUnitSelect
)
</script>

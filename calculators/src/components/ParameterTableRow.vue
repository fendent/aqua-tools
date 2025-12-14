<template>
  <tr class="even:bg-gray-50 hover:bg-gray-100">
    <td class="px-4 py-2">{{ label }}</td>
    <td class="px-4 py-2 text-right font-mono">{{ beforeValue }}</td>
    <td class="px-4 py-2 text-right font-mono">
      <span :class="valueColorClass" class="inline-flex items-center gap-1">
        <component
          :is="arrowIcon"
          class="w-4 h-4"
          v-if="arrowIcon"
        />
        {{ afterValue }}
      </span>
    </td>
    <td class="px-4 py-2" :class="unitOptions || unitSelectorType ? '' : 'text-center text-gray-500'">
      <component
        v-if="unitSelectorType"
        :is="unitSelectorComponent"
        :model-value="unit"
        @update:model-value="$emit('update:unit', $event)"
        select-class="w-full px-2 py-1 text-xs border rounded bg-white"
        label-format="abbrev"
      />
      <select
        v-else-if="unitOptions"
        :value="unit"
        @change="$emit('update:unit', $event.target.value)"
        class="w-full px-2 py-1 text-xs border rounded bg-white"
      >
        <option
          v-for="option in unitOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span v-else>{{ unit }}</span>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import AlkalinityUnitSelect from './AlkalinityUnitSelect.vue'
import CalciumUnitSelect from './CalciumUnitSelect.vue'
import PHScaleSelect from './PHScaleSelect.vue'
import PCO2UnitSelect from './PCO2UnitSelect.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  beforeValue: {
    type: [String, Number],
    required: true
  },
  afterValue: {
    type: [String, Number],
    required: true
  },
  unit: {
    type: String,
    default: '—'
  },
  unitOptions: {
    type: Array,
    default: null
  },
  unitSelectorType: {
    type: String,
    default: null,
    validator: (value) => !value || ['alkalinity', 'calcium', 'phScale', 'pco2'].includes(value)
  }
})

const unitSelectorComponent = computed(() => {
  const map = {
    alkalinity: AlkalinityUnitSelect,
    calcium: CalciumUnitSelect,
    phScale: PHScaleSelect,
    pco2: PCO2UnitSelect
  }
  return map[props.unitSelectorType]
})

defineEmits(['update:unit'])

const numericBefore = computed(() => {
  return typeof props.beforeValue === 'number' ? props.beforeValue : parseFloat(props.beforeValue)
})

const numericAfter = computed(() => {
  return typeof props.afterValue === 'number' ? props.afterValue : parseFloat(props.afterValue)
})

const isIncrease = computed(() => {
  return numericAfter.value > numericBefore.value
})

const valueColorClass = computed(() => {
  if (isNaN(numericBefore.value) || isNaN(numericAfter.value)) {
    return 'text-gray-700'
  }

  if (numericAfter.value === numericBefore.value) {
    return 'text-gray-700'
  }

  // Consistent color scheme: green for up, blue for down
  return isIncrease.value ? 'text-green-600' : 'text-blue-600'
})

const arrowIcon = computed(() => {
  if (isNaN(numericBefore.value) || isNaN(numericAfter.value)) {
    return null
  }

  if (numericAfter.value === numericBefore.value) {
    return null
  }

  return isIncrease.value ? ArrowUpIcon : ArrowDownIcon
})
</script>

<template>
  <div class="space-y-4">
    <!-- Base Compound Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ compoundLabel }}
      </label>
      <select
        :value="baseCompound"
        @change="$emit('update:base-compound', $event.target.value)"
        class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        :disabled="!parameter || disabled"
      >
        <option value="">{{ parameter ? 'Select compound...' : 'Select parameter first' }}</option>
        <option
          v-for="compound in baseCompounds"
          :key="compound.id"
          :value="compound.id"
        >
          {{ compound.name }}
        </option>
      </select>
    </div>

    <!-- Form Selection -->
    <div v-if="baseCompound && availableForms.length > 0">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Form
      </label>
      <select
        :value="form"
        @change="$emit('update:form', $event.target.value)"
        class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        :disabled="disabled"
      >
        <option value="">Select form...</option>
        <option
          v-for="formOption in availableForms"
          :key="formOption.id"
          :value="formOption.id"
        >
          {{ formOption.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { getBaseCompounds, getFormsForCompound } from '../utils/dosingChemicals.js'

const props = defineProps({
  parameter: { type: String, required: true },
  baseCompound: { type: String, required: true },
  form: { type: String, required: true },
  compoundLabel: { type: String, default: 'Compound' },
  disabled: { type: Boolean, default: false },
  autoSelectCompound: { type: Boolean, default: false }
})

const emit = defineEmits(['update:base-compound', 'update:form'])

const baseCompounds = computed(() => {
  if (!props.parameter) return []
  return getBaseCompounds(props.parameter)
})

const availableForms = computed(() => {
  if (!props.parameter || !props.baseCompound) return []
  return getFormsForCompound(props.parameter, props.baseCompound)
})

// Auto-select base compound if only one available (when enabled)
watch(baseCompounds, (compounds) => {
  if (props.autoSelectCompound && compounds.length === 1 && !props.baseCompound) {
    emit('update:base-compound', compounds[0].id)
  }
})

// Auto-select form if only one available
watch(availableForms, (forms) => {
  if (forms.length === 1 && !props.form) {
    emit('update:form', forms[0].id)
  }
})
</script>

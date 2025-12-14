<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
    >
      <optgroup v-if="validFormulations.length > 0" label="Valid Ranges">
        <option
          v-for="code in validFormulations"
          :key="code"
          :value="code"
        >
          {{ formulations[code].name }}
        </option>
      </optgroup>
      <optgroup v-if="invalidFormulations.length > 0" label="Invalid Ranges">
        <option
          v-for="code in invalidFormulations"
          :key="code"
          :value="code"
        >
          {{ formulations[code].name }}
        </option>
      </optgroup>
    </select>
    <div
      class="mt-2 text-xs p-2 rounded"
      :class="getStatusClass(formulationStatus[modelValue]?.overall)"
    >
      <p class="font-medium">{{ formulations[modelValue].description }}</p>
      <div class="mt-1">
        <template v-if="formatValidRange(formulations[modelValue].validRange).type === 'simple'">
          <p>{{ formatValidRange(formulations[modelValue].validRange).text }}</p>
        </template>
        <template v-else>
          <p class="font-medium">Valid range:</p>
          <ul class="list-disc list-inside ml-2">
            <li v-for="part in formatValidRange(formulations[modelValue].validRange).parts" :key="part">
              {{ part }}
            </li>
          </ul>
        </template>
      </div>
      <p
        v-if="formulationStatus[modelValue]?.overall !== 'optimal'"
        class="mt-1 font-medium"
      >
        ⚠ Your conditions are {{ formulationStatus[modelValue]?.overall === 'acceptable' ? 'slightly' : 'significantly' }} outside the valid range
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  formulations: {
    type: Object,
    required: true
  },
  formulationStatus: {
    type: Object,
    required: true
  }
})

defineEmits(['update:modelValue'])

const validFormulations = computed(() => {
  return Object.keys(props.formulations)
    .filter(code => props.formulationStatus[code]?.overall !== 'outside')
    .sort(sortByYearThenAlpha)
})

const invalidFormulations = computed(() => {
  return Object.keys(props.formulations)
    .filter(code => props.formulationStatus[code]?.overall === 'outside')
    .sort(sortByYearThenAlpha)
})

function extractYear(code) {
  // Extract year from formulation code
  // Examples: RRV93 -> 1993, LDK00 -> 2000, M79 -> 1979, SB21 -> 2021, D90a -> 1990
  const match = code.match(/(\d{2})(?:_|[a-z]|$)/i)
  if (match) {
    const twoDigitYear = parseInt(match[1])
    // Convert 2-digit year to 4-digit (assumes 1900s for >= 50, 2000s for < 50)
    return twoDigitYear >= 50 ? 1900 + twoDigitYear : 2000 + twoDigitYear
  }
  return 0 // Unknown year goes to end
}

function sortByYearThenAlpha(a, b) {
  const yearA = extractYear(a)
  const yearB = extractYear(b)

  // Primary sort: by year (newest first)
  if (yearA !== yearB) {
    return yearB - yearA
  }

  // Secondary sort: alphabetically by name
  return props.formulations[a].name.localeCompare(props.formulations[b].name)
}

function formatValidRange(rangeStr) {
  if (rangeStr === 'All salinities') {
    return { type: 'simple', text: 'All salinities' }
  }

  // Parse the range string like "S: 0-45, T: 0-45°C"
  const sMatch = rangeStr.match(/S:\s*(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/)
  const tMatch = rangeStr.match(/T:\s*(-?\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/)

  const parts = []
  if (sMatch) {
    parts.push(`Salinity: ${sMatch[1]}-${sMatch[2]} PSU`)
  }
  if (tMatch) {
    parts.push(`Temperature: ${tMatch[1]}-${tMatch[2]}°C`)
  }

  return { type: 'list', parts }
}

function getStatusClass(status) {
  switch (status) {
    case 'optimal':
      return 'bg-green-50 text-green-800'
    case 'acceptable':
      return 'bg-yellow-50 text-yellow-800'
    case 'outside':
      return 'bg-red-50 text-red-800'
    default:
      return 'bg-gray-50 text-gray-800'
  }
}
</script>

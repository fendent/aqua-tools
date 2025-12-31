<template>
  <div class="space-y-4">
    <!-- Temperature -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Temperature
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model="localTemperature"
          type="number"
          step="0.1"
          class="w-full px-3 py-2 border rounded-lg"
          @focus="temperatureFocused = true"
          @blur="handleTemperatureBlur"
          @keydown.enter="handleTemperatureBlur"
        />
        <TemperatureUnitSelect
          :model-value="tempUnit"
          @update:model-value="$emit('update:tempUnit', $event)"
          select-class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Typical reef: 24-26°C (75-79°F). Affects all equilibrium constants.
      </p>
    </div>

    <!-- Salinity -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Salinity
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model="localSalinity"
          type="number"
          :step="salinityUnit === 'SG' ? 0.001 : 0.1"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
          @focus="salinityFocused = true"
          @blur="handleSalinityBlur"
          @keydown.enter="handleSalinityBlur"
        />
        <SalinityUnitSelect
          :model-value="salinityUnit"
          @update:model-value="$emit('update:salinityUnit', $event)"
          select-class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Typical seawater: 35 PSU / 1.0257 SG. Reef tanks: 33-36 PSU.
      </p>
    </div>

    <!-- Pressure -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Pressure
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model="localPressure"
          type="number"
          step="0.1"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
          @focus="handlePressureFocus"
          @blur="handlePressureBlur"
          @keydown.enter="handlePressureBlur"
        />
        <PressureUnitSelect
          :model-value="pressureUnit"
          @update:model-value="$emit('update:pressureUnit', $event)"
          select-class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Surface = 1 atm. Increases ~1 bar per 10m depth. Use 1 atm for aquariums at sea level.
      </p>
    </div>

    <!-- Calcium (optional) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Calcium - Optional
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model="localCalcium"
          type="number"
          step="0.1"
          min="0"
          :placeholder="calciumPlaceholder"
          class="w-full px-3 py-2 border rounded-lg"
          @focus="calciumFocused = true"
          @blur="handleCalciumBlur"
          @keydown.enter="handleCalciumBlur"
        />
        <CalciumUnitSelect
          :model-value="calciumUnit"
          @update:model-value="$emit('update:calciumUnit', $event)"
          select-class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Leave empty for automatic calculation. Typical reef: 10-11 mmol/kg (400-450 ppm).
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { convertTemperature, convertCalcium, convertPressure, convertSalinity } from '../../../utils/carbonate/helpers/units.js'
import TemperatureUnitSelect from '../../../components/TemperatureUnitSelect.vue'
import SalinityUnitSelect from '../../../components/SalinityUnitSelect.vue'
import PressureUnitSelect from '../../../components/PressureUnitSelect.vue'
import CalciumUnitSelect from '../../../components/CalciumUnitSelect.vue'

const props = defineProps({
  temperature: { type: Number, required: true },
  salinity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  calcium: { type: Number, default: null },
  tempUnit: { type: String, required: true },
  salinityUnit: { type: String, required: true },
  pressureUnit: { type: String, required: true },
  calciumUnit: { type: String, required: true },
  autoCalculatedCalcium: { type: Number, required: true }
})

const emit = defineEmits([
  'update:temperature',
  'update:salinity',
  'update:pressure',
  'update:calcium',
  'update:tempUnit',
  'update:salinityUnit',
  'update:pressureUnit',
  'update:calciumUnit'
])

// Local values for editing (prevents re-calculation while typing)
const localTemperature = ref(convertTemperature(props.temperature, 'degC', props.tempUnit))
const localSalinity = ref(convertSalinity(props.salinity, 'PSU', props.salinityUnit))
const localPressure = ref(convertPressure(props.pressure, 'bar', props.pressureUnit))
const localCalcium = ref(props.calcium === null ? '' : convertCalcium(props.calcium, 'mmol_kg', props.calciumUnit))

// Track original user input to avoid precision loss on round-trip conversions
const originalPressureValue = ref(null)
const originalPressureUnit = ref(null)

// Focus tracking
const temperatureFocused = ref(false)
const salinityFocused = ref(false)
const pressureFocused = ref(false)
const calciumFocused = ref(false)

// Calcium placeholder with auto-calculated value
const calciumPlaceholder = computed(() => {
  let formattedValue
  if (props.calciumUnit === 'ppm') {
    formattedValue = Math.round(props.autoCalculatedCalcium).toString()
  } else if (props.calciumUnit === 'ppt') {
    formattedValue = props.autoCalculatedCalcium.toFixed(2)
  } else if (props.calciumUnit === 'mmol_kg') {
    formattedValue = props.autoCalculatedCalcium.toFixed(1)
  } else {
    formattedValue = props.autoCalculatedCalcium.toFixed(1)
  }
  return `${formattedValue} (Auto-Calculated)`
})

// Sync local values from props when not focused
watch(() => props.temperature, (newValue) => {
  if (!temperatureFocused.value) {
    localTemperature.value = convertTemperature(newValue, 'degC', props.tempUnit)
  }
})

watch(() => props.salinity, (newValue) => {
  if (!salinityFocused.value) {
    localSalinity.value = convertSalinity(newValue, 'PSU', props.salinityUnit)
  }
})

watch(() => props.pressure, (newValue) => {
  if (!pressureFocused.value) {
    // If displaying in the original unit the user typed, use the original value
    if (originalPressureUnit.value === props.pressureUnit && originalPressureValue.value !== null) {
      localPressure.value = originalPressureValue.value
    } else {
      localPressure.value = convertPressure(newValue, 'bar', props.pressureUnit)
    }
  }
})

watch(() => props.calcium, (newValue) => {
  if (!calciumFocused.value) {
    localCalcium.value = newValue === null ? '' : convertCalcium(newValue, 'mmol_kg', props.calciumUnit)
  }
})

// Update local values when units change
watch(() => props.tempUnit, () => {
  if (!temperatureFocused.value) {
    localTemperature.value = convertTemperature(props.temperature, 'degC', props.tempUnit)
  }
})

watch(() => props.salinityUnit, () => {
  if (!salinityFocused.value) {
    localSalinity.value = convertSalinity(props.salinity, 'PSU', props.salinityUnit)
  }
})

watch(() => props.pressureUnit, (newUnit) => {
  if (!pressureFocused.value) {
    // If switching back to the original unit the user typed, use the original value
    if (originalPressureUnit.value === newUnit && originalPressureValue.value !== null) {
      localPressure.value = originalPressureValue.value
    } else {
      localPressure.value = convertPressure(props.pressure, 'bar', newUnit)
    }
  }
})

watch(() => props.calciumUnit, () => {
  if (!calciumFocused.value) {
    localCalcium.value = props.calcium === null ? '' : convertCalcium(props.calcium, 'mmol_kg', props.calciumUnit)
  }
})

// Blur handlers (convert to base units before emitting)
function handleTemperatureBlur() {
  temperatureFocused.value = false
  const baseValue = convertTemperature(parseFloat(localTemperature.value), props.tempUnit, 'degC')
  emit('update:temperature', baseValue)
}

function handleSalinityBlur() {
  salinityFocused.value = false
  const baseValue = convertSalinity(parseFloat(localSalinity.value), props.salinityUnit, 'PSU')
  emit('update:salinity', baseValue)
}

function handlePressureFocus() {
  pressureFocused.value = true
}

function handlePressureBlur() {
  pressureFocused.value = false
  // Store the user's input as the original to avoid precision loss
  originalPressureValue.value = parseFloat(localPressure.value)
  originalPressureUnit.value = props.pressureUnit
  const baseValue = convertPressure(originalPressureValue.value, props.pressureUnit, 'bar')
  emit('update:pressure', baseValue)
}

function handleCalciumBlur() {
  calciumFocused.value = false
  if (localCalcium.value === '') {
    emit('update:calcium', null)
  } else {
    const baseValue = convertCalcium(parseFloat(localCalcium.value), props.calciumUnit, 'mmol_kg')
    emit('update:calcium', baseValue)
  }
}
</script>

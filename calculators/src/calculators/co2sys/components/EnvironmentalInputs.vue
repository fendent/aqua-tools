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
          v-model="tempUnit"
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
          v-model="salinityUnit"
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
          v-model="pressureUnit"
          select-class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Surface = 0. Increases ~1 bar per 10m depth. Usually 0 for aquariums.
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
          placeholder="Auto-calculated from salinity"
          class="w-full px-3 py-2 border rounded-lg"
          @focus="calciumFocused = true"
          @blur="handleCalciumBlur"
          @keydown.enter="handleCalciumBlur"
        />
        <CalciumUnitSelect
          v-model="calciumUnit"
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
import { ref, watch } from 'vue'
import { convertTemperature, convertCalcium, convertPressure, convertSalinity } from '../../../utils/carbonate/helpers/units.js'
import TemperatureUnitSelect from '../../../components/TemperatureUnitSelect.vue'
import SalinityUnitSelect from '../../../components/SalinityUnitSelect.vue'
import PressureUnitSelect from '../../../components/PressureUnitSelect.vue'
import CalciumUnitSelect from '../../../components/CalciumUnitSelect.vue'

const props = defineProps({
  temperature: { type: Number, required: true },
  salinity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  calcium: { type: Number, default: null }
})

const emit = defineEmits(['update:temperature', 'update:salinity', 'update:pressure', 'update:calcium'])

// Unit states with localStorage persistence
const tempUnit = ref(localStorage.getItem('co2sys-tempUnit') || '°C')
const salinityUnit = ref(localStorage.getItem('co2sys-salinityUnit') || 'PSU')
const pressureUnit = ref(localStorage.getItem('co2sys-pressureUnit') || 'bar')
const calciumUnit = ref(localStorage.getItem('co2sys-calciumUnit') || 'mmol/kg')

// Save unit preferences to localStorage
watch(tempUnit, (newValue) => localStorage.setItem('co2sys-tempUnit', newValue))
watch(salinityUnit, (newValue) => localStorage.setItem('co2sys-salinityUnit', newValue))
watch(pressureUnit, (newValue) => localStorage.setItem('co2sys-pressureUnit', newValue))
watch(calciumUnit, (newValue) => localStorage.setItem('co2sys-calciumUnit', newValue))

// Local values for editing (prevents re-calculation while typing)
const localTemperature = ref(convertTemperature(props.temperature, '°C', tempUnit.value))
const localSalinity = ref(convertSalinity(props.salinity, 'PSU', salinityUnit.value))
const localPressure = ref(convertPressure(props.pressure, 'bar', pressureUnit.value))
const localCalcium = ref(props.calcium === null ? '' : convertCalcium(props.calcium, 'mmol/kg', calciumUnit.value))

// Track original user input to avoid precision loss on round-trip conversions
const originalPressureValue = ref(null)
const originalPressureUnit = ref(null)

// Focus tracking
const temperatureFocused = ref(false)
const salinityFocused = ref(false)
const pressureFocused = ref(false)
const calciumFocused = ref(false)

// Sync local values from props when not focused
watch(() => props.temperature, (newValue) => {
  if (!temperatureFocused.value) {
    localTemperature.value = convertTemperature(newValue, '°C', tempUnit.value)
  }
})

watch(() => props.salinity, (newValue) => {
  if (!salinityFocused.value) {
    localSalinity.value = convertSalinity(newValue, 'PSU', salinityUnit.value)
  }
})

watch(() => props.pressure, (newValue) => {
  if (!pressureFocused.value) {
    // If displaying in the original unit the user typed, use the original value
    if (originalPressureUnit.value === pressureUnit.value && originalPressureValue.value !== null) {
      localPressure.value = originalPressureValue.value
    } else {
      localPressure.value = convertPressure(newValue, 'bar', pressureUnit.value)
    }
  }
})

watch(() => props.calcium, (newValue) => {
  if (!calciumFocused.value) {
    localCalcium.value = newValue === null ? '' : convertCalcium(newValue, 'mmol/kg', calciumUnit.value)
  }
})

// Update local values when units change
watch(tempUnit, () => {
  if (!temperatureFocused.value) {
    localTemperature.value = convertTemperature(props.temperature, '°C', tempUnit.value)
  }
})

watch(salinityUnit, () => {
  if (!salinityFocused.value) {
    localSalinity.value = convertSalinity(props.salinity, 'PSU', salinityUnit.value)
  }
})

watch(pressureUnit, (newUnit) => {
  if (!pressureFocused.value) {
    // If switching back to the original unit the user typed, use the original value
    if (originalPressureUnit.value === newUnit && originalPressureValue.value !== null) {
      localPressure.value = originalPressureValue.value
    } else {
      localPressure.value = convertPressure(props.pressure, 'bar', newUnit)
    }
  }
})

watch(calciumUnit, () => {
  if (!calciumFocused.value) {
    localCalcium.value = props.calcium === null ? '' : convertCalcium(props.calcium, 'mmol/kg', calciumUnit.value)
  }
})

// Blur handlers (convert to base units before emitting)
function handleTemperatureBlur() {
  temperatureFocused.value = false
  const baseValue = convertTemperature(parseFloat(localTemperature.value), tempUnit.value, '°C')
  emit('update:temperature', baseValue)
}

function handleSalinityBlur() {
  salinityFocused.value = false
  const baseValue = convertSalinity(parseFloat(localSalinity.value), salinityUnit.value, 'PSU')
  emit('update:salinity', baseValue)
}

function handlePressureFocus() {
  pressureFocused.value = true
}

function handlePressureBlur() {
  pressureFocused.value = false
  // Store the user's input as the original to avoid precision loss
  originalPressureValue.value = parseFloat(localPressure.value)
  originalPressureUnit.value = pressureUnit.value
  const baseValue = convertPressure(originalPressureValue.value, pressureUnit.value, 'bar')
  emit('update:pressure', baseValue)
}

function handleCalciumBlur() {
  calciumFocused.value = false
  if (localCalcium.value === '') {
    emit('update:calcium', null)
  } else {
    const baseValue = convertCalcium(parseFloat(localCalcium.value), calciumUnit.value, 'mmol/kg')
    emit('update:calcium', baseValue)
  }
}
</script>

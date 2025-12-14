<template>
  <div class="space-y-4">
    <!-- Temperature -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Temperature
      </label>
      <div class="grid grid-cols-2 gap-2">
        <input
          :value="displayTemperature"
          @input="handleTemperatureInput"
          type="number"
          step="0.1"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          v-model="tempUnit"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="°C">°C</option>
          <option value="°F">°F</option>
        </select>
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
          :value="displaySalinity"
          @input="handleSalinityInput"
          type="number"
          :step="salinityUnit === 'SG' ? 0.001 : 0.1"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          v-model="salinityUnit"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="PSU">PSU</option>
          <option value="ppt">ppt</option>
          <option value="SG">SG</option>
        </select>
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
          :value="displayPressure"
          @input="handlePressureInput"
          type="number"
          step="0.1"
          min="0"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          v-model="pressureUnit"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="bar">bar</option>
          <option value="atm">atm</option>
          <option value="dbar">dbar</option>
        </select>
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
          :value="displayCalcium"
          @input="handleCalciumInput"
          type="number"
          step="0.1"
          min="0"
          placeholder="Auto-calculated from salinity"
          class="w-full px-3 py-2 border rounded-lg"
        />
        <select
          v-model="calciumUnit"
          class="w-full px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <option value="mmol/kg">mmol/kg</option>
          <option value="ppm">ppm</option>
        </select>
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

// Display values (converted from base units)
const displayTemperature = computed(() => {
  return convertTemperature(props.temperature, '°C', tempUnit.value)
})

const displaySalinity = computed(() => {
  return convertSalinity(props.salinity, 'PSU', salinityUnit.value)
})

const displayPressure = computed(() => {
  return convertPressure(props.pressure, 'bar', pressureUnit.value)
})

const displayCalcium = computed(() => {
  if (props.calcium === null) return ''
  return convertCalcium(props.calcium, 'mmol/kg', calciumUnit.value)
})

// Input handlers (convert to base units before emitting)
function handleTemperatureInput(event) {
  const displayValue = parseFloat(event.target.value)
  const baseValue = convertTemperature(displayValue, tempUnit.value, '°C')
  emit('update:temperature', baseValue)
}

function handleSalinityInput(event) {
  const displayValue = parseFloat(event.target.value)
  const baseValue = convertSalinity(displayValue, salinityUnit.value, 'PSU')
  emit('update:salinity', baseValue)
}

function handlePressureInput(event) {
  const displayValue = parseFloat(event.target.value)
  const baseValue = convertPressure(displayValue, pressureUnit.value, 'bar')
  emit('update:pressure', baseValue)
}

function handleCalciumInput(event) {
  const value = event.target.value
  if (value === '') {
    emit('update:calcium', null)
  } else {
    const displayValue = parseFloat(value)
    const baseValue = convertCalcium(displayValue, calciumUnit.value, 'mmol/kg')
    emit('update:calcium', baseValue)
  }
}
</script>

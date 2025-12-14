<template>
  <div class="relative pt-16 px-3">
    <!-- Value indicator (arrow above bar) -->
    <div
      class="absolute top-0 transition-all duration-300 flex flex-col items-center z-10"
      :style="arrowPosition"
    >
      <!-- Value label -->
      <div class="text-2xl font-bold text-gray-800 whitespace-nowrap">
        {{ omega.toFixed(2) }}
      </div>
      <!-- Arrow pointing down at the value -->
      <ArrowDownIcon v-if="!isOffScale" class="w-6 h-6 text-gray-800" />
      <!-- Off-scale indicator (right arrow) -->
      <ArrowRightIcon v-else class="w-6 h-6 text-gray-600" />
    </div>

    <!-- Gauge bar -->
    <div class="w-full h-8 bg-gray-200 rounded-lg overflow-hidden relative">
      <!-- Color zones -->
      <div class="absolute inset-0 flex">
        <div class="bg-red-500" :style="{ width: criticalZone + '%' }"></div>
        <div class="bg-orange-400" :style="{ width: lowZone + '%' }"></div>
        <div class="bg-blue-400" :style="{ width: fairZone + '%' }"></div>
        <div class="bg-green-500" :style="{ width: excellentZone + '%' }"></div>
      </div>
    </div>

    <!-- Scale markers -->
    <div class="flex justify-between text-xs text-gray-600 mt-1">
      <span>0</span>
      <span>{{ thresholds.critical }}</span>
      <span>{{ thresholds.low }}</span>
      <span>{{ thresholds.ideal }}</span>
      <span>{{ maxValue }}</span>
    </div>

    <!-- Zone labels -->
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span class="text-red-600">Critical</span>
      <span class="text-orange-500">Low</span>
      <span class="text-blue-500">Fair</span>
      <span class="text-green-600">Excellent</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  omega: { type: Number, required: true },
  mineral: { type: String, default: 'aragonite' }
})

const thresholds = computed(() => {
  if (props.mineral === 'aragonite') {
    return { critical: 3.0, low: 3.5, ideal: 4.0 }
  } else {
    return { critical: 4.5, low: 5.0, ideal: 6.0 }
  }
})

const maxValue = computed(() => {
  return props.mineral === 'aragonite' ? 10 : 14
})

// Calculate zone widths as percentages
const criticalZone = computed(() => {
  return (thresholds.value.critical / maxValue.value) * 100
})

const lowZone = computed(() => {
  return ((thresholds.value.low - thresholds.value.critical) / maxValue.value) * 100
})

const fairZone = computed(() => {
  return ((thresholds.value.ideal - thresholds.value.low) / maxValue.value) * 100
})

const excellentZone = computed(() => {
  return ((maxValue.value - thresholds.value.ideal) / maxValue.value) * 100
})

// Check if value is off scale
const isOffScale = computed(() => {
  return props.omega > maxValue.value
})

// Calculate arrow position
const arrowPosition = computed(() => {
  if (isOffScale.value) {
    // Position at the right edge for off-scale values
    return {
      left: '100%',
      transform: 'translateX(-100%)'
    }
  } else {
    // Position proportionally within the bar, centered on the value
    let percentage = (props.omega / maxValue.value) * 100

    // Clamp percentage to prevent overflow
    // At 0-5%, shift right to prevent left overflow
    // At 95-100%, shift left to prevent right overflow
    if (percentage < 5) {
      return {
        left: `${percentage}%`,
        transform: 'translateX(0)' // Align to the left edge of indicator
      }
    } else if (percentage > 95) {
      return {
        left: `${percentage}%`,
        transform: 'translateX(-100%)' // Align to the right edge of indicator
      }
    } else {
      return {
        left: `${percentage}%`,
        transform: 'translateX(-50%)' // Center the indicator on the arrow tip
      }
    }
  }
})
</script>

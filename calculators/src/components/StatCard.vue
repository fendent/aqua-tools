<template>
  <div class="rounded-lg border bg-opacity-50" :class="cardClasses">
    <div class="p-4 pt-6">
      <div class="text-sm text-gray-600">{{ label }}</div>
      <div class="text-2xl font-bold" :class="valueClasses">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  color: { type: String, required: true }
})

const cardClasses = computed(() => ({
  'border-blue-200 bg-blue-50': props.color === 'blue',
  'border-green-200 bg-green-50': props.color === 'green',
  'border-purple-200 bg-purple-50': props.color === 'purple',
  'border-orange-200 bg-orange-50': props.color === 'orange',
  'border-cyan-200 bg-cyan-50': props.color === 'cyan',
  'border-red-200 bg-red-50': props.color === 'red'
}))

const valueClasses = computed(() => ({
  'text-blue-700': props.color === 'blue',
  'text-green-700': props.color === 'green',
  'text-purple-700': props.color === 'purple',
  'text-orange-700': props.color === 'orange',
  'text-cyan-700': props.color === 'cyan',
  'text-red-700': props.color === 'red'
}))
</script>

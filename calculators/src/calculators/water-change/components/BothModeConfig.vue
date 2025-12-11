<template>
  <div class="space-y-4">
    <!-- Continuous Section -->
    <div class="space-y-2">
      <slot name="continuous-input" />
      <VolumeInput
        :model-value="continuousTime"
        @update:model-value="$emit('update:continuousTime', $event)"
        :unit="continuousTimeUnit"
        @update:unit="$emit('update:continuousTimeUnit', $event)"
        label="Over"
        unit-type="time"
        min="0.1"
        step="0.1"
      />
    </div>

    <!-- Interval Section -->
    <div class="space-y-2">
      <slot name="interval-input" />
      <VolumeInput
        :model-value="intervalTime"
        @update:model-value="$emit('update:intervalTime', $event)"
        :unit="intervalTimeUnit"
        @update:unit="$emit('update:intervalTimeUnit', $event)"
        label="Every"
        unit-type="time"
        min="0.1"
        step="0.1"
      />
    </div>
  </div>
</template>

<script setup>
import VolumeInput from '../../../components/VolumeInput.vue'

defineProps({
  continuousTime: { type: Number, required: true },
  continuousTimeUnit: { type: String, required: true },
  intervalTime: { type: Number, required: true },
  intervalTimeUnit: { type: String, required: true }
})

defineEmits([
  'update:continuousTime',
  'update:continuousTimeUnit',
  'update:intervalTime',
  'update:intervalTimeUnit'
])
</script>

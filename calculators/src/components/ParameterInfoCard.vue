<template>
  <div v-if="parameterInfo" class="mt-4 p-4 bg-blue-50 rounded-lg">
    <div class="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium">Natural Seawater:</span> {{ `${formatRange(parameterInfo.natural)} ${parameterInfo.unit}` }}
      </div>
      <div>
        <span class="font-medium">Recommended Range:</span> {{ `${formatRange(parameterInfo.recommended)} ${parameterInfo.unit}` }}
      </div>
      <div>
        <span class="font-medium">Optimal Target:</span> {{ `${formatRange(parameterInfo.optimal)} ${parameterInfo.unit}` }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRange } from '../utils/formatters.js'

defineProps({
  parameterInfo: {
    type: Object,
    required: false,
    default: null
  }
})
</script>

<template>
  <button
    @click.stop="$emit('click')"
    class="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
    :title="title"
  >
    <ArrowPathIcon class="w-3.5 h-3.5" />
    {{ label }}
  </button>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

defineProps({
  label: {
    type: String,
    default: 'Reset'
  },
  title: {
    type: String,
    default: 'Reset to defaults'
  }
})

defineEmits(['click'])
</script>

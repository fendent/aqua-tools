<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-lg">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <slot name="header-actions" />
    </div>
    <div class="p-4" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  contentClass: { type: String, default: '' }
})
</script>

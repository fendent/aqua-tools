<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-lg">
    <div
      class="p-4 border-b border-gray-200 flex justify-between items-center"
      :class="{ 'cursor-pointer hover:bg-gray-50': collapsible }"
      @click="collapsible ? toggleCollapsed() : null"
    >
      <div class="flex items-center gap-2">
        <svg
          v-if="collapsible"
          class="w-5 h-5 text-gray-600 transition-transform"
          :class="{ 'rotate-90': !isCollapsed }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-actions" />
      </div>
    </div>
    <div
      v-show="!isCollapsed"
      class="p-4"
      :class="contentClass"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  contentClass: { type: String, default: '' },
  collapsible: { type: Boolean, default: false },
  defaultCollapsed: { type: Boolean, default: false }
})

const isCollapsed = ref(props.defaultCollapsed)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

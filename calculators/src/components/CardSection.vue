<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-lg">
    <div
      class="p-4 border-b border-gray-200 flex justify-between items-center"
      :class="{ 'cursor-pointer hover:bg-gray-50': collapsible }"
      @click="collapsible ? toggleCollapsed() : null"
    >
      <div class="flex items-center gap-2">
        <ChevronRightIcon
          v-if="collapsible"
          class="w-5 h-5 text-gray-600 transition-transform"
          :class="{ 'rotate-90': !isCollapsed }"
        />
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
import { ref, watch } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  title: { type: String, required: true },
  contentClass: { type: String, default: '' },
  collapsible: { type: Boolean, default: false },
  defaultCollapsed: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: undefined }
})

const emit = defineEmits(['update:collapsed'])

// Use v-model if provided, otherwise use internal state
const isCollapsed = ref(props.collapsed !== undefined ? props.collapsed : props.defaultCollapsed)

// Watch for external changes to collapsed prop
watch(() => props.collapsed, (newVal) => {
  if (newVal !== undefined) {
    isCollapsed.value = newVal
  }
})

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
  if (props.collapsed !== undefined) {
    emit('update:collapsed', isCollapsed.value)
  }
}
</script>

<template>
  <tr
    ref="rowElement"
    :class="[
      stripe ? 'bg-gray-50' : '',
      'hover:bg-gray-100 cursor-pointer transition-colors relative'
    ]"
    @click.stop="handleClick"
    @mouseleave="handleMouseLeave"
  >
    <td class="px-4 py-2 border-b border-gray-400">{{ species }}</td>
    <td class="px-4 py-2 text-right font-mono border-b border-gray-400">{{ concentration }}</td>
    <td class="px-4 py-2 text-right font-mono border-b border-gray-400">{{ percent }}</td>

    <!-- Tooltip -->
    <td class="absolute inset-0 pointer-events-none">
      <div
        :class="[
          'absolute left-0 right-0 top-full mt-1 mx-4 p-3 bg-gray-800 text-white text-xs rounded shadow-lg z-10 transition-opacity duration-200',
          showTooltip ? 'opacity-100' : 'opacity-0'
        ]"
      >
        {{ role }}
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  species: {
    type: String,
    required: true
  },
  concentration: {
    type: String,
    required: true
  },
  percent: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  stripe: {
    type: Boolean,
    default: false
  }
})

const showTooltip = ref(false)
const rowElement = ref(null)

function handleClick() {
  showTooltip.value = true
}

function handleMouseLeave() {
  showTooltip.value = false
}

function handleClickOutside(event) {
  if (rowElement.value && !rowElement.value.contains(event.target)) {
    showTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

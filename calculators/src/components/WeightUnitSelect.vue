<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="w-full px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <option value="milligrams">{{ labelFormat === 'abbrev' ? 'mg' : 'Milligrams' }}</option>
    <option value="grams">{{ labelFormat === 'abbrev' ? 'g' : 'Grams' }}</option>
    <option value="ounces">{{ labelFormat === 'abbrev' ? 'oz' : 'Ounces' }}</option>
    <option value="pounds">{{ labelFormat === 'abbrev' ? 'lb' : 'Pounds' }}</option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  labelFormat: { type: String, default: 'full' }
})

defineEmits(['update:modelValue'])
</script>

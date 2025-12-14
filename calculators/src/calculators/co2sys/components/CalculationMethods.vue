<template>
  <CardSection title="Calculation Methods" :collapsible="true" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)">
    <div class="space-y-3 text-sm">
      <div v-if="results.formulationInfo" class="space-y-2">
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Carbonic Acid Constants (K1, K2)</span>
          <span class="text-gray-900">{{ results.formulationInfo.k12 }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">CO₂ Solubility (K0)</span>
          <span class="text-gray-900">{{ results.formulationInfo.k0 }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Boric Acid Constant (KB)</span>
          <span class="text-gray-900">{{ results.formulationInfo.kb }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Water Dissociation (KW)</span>
          <span class="text-gray-900">{{ results.formulationInfo.kw }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Bisulfate (KSO4)</span>
          <span class="text-gray-900">{{ results.formulationInfo.kso4 }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Hydrogen Fluoride (KF)</span>
          <span class="text-gray-900">{{ results.formulationInfo.kf }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Mineral Solubility (Ksp)</span>
          <span class="text-gray-900">{{ results.formulationInfo.ksp }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-gray-700 font-medium">Calcium Concentration</span>
          <span class="text-gray-900">{{ results.formulationInfo.calcium }}</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-gray-700 font-medium">Total Boron</span>
          <span class="text-gray-900">{{ results.formulationInfo.totalBoron }}</span>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <strong>References:</strong> This calculator uses peer-reviewed formulations from CO2SYS.
        All calculations follow the methodology of Lewis & Wallace (1998) and van Heuven et al. (2011).
      </div>
    </div>
  </CardSection>
</template>

<script setup>
import CardSection from '../../../components/CardSection.vue'

defineProps({
  results: { type: Object, required: true },
  collapsed: { type: Boolean, default: true }
})

defineEmits(['update:collapsed'])
</script>

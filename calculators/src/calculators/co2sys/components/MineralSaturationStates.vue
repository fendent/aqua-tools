<template>
  <CardSection title="Mineral Saturation States" :collapsible="true" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)">
    <div class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-semibold text-gray-700">Aragonite Saturation (Ω)</span>
        </div>
        <SaturationGauge
          :omega="results.omegaAragonite"
          mineral="aragonite"
        />
        <p class="text-xs text-gray-600 mt-2">
          {{ getSaturationMessage(results.omegaAragonite, 'aragonite') }}
        </p>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-lg font-semibold text-gray-700">Calcite Saturation (Ω)</span>
        </div>
        <SaturationGauge
          :omega="results.omegaCalcite"
          mineral="calcite"
        />
        <p class="text-xs text-gray-600 mt-2">
          {{ getSaturationMessage(results.omegaCalcite, 'calcite') }}
        </p>
      </div>
    </div>

    <div class="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
      <strong>Saturation State:</strong> Ω represents the saturation level of calcium carbonate minerals.
      Ω > 1 means supersaturated (precipitation favored). Higher Ω values promote faster coral skeleton formation.
      Reef corals require Ω > 3 for aragonite, with Ω > 3.5-4 being ideal.
    </div>
  </CardSection>
</template>

<script setup>
import CardSection from '../../../components/CardSection.vue'
import SaturationGauge from './SaturationGauge.vue'

defineProps({
  results: { type: Object, required: true },
  collapsed: { type: Boolean, default: false }
})

defineEmits(['update:collapsed'])

function getSaturationMessage(omega, mineral) {
  const thresholds = {
    aragonite: { critical: 3.0, low: 3.5, ideal: 4.0 },
    calcite: { critical: 4.5, low: 5.0, ideal: 6.0 }
  }

  const t = thresholds[mineral]
  if (omega < t.critical) {
    return `⚠️ Critical: Below ${t.critical}. Risk of dissolution. Coral growth severely limited.`
  } else if (omega < t.low) {
    return `⚠ Low: Below ${t.low}. Suboptimal for coral growth. Consider increasing alkalinity/calcium.`
  } else if (omega < t.ideal) {
    return `✓ Fair: Acceptable range. Coral growth possible but not optimal.`
  } else {
    return `✓✓ Excellent: Ideal range for coral calcification and growth.`
  }
}
</script>

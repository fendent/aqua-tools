<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="border-b px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">Export Results</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <p class="text-sm text-gray-600">
          Choose a format to export your carbonate system calculation results.
        </p>

        <!-- Export Options -->
        <div class="space-y-2">
          <button
            @click="exportCSV"
            class="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="text-left">
              <div class="font-medium text-gray-900">CSV (Spreadsheet)</div>
              <div class="text-xs text-gray-500">For Excel, Google Sheets, etc.</div>
            </div>
            <DocumentArrowDownIcon class="w-5 h-5 text-gray-400" />
          </button>

          <button
            @click="exportJSON"
            class="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="text-left">
              <div class="font-medium text-gray-900">JSON (Data)</div>
              <div class="text-xs text-gray-500">For programming and data analysis</div>
            </div>
            <DocumentArrowDownIcon class="w-5 h-5 text-gray-400" />
          </button>

          <button
            @click="copyToClipboard"
            class="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="text-left">
              <div class="font-medium text-gray-900">Copy to Clipboard</div>
              <div class="text-xs text-gray-500">Copy results as formatted text</div>
            </div>
            <ClipboardDocumentIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div v-if="exportStatus" class="text-sm text-green-600 bg-green-50 p-2 rounded">
          {{ exportStatus }}
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t px-6 py-4">
        <button
          @click="$emit('close')"
          class="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportResultsToCSV, exportResultsToJSON, exportToJSON } from '../../../utils/carbonate/index.js'
import { DocumentArrowDownIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  results: { type: Object, required: true }
})

defineEmits(['close'])

const exportStatus = ref('')

function exportCSV() {
  exportResultsToCSV(props.results, 'co2sys_results.csv')
  exportStatus.value = 'Results exported as CSV'
  setTimeout(() => { exportStatus.value = '' }, 3000)
}

function exportJSON() {
  exportResultsToJSON(props.results, 'co2sys_results.json')
  exportStatus.value = 'Results exported as JSON'
  setTimeout(() => { exportStatus.value = '' }, 3000)
}

function copyToClipboard() {
  const text = formatResultsAsText(props.results)
  navigator.clipboard.writeText(text).then(() => {
    exportStatus.value = 'Results copied to clipboard'
    setTimeout(() => { exportStatus.value = '' }, 3000)
  }).catch(err => {
    exportStatus.value = 'Failed to copy to clipboard'
    console.error('Failed to copy:', err)
  })
}

function formatResultsAsText(results) {
  let text = `CO2SYS Carbonate System Results
===============================

Environmental Conditions:
- Temperature: ${results.temperature}°C
- Salinity: ${results.salinity} PSU
- Pressure: ${results.pressure} bar

pH Values:
- pH (Total): ${results.pH_total.toFixed(3)}
- pH (Seawater): ${results.pH_sws.toFixed(3)}
- pH (Free): ${results.pH_free.toFixed(3)}
- pH (NBS): ${results.pH_nbs.toFixed(3)}

Main Parameters:
- Total Alkalinity: ${results.TA.toFixed(1)} µmol/kg (${(results.TA * 0.001 / 0.357143).toFixed(2)} dKH)
- Dissolved Inorg Carbon: ${results.DIC.toFixed(1)} µmol/kg
- pCO2: ${results.pCO2.toFixed(1)} µatm

Carbonate Species:
- CO2(aq): ${results.aqCO2.toFixed(2)} µmol/kg (${(results.fCO2 * 100).toFixed(1)}%)
- HCO3-: ${results.HCO3.toFixed(1)} µmol/kg (${(results.fHCO3 * 100).toFixed(1)}%)
- CO3--: ${results.CO3.toFixed(1)} µmol/kg (${(results.fCO3 * 100).toFixed(1)}%)

Saturation States:
- Aragonite: ${results.omegaAragonite.toFixed(2)}
- Calcite: ${results.omegaCalcite.toFixed(2)}

Buffer Capacity:
- Revelle Factor: ${results.revelleFactor.toFixed(2)}
`

  // Add formulation information if available
  if (results.formulationInfo) {
    text += `
Calculation Methods:
- Carbonic Acid Constants (K1, K2): ${results.formulationInfo.k12}
- CO2 Solubility (K0): ${results.formulationInfo.k0}
- Boric Acid Constant (KB): ${results.formulationInfo.kb}
- Water Dissociation (KW): ${results.formulationInfo.kw}
- Bisulfate (KSO4): ${results.formulationInfo.kso4}
- Hydrogen Fluoride (KF): ${results.formulationInfo.kf}
- Mineral Solubility (Ksp): ${results.formulationInfo.ksp}
- Calcium Concentration: ${results.formulationInfo.calcium}
- Total Boron: ${results.formulationInfo.totalBoron}
`
  }

  text += `
Calculated using CO2SYS algorithm
Generated: ${new Date().toLocaleString()}
`

  return text
}
</script>

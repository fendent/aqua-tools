<template>
  <div class="space-y-6">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Time Series Mode</h3>
      <p class="text-sm text-blue-700">
        Track carbonate system parameters over multiple time points. Useful for monitoring tank stability or simulating changes.
      </p>
    </div>

    <!-- Time Series Configuration -->
    <CardSection title="Time Series Setup" :collapsed="false">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Number of Points
            </label>
            <input
              v-model.number="numPoints"
              type="number"
              min="2"
              max="100"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Time Interval (hours)
            </label>
            <input
              v-model.number="timeInterval"
              type="number"
              step="0.1"
              min="0.1"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <!-- Parameter Tracking -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Track Parameter
          </label>
          <select
            v-model="trackParam"
            class="w-full px-3 py-2 border rounded-lg bg-white"
          >
            <option value="pH">pH</option>
            <option value="TA">Total Alkalinity</option>
            <option value="pCO2">pCO2</option>
            <option value="omegaAragonite">Aragonite Saturation</option>
          </select>
        </div>

        <button
          @click="generateTimeSeries"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Generate Time Series
        </button>
      </div>
    </CardSection>

    <!-- Results -->
    <div v-if="timeSeriesResults.length > 0">
      <CardSection title="Time Series Results" :collapsed="false">
        <div class="space-y-4">
          <!-- Chart -->
          <GenericChart
            v-if="chartDatasets.length > 0"
            :datasets="chartDatasets"
            :options="chartOptions"
            chart-type="line"
          />

          <!-- Data Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left">Time (hrs)</th>
                  <th class="px-4 py-2 text-left">pH</th>
                  <th class="px-4 py-2 text-left">TA (dKH)</th>
                  <th class="px-4 py-2 text-left">pCO2 (µatm)</th>
                  <th class="px-4 py-2 text-left">Ω Arag</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(result, i) in timeSeriesResults" :key="i">
                  <td class="px-4 py-2">{{ result.time.toFixed(1) }}</td>
                  <td class="px-4 py-2">{{ result.pH_total.toFixed(3) }}</td>
                  <td class="px-4 py-2">{{ (result.TA * 0.001 / 0.357143).toFixed(2) }}</td>
                  <td class="px-4 py-2">{{ result.pCO2.toFixed(0) }}</td>
                  <td class="px-4 py-2">{{ result.omegaAragonite.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Export -->
          <button
            @click="exportTimeSeries"
            class="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700"
          >
            Export Time Series Data
          </button>
        </div>
      </CardSection>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { calculateCarbonateSystem } from '../../../utils/carbonate/index.js'
import { exportResultsToCSV } from '../../../utils/carbonate/index.js'
import CardSection from '../../../components/CardSection.vue'
import GenericChart from '../../../components/GenericChart.vue'

const props = defineProps({
  param1Type: { type: String, required: true },
  param2Type: { type: String, required: true },
  temperature: { type: Number, required: true },
  salinity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  phScale: { type: String, required: true }
})

const numPoints = ref(24)
const timeInterval = ref(1)
const trackParam = ref('pH')
const timeSeriesResults = ref([])

const trackParamLabel = computed(() => {
  const labels = {
    pH: 'pH',
    TA: 'Total Alkalinity (dKH)',
    pCO2: 'pCO2 (µatm)',
    omegaAragonite: 'Aragonite Saturation (Ω)'
  }
  return labels[trackParam.value] || trackParam.value
})

const chartDatasets = computed(() => {
  if (timeSeriesResults.value.length === 0) return []

  const data = timeSeriesResults.value.map(result => {
    let value = result[trackParam.value]

    // Convert TA to dKH for display
    if (trackParam.value === 'TA') {
      value = value * 0.001 / 0.357143
    }

    return value
  })

  return [{
    label: trackParamLabel.value,
    data: data,
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.3
  }]
})

const chartOptions = computed(() => {
  const labels = timeSeriesResults.value.map(r => r.time.toFixed(1))

  return {
    labels: labels,
    scales: {
      y: {
        title: {
          display: true,
          text: trackParamLabel.value
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time (hours)'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }
})

function generateTimeSeries() {
  // For now, generate with constant parameters
  // In a full implementation, this would allow varying parameters over time
  timeSeriesResults.value = []

  for (let i = 0; i < numPoints.value; i++) {
    const time = i * timeInterval.value

    try {
      const result = calculateCarbonateSystem({
        param1Type: props.param1Type,
        param1Value: 8.1, // Example: would be dynamic in full implementation
        param2Type: props.param2Type,
        param2Value: 2500, // Example: would be dynamic in full implementation
        temperature: props.temperature,
        salinity: props.salinity,
        pressure: props.pressure,
        pHScale: props.phScale
      })

      timeSeriesResults.value.push({
        time,
        ...result
      })
    } catch (error) {
      console.error(`Error at time ${time}:`, error)
    }
  }
}

function exportTimeSeries() {
  exportResultsToCSV(timeSeriesResults.value, 'co2sys_timeseries.csv')
}
</script>

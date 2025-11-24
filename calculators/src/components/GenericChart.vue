<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineExpose } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  datasets: {
    type: Array,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar', 'radar', 'doughnut', 'pie', 'polarArea', 'bubble', 'scatter'].includes(value)
  }
})

const chartCanvas = ref(null)
let chartInstance = null
let resizeTimeout = null

const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }, 100)
}

const createChart = () => {
  if (!chartCanvas.value || !props.datasets.length) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  }

  // Deep merge options
  const mergedOptions = {
    ...defaultOptions,
    ...props.options,
    plugins: {
      ...defaultOptions.plugins,
      ...props.options.plugins
    },
    interaction: {
      ...defaultOptions.interaction,
      ...props.options.interaction
    }
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: props.chartType,
    data: {
      datasets: props.datasets
    },
    options: mergedOptions
  })
}

watch(() => [props.datasets, props.options, props.chartType], createChart, { deep: true })

onMounted(() => {
  createChart()
  window.addEventListener('resize', handleResize)
})

const downloadChart = (filename = 'chart.png') => {
  if (!chartInstance || !chartCanvas.value) return

  const canvas = chartCanvas.value

  // Create a temporary canvas with white background
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const tempCtx = tempCanvas.getContext('2d')

  // Fill with white background
  tempCtx.fillStyle = '#ffffff'
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

  // Draw the chart on top
  tempCtx.drawImage(canvas, 0, 0)

  // Convert to blob and download
  tempCanvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  })
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) clearTimeout(resizeTimeout)
  if (chartInstance) {
    chartInstance.destroy()
  }
})

defineExpose({
  downloadChart
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>

<template>
  <div class="water-change-chart">
    <GenericChart
      ref="chartRef"
      :datasets="currentDatasets"
      :options="currentOptions"
      chart-type="line"
    />
  </div>
</template>

<script setup>
import { computed, ref, defineExpose } from 'vue'
import GenericChart from '../../../components/GenericChart.vue'
import { formatTimeValue } from '../../../utils/timeUtils.js'
import { getUnitAbbrev } from '../../../utils/volumeUtils.js'

const chartRef = ref(null)

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'area', 'area-percent'].includes(value)
  },
  volumeUnit: {
    type: String,
    default: 'gallons'
  }
})

const currentDatasets = computed(() => {
  if (!props.data.length) return []

  if (props.chartType === 'line') {
    return [
      {
        label: 'Supply Reservoir',
        data: props.data.map(d => ({ x: d.time, y: d.supply })),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Waste Reservoir',
        data: props.data.map(d => ({ x: d.time, y: d.waste })),
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  } else if (props.chartType === 'area') {
    return [
      {
        label: 'New Water',
        data: props.data.map(d => ({ x: d.time, y: d.newWater })),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Old Water',
        data: props.data.map(d => ({ x: d.time, y: d.oldWater })),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  } else if (props.chartType === 'area-percent') {
    return [
      {
        label: 'New Water %',
        data: props.data.map(d => ({ x: d.time, y: d.newWaterPercent })),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Old Water %',
        data: props.data.map(d => ({ x: d.time, y: d.oldWaterPercent })),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  }

  return []
})

const currentOptions = computed(() => {
  const timeLabel = props.data[0]?.timeLabel || 'Time'

  return {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: timeLabel
        },
        type: 'linear',
        ticks: {
          maxTicksLimit: 15,
          callback: function(value) {
            if (timeLabel === 'Days' || timeLabel === 'Weeks') {
              return Number.isInteger(value) ? value : ''
            }
            return value
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: props.chartType === 'area-percent' ? 'Percentage (%)' : `Volume (${getUnitAbbrev(props.volumeUnit)})`
        },
        ...(props.chartType === 'area-percent' && {
          min: 0,
          max: 100
        })
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context) {
            const value = context[0].parsed.x
            return formatTimeValue(value, timeLabel)
          },
          label: function(context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            const formattedValue = props.chartType === 'area-percent'
              ? `${value.toFixed(1)}%`
              : `${value.toFixed(1)} ${getUnitAbbrev(props.volumeUnit)}`
            return `${label}: ${formattedValue}`
          }
        }
      }
    }
  }
})

const downloadChart = (filename) => {
  if (chartRef.value) {
    chartRef.value.downloadChart(filename)
  }
}

defineExpose({
  downloadChart
})
</script>

<style scoped>
.water-change-chart {
  width: 100%;
}
</style>

import { formatTimeValue } from './timeUtils.js'

export const createTimeChartOptions = (timeLabel, yAxisConfig) => {
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
      y: yAxisConfig
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context) {
            const value = context[0].parsed.x
            return formatTimeValue(value, timeLabel)
          }
        }
      }
    }
  }
}

const TIME_CONVERSIONS_TO_HOURS = {
  hours: 1,
  days: 24,
  weeks: 168
}

export const convertToHours = (amount, unit) => {
  return amount * TIME_CONVERSIONS_TO_HOURS[unit]
}

export const formatTimeValue = (value, timeLabel) => {
  if (timeLabel === 'Days') {
    const days = Math.floor(value)
    const hours = Math.round((value - days) * 24)
    if (days === 0) {
      return `${hours}h`
    } else if (hours === 0) {
      return `${days}d`
    } else {
      return `${days}d ${hours}h`
    }
  } else if (timeLabel === 'Weeks') {
    const weeks = Math.floor(value)
    const days = Math.round((value - weeks) * 7)
    if (weeks === 0) {
      return `${days}d`
    } else if (days === 0) {
      return `${weeks}w`
    } else {
      return `${weeks}w ${days}d`
    }
  } else if (timeLabel === 'Hours') {
    return `${value.toFixed(1)}h`
  }
  return value.toString()
}

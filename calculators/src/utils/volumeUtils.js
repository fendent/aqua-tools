// Conversion rates to milliliters (base unit)
const VOLUME_CONVERSIONS_TO_ML = {
  gallons: 3785.41,
  ouncesUS: 29.5735,
  ouncesUK: 28.4131,
  liters: 1000,
  milliliters: 1
}

export const toMilliliters = (value, unit) => {
  return value * VOLUME_CONVERSIONS_TO_ML[unit]
}

export const fromMilliliters = (ml, unit) => {
  return ml / VOLUME_CONVERSIONS_TO_ML[unit]
}

export const convertVolume = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value
  const ml = toMilliliters(value, fromUnit)
  return fromMilliliters(ml, toUnit)
}

export const getVolumeStep = (unit) => {
  if (unit === 'milliliters') return 10
  if (unit === 'ouncesUS' || unit === 'ouncesUK') return 0.1
  return 0.1
}

export const getUnitAbbrev = (unit) => {
  const abbrevs = {
    gallons: 'gal',
    ouncesUS: 'US fl oz',
    ouncesUK: 'UK fl oz',
    liters: 'L',
    milliliters: 'mL'
  }
  return abbrevs[unit] || unit
}

export const formatNumber = (num) => {
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const formatVolume = (value, unit) => {
  if (unit === 'milliliters') {
    return formatNumber(Math.round(value))
  }
  return formatNumber(value.toFixed(1))
}

export const getBestFlowUnit = (rateInCurrentUnit, currentUnit, progression = 'gal-floz-ml') => {
  const threshold = 0.1

  const rateInMl = toMilliliters(rateInCurrentUnit, currentUnit)

  const progressions = {
    'gal-floz-ml': ['gallons', 'ouncesUS', 'ouncesUK', 'milliliters'],
    'gal-l-ml': ['gallons', 'liters', 'milliliters'],
    'l-ml': ['liters', 'milliliters'],
    'ml': ['milliliters']
  }

  const unitProgression = progressions[progression] || progressions['gal-floz-ml']

  let currentIndex = unitProgression.indexOf(currentUnit)

  if (currentIndex === -1) {
    if (currentUnit === 'ouncesUK' && unitProgression.includes('ouncesUS')) {
      currentIndex = unitProgression.indexOf('ouncesUS')
      currentUnit = 'ouncesUS'
    } else if ((currentUnit === 'gallons' || currentUnit === 'ouncesUS' || currentUnit === 'ouncesUK')) {
      currentIndex = -1
    } else if (currentUnit === 'liters' && !unitProgression.includes('liters')) {
      currentIndex = -1
    } else if (currentUnit === 'milliliters') {
      currentIndex = unitProgression.indexOf('milliliters')
    }
  }

  if (currentIndex !== -1) {
    const rateInCurrentMapped = fromMilliliters(rateInMl, unitProgression[currentIndex])
    if (rateInCurrentMapped >= threshold) {
      return unitProgression[currentIndex]
    }
  }

  const startIndex = currentIndex === -1 ? 0 : currentIndex + 1
  for (let i = startIndex; i < unitProgression.length; i++) {
    const testUnit = unitProgression[i]
    const rateInTestUnit = fromMilliliters(rateInMl, testUnit)
    if (rateInTestUnit >= threshold) {
      return testUnit
    }
  }

  return unitProgression[unitProgression.length - 1]
}

export const formatFlowRateWithUnit = (rateInDisplayUnit, displayUnit, timeUnit, overrideUnit = null, progression = 'gal-floz-ml') => {
  const bestUnit = overrideUnit || getBestFlowUnit(rateInDisplayUnit, displayUnit, progression)

  let value = rateInDisplayUnit
  if (bestUnit !== displayUnit) {
    const rateInMl = toMilliliters(rateInDisplayUnit, displayUnit)
    value = fromMilliliters(rateInMl, bestUnit)
  }

  let formatted
  if (bestUnit === 'milliliters') {
    formatted = value < 1 ? formatNumber(value.toFixed(2)) : formatNumber(Math.round(value))
  } else if (bestUnit === 'ouncesUS' || bestUnit === 'ouncesUK') {
    formatted = value < 0.1 ? formatNumber(value.toFixed(3)) : formatNumber(value.toFixed(2))
  } else {
    formatted = value < 1 ? formatNumber(value.toFixed(3)) : formatNumber(value.toFixed(2))
  }

  return `${formatted} ${getUnitAbbrev(bestUnit)}${timeUnit}`
}

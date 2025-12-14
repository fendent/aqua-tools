/**
 * Export Functions for CSV and JSON
 */

/**
 * Export results to CSV format
 * @param {Object|Array} results - Single result or array of results
 * @returns {string} CSV formatted string
 */
export function exportToCSV(results) {
  const resultsArray = Array.isArray(results) ? results : [results]

  if (resultsArray.length === 0) return ''

  // Define columns
  const columns = [
    { key: 'time', label: 'Time' },
    { key: 'temperature', label: 'Temperature (°C)' },
    { key: 'salinity', label: 'Salinity (PSU)' },
    { key: 'pressure', label: 'Pressure (bar)' },
    { key: 'pH_total', label: 'pH (Total)' },
    { key: 'pH_sws', label: 'pH (SWS)' },
    { key: 'pH_free', label: 'pH (Free)' },
    { key: 'TA', label: 'Alkalinity (µmol/kg)' },
    { key: 'DIC', label: 'DIC (µmol/kg)' },
    { key: 'pCO2', label: 'pCO2 (µatm)' },
    { key: 'aqCO2', label: 'CO2(aq) (µmol/kg)' },
    { key: 'HCO3', label: 'HCO3- (µmol/kg)' },
    { key: 'CO3', label: 'CO3-- (µmol/kg)' },
    { key: 'omegaAragonite', label: 'Ω Aragonite' },
    { key: 'omegaCalcite', label: 'Ω Calcite' },
    { key: 'revelleFactor', label: 'Revelle Factor' }
  ]

  // Create header row
  const header = columns.map(col => col.label).join(',')

  // Create data rows
  const rows = resultsArray.map(result => {
    return columns.map(col => {
      const value = result[col.key]
      if (value === undefined || value === null) return ''
      if (typeof value === 'number') return value.toFixed(6)
      return value
    }).join(',')
  })

  return [header, ...rows].join('\n')
}

/**
 * Export results to JSON format
 * @param {Object|Array} results - Single result or array of results
 * @param {boolean} pretty - Pretty print JSON
 * @returns {string} JSON formatted string
 */
export function exportToJSON(results, pretty = true) {
  const space = pretty ? 2 : 0
  return JSON.stringify(results, null, space)
}

/**
 * Download data as file
 * @param {string} content - File content
 * @param {string} filename - Name of file
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export results to CSV file
 * @param {Object|Array} results - Results to export
 * @param {string} filename - Filename (default: co2sys_results.csv)
 */
export function exportResultsToCSV(results, filename = 'co2sys_results.csv') {
  const csv = exportToCSV(results)
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export results to JSON file
 * @param {Object|Array} results - Results to export
 * @param {string} filename - Filename (default: co2sys_results.json)
 */
export function exportResultsToJSON(results, filename = 'co2sys_results.json') {
  const json = exportToJSON(results, true)
  downloadFile(json, filename, 'application/json')
}

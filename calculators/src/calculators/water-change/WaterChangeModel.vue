<template>
  <div class="w-full max-w-7xl mx-auto p-6 space-y-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Aquarium Water Change Model</h1>
      <p class="text-gray-600">Visualize continuous and interval water changes over time</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- System Configuration -->
      <CardSection title="System Configuration" content-class="space-y-4">
        <template #header-actions>
          <div class="flex gap-2">
            <VolumeUnitSelect
              v-model="pendingUnitsChange"
              :include-auto="true"
              auto-label="Change all units to..."
              select-class="px-3 py-2 border rounded-lg text-sm bg-gray-50"
            />
            <button
              v-if="pendingUnitsChange"
              @click="applyUnitsChange"
              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </template>
        <VolumeInput
          v-model="systemVolume"
          v-model:unit="systemVolumeUnit"
          label="System Volume"
          :step="getVolumeStep(systemVolumeUnit)"
          min="0.1"
          grid-class="grid-cols-3 gap-2"
          input-col-class="col-span-2"
        />

        <VolumeInput
          v-model="supplyReservoirSize"
          v-model:unit="supplyReservoirUnit"
          label="Supply Reservoir Size"
          :step="getVolumeStep(supplyReservoirUnit)"
          min="0"
          grid-class="grid-cols-3 gap-2"
          input-col-class="col-span-2"
        />

        <VolumeInput
          v-model="wasteReservoirSize"
          v-model:unit="wasteReservoirUnit"
          label="Waste Reservoir Size"
          hint="Graph resets to 0 when this threshold is reached"
          :step="getVolumeStep(wasteReservoirUnit)"
          min="0.1"
          grid-class="grid-cols-3 gap-2"
          input-col-class="col-span-2"
        />

        <VolumeInput
          v-model="supplyRefillThreshold"
          v-model:unit="supplyRefillUnit"
          label="Supply Refill Threshold"
          hint="Refills to full capacity when supply reaches this level"
          :step="getVolumeStep(supplyRefillUnit)"
          min="0"
          grid-class="grid-cols-3 gap-2"
          input-col-class="col-span-2"
        />
      </CardSection>

      <!-- Water Change Configuration -->
      <CardSection title="Water Change Parameters" content-class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Strategy</label>
            <select
              v-model="strategy"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="volume">Specify Volume</option>
              <option value="percentage">Target Percentage</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Change Mode</label>
            <select
              v-model="changeMode"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="continuous">Continuous</option>
              <option value="interval">Interval</option>
              <option value="both">Continuous + Interval</option>
            </select>
          </div>

          <VolumeInput
            v-if="strategy === 'volume' && changeMode !== 'both'"
            v-model="volumeToChange"
            v-model:unit="volumeToChangeUnit"
            label="Volume to Change"
            :step="getVolumeStep(volumeToChangeUnit)"
            min="0"
          />

          <BothModeConfig
            v-if="strategy === 'volume' && changeMode === 'both'"
            v-model:continuous-time="timeAmount"
            v-model:continuous-time-unit="timeUnit"
            v-model:interval-time="intervalAmount"
            v-model:interval-time-unit="intervalUnit"
          >
            <template #continuous-input>
              <VolumeInput
                v-model="volumeToChange"
                v-model:unit="volumeToChangeUnit"
                label="Continuous Volume to Change"
                :step="getVolumeStep(volumeToChangeUnit)"
                min="0"
              />
            </template>
            <template #interval-input>
              <VolumeInput
                v-model="intervalVolumeToChange"
                v-model:unit="intervalVolumeToChangeUnit"
                label="Interval Volume to Change"
                :step="getVolumeStep(intervalVolumeToChangeUnit)"
                min="0"
              />
            </template>
          </BothModeConfig>

          <div v-if="strategy === 'percentage' && changeMode !== 'both'" class="space-y-2">
            <div>
              <label class="block text-sm font-medium mb-2">Target Water Change (%)</label>
              <input
                v-model.number="targetPercentage"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
                :min="changeMode === 'continuous' ? 0.01 : 0"
                :max="changeMode === 'continuous' ? 99.99 : 100"
                step="0.01"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ changeMode === 'continuous' ? 'Percentage of system volume to replace (0.01-99.99%)' : 'Percentage of system volume to replace' }}
              </p>
            </div>
            <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Volume: {{ formatVolume(calculatedVolume, systemVolumeUnit) }} {{ getUnitAbbrev(systemVolumeUnit) }}
            </div>
          </div>

          <BothModeConfig
            v-if="strategy === 'percentage' && changeMode === 'both'"
            v-model:continuous-time="timeAmount"
            v-model:continuous-time-unit="timeUnit"
            v-model:interval-time="intervalAmount"
            v-model:interval-time-unit="intervalUnit"
          >
            <template #continuous-input>
              <div>
                <label class="block text-sm font-medium mb-2">Continuous Target Water Change (%)</label>
                <input
                  v-model.number="targetPercentage"
                  type="number"
                  class="w-full px-3 py-2 border rounded-lg"
                  min="0.01"
                  max="99.99"
                  step="0.01"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Percentage of system volume for continuous change (0.01-99.99%)
                </p>
              </div>
              <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Volume: {{ formatVolume(calculatedVolume, systemVolumeUnit) }} {{ getUnitAbbrev(systemVolumeUnit) }}
              </div>
            </template>
            <template #interval-input>
              <div>
                <label class="block text-sm font-medium mb-2">Interval Target Water Change (%)</label>
                <input
                  v-model.number="intervalTargetPercentage"
                  type="number"
                  class="w-full px-3 py-2 border rounded-lg"
                  min="0"
                  max="100"
                  step="1"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Percentage of system volume for interval change
                </p>
              </div>
              <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Volume: {{ formatVolume(calculatedIntervalVolume, systemVolumeUnit) }} {{ getUnitAbbrev(systemVolumeUnit) }}
              </div>
            </template>
          </BothModeConfig>

          <div v-if="changeMode !== 'both'" class="grid grid-cols-[2fr_1fr] gap-2">
            <div>
              <label class="block text-sm font-medium mb-2">
                {{ changeMode === 'continuous' ? 'Over' : 'Every' }}
              </label>
              <input
                :value="changeMode === 'continuous' ? timeAmount : intervalAmount"
                @input="changeMode === 'continuous' ? timeAmount = parseFloat($event.target.value) : intervalAmount = parseFloat($event.target.value)"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
                :min="currentTimeMin"
                :step="currentTimeStep"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">&nbsp;</label>
              <TimeUnitSelect
                :model-value="changeMode === 'continuous' ? timeUnit : intervalUnit"
                @update:model-value="changeMode === 'continuous' ? timeUnit = $event : intervalUnit = $event"
              />
            </div>
          </div>
      </CardSection>
    </div>

    <!-- Simulation Duration -->
    <CardSection title="Simulation Settings">
      <template #header-actions>
        <button
          @click="resetToDefaults"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </template>
      <VolumeInput
        v-model="simulationDuration"
        v-model:unit="simulationUnit"
        label="Simulation Duration"
        unit-type="time"
        min="1"
        grid-class="grid-cols-2 gap-4"
      />
    </CardSection>

    <!-- Parameter Tracking -->
    <CardSection title="Parameter Tracking">
      <template #header-actions>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="parameterTracking.enabled"
            class="w-4 h-4 rounded border-gray-300"
          />
          <span class="text-sm font-medium text-gray-700">Enable</span>
        </label>
      </template>
      <div v-if="parameterTracking.enabled">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Parameter Name</label>
            <input
              v-model="parameterTracking.name"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Nitrate, Phosphate"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Unit</label>
            <input
              v-model="parameterTracking.unit"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., ppm, mg/L"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Starting Value</label>
            <input
              v-model.number="parameterTracking.startingValue"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Replacement Water Value</label>
            <input
              v-model.number="parameterTracking.replacementWaterValue"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Accumulation Rate</label>
            <input
              v-model.number="parameterTracking.accumulationRate"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              step="0.1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Per</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model.number="parameterTracking.accumulationPeriod"
                type="number"
                class="w-full px-3 py-2 border rounded-lg"
                min="0.1"
                step="0.1"
              />
              <TimeUnitSelect v-model="parameterTracking.accumulationRateUnit" />
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Track how a water parameter changes over time based on accumulation rate and water changes.
          Positive accumulation rate increases the parameter, negative decreases it.
        </p>
      </div>
    </CardSection>

    <!-- Summary Statistics -->
    <div class="grid md:grid-cols-3 gap-4">
      <StatCard
        :label="changeMode === 'both' ? 'Continuous Water Changed' : 'Total Water Changed'"
        :value="formatVolume(totalWaterChanged, displayUnit) + ' ' + getUnitAbbrev(displayUnit)"
        color="blue"
      />
      <StatCard
        label="Final Old Water %"
        :value="finalData.oldWaterPercent + '%'"
        color="green"
      />
      <StatCard
        label="Final New Water %"
        :value="finalData.newWaterPercent + '%'"
        color="purple"
      />
      <StatCard
        label="Supply Remaining"
        :value="formatVolume(finalData.supply, displayUnit) + ' ' + getUnitAbbrev(displayUnit)"
        color="orange"
      />
      <StatCard
        label="Supply Refills"
        :value="finalData.supplyRefills"
        color="cyan"
      />
      <StatCard
        label="Waste Empties"
        :value="finalData.wasteEmpties"
        color="red"
      />
    </div>

    <!-- Flow Rates -->
    <CardSection
      v-if="changeMode === 'continuous' || changeMode === 'both'"
      :title="changeMode === 'both' ? 'Continuous Change Flow Rates' : 'Flow Rates'"
    >
      <template #header-actions>
        <div class="w-64">
          <select
            v-model="flowRateProgression"
            class="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="gal-floz-ml">Gallons → Fluid Ounces → Milliliters</option>
            <option value="gal-l-ml">Gallons → Liters → Milliliters</option>
            <option value="l-ml">Liters → Milliliters</option>
            <option value="ml">Milliliters</option>
          </select>
        </div>
      </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-600">Per Second</div>
            <div class="text-lg font-semibold text-gray-800 mb-2">{{ flowRates.perSecond }}</div>
            <VolumeUnitSelect
              v-model="flowRateUnitOverrides.perSecond"
              :include-auto="true"
              label-format="abbrev"
              select-class="w-full px-2 py-1 border rounded text-xs"
            />
          </div>
          <div>
            <div class="text-sm text-gray-600">Per Minute</div>
            <div class="text-lg font-semibold text-gray-800 mb-2">{{ flowRates.perMinute }}</div>
            <VolumeUnitSelect
              v-model="flowRateUnitOverrides.perMinute"
              :include-auto="true"
              label-format="abbrev"
              select-class="w-full px-2 py-1 border rounded text-xs"
            />
          </div>
          <div>
            <div class="text-sm text-gray-600">Per Hour</div>
            <div class="text-lg font-semibold text-gray-800 mb-2">{{ flowRates.perHour }}</div>
            <VolumeUnitSelect
              v-model="flowRateUnitOverrides.perHour"
              :include-auto="true"
              label-format="abbrev"
              select-class="w-full px-2 py-1 border rounded text-xs"
            />
          </div>
          <div>
            <div class="text-sm text-gray-600">Per Day</div>
            <div class="text-lg font-semibold text-gray-800 mb-2">{{ flowRates.perDay }}</div>
            <VolumeUnitSelect
              v-model="flowRateUnitOverrides.perDay"
              :include-auto="true"
              label-format="abbrev"
              select-class="w-full px-2 py-1 border rounded text-xs"
            />
          </div>
        </div>
    </CardSection>

    <!-- Graphs -->
    <CardSection title="Reservoir Levels Over Time" collapsible>
      <template #header-actions>
        <button
          @click.stop="downloadChartImage('reservoir', 'reservoir-levels.png')"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
          title="Download chart as PNG"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </template>
      <WaterChangeChart ref="reservoirChartRef" :data="graphData" chart-type="line" :volume-unit="displayUnit" />
    </CardSection>

    <CardSection title="Water Composition Over Time" collapsible>
      <template #header-actions>
        <button
          @click.stop="downloadChartImage('composition', 'water-composition.png')"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
          title="Download chart as PNG"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </template>
      <WaterChangeChart ref="compositionChartRef" :data="graphData" chart-type="area" :volume-unit="displayUnit" />
    </CardSection>

    <CardSection title="Water Composition Percentage" collapsible>
      <template #header-actions>
        <button
          @click.stop="downloadChartImage('percent', 'water-composition-percent.png')"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
          title="Download chart as PNG"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </template>
      <WaterChangeChart ref="percentChartRef" :data="graphData" chart-type="area-percent" :volume-unit="displayUnit" />
    </CardSection>

    <CardSection v-if="parameterTracking.enabled" :title="parameterTracking.name + ' Over Time'" collapsible>
      <template #header-actions>
        <button
          @click.stop="downloadChartImage('parameter', 'parameter-tracking.png')"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
          title="Download chart as PNG"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </template>
      <GenericChart ref="parameterChartRef" :datasets="parameterDatasets" :options="parameterChartOptions" chart-type="line" />
    </CardSection>

    <!-- Usage Notes -->
    <div class="rounded-lg border border-gray-200 bg-gray-50">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">How to Use</h3>
      </div>
      <div class="p-4 space-y-2 text-sm text-gray-700">
        <p><strong>Continuous Mode:</strong> Water changes happen at a constant flow rate. For example, "50 gallons over 7 days" means approximately 0.3 gallons per hour.</p>
        <p><strong>Interval Mode:</strong> Water changes happen in discrete amounts at regular intervals. For example, "50 gallons every 7 days" means no change for 7 days, then 50 gallons all at once.</p>
        <p><strong>Continuous + Interval Mode:</strong> Combines both modes simultaneously. Water changes at a constant continuous flow rate while also performing periodic interval changes. For example, "20 gallons over 7 days" continuously plus "30 gallons every 7 days" in discrete changes. Note: Supply and waste reservoirs only track continuous changes.</p>
        <p><strong>Old vs New Water:</strong> "Old water" is the water present at the start of the simulation. As water changes occur, old water is diluted exponentially following the formula: remaining_old_water = current_old_water × (1 - volume_removed / system_volume)</p>
        <p><strong>Supply Reservoir:</strong> Tracks only continuous water changes. Automatically refills to full capacity when it reaches or falls below the refill threshold. Set threshold to 0 to refill only when completely empty.</p>
        <p><strong>Waste Reservoir:</strong> Tracks only continuous water changes. The graph shows waste accumulation. When the waste would exceed the reservoir size, it resets to 0 (simulating emptying the reservoir).</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import WaterChangeChart from './components/WaterChangeChart.vue'
import GenericChart from '../../components/GenericChart.vue'
import VolumeUnitSelect from '../../components/VolumeUnitSelect.vue'
import TimeUnitSelect from '../../components/TimeUnitSelect.vue'
import VolumeInput from '../../components/VolumeInput.vue'
import StatCard from '../../components/StatCard.vue'
import CardSection from '../../components/CardSection.vue'
import BothModeConfig from './components/BothModeConfig.vue'
import {
  toMilliliters,
  fromMilliliters,
  getVolumeStep,
  getUnitAbbrev,
  formatVolume,
  getBestFlowUnit,
  formatFlowRateWithUnit
} from '../../utils/volumeUtils.js'
import { convertToHours, formatTimeValue } from '../../utils/timeUtils.js'

const STORAGE_KEY = 'waterChangeModelSettings'
const DEFAULTS = {
  systemVolume: 100,
  systemVolumeUnit: 'gallons',
  supplyReservoirSize: 200,
  supplyReservoirUnit: 'gallons',
  wasteReservoirSize: 50,
  wasteReservoirUnit: 'gallons',
  supplyRefillThreshold: 0,
  supplyRefillUnit: 'gallons',
  volumeToChange: 50,
  volumeToChangeUnit: 'gallons',
  intervalVolumeToChange: 25,
  intervalVolumeToChangeUnit: 'gallons',
  strategy: 'volume',
  changeMode: 'continuous',
  targetPercentage: 50,
  intervalTargetPercentage: 25,
  timeAmount: 7,
  timeUnit: 'days',
  intervalAmount: 1,
  intervalUnit: 'days',
  simulationDuration: 30,
  simulationUnit: 'days',
  flowRateProgression: 'gal-floz-ml',
  flowRateUnitOverrides: {
    perSecond: '',
    perMinute: '',
    perHour: '',
    perDay: ''
  },
  parameterTracking: {
    enabled: false,
    name: 'Nitrate',
    unit: 'ppm',
    startingValue: 20,
    accumulationRate: 5,
    accumulationPeriod: 1,
    accumulationRateUnit: 'days',
    replacementWaterValue: 0
  }
}

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

const settings = loadSettings()

const systemVolume = ref(settings.systemVolume)
const systemVolumeUnit = ref(settings.systemVolumeUnit)
const supplyReservoirSize = ref(settings.supplyReservoirSize)
const supplyReservoirUnit = ref(settings.supplyReservoirUnit)
const wasteReservoirSize = ref(settings.wasteReservoirSize)
const wasteReservoirUnit = ref(settings.wasteReservoirUnit)
const supplyRefillThreshold = ref(settings.supplyRefillThreshold)
const supplyRefillUnit = ref(settings.supplyRefillUnit)

const strategy = ref(settings.strategy)
const changeMode = ref(settings.changeMode)
const volumeToChange = ref(settings.volumeToChange)
const volumeToChangeUnit = ref(settings.volumeToChangeUnit)
const intervalVolumeToChange = ref(settings.intervalVolumeToChange || DEFAULTS.intervalVolumeToChange)
const intervalVolumeToChangeUnit = ref(settings.intervalVolumeToChangeUnit || DEFAULTS.intervalVolumeToChangeUnit)
const targetPercentage = ref(settings.targetPercentage)
const intervalTargetPercentage = ref(settings.intervalTargetPercentage || DEFAULTS.intervalTargetPercentage)
const timeAmount = ref(settings.timeAmount)
const timeUnit = ref(settings.timeUnit)

const intervalAmount = ref(settings.intervalAmount)
const intervalUnit = ref(settings.intervalUnit)

const simulationDuration = ref(settings.simulationDuration)
const simulationUnit = ref(settings.simulationUnit)
const flowRateProgression = ref(settings.flowRateProgression)
const flowRateUnitOverrides = ref(settings.flowRateUnitOverrides || DEFAULTS.flowRateUnitOverrides)
const parameterTracking = ref(settings.parameterTracking || DEFAULTS.parameterTracking)

const pendingUnitsChange = ref('')

const reservoirChartRef = ref(null)
const compositionChartRef = ref(null)
const percentChartRef = ref(null)
const parameterChartRef = ref(null)

const displayUnit = computed(() => systemVolumeUnit.value)

const downloadChartImage = (refName, filename) => {
  const chartRefMap = {
    reservoir: reservoirChartRef,
    composition: compositionChartRef,
    percent: percentChartRef,
    parameter: parameterChartRef
  }

  const chartRef = chartRefMap[refName]

  if (chartRef?.value && typeof chartRef.value.downloadChart === 'function') {
    chartRef.value.downloadChart(filename)
  }
}

const flowRates = computed(() => {
  if (changeMode.value !== 'continuous' && changeMode.value !== 'both') {
    return {
      perSecond: '0 ' + getUnitAbbrev(displayUnit.value) + '/s',
      perMinute: '0 ' + getUnitAbbrev(displayUnit.value) + '/min',
      perHour: '0 ' + getUnitAbbrev(displayUnit.value) + '/hr',
      perDay: '0 ' + getUnitAbbrev(displayUnit.value) + '/day'
    }
  }

  // Calculate flow rate in display units per hour
  const volumeMl = strategy.value === 'percentage'
    ? changeMode.value === 'continuous' || changeMode.value === 'both'
      ? -Math.log(1 - targetPercentage.value / 100) * toMilliliters(systemVolume.value, systemVolumeUnit.value)
      : toMilliliters(systemVolume.value, systemVolumeUnit.value) * targetPercentage.value / 100
    : toMilliliters(effectiveVolume.value, volumeToChangeUnit.value)

  const timeHours = convertToHours(timeAmount.value, timeUnit.value)
  const flowRatePerHour = fromMilliliters(volumeMl / timeHours, displayUnit.value)

  return {
    perSecond: formatFlowRateWithUnit(flowRatePerHour / 3600, displayUnit.value, '/s', flowRateUnitOverrides.value.perSecond || null, flowRateProgression.value),
    perMinute: formatFlowRateWithUnit(flowRatePerHour / 60, displayUnit.value, '/min', flowRateUnitOverrides.value.perMinute || null, flowRateProgression.value),
    perHour: formatFlowRateWithUnit(flowRatePerHour, displayUnit.value, '/hr', flowRateUnitOverrides.value.perHour || null, flowRateProgression.value),
    perDay: formatFlowRateWithUnit(flowRatePerHour * 24, displayUnit.value, '/day', flowRateUnitOverrides.value.perDay || null, flowRateProgression.value)
  }
})

const applyUnitsChange = () => {
  if (!pendingUnitsChange.value) return

  const newUnit = pendingUnitsChange.value

  systemVolumeUnit.value = newUnit
  supplyReservoirUnit.value = newUnit
  wasteReservoirUnit.value = newUnit
  supplyRefillUnit.value = newUnit
  volumeToChangeUnit.value = newUnit

  pendingUnitsChange.value = ''
}

const calculatedVolume = computed(() => {
  // For continuous mode, use exponential decay formula to calculate actual volume needed
  // For interval mode, use simple percentage of system volume
  if (changeMode.value === 'continuous' || changeMode.value === 'both') {
    const systemVolumeMl = toMilliliters(systemVolume.value, systemVolumeUnit.value)
    const volumeNeededMl = -Math.log(1 - targetPercentage.value / 100) * systemVolumeMl
    return fromMilliliters(volumeNeededMl, systemVolumeUnit.value)
  } else {
    return (systemVolume.value * targetPercentage.value) / 100
  }
})

const calculatedIntervalVolume = computed(() => {
  // Always use simple percentage for interval changes
  return (systemVolume.value * intervalTargetPercentage.value) / 100
})

const effectiveVolume = computed(() => {
  return strategy.value === 'percentage' ? calculatedVolume.value : volumeToChange.value
})

const effectiveIntervalVolume = computed(() => {
  return strategy.value === 'percentage' ? calculatedIntervalVolume.value : intervalVolumeToChange.value
})

const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      systemVolume: systemVolume.value,
      systemVolumeUnit: systemVolumeUnit.value,
      supplyReservoirSize: supplyReservoirSize.value,
      supplyReservoirUnit: supplyReservoirUnit.value,
      wasteReservoirSize: wasteReservoirSize.value,
      wasteReservoirUnit: wasteReservoirUnit.value,
      supplyRefillThreshold: supplyRefillThreshold.value,
      supplyRefillUnit: supplyRefillUnit.value,
      volumeToChange: volumeToChange.value,
      volumeToChangeUnit: volumeToChangeUnit.value,
      intervalVolumeToChange: intervalVolumeToChange.value,
      intervalVolumeToChangeUnit: intervalVolumeToChangeUnit.value,
      strategy: strategy.value,
      changeMode: changeMode.value,
      targetPercentage: targetPercentage.value,
      intervalTargetPercentage: intervalTargetPercentage.value,
      timeAmount: timeAmount.value,
      timeUnit: timeUnit.value,
      intervalAmount: intervalAmount.value,
      intervalUnit: intervalUnit.value,
      simulationDuration: simulationDuration.value,
      simulationUnit: simulationUnit.value,
      flowRateProgression: flowRateProgression.value,
      flowRateUnitOverrides: flowRateUnitOverrides.value,
      parameterTracking: parameterTracking.value
    }))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

const resetToDefaults = () => {
  systemVolume.value = DEFAULTS.systemVolume
  systemVolumeUnit.value = DEFAULTS.systemVolumeUnit
  supplyReservoirSize.value = DEFAULTS.supplyReservoirSize
  supplyReservoirUnit.value = DEFAULTS.supplyReservoirUnit
  wasteReservoirSize.value = DEFAULTS.wasteReservoirSize
  wasteReservoirUnit.value = DEFAULTS.wasteReservoirUnit
  supplyRefillThreshold.value = DEFAULTS.supplyRefillThreshold
  supplyRefillUnit.value = DEFAULTS.supplyRefillUnit
  volumeToChange.value = DEFAULTS.volumeToChange
  volumeToChangeUnit.value = DEFAULTS.volumeToChangeUnit
  intervalVolumeToChange.value = DEFAULTS.intervalVolumeToChange
  intervalVolumeToChangeUnit.value = DEFAULTS.intervalVolumeToChangeUnit
  strategy.value = DEFAULTS.strategy
  changeMode.value = DEFAULTS.changeMode
  targetPercentage.value = DEFAULTS.targetPercentage
  intervalTargetPercentage.value = DEFAULTS.intervalTargetPercentage
  timeAmount.value = DEFAULTS.timeAmount
  timeUnit.value = DEFAULTS.timeUnit
  intervalAmount.value = DEFAULTS.intervalAmount
  intervalUnit.value = DEFAULTS.intervalUnit
  simulationDuration.value = DEFAULTS.simulationDuration
  simulationUnit.value = DEFAULTS.simulationUnit
  flowRateProgression.value = DEFAULTS.flowRateProgression
  flowRateUnitOverrides.value = DEFAULTS.flowRateUnitOverrides
  parameterTracking.value = DEFAULTS.parameterTracking
}

watch([
  systemVolume,
  systemVolumeUnit,
  supplyReservoirSize,
  supplyReservoirUnit,
  wasteReservoirSize,
  wasteReservoirUnit,
  supplyRefillThreshold,
  supplyRefillUnit,
  volumeToChange,
  volumeToChangeUnit,
  intervalVolumeToChange,
  intervalVolumeToChangeUnit,
  strategy,
  changeMode,
  targetPercentage,
  intervalTargetPercentage,
  timeAmount,
  timeUnit,
  intervalAmount,
  intervalUnit,
  simulationDuration,
  simulationUnit,
  flowRateProgression,
  flowRateUnitOverrides,
  parameterTracking
], saveSettings, { deep: true })

const currentTimeStep = computed(() => {
  const unit = changeMode.value === 'continuous' ? timeUnit.value : intervalUnit.value
  return unit === 'hours' ? 0.1 : 1
})

const currentTimeMin = computed(() => {
  const unit = changeMode.value === 'continuous' ? timeUnit.value : intervalUnit.value
  return unit === 'hours' ? 0.1 : 1
})

const graphData = computed(() => {
  // Convert all volumes to milliliters for calculation (base unit)
  const systemVolumeMl = toMilliliters(systemVolume.value, systemVolumeUnit.value)
  const supplyReservoirMl = toMilliliters(supplyReservoirSize.value, supplyReservoirUnit.value)
  const wasteReservoirMl = toMilliliters(wasteReservoirSize.value, wasteReservoirUnit.value)
  const supplyRefillThresholdMl = toMilliliters(supplyRefillThreshold.value, supplyRefillUnit.value)

  // For percentage strategy in continuous mode, calculate the volume needed to reach target %
  // Using exponential decay formula: newWater% = 1 - e^(-volumeChanged/systemVolume)
  // Solving for volumeChanged: volumeChanged = -ln(1 - targetPercent/100) * systemVolume
  const volumeToChangeMl = strategy.value === 'percentage'
    ? changeMode.value === 'continuous' || changeMode.value === 'both'
      ? -Math.log(1 - targetPercentage.value / 100) * systemVolumeMl
      : (systemVolumeMl * targetPercentage.value) / 100
    : toMilliliters(effectiveVolume.value, volumeToChangeUnit.value)

  // For "both" mode, we need a separate volume for interval changes
  const intervalVolumeMl = changeMode.value === 'both'
    ? strategy.value === 'percentage'
      ? (systemVolumeMl * intervalTargetPercentage.value) / 100
      : toMilliliters(effectiveIntervalVolume.value, intervalVolumeToChangeUnit.value)
    : changeMode.value === 'interval'
      ? volumeToChangeMl
      : 0

  const totalHours = convertToHours(simulationDuration.value, simulationUnit.value)
  const changeTimeHours = convertToHours(timeAmount.value, timeUnit.value)
  const intervalHours = changeMode.value === 'interval' || changeMode.value === 'both'
    ? convertToHours(intervalAmount.value, intervalUnit.value)
    : 0

  const flowRate = changeMode.value === 'continuous' || changeMode.value === 'both'
    ? volumeToChangeMl / changeTimeHours
    : 0

  const sampleInterval = Math.max(1, Math.floor(totalHours / 500))
  const dataPoints = []

  let currentSupply = supplyReservoirMl
  let currentWaste = 0
  let oldWater = systemVolumeMl
  let newWater = 0
  let nextIntervalTime = intervalHours
  let totalWaterUsed = 0
  let supplyRefills = 0
  let wasteEmpties = 0

  // Parameter tracking initialization
  let currentParameter = parameterTracking.value.enabled ? parameterTracking.value.startingValue : 0
  const paramAccumulationRatePerHour = parameterTracking.value.enabled
    ? parameterTracking.value.accumulationRate / convertToHours(parameterTracking.value.accumulationPeriod, parameterTracking.value.accumulationRateUnit)
    : 0

  for (let hour = 0; hour <= totalHours; hour += sampleInterval) {
    let continuousWaterChange = 0
    let intervalWaterChange = 0

    if (changeMode.value === 'continuous') {
      continuousWaterChange = flowRate * sampleInterval
    } else if (changeMode.value === 'interval' && hour >= nextIntervalTime && hour < nextIntervalTime + sampleInterval) {
      intervalWaterChange = volumeToChangeMl
      nextIntervalTime += intervalHours
    } else if (changeMode.value === 'both') {
      // Separate continuous and interval water changes
      continuousWaterChange = flowRate * sampleInterval
      if (hour >= nextIntervalTime && hour < nextIntervalTime + sampleInterval) {
        intervalWaterChange = intervalVolumeMl
        nextIntervalTime += intervalHours
      }
    }

    // Reservoirs only track continuous water changes
    const actualContinuousChange = Math.min(continuousWaterChange, currentSupply)

    currentSupply -= actualContinuousChange
    currentWaste += actualContinuousChange
    totalWaterUsed += actualContinuousChange

    if (currentSupply <= supplyRefillThresholdMl) {
      currentSupply = supplyReservoirMl
      supplyRefills++
    }

    if (currentWaste > wasteReservoirMl) {
      currentWaste = 0
      wasteEmpties++
    }

    // For water composition and parameters, use ideal water changes (continuous + interval, not limited by supply)
    const idealWaterChange = continuousWaterChange + intervalWaterChange
    const fractionRemoved = idealWaterChange / systemVolumeMl
    oldWater = oldWater * (1 - fractionRemoved)
    newWater = systemVolumeMl - oldWater

    // Update parameter concentration
    if (parameterTracking.value.enabled) {
      // Dilute parameter based on water change (same as water composition)
      currentParameter = currentParameter * (1 - fractionRemoved) +
                        (parameterTracking.value.replacementWaterValue * fractionRemoved)

      // Add accumulation from biological processes, feeding, etc. AFTER water change
      currentParameter += paramAccumulationRatePerHour * sampleInterval

      currentParameter = Math.max(0, currentParameter)
    }

    oldWater = Math.max(0, oldWater)
    newWater = Math.max(0, newWater)
    currentSupply = Math.max(0, currentSupply)

    let timeValue = hour
    let timeLabel = 'Hours'

    if (simulationUnit.value === 'days') {
      timeValue = hour / 24
      timeLabel = 'Days'
    } else if (simulationUnit.value === 'weeks') {
      timeValue = hour / 168
      timeLabel = 'Weeks'
    }

    // Convert back to display unit for output
    const displaySupply = fromMilliliters(currentSupply, displayUnit.value)
    const displayWaste = fromMilliliters(currentWaste, displayUnit.value)
    const displayOldWater = fromMilliliters(oldWater, displayUnit.value)
    const displayNewWater = fromMilliliters(newWater, displayUnit.value)
    const displayTotalWaterUsed = fromMilliliters(totalWaterUsed, displayUnit.value)

    dataPoints.push({
      time: parseFloat(timeValue.toFixed(2)),
      timeLabel,
      supply: parseFloat(displaySupply.toFixed(2)),
      waste: parseFloat(displayWaste.toFixed(2)),
      oldWater: parseFloat(displayOldWater.toFixed(2)),
      newWater: parseFloat(displayNewWater.toFixed(2)),
      oldWaterPercent: parseFloat((oldWater / systemVolumeMl * 100).toFixed(1)),
      newWaterPercent: parseFloat((newWater / systemVolumeMl * 100).toFixed(1)),
      totalWaterUsed: parseFloat(displayTotalWaterUsed.toFixed(2)),
      supplyRefills,
      wasteEmpties,
      parameter: parameterTracking.value.enabled ? parseFloat(currentParameter.toFixed(2)) : null
    })
  }

  return dataPoints
})

const finalData = computed(() => graphData.value[graphData.value.length - 1])
const totalWaterChanged = computed(() => finalData.value?.totalWaterUsed || 0)

const parameterDatasets = computed(() => {
  if (!parameterTracking.value.enabled || !graphData.value.length) return []

  return [{
    label: `${parameterTracking.value.name} (${parameterTracking.value.unit})`,
    data: graphData.value.map(d => ({ x: d.time, y: d.parameter })),
    borderColor: '#f59e0b',
    backgroundColor: '#f59e0b',
    borderWidth: 2,
    tension: 0.1,
    pointRadius: 0
  }]
})

const parameterChartOptions = computed(() => {
  const timeLabel = graphData.value[0]?.timeLabel || 'Time'

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
          text: `${parameterTracking.value.name} (${parameterTracking.value.unit})`
        }
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
            return `${label}: ${value.toFixed(2)}`
          }
        }
      }
    }
  }
})
</script>

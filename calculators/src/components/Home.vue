<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">Aquaria Calculators</h1>
      <p class="text-xl text-gray-600">
        A collection of tools and calculators for marine and freshwater aquarium hobbyists
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <router-link
        v-for="calc in calculators"
        :key="calc.id"
        :to="calc.path"
        class="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
      >
        <div class="text-4xl mb-4">{{ calc.icon }}</div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">{{ calc.name }}</h2>
        <p class="text-gray-600">
          {{ calc.description }}
        </p>
      </router-link>

      <div class="block p-6 bg-gray-100 rounded-xl border border-dashed border-gray-300">
        <div class="text-4xl mb-4 opacity-50">🧮</div>
        <h2 class="text-2xl font-semibold text-gray-400 mb-2">More Coming Soon</h2>
        <p class="text-gray-400">
          Additional calculators for salinity, stocking, heater sizing, and more are in development.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CALCULATORS } from '../config/calculators.js'

const calculators = CALCULATORS
</script>

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
        to="/calculators/water-change"
        class="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
      >
        <div class="text-4xl mb-4">💧</div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Water Change Model</h2>
        <p class="text-gray-600">
          Visualize continuous and interval water changes over time. Track supply/waste reservoirs
          and see how old water gets replaced with new water.
        </p>
      </router-link>

      <div class="block p-6 bg-gray-100 rounded-xl border border-dashed border-gray-300">
        <div class="text-4xl mb-4 opacity-50">🧮</div>
        <h2 class="text-2xl font-semibold text-gray-400 mb-2">More Coming Soon</h2>
        <p class="text-gray-400">
          Additional calculators for dosing, salinity, stocking, and more are in development.
        </p>
      </div>
    </div>
  </div>
</template>

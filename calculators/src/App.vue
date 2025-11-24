<template>
  <div class="min-h-screen">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <router-link to="/" class="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          🥩 Aquaria Calculators
        </router-link>
      </div>
    </nav>

    <main class="py-6">
      <router-view />
    </main>

    <footer class="bg-white border-t border-gray-200 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        Open source aquarium tools. Contributions welcome on GitHub.
      </div>
    </footer>
  </div>
</template>

<script setup>
// Router handles all navigation now
</script>

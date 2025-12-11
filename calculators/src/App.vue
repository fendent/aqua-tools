<template>
  <div class="min-h-screen">
    <Navigation />

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
import Navigation from './components/Navigation.vue'
</script>

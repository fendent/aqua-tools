<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <router-link to="/" class="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
          🥩 Aquaria Calculators
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            :class="{ 'text-blue-600': $route.path === '/' }"
          >
            Home
          </router-link>
          <router-link
            v-for="calc in calculators"
            :key="calc.id"
            :to="calc.path"
            class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            :class="{ 'text-blue-600': $route.path === calc.path }"
          >
            {{ calc.shortName }}
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Bars3Icon v-if="!isMenuOpen" class="w-6 h-6 text-gray-600" />
          <XMarkIcon v-else class="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMenuOpen"
        class="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2"
      >
        <router-link
          to="/"
          @click="isMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
        >
          Home
        </router-link>
        <router-link
          v-for="calc in calculators"
          :key="calc.id"
          :to="calc.path"
          @click="isMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          :class="{ 'text-blue-600 bg-blue-50': $route.path === calc.path }"
        >
          {{ calc.shortName }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { CALCULATORS } from '../config/calculators.js'

const calculators = CALCULATORS
const isMenuOpen = ref(false)
</script>

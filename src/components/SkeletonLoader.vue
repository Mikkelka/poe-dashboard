<template>
  <div class="skeleton-loader">
    <!-- Build Card Skeleton -->
    <div v-if="type === 'build-card'" class="loading-card">
      <div class="mb-4">
        <div class="loading-skeleton h-6 w-3/4 mb-2"></div>
      </div>
      
      <div class="flex justify-between items-center mb-5">
        <div class="flex items-center gap-2">
          <div class="loading-skeleton h-6 w-16"></div>
          <div class="loading-skeleton-avatar w-2 h-2"></div>
          <div class="loading-skeleton h-4 w-12"></div>
        </div>
        <div class="loading-skeleton h-6 w-20"></div>
      </div>
      
      <div class="mb-5 space-y-2">
        <div class="flex justify-between">
          <div class="loading-skeleton h-4 w-12"></div>
          <div class="loading-skeleton h-4 w-20"></div>
        </div>
        <div class="flex justify-between">
          <div class="loading-skeleton h-4 w-16"></div>
          <div class="loading-skeleton h-4 w-24"></div>
        </div>
        <div class="flex justify-between">
          <div class="loading-skeleton h-4 w-20"></div>
          <div class="loading-skeleton h-4 w-16"></div>
        </div>
      </div>

      <div class="flex gap-4 pt-4 border-t border-gray-700">
        <div class="loading-skeleton h-5 w-16"></div>
        <div class="loading-skeleton h-5 w-12"></div>
        <div class="loading-skeleton h-5 w-14"></div>
      </div>
    </div>

    <!-- Resource Card Skeleton -->
    <div v-else-if="type === 'resource-card'" class="loading-card">
      <div class="flex items-center gap-4">
        <div class="loading-skeleton h-12 w-12 rounded-lg"></div>
        <div class="flex-1">
          <div class="loading-skeleton h-5 w-3/4 mb-2"></div>
          <div class="loading-skeleton h-4 w-full mb-1"></div>
          <div class="loading-skeleton h-4 w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Text Lines Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div v-for="line in lines" :key="line" class="loading-skeleton-text" :style="{ width: `${Math.random() * 40 + 60}%` }"></div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else-if="type === 'custom'" class="loading-skeleton" :style="customStyle">
      <slot />
    </div>

    <!-- Default: Simple rectangular skeleton -->
    <div v-else class="loading-skeleton" :class="defaultClass"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // 'build-card', 'resource-card', 'text', 'custom', 'default'
    validator: (value) => ['build-card', 'resource-card', 'text', 'custom', 'default'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1rem'
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

const defaultClass = computed(() => {
  return `w-full`
})
</script>

<style scoped>
/* Component specific styles if needed */
</style>
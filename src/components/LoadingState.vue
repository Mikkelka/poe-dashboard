<template>
  <div v-if="loading" class="loading-state" :class="containerClass">
    <LoadingSpinner 
      :size="size" 
      :color="color" 
      :message="message"
      :show-text="showText"
      :inline="inline"
    />
  </div>
  <slot v-else />
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Indlæser...'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  },
  inline: {
    type: Boolean,
    default: false
  },
  minHeight: {
    type: String,
    default: 'auto'
  },
  padding: {
    type: String,
    default: 'py-8'
  }
})

const containerClass = computed(() => {
  const baseClasses = 'flex items-center justify-center'
  const heightClass = props.minHeight !== 'auto' ? `min-h-[${props.minHeight}]` : ''
  
  return `${baseClasses} ${props.padding} ${heightClass}`
})
</script>

<style scoped>
.loading-state {
  transition: opacity 0.2s ease-in-out;
}
</style>
<template>
  <div 
    v-if="show" 
    class="loading-overlay"
    :class="overlayClass"
  >
    <div class="loading-content">
      <LoadingSpinner 
        :size="size" 
        :color="spinnerColor" 
        :message="message"
        :show-text="showText"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  show: {
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
  overlay: {
    type: String,
    default: 'dark', // 'dark', 'light', 'transparent'
    validator: (value) => ['dark', 'light', 'transparent'].includes(value)
  },
  blur: {
    type: Boolean,
    default: true
  },
  showText: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 50
  }
})

const overlayClass = computed(() => {
  const baseClasses = 'fixed inset-0 flex items-center justify-center'
  const overlayClasses = {
    dark: 'bg-black/50',
    light: 'bg-white/75',
    transparent: 'bg-transparent'
  }
  const blurClass = props.blur ? 'backdrop-blur-sm' : ''
  const zIndexClass = `z-${props.zIndex}`
  
  return `${baseClasses} ${overlayClasses[props.overlay]} ${blurClass} ${zIndexClass}`
})

const spinnerColor = computed(() => {
  return props.overlay === 'light' ? 'secondary' : 'white'
})
</script>

<style scoped>
.loading-overlay {
  transition: all 0.2s ease-in-out;
}

.loading-content {
  @apply bg-slate-800/90 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-slate-600/50;
}

/* Override for light overlay */
.bg-white\/75 .loading-content {
  @apply bg-white/90 border-gray-200 text-gray-800;
}

/* Override for transparent overlay */
.bg-transparent .loading-content {
  @apply bg-slate-800/95;
}
</style>
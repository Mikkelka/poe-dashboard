<template>
  <div class="loading-spinner" :class="sizeClass">
    <div class="spinner" :class="colorClass"></div>
    <span v-if="showText && message" class="loading-text" :class="textClass">
      {{ message }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary', // 'primary', 'secondary', 'white'
    validator: (value) => ['primary', 'secondary', 'white'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: true
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const sizeClass = computed(() => {
  const classes = {
    small: 'text-sm gap-2',
    medium: 'text-base gap-3', 
    large: 'text-lg gap-4'
  }
  return `${classes[props.size]} ${props.inline ? 'flex items-center' : 'flex flex-col items-center justify-center'}`
})

const colorClass = computed(() => {
  const classes = {
    primary: 'border-slate-400',
    secondary: 'border-gray-500',
    white: 'border-white'
  }
  return classes[props.color]
})

const textClass = computed(() => {
  const classes = {
    primary: 'text-gray-300',
    secondary: 'text-gray-400',
    white: 'text-white'
  }
  return classes[props.color]
})
</script>

<style scoped>
.loading-spinner {
  @apply flex items-center justify-center;
}

.spinner {
  @apply animate-spin rounded-full border-2 border-t-transparent;
}

.spinner.border-slate-400 {
  @apply border-slate-400 border-t-transparent;
}

.spinner.border-gray-500 {
  @apply border-gray-500 border-t-transparent;
}

.spinner.border-white {
  @apply border-white border-t-transparent;
}

/* Size variants */
.text-sm .spinner {
  @apply w-4 h-4;
}

.text-base .spinner {
  @apply w-6 h-6;
}

.text-lg .spinner {
  @apply w-8 h-8;
}

.loading-text {
  @apply font-medium;
}
</style>
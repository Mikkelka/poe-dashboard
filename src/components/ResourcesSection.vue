<template>
  <section class="tab-content">
    <div class="section-header">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-semibold text-gray-200">Ressourcer</h2>
        <span class="count-badge">{{ visibleResourceCount }} links</span>
      </div>
      <div class="flex gap-3">
        <button 
          v-if="hiddenResources.length > 0" 
          @click="restoreAllResources" 
          class="btn-outline"
        >
          Gendan Alle ({{ hiddenResources.length }})
        </button>
        <button class="btn-primary" @click="$emit('add-resource')">+ Tilføj Ressource</button>
      </div>
    </div>
    
    <div v-if="loading" class="space-y-10">
      <div v-for="category in 4" :key="category" class="space-y-5">
        <div class="loading-skeleton h-8 w-48 mb-5"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonLoader v-for="n in 6" :key="n" type="resource-card" />
        </div>
      </div>
    </div>
    
    <div v-else-if="visibleResources.length === 0" class="empty-state">
      <h3>Ingen ressourcer synlige</h3>
      <p v-if="hiddenResources.length > 0">
        Alle ressourcer er skjulte. Klik "Gendan Alle" for at få dem tilbage.
      </p>
      <p v-else>
        Tilføj nyttige links og ressourcer til dine Path of Exile builds.
      </p>
    </div>
    
    <div v-else class="flex flex-col gap-10">
      <div 
        v-for="category in categorizedResources" 
        :key="category.name"
        class="space-y-5"
      >
        <h3 class="text-xl font-semibold text-gray-200 mb-5 pb-2 border-b border-slate-600/40">{{ category.name }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div 
            v-for="resource in category.resources" 
            :key="resource.id" 
            class="resource-card"
          >
            <div class="text-3xl min-w-10 flex items-center justify-center">{{ resource.icon }}</div>
            <div class="flex-1 min-w-0">
              <h4 class="text-gray-200 text-lg font-semibold mb-1">{{ resource.title }}</h4>
              <p class="text-gray-400 text-sm leading-relaxed">{{ resource.description }}</p>
            </div>
            <div class="flex flex-col gap-2 items-end">
              <a :href="resource.url" target="_blank" class="action-link">
                Åbn
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <button 
                v-if="!resource.isDefault"
                @click="$emit('edit-resource', resource)" 
                class="action-link text-green-400 hover:text-green-300 hover:bg-green-400/10"
                title="Rediger ressource"
              >
                Rediger
              </button>
              <button 
                @click="resource.isDefault ? hideResource(resource.id) : deleteResource(resource.id)" 
                class="action-link text-red-400 hover:text-red-300 hover:bg-red-400/10"
                :title="resource.isDefault ? 'Skjul ressource' : 'Slet ressource'"
              >
                {{ resource.isDefault ? 'Skjul' : 'Slet' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { defaultResources, categoryOrder } from '../data/resources.js'
import SkeletonLoader from './SkeletonLoader.vue'

const props = defineProps({
  resources: {
    type: Array,
    default: () => []
  },
  hiddenResourceIds: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-resource', 'edit-resource', 'hide-resource', 'delete-resource', 'restore-resources'])

// Optimized: Compute all resources filtering once
const resourcesData = computed(() => {
  // Combine default resources with custom user resources
  const customResources = props.resources.filter(r => !r.isDefault)
  const allResources = [...defaultResources, ...customResources]
  
  // Split into visible and hidden in one pass
  const visible = []
  const hidden = []
  
  allResources.forEach(resource => {
    if (props.hiddenResourceIds.includes(resource.id)) {
      hidden.push(resource)
    } else {
      visible.push(resource)
    }
  })
  
  // Group visible resources by category
  const categories = {}
  visible.forEach(resource => {
    if (!categories[resource.category]) {
      categories[resource.category] = []
    }
    categories[resource.category].push(resource)
  })
  
  // Return categorized data in specified order
  const categorizedResources = categoryOrder
    .filter(categoryName => categories[categoryName])
    .map(categoryName => ({
      name: categoryName,
      resources: categories[categoryName]
    }))
  
  return {
    visible,
    hidden,
    categorizedResources,
    visibleCount: visible.length
  }
})

// Accessor computed properties for template compatibility
const visibleResources = computed(() => resourcesData.value.visible)
const hiddenResources = computed(() => resourcesData.value.hidden)
const visibleResourceCount = computed(() => resourcesData.value.visibleCount)
const categorizedResources = computed(() => resourcesData.value.categorizedResources)

// Methods
const hideResource = (resourceId) => {
  emit('hide-resource', resourceId)
}

const deleteResource = (resourceId) => {
  emit('delete-resource', resourceId)
}

const restoreAllResources = () => {
  emit('restore-resources')
}
</script>

<style scoped>
/* Using Tailwind CSS classes - no custom CSS needed */
</style>
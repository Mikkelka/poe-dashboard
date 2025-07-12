<template>
  <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 transition-all hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-xl">
    <div class="mb-4">
      <div>
        <h3 class="text-xl font-semibold text-gray-200 mb-0">{{ build.buildName }}</h3>
      </div>
    </div>
    
    <div class="flex justify-between items-center mb-5">
      <div class="flex items-center gap-2">
        <span 
          class="px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide"
          :class="{
            'bg-orange-100 text-orange-600': build.gameVersion === 'poe1',
            'bg-green-100 text-green-600': build.gameVersion === 'poe2'
          }"
        >
          {{ build.gameVersion === 'poe1' ? 'PoE 1' : 'PoE 2' }}
        </span>
        <span 
          class="w-1.5 h-1.5 rounded-full"
          :class="{
            'bg-green-500': build.buildStatus === 'active',
            'bg-orange-500': build.buildStatus === 'paused',
            'bg-blue-500': build.buildStatus === 'completed'
          }"
        ></span>
        <span class="text-xs text-gray-400">{{ getStatusText(build.buildStatus) }}</span>
      </div>
      <div 
        class="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
        :class="{
          'bg-green-500/15 text-green-400': build.guideStatus === 'up-to-date',
          'bg-orange-500/15 text-orange-400': build.guideStatus === 'outdated',
          'bg-gray-500/15 text-gray-400': build.guideStatus === 'unknown'
        }"
      >
        <span>{{ getGuideIndicator(build.guideStatus) }}</span>
        <span>{{ getGuideText(build.guideStatus) }}</span>
      </div>
    </div>
    
    <div class="mb-5">
      <div class="flex justify-between mb-2">
        <span class="text-gray-400 text-sm">League</span>
        <span class="text-gray-200 font-medium text-sm">{{ build.league || 'N/A' }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-gray-400 text-sm">Character</span>
        <span class="text-gray-200 font-medium text-sm">{{ build.characterName || 'N/A' }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-gray-400 text-sm">Sidst åbnet</span>
        <span class="text-gray-200 font-medium text-sm">{{ formatLastOpened(build.lastOpened) }}</span>
      </div>
    </div>

    <div class="flex gap-4 pt-4 border-t border-gray-700">
      <a v-if="build.pobLink" :href="build.pobLink" target="_blank" class="flex items-center gap-1.5 text-gray-200 text-sm font-medium transition-colors hover:text-gray-400 cursor-pointer" @click="$emit('link-clicked', build.id)">
        <span>PoB Link</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <a v-if="build.guideLink" :href="build.guideLink" target="_blank" class="flex items-center gap-1.5 text-gray-200 text-sm font-medium transition-colors hover:text-gray-400 cursor-pointer" @click="$emit('link-clicked', build.id)">
        <span>Guide</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <button @click="$emit('edit-build', build)" class="flex items-center gap-1.5 text-gray-200 text-sm font-medium transition-colors hover:text-gray-400 cursor-pointer bg-none border-none">
        <span>Rediger</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { getStatusText, getGuideIndicator, getGuideText, formatLastOpened } from '../utils/helpers'

export default {
  name: 'BuildCard',
  props: {
    build: {
      type: Object,
      required: true
    }
  },
  emits: ['edit-build', 'link-clicked'],
  methods: {
    getStatusText,
    getGuideIndicator, 
    getGuideText,
    formatLastOpened
  }
}
</script>

<style scoped>
/* All styles converted to Tailwind CSS classes */
</style>
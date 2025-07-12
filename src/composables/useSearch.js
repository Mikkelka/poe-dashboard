import { ref, computed, watch, onUnmounted } from 'vue'

export function useSearch(builds) {
  // Search and filter state
  const filter = ref('all')
  const inputSearchQuery = ref('')
  const debouncedSearchQuery = ref('')
  
  // Debounce timer
  let searchDebounceTimer = null

  // Debounce search input
  watch(inputSearchQuery, (newValue) => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = newValue
    }, 300)
  })

  // Computed filtered builds
  const filteredBuilds = computed(() => {
    if (!builds.value) return []
    
    let filtered = builds.value

    // Apply filter
    if (filter.value !== 'all') {
      if (filter.value === 'active') {
        filtered = filtered.filter(build => build.buildStatus === 'active')
      } else {
        filtered = filtered.filter(build => build.gameVersion === filter.value)
      }
    }

    // Apply search
    if (debouncedSearchQuery.value) {
      const query = debouncedSearchQuery.value.toLowerCase()
      filtered = filtered.filter(build => 
        build.buildName.toLowerCase().includes(query) ||
        (build.characterName && build.characterName.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  // Cleanup
  const cleanup = () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }
  }

  // Cleanup on unmount
  onUnmounted(cleanup)

  return {
    // State
    filter,
    inputSearchQuery,
    debouncedSearchQuery,
    
    // Computed
    filteredBuilds,
    
    // Methods
    cleanup
  }
}
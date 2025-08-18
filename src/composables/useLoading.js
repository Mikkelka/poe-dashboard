import { ref, reactive } from 'vue'

export function useLoading() {
  // Global loading states
  const globalLoading = ref(false)
  const loadingStates = reactive({})
  
  // Set global loading state
  const setGlobalLoading = (isLoading, message = 'Indlæser...') => {
    globalLoading.value = isLoading
    if (isLoading) {
      loadingStates.global = { loading: true, message }
    } else {
      delete loadingStates.global
    }
  }
  
  // Set specific loading state
  const setLoading = (key, isLoading, message = 'Indlæser...') => {
    if (isLoading) {
      loadingStates[key] = { loading: true, message }
    } else {
      delete loadingStates[key]
    }
  }
  
  // Check if specific key is loading
  const isLoading = (key) => {
    return loadingStates[key]?.loading || false
  }
  
  // Get loading message for specific key
  const getLoadingMessage = (key) => {
    return loadingStates[key]?.message || 'Indlæser...'
  }
  
  // Check if any loading is active
  const hasAnyLoading = () => {
    return Object.keys(loadingStates).length > 0 || globalLoading.value
  }
  
  // Clear all loading states
  const clearAllLoading = () => {
    Object.keys(loadingStates).forEach(key => {
      delete loadingStates[key]
    })
    globalLoading.value = false
  }
  
  // Async wrapper that automatically handles loading states
  const withLoading = async (key, asyncFn, message = 'Indlæser...') => {
    try {
      setLoading(key, true, message)
      const result = await asyncFn()
      return result
    } finally {
      setLoading(key, false)
    }
  }
  
  return {
    // States
    globalLoading,
    loadingStates,
    
    // Methods
    setGlobalLoading,
    setLoading,
    isLoading,
    getLoadingMessage,
    hasAnyLoading,
    clearAllLoading,
    withLoading
  }
}

// Create a singleton instance for global use
export const globalLoading = useLoading()
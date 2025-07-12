import { ref } from 'vue'

export function useTab(defaultTab = 'builds') {
  // Tab state
  const activeTab = ref(defaultTab)

  return {
    activeTab
  }
}
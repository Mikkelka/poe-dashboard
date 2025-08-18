import { ref, onUnmounted } from 'vue'
import { 
  subscribeToUserResources, 
  deleteResource
} from '../firebase'

export function useResources() {
  // Resources state
  const customResources = ref([])
  const hiddenResourceIds = ref([])
  const showResourceModal = ref(false)
  const editingResource = ref(null)
  const loading = ref(false)
  
  // Subscription cleanup functions
  let unsubscribeResources = null
  
  // localStorage key for hidden resources
  const HIDDEN_RESOURCES_KEY = 'poe-dashboard-hidden-resources'

  // Modal management
  const handleAddResource = () => {
    editingResource.value = null
    showResourceModal.value = true
  }

  const handleEditResource = (resource) => {
    editingResource.value = resource
    showResourceModal.value = true
  }

  const closeResourceModal = () => {
    showResourceModal.value = false
    editingResource.value = null
  }

  const handleResourceSaved = () => {
    // Modal will be closed by closeResourceModal
    // Resources will be automatically updated via real-time subscription
  }

  // Resource operations
  const handleDeleteResource = async (resourceId) => {
    if (confirm('Er du sikker på, at du vil slette denne ressource?')) {
      const result = await deleteResource(resourceId)
      if (result.error) {
        console.error('Error deleting resource:', result.error)
      }
    }
  }

  // localStorage helper functions
  const getHiddenResourceIds = () => {
    try {
      const stored = localStorage.getItem(HIDDEN_RESOURCES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Error reading hidden resources from localStorage:', error)
      return []
    }
  }

  const setHiddenResourceIds = (ids) => {
    try {
      localStorage.setItem(HIDDEN_RESOURCES_KEY, JSON.stringify(ids))
      hiddenResourceIds.value = ids
    } catch (error) {
      console.warn('Error saving hidden resources to localStorage:', error)
    }
  }

  const handleHideResource = (resourceId) => {
    if (!hiddenResourceIds.value.includes(resourceId)) {
      const newHiddenIds = [...hiddenResourceIds.value, resourceId]
      setHiddenResourceIds(newHiddenIds)
    }
  }

  const handleRestoreResources = () => {
    setHiddenResourceIds([])
  }

  // Initialize resources subscriptions for authenticated user
  const initializeResourcesSubscriptions = (userId) => {
    // Clean up existing subscriptions
    cleanupResourcesSubscriptions()
    
    if (userId) {
      loading.value = true
      
      // Subscribe to user resources
      unsubscribeResources = subscribeToUserResources(userId, (userResources) => {
        customResources.value = userResources
        loading.value = false
      })
      
      // Load hidden resources from localStorage
      hiddenResourceIds.value = getHiddenResourceIds()
    } else {
      // Clear data when no user
      customResources.value = []
      hiddenResourceIds.value = []
      loading.value = false
    }
  }

  // Cleanup subscriptions
  const cleanupResourcesSubscriptions = () => {
    if (unsubscribeResources) {
      unsubscribeResources()
      unsubscribeResources = null
    }
    customResources.value = []
    hiddenResourceIds.value = []
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupResourcesSubscriptions()
  })

  return {
    // State
    customResources,
    hiddenResourceIds,
    showResourceModal,
    editingResource,
    loading,
    
    // Methods
    handleAddResource,
    handleEditResource,
    closeResourceModal,
    handleResourceSaved,
    handleDeleteResource,
    handleHideResource,
    handleRestoreResources,
    initializeResourcesSubscriptions,
    cleanupResourcesSubscriptions
  }
}
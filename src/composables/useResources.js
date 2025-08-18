import { ref, onUnmounted } from 'vue'
import { 
  subscribeToUserResources, 
  subscribeToUserPreferences, 
  deleteResource, 
  updateUserPreferences 
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
  let unsubscribePreferences = null

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

  const handleHideResource = async (resourceId, userId) => {
    if (!hiddenResourceIds.value.includes(resourceId) && userId) {
      const newHiddenIds = [...hiddenResourceIds.value, resourceId]
      await updateUserPreferences(userId, { hiddenResourceIds: newHiddenIds })
    }
  }

  const handleRestoreResources = async (userId) => {
    if (userId) {
      await updateUserPreferences(userId, { hiddenResourceIds: [] })
    }
  }

  // Initialize resources and preferences subscriptions for authenticated user
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
      
      // Subscribe to user preferences
      unsubscribePreferences = subscribeToUserPreferences(userId, (preferences) => {
        hiddenResourceIds.value = preferences.hiddenResourceIds || []
      })
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
    if (unsubscribePreferences) {
      unsubscribePreferences()
      unsubscribePreferences = null
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
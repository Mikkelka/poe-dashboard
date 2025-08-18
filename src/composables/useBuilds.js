import { ref, onUnmounted } from 'vue'
import { subscribeToUserBuilds, updateLastOpened, deleteBuild } from '../firebase'

export function useBuilds() {
  // Builds state
  const builds = ref([])
  const showModal = ref(false)
  const editingBuild = ref(null)
  
  // Subscription cleanup
  let unsubscribeBuilds = null

  // Modal management
  const openAddBuildModal = () => {
    editingBuild.value = null
    showModal.value = true
  }

  const openEditBuildModal = async (build) => {
    editingBuild.value = build
    showModal.value = true
    
    // Update last opened timestamp
    await updateLastOpened(build.id)
  }

  const closeModal = () => {
    showModal.value = false
    editingBuild.value = null
  }

  const handleBuildSaved = () => {
    // Modal will be closed by closeModal
    // Builds will be automatically updated via real-time subscription
  }

  const handleLinkClicked = async (buildId) => {
    // Update last opened timestamp when user clicks on build links
    await updateLastOpened(buildId)
  }

  const handleDeleteBuild = async (buildId, buildName) => {
    // Confirm deletion
    const confirmed = window.confirm(`Er du sikker på, at du vil slette "${buildName}"? Denne handling kan ikke fortrydes.`)
    
    if (!confirmed) {
      return { success: false, error: null }
    }

    try {
      const result = await deleteBuild(buildId)
      if (result.error) {
        console.error('Error deleting build:', result.error)
        return { success: false, error: 'Kunne ikke slette build. Prøv igen.' }
      }
      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting build:', error)
      return { success: false, error: 'Kunne ikke slette build. Prøv igen.' }
    }
  }

  // Initialize builds subscription for authenticated user
  const initializeBuildsSubscription = (userId) => {
    if (unsubscribeBuilds) {
      unsubscribeBuilds()
    }
    
    if (userId) {
      unsubscribeBuilds = subscribeToUserBuilds(userId, (userBuilds) => {
        builds.value = userBuilds
      })
    } else {
      builds.value = []
    }
  }

  // Cleanup subscription
  const cleanupBuildsSubscription = () => {
    if (unsubscribeBuilds) {
      unsubscribeBuilds()
      unsubscribeBuilds = null
    }
    builds.value = []
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupBuildsSubscription()
  })

  return {
    // State
    builds,
    showModal,
    editingBuild,
    
    // Methods
    openAddBuildModal,
    openEditBuildModal,
    closeModal,
    handleBuildSaved,
    handleLinkClicked,
    handleDeleteBuild,
    initializeBuildsSubscription,
    cleanupBuildsSubscription
  }
}
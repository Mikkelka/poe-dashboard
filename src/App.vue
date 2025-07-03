<template>
  <div id="app">
    <!-- Authentication Section -->
    <div v-if="!user" class="auth-container">
      <div class="auth-form">
        <h1>PoE Tracker</h1>
        <p>Log ind for at få adgang til dine builds</p>
        
        <div class="auth-form-content">
          <button 
            @click="handleGoogleSignIn" 
            class="btn-google" 
            :disabled="loading"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {{ loading ? 'Logger ind...' : 'Log ind med Google' }}
          </button>
        </div>
        
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>
      </div>
    </div>

    <!-- Main App Content -->
    <div v-else class="container">
      <!-- Header -->
      <Header 
        :user="user" 
        @logout="handleLogout" 
        @new-build="openAddBuildModal" 
      />

      <!-- Navigation Tabs -->
      <Navigation 
        :active-tab="activeTab" 
        @tab-change="activeTab = $event" 
      />

      <!-- Main Content -->
      <main class="main">
        <!-- Builds Section -->
        <section v-if="activeTab === 'builds'" class="tab-content">
          <div class="section-header">
            <div class="section-title">
              <h2>Mine Builds</h2>
              <span class="count">{{ builds.length }} builds</span>
            </div>
            <div class="filters">
              <select v-model="filter" class="filter-dropdown">
                <option value="all">Alle builds</option>
                <option value="poe1">Path of Exile 1</option>
                <option value="poe2">Path of Exile 2</option>
                <option value="active">Kun aktive</option>
              </select>
              <div class="search-box">
                <input 
                  v-model="inputSearchQuery" 
                  type="text" 
                  placeholder="Søg builds..." 
                />
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading">
            Indlæser builds...
          </div>

          <div v-else-if="filteredBuilds.length === 0" class="empty-state">
            <h3>Ingen builds fundet</h3>
            <p>Tilføj dit første build for at komme i gang!</p>
          </div>

          <div v-else class="builds-grid">
            <BuildCard 
              v-for="build in filteredBuilds" 
              :key="build.id" 
              :build="build"
              @edit-build="openEditBuildModal"
              @link-clicked="handleLinkClicked"
            />
          </div>
        </section>

        <!-- Resources Section -->
        <ResourcesSection 
          v-if="activeTab === 'resources'" 
          :resources="customResources"
          :hidden-resource-ids="hiddenResourceIds"
          @add-resource="handleAddResource"
          @edit-resource="handleEditResource"
          @hide-resource="handleHideResource"
          @delete-resource="handleDeleteResource"
          @restore-resources="handleRestoreResources"
        />
      </main>
    </div>

    <!-- Add/Edit Build Modal -->
    <BuildModal 
      :show="showModal"
      :editing-build="editingBuild"
      :user-id="user?.uid || ''"
      @close="closeModal"
      @saved="handleBuildSaved"
    />

    <!-- Add/Edit Resource Modal -->
    <ResourceModal 
      :show="showResourceModal"
      :editing-resource="editingResource"
      :user-id="user?.uid || ''"
      @close="closeResourceModal"
      @saved="handleResourceSaved"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { onAuthChange, signInWithGoogle, logoutUser, subscribeToUserBuilds, subscribeToUserResources, deleteResource, updateLastOpened, subscribeToUserPreferences, updateUserPreferences } from './firebase'
import { getStatusText, getGuideIndicator, getGuideText, formatLastOpened } from './utils/helpers'
import BuildModal from './components/BuildModal.vue'
import ResourceModal from './components/ResourceModal.vue'
import Header from './components/Header.vue'
import Navigation from './components/Navigation.vue'
import BuildCard from './components/BuildCard.vue'
import ResourcesSection from './components/ResourcesSection.vue'

export default {
  name: 'App',
  components: {
    BuildModal,
    ResourceModal,
    Header,
    Navigation,
    BuildCard,
    ResourcesSection
  },
  setup() {
    // Authentication state
    const user = ref(null)
    const authError = ref('')
    const loading = ref(false)

    // App state
    const activeTab = ref('builds')
    const builds = ref([])
    const filter = ref('all')
    const inputSearchQuery = ref('')
    const debouncedSearchQuery = ref('')
    const showModal = ref(false)
    const editingBuild = ref(null)
    const showResourceModal = ref(false)
    const editingResource = ref(null)
    const customResources = ref([])
    const hiddenResourceIds = ref([])
    
    let unsubscribeAuth = null
    let unsubscribeBuilds = null
    let unsubscribeResources = null
    let unsubscribePreferences = null
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

    // Authentication methods
    const handleGoogleSignIn = async () => {
      loading.value = true
      authError.value = ''
      
      try {
        const result = await signInWithGoogle()
        
        if (result.error) {
          authError.value = result.error
        }
      } catch (error) {
        authError.value = 'Der opstod en fejl under login. Prøv igen.'
      } finally {
        loading.value = false
      }
    }

    const handleLogout = async () => {
      await logoutUser()
    }

    // Build management
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

    const handleLinkClicked = async (buildId) => {
      // Update last opened timestamp when user clicks on build links
      await updateLastOpened(buildId)
    }

    const closeModal = () => {
      showModal.value = false
      editingBuild.value = null
    }

    const handleBuildSaved = () => {
      // Modal will be closed by closeModal
      // Builds will be automatically updated via real-time subscription
    }

    // Computed properties
    const filteredBuilds = computed(() => {
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


    // Resource management
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

    const handleDeleteResource = async (resourceId) => {
      if (confirm('Er du sikker på, at du vil slette denne ressource?')) {
        const result = await deleteResource(resourceId)
        if (result.error) {
          console.error('Error deleting resource:', result.error)
        }
      }
    }

    const handleHideResource = async (resourceId) => {
      if (!hiddenResourceIds.value.includes(resourceId) && user.value) {
        const newHiddenIds = [...hiddenResourceIds.value, resourceId]
        await updateUserPreferences(user.value.uid, { hiddenResourceIds: newHiddenIds })
      }
    }

    const handleRestoreResources = async () => {
      if (user.value) {
        await updateUserPreferences(user.value.uid, { hiddenResourceIds: [] })
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      // Listen for auth state changes
      unsubscribeAuth = onAuthChange((authUser) => {
        user.value = authUser
        
        // Clean up existing subscriptions first
        if (unsubscribeBuilds) {
          unsubscribeBuilds()
          unsubscribeBuilds = null
        }
        if (unsubscribeResources) {
          unsubscribeResources()
          unsubscribeResources = null
        }
        if (unsubscribePreferences) {
          unsubscribePreferences()
          unsubscribePreferences = null
        }
        
        if (authUser) {
          // Subscribe to builds when user logs in
          unsubscribeBuilds = subscribeToUserBuilds(authUser.uid, (userBuilds) => {
            builds.value = userBuilds
          })
          
          // Subscribe to resources when user logs in
          unsubscribeResources = subscribeToUserResources(authUser.uid, (userResources) => {
            customResources.value = userResources
          })
          
          // Subscribe to user preferences when user logs in
          unsubscribePreferences = subscribeToUserPreferences(authUser.uid, (preferences) => {
            hiddenResourceIds.value = preferences.hiddenResourceIds || []
          })
        } else {
          // Clear data when user logs out
          builds.value = []
          customResources.value = []
          hiddenResourceIds.value = []
        }
      })
    })

    onUnmounted(() => {
      if (unsubscribeAuth) unsubscribeAuth()
      if (unsubscribeBuilds) unsubscribeBuilds()
      if (unsubscribeResources) unsubscribeResources()
      if (unsubscribePreferences) unsubscribePreferences()
    })

    return {
      // Auth
      user,
      authError,
      loading,
      handleGoogleSignIn,
      handleLogout,
      
      // App state
      activeTab,
      builds,
      filter,
      inputSearchQuery,
      showModal,
      editingBuild,
      filteredBuilds,
      
      // Methods
      openAddBuildModal,
      openEditBuildModal,
      handleLinkClicked,
      closeModal,
      handleBuildSaved,
      handleAddResource,
      handleEditResource,
      closeResourceModal,
      handleResourceSaved,
      handleDeleteResource,
      handleHideResource,
      handleRestoreResources,
      getStatusText,
      getGuideIndicator,
      getGuideText,
      formatLastOpened,
      
      // Resource state
      showResourceModal,
      editingResource,
      customResources,
      hiddenResourceIds
    }
  }
}
</script>

<style scoped>
/* Authentication Styles */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-form {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-form h1 {
  color: #e5e5e5;
  font-size: 2rem;
  margin-bottom: 8px;
}

.auth-form p {
  color: #999999;
  margin-bottom: 32px;
}

.auth-form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group input {
  width: 100%;
  background: #0f0f0f;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  color: #e5e5e5;
  font-size: 0.9rem;
}

.form-group input:focus {
  outline: none;
  border-color: #e5e5e5;
}

.form-group input::placeholder {
  color: #666666;
}

.btn-primary {
  background: #e5e5e5;
  color: #1a1a1a;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #cccccc;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  margin-top: 16px;
}

.btn-link:hover {
  color: #e5e5e5;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #ffffff;
  color: #1f1f1f;
  border: 1px solid #dadce0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-google:hover:not(:disabled) {
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
  background: #f8f9fa;
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  margin-top: 16px;
  font-size: 0.9rem;
}

/* Main App Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header {
  background: #1a1a1a;
  border-bottom: 1px solid #333333;
  padding: 24px 0;
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e5e5e5;
  margin-bottom: 4px;
}

.brand p {
  color: #999999;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-welcome {
  color: #999999;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: #e5e5e5;
  border: 1px solid #333333;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: #e5e5e5;
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid #333333;
  margin-bottom: 40px;
}

.tab {
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #999999;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: #e5e5e5;
}

.tab.active {
  color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e5e5e5;
}

.count {
  background: #333333;
  color: #999999;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-dropdown {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #e5e5e5;
  cursor: pointer;
}

.search-box input {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #e5e5e5;
  width: 200px;
}

.search-box input:focus {
  outline: none;
  border-color: #e5e5e5;
}

/* Loading and Empty States */
.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.empty-state h3 {
  color: #e5e5e5;
  margin-bottom: 8px;
}

/* Builds Grid */
.builds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.build-card {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.build-card:hover {
  border-color: #555555;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.build-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.build-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: 8px;
}

.build-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.game-badge.poe1 {
  background: #fff3e0;
  color: #f57c00;
}

.game-badge.poe2 {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.active {
  background: #4caf50;
}

.status-dot.paused {
  background: #ff9800;
}

.status-dot.completed {
  background: #2196f3;
}

.status-text {
  font-size: 0.8rem;
  color: #999999;
}

.build-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.guide-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.guide-status.up-to-date {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.guide-status.outdated {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.guide-status.unknown {
  background: rgba(158, 158, 158, 0.15);
  color: #9e9e9e;
}

/* Build Details */
.build-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item .label {
  color: #999999;
  font-size: 0.9rem;
}

.detail-item .value {
  color: #e5e5e5;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Build Actions */
.build-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #333333;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.action-link:hover {
  color: #999999;
}


/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .filters {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .builds-grid {
    grid-template-columns: 1fr;
  }
}
</style>
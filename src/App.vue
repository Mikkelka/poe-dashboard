<template>
  <div id="app" class="w-full min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-gray-200">
    <!-- Authentication Section -->
    <div v-if="!user" class="flex justify-center items-center min-h-screen p-5">
      <div class="auth-form">
        <h1 class="text-gray-200 text-3xl font-bold mb-2">PoE Tracker</h1>
        <p class="text-gray-400 mb-8">Log ind for at få adgang til dine builds</p>
        
        <div class="flex flex-col gap-4">
          <button 
            @click="handleGoogleSignIn" 
            class="btn-google" 
            :class="{ 'btn-loading': loading }"
            :disabled="loading"
          >
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div v-if="loading" class="w-5 h-5 border-2 border-gray-600 border-t-gray-900 rounded-full animate-spin"></div>
            {{ loading ? 'Logger ind...' : 'Log ind med Google' }}
          </button>
        </div>
        
        <div v-if="authError" class="error-message">
          {{ authError }}
        </div>
      </div>
    </div>

    <!-- Main App Content -->
    <div v-else class="container-main">
      <!-- Header -->
      <AppHeader 
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
      <main>
        <!-- Builds Section -->
        <section v-if="activeTab === 'builds'">
          <div class="section-header">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-semibold text-gray-200">Mine Builds</h2>
              <span class="count-badge">{{ builds.length }} builds</span>
            </div>
            <div class="flex items-center gap-4">
              <select v-model="filter" class="select-dropdown">
                <option value="all">Alle builds</option>
                <option value="poe1">Path of Exile 1</option>
                <option value="poe2">Path of Exile 2</option>
                <option value="active">Kun aktive</option>
              </select>
              <div>
                <input 
                  v-model="inputSearchQuery" 
                  type="text" 
                  placeholder="Søg builds..." 
                  class="input-search"
                />
              </div>
            </div>
          </div>

          <LoadingState v-if="loading" :loading="true" message="Indlæser builds..." min-height="400px">
            <div class="builds-grid">
              <SkeletonLoader v-for="n in 6" :key="n" type="build-card" />
            </div>
          </LoadingState>

          <div v-else-if="filteredBuilds.length === 0" class="text-center py-16 text-gray-400">
            <h3 class="text-gray-200 mb-2">Ingen builds fundet</h3>
            <p>Tilføj dit første build for at komme i gang!</p>
          </div>

          <div v-else class="builds-grid">
            <BuildCard 
              v-for="build in filteredBuilds" 
              :key="build.id" 
              :build="build"
              @edit-build="openEditBuildModal"
              @link-clicked="handleLinkClicked"
              @delete-build="handleDeleteBuild"
            />
          </div>
        </section>

        <!-- Resources Section -->
        <ResourcesSection 
          v-if="activeTab === 'resources'" 
          :resources="customResources"
          :hidden-resource-ids="hiddenResourceIds"
          :loading="resourcesLoading"
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
import { onMounted } from 'vue'
import { getStatusText, getGuideIndicator, getGuideText, formatLastOpened } from './utils/helpers'
import { useAuth } from './composables/useAuth'
import { useBuilds } from './composables/useBuilds'
import { useResources } from './composables/useResources'
import { useSearch } from './composables/useSearch'
import { useTab } from './composables/useTab'
import BuildModal from './components/BuildModal.vue'
import ResourceModal from './components/ResourceModal.vue'
import AppHeader from './components/AppHeader.vue'
import Navigation from './components/Navigation.vue'
import BuildCard from './components/BuildCard.vue'
import ResourcesSection from './components/ResourcesSection.vue'
import LoadingState from './components/LoadingState.vue'
import SkeletonLoader from './components/SkeletonLoader.vue'

export default {
  name: 'App',
  components: {
    BuildModal,
    ResourceModal,
    AppHeader,
    Navigation,
    BuildCard,
    ResourcesSection,
    LoadingState,
    SkeletonLoader
  },
  setup() {
    // Initialize composables
    const auth = useAuth()
    const builds = useBuilds()
    const resources = useResources()
    const search = useSearch(builds.builds)
    const tab = useTab()

    // Setup authentication state change handler
    onMounted(() => {
      auth.initializeAuth((authUser) => {
        // Initialize data subscriptions when auth state changes
        const userId = authUser?.uid || null
        
        // Initialize builds subscription
        builds.initializeBuildsSubscription(userId)
        
        // Initialize resources subscriptions
        resources.initializeResourcesSubscriptions(userId)
      })
    })

    // Wrapper methods to pass user context to resources
    const handleHideResource = async (resourceId) => {
      await resources.handleHideResource(resourceId, auth.user.value?.uid)
    }

    const handleRestoreResources = async () => {
      await resources.handleRestoreResources(auth.user.value?.uid)
    }

    const handleDeleteBuild = async (build) => {
      const result = await builds.handleDeleteBuild(build.id, build.buildName)
      if (result.error) {
        // You could add toast notification here
        alert(result.error)
      }
    }

    return {
      // Authentication
      user: auth.user,
      authError: auth.authError,
      loading: auth.loading,
      handleGoogleSignIn: auth.handleGoogleSignIn,
      handleLogout: auth.handleLogout,
      
      // Tab management
      activeTab: tab.activeTab,
      
      // Builds
      builds: builds.builds,
      showModal: builds.showModal,
      editingBuild: builds.editingBuild,
      openAddBuildModal: builds.openAddBuildModal,
      openEditBuildModal: builds.openEditBuildModal,
      handleLinkClicked: builds.handleLinkClicked,
      handleDeleteBuild,
      closeModal: builds.closeModal,
      handleBuildSaved: builds.handleBuildSaved,
      
      // Search and filtering
      filter: search.filter,
      inputSearchQuery: search.inputSearchQuery,
      filteredBuilds: search.filteredBuilds,
      
      // Resources
      customResources: resources.customResources,
      hiddenResourceIds: resources.hiddenResourceIds,
      resourcesLoading: resources.loading,
      showResourceModal: resources.showResourceModal,
      editingResource: resources.editingResource,
      handleAddResource: resources.handleAddResource,
      handleEditResource: resources.handleEditResource,
      closeResourceModal: resources.closeResourceModal,
      handleResourceSaved: resources.handleResourceSaved,
      handleDeleteResource: resources.handleDeleteResource,
      handleHideResource,
      handleRestoreResources,
      
      // Helper methods
      getStatusText,
      getGuideIndicator,
      getGuideText,
      formatLastOpened
    }
  }
}
</script>

<style scoped>
/* All styles converted to Tailwind CSS classes */
</style>
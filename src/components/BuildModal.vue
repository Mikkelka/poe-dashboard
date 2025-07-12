<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal glass-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingBuild ? 'Rediger Build' : 'Tilføj Nyt Build' }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div class="flex flex-col gap-1.5">
            <label for="buildName" class="text-gray-200 text-sm font-medium">Build Navn *</label>
            <input 
              v-model="formData.buildName" 
              type="text" 
              id="buildName"
              placeholder="Lightning Strike Champion" 
              required
              class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="gameVersion" class="text-gray-200 text-sm font-medium">Spil *</label>
            <select v-model="formData.gameVersion" id="gameVersion" required class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors">
              <option value="">Vælg spil</option>
              <option value="poe1">Path of Exile 1</option>
              <option value="poe2">Path of Exile 2</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div class="flex flex-col gap-1.5">
            <label for="characterName" class="text-gray-200 text-sm font-medium">Character Navn</label>
            <input 
              v-model="formData.characterName" 
              type="text" 
              id="characterName"
              placeholder="StormWarrior"
              class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="league" class="text-gray-200 text-sm font-medium">League</label>
            <input 
              v-model="formData.league" 
              type="text" 
              id="league"
              placeholder="Early Access"
              class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div class="flex flex-col gap-1.5">
            <label for="buildStatus" class="text-gray-200 text-sm font-medium">Status *</label>
            <select v-model="formData.buildStatus" id="buildStatus" required class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors">
              <option value="active">Aktiv</option>
              <option value="paused">Pause</option>
              <option value="completed">Færdig</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="guideStatus" class="text-gray-200 text-sm font-medium">Guide Status</label>
            <select v-model="formData.guideStatus" id="guideStatus" class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors">
              <option value="unknown">Ukendt</option>
              <option value="up-to-date">Opdateret</option>
              <option value="outdated">Forældet</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="pobLink" class="text-gray-200 text-sm font-medium">Path of Building Link</label>
          <input 
            v-model="formData.pobLink" 
            type="url" 
            id="pobLink"
            placeholder="https://pobb.in/..."
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
          />
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="guideLink" class="text-gray-200 text-sm font-medium">Guide Link</label>
          <input 
            v-model="formData.guideLink" 
            type="url" 
            id="guideLink"
            placeholder="https://maxroll.gg/..."
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
          />
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="notes" class="text-gray-200 text-sm font-medium">Noter</label>
          <textarea 
            v-model="formData.notes" 
            id="notes"
            rows="3" 
            placeholder="Ekstra noter om buildet..."
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500 resize-none"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="flex gap-3 justify-end mt-8 pt-5 border-t border-slate-600/40">
          <button type="button" class="btn-outline" @click="closeModal" :disabled="loading">
            Annuller
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Gemmer...' : (editingBuild ? 'Gem Ændringer' : 'Gem Build') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { addBuild, updateBuild } from '../firebase'

export default {
  name: 'BuildModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editingBuild: {
      type: Object,
      default: null
    },
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')

    // Form data
    const defaultFormData = {
      buildName: '',
      gameVersion: '',
      characterName: '',
      league: '',
      buildStatus: 'active',
      guideStatus: 'unknown',
      pobLink: '',
      guideLink: '',
      notes: ''
    }

    const formData = reactive({ ...defaultFormData })

    // Watch for editing build changes
    watch(() => props.editingBuild, (newBuild) => {
      if (newBuild) {
        // Populate form with existing build data
        Object.assign(formData, {
          buildName: newBuild.buildName || '',
          gameVersion: newBuild.gameVersion || '',
          characterName: newBuild.characterName || '',
          league: newBuild.league || '',
          buildStatus: newBuild.buildStatus || 'active',
          guideStatus: newBuild.guideStatus || 'unknown',
          pobLink: newBuild.pobLink || '',
          guideLink: newBuild.guideLink || '',
          notes: newBuild.notes || ''
        })
      } else {
        // Reset form for new build
        Object.assign(formData, defaultFormData)
      }
      error.value = ''
    }, { immediate: true })

    // Watch for show prop changes to reset form
    watch(() => props.show, (isShowing) => {
      if (!isShowing) {
        error.value = ''
      }
    })

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        let result
        
        if (props.editingBuild) {
          // Update existing build
          result = await updateBuild(props.editingBuild.id, formData)
        } else {
          // Create new build
          result = await addBuild(props.userId, formData)
        }

        if (result.error) {
          error.value = result.error
        } else {
          emit('saved')
          // Reset form for new builds only
          if (!props.editingBuild) {
            Object.assign(formData, defaultFormData)
          }
          closeModal()
        }
      } catch (err) {
        error.value = 'Der opstod en fejl. Prøv igen.'
        console.error('Build save error:', err)
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      // Reset form when closing modal for new builds
      if (!props.editingBuild) {
        Object.assign(formData, defaultFormData)
      }
      error.value = ''
      emit('close')
    }

    const handleOverlayClick = (event) => {
      if (event.target === event.currentTarget) {
        closeModal()
      }
    }

    return {
      formData,
      loading,
      error,
      handleSubmit,
      closeModal,
      handleOverlayClick
    }
  }
}
</script>

<style scoped>
/* Using Tailwind CSS classes from style.css - no custom CSS needed */
</style>

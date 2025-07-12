<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal glass-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingResource ? 'Rediger Ressource' : 'Tilføj Ny Ressource' }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div class="flex flex-col gap-1.5">
            <label for="title" class="text-gray-200 text-sm font-medium">Titel *</label>
            <input 
              v-model="formData.title" 
              type="text" 
              id="title"
              placeholder="PoE Planner" 
              required
              class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="category" class="text-gray-200 text-sm font-medium">Kategori *</label>
            <select v-model="formData.category" id="category" required class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors">
              <option value="">Vælg kategori</option>
              <option value="Path of Exile 1">Path of Exile 1</option>
              <option value="Path of Exile 2">Path of Exile 2</option>
              <option value="Programs">Programs</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="description" class="text-gray-200 text-sm font-medium">Beskrivelse *</label>
          <input 
            v-model="formData.description" 
            type="text" 
            id="description"
            placeholder="Detaljeret build planlægning værktøj"
            required
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
          />
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="url" class="text-gray-200 text-sm font-medium">URL *</label>
          <input 
            v-model="formData.url" 
            type="url" 
            id="url"
            placeholder="https://example.com"
            required
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500"
          />
        </div>

        <div class="flex flex-col gap-1.5 mb-5">
          <label for="icon" class="text-gray-200 text-sm font-medium">Ikon (Emoji)</label>
          <div class="flex flex-col gap-3">
            <input 
              v-model="formData.icon" 
              type="text" 
              id="icon"
              placeholder="🔧"
              maxlength="2"
              class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500 w-20 text-center text-lg"
            />
            <div class="grid grid-cols-10 gap-2 p-3 bg-slate-900/50 border border-slate-600/50 rounded-lg max-h-40 overflow-y-auto">
              <button 
                v-for="emoji in commonEmojis" 
                :key="emoji"
                type="button"
                @click="formData.icon = emoji"
                class="w-8 h-8 flex items-center justify-center bg-transparent border border-slate-600/50 rounded-md cursor-pointer text-lg transition-all hover:border-slate-400 hover:bg-slate-800/50"
                :class="{ 'border-slate-400 bg-slate-700/50': formData.icon === emoji }"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="flex gap-3 justify-end mt-8 pt-5 border-t border-slate-600/40">
          <button type="button" class="btn-outline" @click="closeModal" :disabled="loading">
            Annuller
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Gemmer...' : (editingResource ? 'Gem Ændringer' : 'Gem Ressource') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { addResource, updateResource } from '../firebase'

export default {
  name: 'ResourceModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editingResource: {
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

    // Common emojis for quick selection
    const commonEmojis = ['🔧', '📊', '💰', '📈', '🆕', '📚', '📋', '⚡', '🔄', '💬', '🗨️', '📖', '🏗️', '🎮', '⚔️', '🛡️', '💎', '🎯', '📝', '🔍']

    // Form data
    const defaultFormData = {
      title: '',
      description: '',
      url: '',
      icon: '🔧',
      category: ''
    }

    const formData = reactive({ ...defaultFormData })

    // Watch for editing resource changes
    watch(() => props.editingResource, (newResource) => {
      if (newResource) {
        // Populate form with existing resource data
        Object.assign(formData, {
          title: newResource.title || '',
          description: newResource.description || '',
          url: newResource.url || '',
          icon: newResource.icon || '🔧',
          category: newResource.category || ''
        })
      } else {
        // Reset form for new resource
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
        
        if (props.editingResource) {
          // Update existing resource
          result = await updateResource(props.editingResource.id, formData)
        } else {
          // Create new resource
          result = await addResource(props.userId, formData)
        }

        if (result.error) {
          error.value = result.error
        } else {
          emit('saved')
          // Reset form for new resources only
          if (!props.editingResource) {
            Object.assign(formData, defaultFormData)
          }
          closeModal()
        }
      } catch (err) {
        error.value = 'Der opstod en fejl. Prøv igen.'
        console.error('Resource save error:', err)
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      // Reset form when closing modal for new resources
      if (!props.editingResource) {
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
      commonEmojis,
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

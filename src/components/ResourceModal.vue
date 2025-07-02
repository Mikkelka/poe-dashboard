<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingResource ? 'Rediger Ressource' : 'Tilføj Ny Ressource' }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-content">
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titel *</label>
            <input 
              v-model="formData.title" 
              type="text" 
              id="title"
              placeholder="PoE Planner" 
              required
            />
          </div>
          <div class="form-group">
            <label for="category">Kategori *</label>
            <select v-model="formData.category" id="category" required>
              <option value="">Vælg kategori</option>
              <option value="Path of Exile 1">Path of Exile 1</option>
              <option value="Path of Exile 2">Path of Exile 2</option>
              <option value="Programs">Programs</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Beskrivelse *</label>
          <input 
            v-model="formData.description" 
            type="text" 
            id="description"
            placeholder="Detaljeret build planlægning værktøj"
            required
          />
        </div>

        <div class="form-group">
          <label for="url">URL *</label>
          <input 
            v-model="formData.url" 
            type="url" 
            id="url"
            placeholder="https://example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="icon">Ikon (Emoji)</label>
          <div class="icon-input-container">
            <input 
              v-model="formData.icon" 
              type="text" 
              id="icon"
              placeholder="🔧"
              maxlength="2"
              class="icon-input"
            />
            <div class="icon-suggestions">
              <button 
                v-for="emoji in commonEmojis" 
                :key="emoji"
                type="button"
                @click="formData.icon = emoji"
                class="emoji-btn"
                :class="{ active: formData.icon === emoji }"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #333333;
}

.modal-header h3 {
  color: #e5e5e5;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #333333;
  color: #e5e5e5;
}

.modal-content {
  padding: 24px;
}

/* Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.form-group label {
  color: #e5e5e5;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  background: #0f0f0f;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  color: #e5e5e5;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e5e5e5;
}

.form-group input::placeholder {
  color: #666666;
}

/* Icon input styles */
.icon-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-input {
  width: 80px;
  text-align: center;
  font-size: 1.2rem;
}

.icon-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #0f0f0f;
  border: 1px solid #333333;
  border-radius: 8px;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  background: #333333;
}

.emoji-btn.active {
  background: #e5e5e5;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 20px;
  font-size: 0.9rem;
  padding: 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #333333;
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

.btn-outline:hover:not(:disabled) {
  border-color: #e5e5e5;
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal {
    width: 95%;
    margin: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .icon-suggestions {
    justify-content: center;
  }
}
</style>
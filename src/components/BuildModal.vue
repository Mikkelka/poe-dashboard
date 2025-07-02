<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingBuild ? 'Rediger Build' : 'Tilføj Nyt Build' }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-content">
        <div class="form-row">
          <div class="form-group">
            <label for="buildName">Build Navn *</label>
            <input 
              v-model="formData.buildName" 
              type="text" 
              id="buildName"
              placeholder="Lightning Strike Champion" 
              required
            />
          </div>
          <div class="form-group">
            <label for="gameVersion">Spil *</label>
            <select v-model="formData.gameVersion" id="gameVersion" required>
              <option value="">Vælg spil</option>
              <option value="poe1">Path of Exile 1</option>
              <option value="poe2">Path of Exile 2</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="characterName">Character Navn</label>
            <input 
              v-model="formData.characterName" 
              type="text" 
              id="characterName"
              placeholder="StormWarrior"
            />
          </div>
          <div class="form-group">
            <label for="league">League</label>
            <input 
              v-model="formData.league" 
              type="text" 
              id="league"
              placeholder="Early Access"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="buildStatus">Status *</label>
            <select v-model="formData.buildStatus" id="buildStatus" required>
              <option value="active">Aktiv</option>
              <option value="paused">Pause</option>
              <option value="completed">Færdig</option>
            </select>
          </div>
          <div class="form-group">
            <label for="guideStatus">Guide Status</label>
            <select v-model="formData.guideStatus" id="guideStatus">
              <option value="unknown">Ukendt</option>
              <option value="up-to-date">Opdateret</option>
              <option value="outdated">Forældet</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="pobLink">Path of Building Link</label>
          <input 
            v-model="formData.pobLink" 
            type="url" 
            id="pobLink"
            placeholder="https://pobb.in/..."
          />
        </div>

        <div class="form-group">
          <label for="guideLink">Guide Link</label>
          <input 
            v-model="formData.guideLink" 
            type="url" 
            id="guideLink"
            placeholder="https://maxroll.gg/..."
          />
        </div>

        <div class="form-group">
          <label for="notes">Noter</label>
          <textarea 
            v-model="formData.notes" 
            id="notes"
            rows="3" 
            placeholder="Ekstra noter om buildet..."
          ></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
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
import { ref, reactive, watch, computed } from 'vue'
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
}

.form-group label {
  color: #e5e5e5;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: #0f0f0f;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  color: #e5e5e5;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e5e5e5;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666666;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
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
}
</style>
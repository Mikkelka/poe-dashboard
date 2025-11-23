<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal glass-modal" @click.stop>
      <div class="modal-header">
        <h3>Noter for {{ buildName }}</h3>
        <button class="modal-close" @click="handleClose">&times;</button>
      </div>
      
      <div class="modal-content">
        <div class="flex flex-col gap-1.5 mb-5">
          <label class="text-gray-200 text-sm font-medium">Rediger</label>
          <textarea 
            v-model="notes" 
            rows="6" 
            placeholder="Skriv dine noter her..."
            class="bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-gray-500 resize-none w-full"
          ></textarea>
        </div>

        <div v-if="notes" class="flex flex-col gap-1.5 mb-5">
          <label class="text-gray-200 text-sm font-medium">Forhåndsvisning</label>
          <div 
            v-html="formattedNotes"
            class="bg-slate-900/30 border border-slate-600/30 rounded-lg px-3 py-2.5 text-sm text-gray-200 min-h-[100px] whitespace-pre-wrap notes-preview"
          ></div>
        </div>

        <div v-if="error" class="error-message mb-4">
          {{ error }}
        </div>

        <div class="flex gap-3 justify-end pt-2 border-t border-slate-600/40">
          <button type="button" class="btn-outline" @click="handleClose" :disabled="loading">
            Luk
          </button>
          <button 
            type="button" 
            class="btn-primary" 
            @click="handleSave"
            :disabled="loading"
          >
            {{ loading ? 'Gemmer...' : 'Gem Noter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { updateBuild } from '../firebase'

export default {
  name: 'NotesModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    build: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const notes = ref('')
    const loading = ref(false)
    const error = ref('')
    const buildName = ref('')

    // Convert URLs in notes to clickable links
    const formattedNotes = computed(() => {
      if (!notes.value) return ''
      
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g
      
      // Replace URLs with clickable links
      return notes.value.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${url}</a>`
      })
    })

    watch(() => props.build, (newBuild) => {
      if (newBuild) {
        notes.value = newBuild.notes || ''
        buildName.value = newBuild.buildName || 'Build'
      } else {
        notes.value = ''
        buildName.value = ''
      }
      error.value = ''
    }, { immediate: true })

    const handleSave = async () => {
      if (!props.build) return

      loading.value = true
      error.value = ''

      try {
        const result = await updateBuild(props.build.id, { notes: notes.value })
        
        if (result.error) {
          error.value = result.error
        } else {
          emit('saved')
          emit('close')
        }
      } catch (err) {
        error.value = 'Der opstod en fejl ved gemning af noter.'
        console.error('Notes save error:', err)
      } finally {
        loading.value = false
      }
    }

    const handleClose = () => {
      emit('close')
    }

    return {
      notes,
      loading,
      error,
      buildName,
      formattedNotes,
      handleSave,
      handleClose
    }
  }
}
</script>

<style scoped>
/* Styling for links in the preview */
.notes-preview :deep(a) {
  word-break: break-all;
}
</style>

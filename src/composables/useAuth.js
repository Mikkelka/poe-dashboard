import { ref, onMounted, onUnmounted } from 'vue'
import { signInWithGoogle, logoutUser, onAuthChange } from '../firebase'

export function useAuth() {
  // Authentication state
  const user = ref(null)
  const authError = ref('')
  const loading = ref(false)
  
  // Authentication state change listener
  let unsubscribeAuth = null

  // Sign in with Google
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

  // Logout user
  const handleLogout = async () => {
    await logoutUser()
  }

  // Initialize auth state listener
  const initializeAuth = (onAuthStateChange) => {
    unsubscribeAuth = onAuthChange((authUser) => {
      user.value = authUser
      
      // Call the provided callback with auth state
      if (onAuthStateChange) {
        onAuthStateChange(authUser)
      }
    })
  }

  // Cleanup function
  const cleanup = () => {
    if (unsubscribeAuth) {
      unsubscribeAuth()
      unsubscribeAuth = null
    }
  }

  // Setup lifecycle hooks
  onMounted(() => {
    // initializeAuth will be called from the parent component with callbacks
  })

  onUnmounted(cleanup)

  return {
    // State
    user,
    authError,
    loading,
    
    // Methods
    handleGoogleSignIn,
    handleLogout,
    initializeAuth,
    cleanup
  }
}
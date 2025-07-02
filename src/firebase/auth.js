import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './config'

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    return { user, error: null }
  } catch (error) {
    let errorMessage = 'Der opstod en fejl under login'
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login blev annulleret'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blev blokeret af browseren'
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Login blev annulleret'
    }
    
    return { user: null, error: errorMessage }
  }
}

// Legacy methods for backward compatibility
export const registerUser = signInWithGoogle
export const loginUser = signInWithGoogle

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Monitor auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser
}
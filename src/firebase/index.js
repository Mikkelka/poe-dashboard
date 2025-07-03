// Export all Firebase services
export { auth, db } from './config'
export { 
  registerUser, 
  loginUser, 
  signInWithGoogle,
  logoutUser, 
  onAuthChange, 
  getCurrentUser 
} from './auth'
export { 
  addBuild, 
  updateBuild, 
  deleteBuild, 
  getUserBuilds, 
  subscribeToUserBuilds, 
  updateLastOpened,
  addResource,
  updateResource,
  deleteResource,
  getUserResources,
  subscribeToUserResources,
  getUserPreferences,
  updateUserPreferences,
  subscribeToUserPreferences
} from './firestore'
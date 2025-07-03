import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  setDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

const BUILDS_COLLECTION = 'builds'
const RESOURCES_COLLECTION = 'resources'
const USER_PREFERENCES_COLLECTION = 'userPreferences'

/**
 * Build Data Model Structure:
 * {
 *   id: string (auto-generated document ID)
 *   userId: string (required - Firebase Auth user ID)
 *   buildName: string (required - display name for the build)
 *   gameVersion: string (required - 'poe1' or 'poe2')
 *   characterName: string (optional - in-game character name)
 *   league: string (optional - current league name)
 *   buildStatus: string (required - 'active', 'paused', 'completed')
 *   guideStatus: string (optional - 'up-to-date', 'outdated', 'unknown')
 *   pobLink: string (optional - Path of Building import link)
 *   guideLink: string (optional - URL to external guide)
 *   notes: string (optional - user notes about the build)
 *   createdAt: Timestamp (auto-generated)
 *   updatedAt: Timestamp (auto-updated on changes)
 *   lastOpened: Timestamp (updated when build is accessed)
 * }
 */

// Add a new build
export const addBuild = async (userId, buildData) => {
  try {
    const docRef = await addDoc(collection(db, BUILDS_COLLECTION), {
      ...buildData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastOpened: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error) {
    return { id: null, error: error.message }
  }
}

// Update an existing build
export const updateBuild = async (buildId, buildData) => {
  try {
    const buildRef = doc(db, BUILDS_COLLECTION, buildId)
    await updateDoc(buildRef, {
      ...buildData,
      updatedAt: serverTimestamp()
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Delete a build
export const deleteBuild = async (buildId) => {
  try {
    await deleteDoc(doc(db, BUILDS_COLLECTION, buildId))
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Get all builds for a user
export const getUserBuilds = async (userId) => {
  try {
    const q = query(
      collection(db, BUILDS_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    const builds = []
    querySnapshot.forEach((doc) => {
      builds.push({ id: doc.id, ...doc.data() })
    })
    return { builds, error: null }
  } catch (error) {
    return { builds: [], error: error.message }
  }
}

// Listen to real-time updates for user builds
export const subscribeToUserBuilds = (userId, callback) => {
  const q = query(
    collection(db, BUILDS_COLLECTION),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const builds = []
    querySnapshot.forEach((doc) => {
      builds.push({ id: doc.id, ...doc.data() })
    })
    callback(builds)
  }, (error) => {
    console.error("Error listening to builds:", error)
    callback([])
  })
}

// Update last opened timestamp
export const updateLastOpened = async (buildId) => {
  try {
    const buildRef = doc(db, BUILDS_COLLECTION, buildId)
    await updateDoc(buildRef, {
      lastOpened: serverTimestamp()
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Resource Data Model Structure:
 * {
 *   id: string (auto-generated document ID)
 *   userId: string (required - Firebase Auth user ID)
 *   title: string (required - display name for the resource)
 *   description: string (required - brief description)
 *   url: string (required - web URL to the resource)
 *   icon: string (optional - emoji icon)
 *   category: string (required - 'Path of Exile 1', 'Path of Exile 2', 'Programs', 'Community')
 *   type: string (optional - subcategory like 'database', 'trading', etc.)
 *   isDefault: boolean (always false for user resources)
 *   createdAt: Timestamp (auto-generated)
 *   updatedAt: Timestamp (auto-updated on changes)
 * }
 */

// Add a new resource
export const addResource = async (userId, resourceData) => {
  try {
    const docRef = await addDoc(collection(db, RESOURCES_COLLECTION), {
      ...resourceData,
      userId,
      isDefault: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error) {
    return { id: null, error: error.message }
  }
}

// Update an existing resource
export const updateResource = async (resourceId, resourceData) => {
  try {
    const resourceRef = doc(db, RESOURCES_COLLECTION, resourceId)
    await updateDoc(resourceRef, {
      ...resourceData,
      updatedAt: serverTimestamp()
    })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Delete a resource
export const deleteResource = async (resourceId) => {
  try {
    await deleteDoc(doc(db, RESOURCES_COLLECTION, resourceId))
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Get all resources for a user
export const getUserResources = async (userId) => {
  try {
    const q = query(
      collection(db, RESOURCES_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    const resources = []
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() })
    })
    return { resources, error: null }
  } catch (error) {
    return { resources: [], error: error.message }
  }
}

// Listen to real-time updates for user resources
export const subscribeToUserResources = (userId, callback) => {
  const q = query(
    collection(db, RESOURCES_COLLECTION),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const resources = []
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() })
    })
    callback(resources)
  }, (error) => {
    console.error("Error listening to resources:", error)
    callback([])
  })
}

/**
 * User Preferences Data Model Structure:
 * {
 *   id: string (userId - same as document ID)
 *   userId: string (Firebase Auth user ID)
 *   hiddenResourceIds: string[] (array of hidden resource IDs)
 *   updatedAt: Timestamp (auto-updated on changes)
 * }
 */

// Get user preferences
export const getUserPreferences = async (userId) => {
  try {
    const docRef = doc(db, USER_PREFERENCES_COLLECTION, userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { preferences: docSnap.data(), error: null }
    } else {
      // Return default preferences if none exist
      return { preferences: { hiddenResourceIds: [] }, error: null }
    }
  } catch (error) {
    return { preferences: { hiddenResourceIds: [] }, error: error.message }
  }
}

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const docRef = doc(db, USER_PREFERENCES_COLLECTION, userId)
    await setDoc(docRef, {
      ...preferences,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Listen to real-time updates for user preferences
export const subscribeToUserPreferences = (userId, callback) => {
  const docRef = doc(db, USER_PREFERENCES_COLLECTION, userId)
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data())
    } else {
      // Return default preferences if none exist
      callback({ hiddenResourceIds: [] })
    }
  }, (error) => {
    console.error("Error listening to user preferences:", error)
    callback({ hiddenResourceIds: [] })
  })
}
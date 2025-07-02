import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

const BUILDS_COLLECTION = 'builds'

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
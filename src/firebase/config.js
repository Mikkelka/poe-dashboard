// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPSLOwpSdhU1y2vPZuFnRr-27jVUqLoSg",
  authDomain: "poe-dashboard-5d056.firebaseapp.com",
  projectId: "poe-dashboard-5d056",
  storageBucket: "poe-dashboard-5d056.firebasestorage.app",
  messagingSenderId: "348490760341",
  appId: "1:348490760341:web:71c094f83d5cc230199b9c"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
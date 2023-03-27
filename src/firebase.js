import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDs3HF2Y-hf6KUhQH1sECzZSBM1JTGhFZY",
  authDomain: "lc-assist.firebaseapp.com",
  projectId: "lc-assist",
  storageBucket: "lc-assist.appspot.com",
  messagingSenderId: "116619265795",
  appId: "1:116619265795:web:51c92240e91f53e4e34b36"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
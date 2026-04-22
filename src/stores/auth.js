// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null) // Puede ser 'superadmin', 'admin', o 'viewer'
  const loading = ref(true)
  const router = useRouter()

  // Este observador vigila las sombras: detecta si alguien entra o sale
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      await checkUserRole(currentUser)
    } else {
      user.value = null
      role.value = null
    }
    loading.value = false
  })

  const checkUserRole = async (user) => {
    try {
      const docRef = doc(db, 'roles', user.email)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        role.value = docSnap.data().role
      } else {
        // ATENCIÓN: Reemplaza esto con tu correo real de Google
        // Si no tienes rol pero eres tú, te asciende a SuperAdmin automáticamente
        if (user.email === 'jmonterolad@gmail.com') {
          await setDoc(docRef, { role: 'superadmin' })
          role.value = 'superadmin'
        } else {
          role.value = 'viewer'
        }
      }
    } catch (error) {
      console.error("Error al obtener credenciales de mando:", error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/admin') // Te lleva al dashboard táctico al loguearte
    } catch (error) {
      console.error("Infiltración fallida:", error)
    }
  }

  const logout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return { user, role, loading, loginWithGoogle, logout }
})
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import DropdownTactico from './DropdownTactico.vue' // Importación

const authStore = useAuthStore()
const formUsuario = ref({ email: '', rol: 'admin' })
const enviandoUsuario = ref(false)
const mensajeUsuarioStatus = ref(null)

const invitarOperativo = async () => {
  enviandoUsuario.value = true
  mensajeUsuarioStatus.value = null
  try {
    const token = await authStore.user.getIdToken()
    const response = await fetch('http://127.0.0.1:8000/api/usuarios/rol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formUsuario.value)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Fallo en la autorización')
    mensajeUsuarioStatus.value = { tipo: 'exito', texto: data.mensaje }
    formUsuario.value.email = ''
    formUsuario.value.rol = 'admin'
  } catch (error) { mensajeUsuarioStatus.value = { tipo: 'error', texto: error.message }
  } finally { enviandoUsuario.value = false }
}
</script>

<template>
  <section class="bg-slate-900/40 border border-red-900/50 p-6 md:p-8 rounded-xl animate-fade-in relative overflow-hidden z-10">
    <div class="absolute inset-0 bg-red-900/5 pointer-events-none z-0"></div>
    <h3 class="text-xl font-black text-red-500 uppercase italic mb-2 relative z-20">Autorizar Admins</h3>
    <p class="text-xs text-slate-400 font-mono mb-6 relative z-20">Agrega el correo de Google de la persona a la que deseas darle acceso al Dashboard.</p>
    
    <div v-if="mensajeUsuarioStatus" :class="mensajeUsuarioStatus.tipo === 'exito' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'" class="border p-4 rounded-lg mb-6 font-mono text-xs uppercase tracking-widest relative z-20">
      {{ mensajeUsuarioStatus.texto }}
    </div>
    
    <form @submit.prevent="invitarOperativo" class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
      <div class="flex flex-col gap-2 relative z-10">
        <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Correo Electrónico (Google)</label>
        <input v-model="formUsuario.email" type="email" required placeholder="operativo@gmail.com" class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-red-500 outline-none">
      </div>
      <div class="flex flex-col gap-2 relative z-50">
        <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Nivel de Credencial</label>
        <DropdownTactico 
          v-model="formUsuario.rol" 
          :opciones="[{value: 'admin', label: 'Administrador'}, {value: 'superadmin', label: 'SuperAdmin'}]" 
        />
      </div>
      <div class="md:col-span-2 mt-4 relative z-10">
        <button type="submit" :disabled="enviandoUsuario" class="w-full bg-red-800 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-900/50 border border-red-500/50">
          {{ enviandoUsuario ? 'PROCESANDO...' : 'CONCEDER AUTORIZACIÓN' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
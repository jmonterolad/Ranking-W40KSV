<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

// Importamos solo los componentes que vamos a usar
import TabEventos from '../components/admin/TabEventos.vue'
import TabUsuarios from '../components/admin/TabUsuarios.vue'

const authStore = useAuthStore()

// Como eliminamos los resultados, el tab por defecto ahora es 'eventos'
const activeTab = ref('eventos')
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-10 text-slate-100 min-h-screen">
    
    <header class="mb-10 bg-slate-900/60 border border-slate-800 p-6 rounded-xl backdrop-blur-md relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 text-8xl -mt-4 -mr-4 pointer-events-none text-orange-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-32 h-32"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" /></svg>
      </div>
      
      <h2 class="text-3xl font-black text-orange-500 uppercase italic tracking-tighter shadow-orange-500/20 mb-2">
        Terminal de Mando Directo
      </h2>
      
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 font-mono text-xs uppercase tracking-widest text-slate-400">
        <p>
          <span class="text-slate-500">Operativo:</span> 
          <span class="text-white font-bold">{{ authStore.user?.displayName || authStore.user?.email }}</span>
        </p>
        <p class="flex items-center gap-2">
          <span class="text-slate-500">Nivel de Acceso:</span> 
          <span 
            class="px-2 py-0.5 rounded text-[9px] font-black border"
            :class="{
              'bg-red-950/50 text-red-500 border-red-900': authStore.role === 'superadmin',
              'bg-green-950/50 text-green-500 border-green-900': authStore.role === 'admin',
              'bg-slate-800 text-slate-400 border-slate-700': authStore.role === 'viewer' || !authStore.role
            }"
          >
            {{ authStore.role || 'NO AUTORIZADO' }}
          </span>
        </p>
      </div>
    </header>

    <div v-if="!authStore.role || authStore.role === 'viewer'" class="bg-red-900/20 border-2 border-red-600 p-8 rounded-xl text-red-400 text-center font-mono uppercase">
      <p class="text-xl font-black mb-2 tracking-tighter">⚠️ Acceso Denegado</p>
      <p class="text-xs opacity-80">Su credencial no tiene los privilegios necesarios para operar esta terminal.</p>
    </div>

    <div v-else>
      <div class="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-px">
        <button 
          @click="activeTab = 'eventos'" 
          class="px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all"
          :class="activeTab === 'eventos' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-slate-500 hover:text-slate-300'"
        >
          Calendario
        </button>
        <button 
          v-if="authStore.role === 'superadmin'"
          @click="activeTab = 'usuarios'" 
          class="px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all"
          :class="activeTab === 'usuarios' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'"
        >
          Gestión de Operativos
        </button>
      </div>

      <TabEventos v-if="activeTab === 'eventos'" />
      <TabUsuarios v-if="activeTab === 'usuarios' && authStore.role === 'superadmin'" />

    </div>
  </div>
</template>
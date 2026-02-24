<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import RankingPodium from '../components/RankingPodium.vue'
import RankingTable from '../components/RankingTable.vue'

const route = useRoute()
const ranking = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const isGlitching = ref(false) 

const IS_LOCAL = false 
const API_BASE = IS_LOCAL 
  ? 'http://127.0.0.1:8000/api/ranking' 
  : 'https://rankingw40ksvbackend.vercel.app/api/ranking'

const fetchRanking = async () => {
  try {
    loading.value = true
    isGlitching.value = false 
    error.value = null
    const gameId = route.params.id 
    const response = await fetch(`${API_BASE}/${gameId}`)
    
    if (!response.ok) throw new Error('Fallo de enlace con la terminal de mando.')
    
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    
    ranking.value = data
    
    // El glitch dura un poco más que la animación para asegurar que el usuario lo vea
    isGlitching.value = true
    setTimeout(() => { isGlitching.value = false }, 800)
    
  } catch (err) {
    error.value = err.message
    console.error("Link Error:", err)
  } finally {
    loading.value = false
  }
}

// Observar cambios en la ruta para recargar datos (ej. cambiar de KT a 40K)
watch(() => route.params.id, () => fetchRanking())

const rankingFiltrado = computed(() => {
  let list = ranking.value.filter(j => j['Jugadores'] && j['Jugadores'].toString().trim() !== '')
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(j => j['Jugadores'].toLowerCase().includes(query))
  }
  
  // Ordenamiento por puntos descendente
  return list.sort((a, b) => (Number(b['Puntos']) || 0) - (Number(a['Puntos']) || 0))
})

onMounted(fetchRanking)
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-10 text-slate-100 min-h-screen">
    
    <div class="mb-8">
      <RouterLink 
        to="/ranking" 
        class="inline-flex items-center gap-3 px-4 py-2 border border-slate-800 bg-slate-900/40 rounded-lg text-[10px] font-mono text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="uppercase tracking-[0.2em]">Volver al Hub</span>
      </RouterLink>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 gap-6">
      <div :class="{ 'under-fire': isGlitching }" class="relative overflow-hidden lg:overflow-visible">
        <h2 class="text-3xl md:text-4xl font-black text-orange-500 uppercase italic tracking-tighter shadow-orange-500/20">
          Codex Ranking
        </h2>
        <p class="text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] relative">
          DATA_STREAM: {{ route.params.id.replace('kt', 'Kill Team ').replace('40k1k', '40K 1000pts ') }}
          <span v-if="isGlitching" class="tracer-line"></span>
        </p>
      </div>

      <div class="relative w-full md:w-80">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="BUSCAR OPERATIVO..." 
          class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all font-mono"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <div class="relative flex items-center justify-center">
        <div class="absolute h-20 w-20 border-2 border-orange-500/30 rounded-full animate-ping"></div>
        <div class="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-orange-500 font-bold tracking-[0.5em] text-[10px] mt-10 uppercase animate-pulse">Sincronizando con el frente...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border-2 border-red-600 p-8 rounded-xl text-red-400 text-center font-mono uppercase">
      <p class="text-xl font-black mb-2 tracking-tighter">⚠️ Signal_Lost</p>
      <p class="mb-6 opacity-80 text-xs">{{ error }}</p>
      <RouterLink to="/ranking" class="inline-block px-6 py-2 border border-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] tracking-widest font-bold text-center">Reiniciar Terminal</RouterLink>
    </div>

    <div v-else>
      <RankingPodium :ranking="rankingFiltrado" :searchQuery="searchQuery" />
      <RankingTable :ranking="rankingFiltrado" :isGlitching="isGlitching" />
    </div>
  </div>
</template>

<style scoped>
/* EFECTO BAJO FUEGO */
.under-fire {
  animation: recoil 0.1s steps(2) infinite;
}

@keyframes recoil {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3px, 1px) skewX(2deg); }
  50% { transform: translate(4px, -1px) brightness(2); }
  75% { transform: translate(-2px, 2px) skewX(-2deg); }
  100% { transform: translate(0, 0); }
}

.under-fire::after {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 5; /* Bajado un poco para no tapar el texto naranja */
  animation: muzzle-flash 0.2s ease-out infinite;
}

@keyframes muzzle-flash {
  0% { opacity: 0; }
  20% { opacity: 0.3; } /* Un poco más sutil */
  100% { opacity: 0; }
}

.under-fire h2 {
  text-shadow: 2px 0 #ff0000, -2px 0 #00ff00;
  animation: combat-noise 0.4s infinite;
}

@keyframes combat-noise {
  0% { text-shadow: 1px 1px #ff0000; }
  25% { text-shadow: -2px -2px #ffffff; transform: scale(1.02); }
  50% { text-shadow: 3px -1px #0000ff; }
  75% { text-shadow: -1px 2px #ff0000; }
  100% { text-shadow: 1px 1px #ff0000; }
}

.tracer-line {
  position: absolute;
  top: 50%;
  left: -100%;
  width: 80px; /* Un poco más larga */
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffcc00, white);
  box-shadow: 0 0 10px #ffcc00;
  animation: tracer-pass 0.4s linear infinite;
}

@keyframes tracer-pass {
  0% { left: -100%; }
  100% { left: 200%; }
}
</style>
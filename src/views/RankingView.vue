<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

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
    
    isGlitching.value = true
    setTimeout(() => { isGlitching.value = false }, 700)

  } catch (err) {
    error.value = err.message
    console.error("Fetch error:", err)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, () => {
  fetchRanking()
})

const rankingFiltrado = computed(() => {
  let list = ranking.value.filter(jugador => {
    return jugador['Jugadores'] && jugador['Jugadores'].toString().trim() !== ''
  })
  
  if (searchQuery.value) {
    list = list.filter(jugador => {
      const nombre = (jugador['Jugadores'] || '').toLowerCase()
      return nombre.includes(searchQuery.value.toLowerCase())
    })
  }
  
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
      <div :class="{ 'glitch-text': isGlitching }">
        <h2 class="text-3xl md:text-4xl font-black text-orange-500 uppercase italic tracking-tighter shadow-orange-500/20">
          Codex Ranking
        </h2>
        <p class="text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
          DATA_STREAM: {{ route.params.id.replace('kt', 'Kill Team ').replace('40k1k', '40K 1000pts ') }}
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
      <p class="text-orange-500 font-bold tracking-[0.5em] text-[10px] mt-10 uppercase animate-pulse">
        Estableciendo enlace de datos...
      </p>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border-2 border-red-600 p-8 rounded-xl text-red-400 text-center font-mono">
      <p class="text-xl font-black mb-2 tracking-tighter uppercase">⚠️ Signal_Lost</p>
      <p class="mb-6 opacity-80 text-xs">{{ error }}</p>
      <RouterLink to="/ranking" class="inline-block px-6 py-2 border border-red-500 hover:bg-red-600 hover:text-white transition-all uppercase text-[10px] tracking-widest font-bold">
        Reiniciar Terminal
      </RouterLink>
    </div>

    <div v-else :class="{ 'glitch-scan': isGlitching }" class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl transition-all duration-300">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="bg-slate-800/80 text-orange-400 text-[10px] uppercase tracking-widest font-black">
            <th class="px-4 md:px-6 py-4 border-b border-slate-700">#</th>
            <th class="px-4 md:px-6 py-4 border-b border-slate-700">Jugador</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700">Rango</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center">PJ</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center text-green-500 font-bold">PG</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center text-yellow-500">PE</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center text-red-500">PP</th>
            <th class="px-4 md:px-6 py-4 border-b border-slate-700 text-right">Puntos</th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-slate-800 font-mono">
          <tr v-for="(jugador, index) in rankingFiltrado" :key="index" class="hover:bg-orange-500/5 transition-colors group text-xs md:text-sm">
            <td class="px-4 md:px-6 py-4 text-slate-500">{{ index + 1 }}</td>
            <td class="px-4 md:px-6 py-4 font-bold text-white uppercase group-hover:text-orange-400 transition-colors">
              {{ jugador['Jugadores'] }}
            </td>
            <td class="px-3 md:px-4 py-4">
              <span class="bg-slate-800 px-2 py-0.5 rounded text-[9px] border border-slate-700 text-slate-300 uppercase tracking-tighter">
                {{ jugador['Rango'] || 'Iniciado' }}
              </span>
            </td>
            <td class="px-3 md:px-4 py-4 text-center text-slate-400">{{ jugador['Juegos'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-green-500 font-bold">{{ jugador['Victorias'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-yellow-500">{{ jugador['Empates'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-red-500">{{ jugador['Derrotas'] }}</td>
            <td class="px-4 md:px-6 py-4 text-right font-black text-orange-500 text-base md:text-lg tracking-tighter">
              {{ jugador['Puntos'] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="md:hidden text-[9px] text-slate-500 text-center mt-6 uppercase tracking-[0.3em] opacity-50">
      ← Desliza para ver registros completos →
    </p>

  </div>
</template>

<style scoped>
/* Estilos Glitch heredados del componente anterior */
.glitch-scan {
  animation: scanline 0.3s ease-in-out infinite;
  filter: brightness(1.2) contrast(1.1);
  position: relative;
}

@keyframes scanline {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px) skewX(2deg); opacity: 0.8; }
  40% { transform: translate(2px, -1px) skewX(-2deg); }
  60% { transform: translate(-1px, 2px); opacity: 0.9; }
  80% { transform: translate(1px, -2px) skewX(1deg); }
  100% { transform: translate(0); }
}

.glitch-text {
  animation: textNoise 0.4s infinite;
  text-shadow: 2px 0 #ff0000, -2px 0 #00ff00;
}

@keyframes textNoise {
  0% { text-shadow: 1px 1px #ff0000; }
  25% { text-shadow: -1px -1px #00ff00; transform: translate(1px, 0); }
  50% { text-shadow: 2px -1px #0000ff; }
  75% { text-shadow: -2px 1px #ff00ff; transform: translate(-1px, 1px); }
  100% { text-shadow: 1px 1px #ff0000; }
}

.glitch-scan::after {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}
</style>
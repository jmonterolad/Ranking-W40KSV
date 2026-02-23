<script setup>
import { ref, onMounted, computed } from 'vue'

const ranking = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const fetchRanking = async () => {
  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/api/ranking')
    if (!response.ok) throw new Error('Failed to connect to Holy Terra (Server)')
    const data = await response.json()
    ranking.value = data
  } catch (err) {
    error.value = err.message
    console.error("Fetch error:", err)
  } finally {
    loading.value = false
  }
}

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
  <div class="max-w-6xl mx-auto p-4 md:p-10 text-slate-100">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 gap-6">
      <div>
        <h2 class="text-3xl md:text-4xl font-black text-orange-500 uppercase italic tracking-tighter">Codex Ranking</h2>
        <p class="text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-widest">Active Archives: Kill Team 2025</p>
      </div>

      <div class="relative w-full md:w-80">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar jugador..." 
          class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
      <p class="text-orange-500 font-bold tracking-widest text-xs">CONNECTING...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border border-red-500 p-6 rounded text-red-400 text-center font-mono text-xs">
      {{ error }}
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="bg-slate-800/80 text-orange-400 text-[10px] uppercase tracking-widest font-black">
            <th class="px-4 md:px-6 py-4 border-b border-slate-700">#</th>
            <th class="px-4 md:px-6 py-4 border-b border-slate-700">Jugador</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700">Rango</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center">PJ</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center">PG</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center">PE</th>
            <th class="px-3 md:px-4 py-4 border-b border-slate-700 text-center">PP</th>
            <th class="px-4 md:px-6 py-4 border-b border-slate-700 text-right">Puntos</th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-slate-800">
          <tr v-for="(jugador, index) in rankingFiltrado" :key="index" class="hover:bg-orange-500/5 transition-colors">
            <td class="px-4 md:px-6 py-4 text-slate-500 font-mono text-xs">{{ index + 1 }}</td>
            <td class="px-4 md:px-6 py-4 font-bold text-white uppercase text-xs md:text-sm">{{ jugador['Jugadores'] }}</td>
            <td class="px-3 md:px-4 py-4">
              <span class="bg-slate-800 px-2 py-0.5 rounded text-[9px] md:text-[10px] border border-slate-700 text-slate-300">
                {{ jugador['Rango'] }}
              </span>
            </td>
            <td class="px-3 md:px-4 py-4 text-center text-slate-400 font-mono text-xs">{{ jugador['Juegos'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-green-500 font-mono text-xs">{{ jugador['Victorias'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-yellow-500 font-mono text-xs">{{ jugador['Empates'] }}</td>
            <td class="px-3 md:px-4 py-4 text-center text-red-500 font-mono text-xs">{{ jugador['Derrotas'] }}</td>
            <td class="px-4 md:px-6 py-4 text-right font-black text-orange-500 text-sm md:text-base">{{ jugador['Puntos'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <p class="md:hidden text-[9px] text-slate-500 text-center mt-4 uppercase tracking-tighter">
      ← Desliza la tabla para ver todos los datos →
    </p>

  </div>
</template>
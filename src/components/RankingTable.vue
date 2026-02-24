<script setup>
defineProps(['ranking', 'isGlitching'])
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl transition-all duration-300 relative">
    
    <div v-if="isGlitching" class="absolute inset-0 pointer-events-none z-50 scan-overlay"></div>

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
        <tr v-for="(jugador, index) in ranking" :key="index" class="hover:bg-orange-500/5 transition-colors group text-xs md:text-sm">
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
</template>

<style scoped>
.scan-overlay {
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.05) 50%
  );
  background-size: 100% 4px;

  animation: static-flicker 0.2s infinite;
}

@keyframes static-flicker {
  0% { opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { opacity: 0.5; }
}
</style>
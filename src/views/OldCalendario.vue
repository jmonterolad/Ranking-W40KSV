<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// CONFIGURACIÓN DE LA MISIÓN
const fechaTorneo = new Date('2026-03-28T12:00:00').getTime() 
const dias = ref(0)
const horas = ref(0)
const minutos = ref(0)
const segundos = ref(0)
let timer = null

const actualizarReloj = () => {
  const ahora = new Date().getTime()
  const distancia = fechaTorneo - ahora

  if (distancia < 0) {
    clearInterval(timer)
    return
  }

  dias.value = Math.floor(distancia / (1000 * 60 * 60 * 24))
  horas.value = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutos.value = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60))
  segundos.value = Math.floor((distancia % (1000 * 60)) / 1000)
}

onMounted(() => {
  actualizarReloj()
  timer = setInterval(actualizarReloj, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-10 text-slate-100 min-h-screen">
    
    <div class="mb-8">
      <RouterLink to="/" class="inline-flex items-center gap-3 px-4 py-2 border border-slate-800 bg-slate-900/40 rounded-lg text-[10px] font-mono text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all group">
        <span class="uppercase tracking-[0.2em]">← Volver al Home</span>
      </RouterLink>
    </div>

    <header class="mb-8">
      <h2 class="text-2xl md:text-4xl font-black text-orange-500 uppercase italic tracking-tighter shadow-orange-500/20">
        Cronograma de Batalla
      </h2>
      <p class="text-slate-400 font-mono text-[9px] md:text-xs uppercase tracking-[0.3em]">Sector_Operativo_2026</p>
    </header>

    <div class="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-500 hover:border-orange-500/50 max-w-3xl">
      
      <img 
        src="/src/assets/fondoktbox.jpeg" 
        class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 pointer-events-none"
        alt="Kill Team Background"
      />

      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent pointer-events-none"></div>

      <div class="absolute top-0 right-0 bg-orange-600 text-black font-black text-[9px] px-4 py-1 uppercase tracking-tighter italic z-20">
        Infiltración en curso
      </div>

      <div class="relative z-10">
        <h3 class="text-2xl md:text-3xl font-black text-white uppercase italic mb-4 leading-tight drop-shadow-2xl">
          Operación Skirmish <br> <span class="text-orange-500">"Kill Team: El Salvador"</span>
        </h3>
        
        <p class="text-slate-300 text-xs md:text-sm leading-relaxed mb-8 font-mono uppercase tracking-tight max-w-xl">
          Atención comandos: Briefing de misión actualizado. Despliegue de operativos para combate urbano. 
          Formatos competitivos y premios para los mejores comandantes de campo.
        </p>

        <div class="grid grid-cols-4 gap-2 mb-8 max-w-[320px]">
          <div class="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-center">
            <span class="block text-xl font-black text-orange-500 leading-none">{{ dias }}</span>
            <span class="text-[7px] uppercase text-slate-500 font-mono">Días</span>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-center">
            <span class="block text-xl font-black text-orange-500 leading-none">{{ horas }}</span>
            <span class="text-[7px] uppercase text-slate-500 font-mono">Hrs</span>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-center">
            <span class="block text-xl font-black text-orange-500 leading-none">{{ minutos }}</span>
            <span class="text-[7px] uppercase text-slate-500 font-mono">Min</span>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-center">
            <span class="block text-xl font-black text-orange-500 leading-none">{{ segundos }}</span>
            <span class="text-[7px] uppercase text-slate-500 font-mono">Seg</span>
          </div>
        </div>

        <a 
          href="https://www.bestcoastpairings.com/event/cPvNL6Zyppn4" 
          target="_blank"
          class="inline-block bg-orange-600 hover:bg-orange-500 text-black font-black py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-[0.2em] text-[10px] shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105"
        >
          Inscribite al torneo
        </a>
      </div>

      <div class="absolute -bottom-4 -right-4 opacity-10 text-6xl font-black italic select-none rotate-12 pointer-events-none text-slate-500 uppercase">
        Skirmish
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-orange-500 {
  text-shadow: 0 0 8px rgba(249, 115, 22, 0.3);
}
</style>
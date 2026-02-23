<template>
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-24 text-center">
    <div class="w-24 h-1 bg-orange-600 mx-auto mb-8 shadow-[0_0_15px_rgba(234,88,12,0.6)] animate-pulse"></div>

    <section class="mb-16">
      <h1 class="text-5xl md:text-8xl font-black mb-4 uppercase italic tracking-tighter text-white drop-shadow-2xl">
        SECTOR <span class="text-orange-500"> EL SALVADOR</span>
      </h1>
      <p class="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto font-mono uppercase tracking-[0.2em] leading-relaxed">
        Registro central de hostilidades y clasificaciones tácticas.
      </p>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      <RouterLink 
        to="/ranking" 
        class="group relative overflow-hidden bg-slate-900/40 border border-slate-700 p-8 rounded-2xl hover:border-orange-500 transition-all duration-500 backdrop-blur-sm"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
          <span class="text-6xl italic font-black">01</span>
        </div>
        <h3 class="text-2xl font-bold text-orange-500 uppercase mb-3 text-left">Codex Ranking</h3>
        <p class="text-slate-400 text-left text-sm leading-relaxed mb-6">
          Consulta el estado actual de las facciones y los puntos de victoria acumulados por los operativos.
        </p>
        <div class="flex items-center text-white font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
          Acceder al ranking <span class="ml-2">→</span>
        </div>
      </RouterLink>

      <div class="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-8 rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500 backdrop-blur-sm">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <span class="text-6xl italic font-black">02</span>
        </div>
        <h3 class="text-2xl font-bold text-slate-500 uppercase mb-3 text-left italic">Próximos Despliegues</h3>
        <p class="text-slate-500 text-left text-sm leading-relaxed mb-6">
          Calendario de torneos y misiones de reconocimiento programadas para el ciclo 2026.
        </p>
        <div class="text-slate-600 font-bold uppercase text-xs tracking-widest">
          Transmisión encriptada...
        </div>
      </div>
    </div>

    <footer class="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-slate-800 text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">
      <!-- <div class="flex flex-col gap-1">
        <span class="text-slate-700">Protocolo:</span>
        <span class="text-orange-500/50">Vermilion-Level</span>
      </div> -->
      <div class="flex flex-col gap-1">
        <span class="text-slate-700">Estado:</span>
        <span class="text-green-500/50">Sincronizado</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-slate-700">Ubicación:</span>
        <span>San Salvador HQ</span>
      </div>
      <!-- <div class="flex flex-col gap-1">
        <span class="text-slate-700">Ciclo:</span>
        <span>M42.026</span>
      </div> -->
    </footer>
  </div>
</template>

<style scoped>
/* Efecto de brillo sutil en el texto principal */
h1 {
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

/* Animación de entrada suave */
div, section {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
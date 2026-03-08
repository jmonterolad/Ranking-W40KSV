<template>
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-24 text-center">
    <div class="w-24 h-1 bg-orange-600 mx-auto mb-8 shadow-[0_0_15px_rgba(234,88,12,0.6)] animate-pulse"></div>

    <section class="mb-12 flex flex-col items-center">
      <img src="/src/assets/warhammersv.png" alt="Warhammer El Salvador Logo"
        class="max-w-[380px] md:max-w-[600px] w-full h-auto mb-6 opacity-90 hover:opacity-100 transition-opacity duration-500" />

      <p
        class="text-slate-400 text-[10px] md:text-sm max-w-2xl mx-auto font-mono uppercase tracking-[0.3em] leading-relaxed text-center">
        Gran comunidad Salvadoreña de Warhammer
      </p>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      <RouterLink to="/ranking"
        class="group relative overflow-hidden bg-slate-900/40 border border-slate-700 p-8 rounded-2xl hover:border-orange-500 transition-all duration-500 backdrop-blur-sm">
        <h3 class="text-2xl font-bold text-orange-500 uppercase mb-3 text-left italic">Ranking El Salvador</h3>
        <p class="text-slate-400 text-left text-sm leading-relaxed mb-6">
          Tablas de posiciones de los participantes en la comunidad
        </p>
        <div
          class="flex items-center text-white font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
          Acceder a los ranking <span class="ml-2">→</span>
        </div>
      </RouterLink>

      <RouterLink to="/calendario"
        class="group relative overflow-hidden bg-slate-900/40 border border-slate-700 p-8 rounded-2xl hover:border-orange-500 transition-all duration-500 backdrop-blur-sm">
        <h3 class="text-2xl font-bold text-orange-500 uppercase mb-3 text-left italic">Eventos y calendarios</h3>
        <p class="text-slate-400 text-left text-sm leading-relaxed mb-6">
          Calendario de torneos y misiones de reconocimiento programadas para el ciclo 2026.
        </p>
        <div
          class="flex items-center text-white font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
          Ver cronograma de batalla <span class="ml-2">→</span>
        </div>
      </RouterLink>
    </div>

    <footer
      class="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-slate-800 text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">
      <div class="flex flex-col gap-1">
        <span class="text-slate-700">Estado:</span>
        <span class="text-green-500/50">Sincronizado</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-slate-700">Ubicación:</span>
        <span>San Salvador HQ</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Animación de entrada suave */
div,
section {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto Hover para las cajas */
.group:hover {
  background-color: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 30px rgba(234, 88, 12, 0.1);
}
</style>
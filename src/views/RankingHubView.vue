<template>
  <div class="max-w-6xl mx-auto p-4 md:p-10">
    <h2 class="text-3xl md:text-5xl font-black text-orange-500 uppercase italic mb-12 tracking-tighter text-center">
      Terminal de Rankings
    </h2>

    <div class="mb-12">
      <div class="flex items-center gap-4 mb-8">
        <span class="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></span>
        <h3 class="text-green-500 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">● Operaciones Activas</h3>
        <span class="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouterLink to="/ranking/kt2026" class="group bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-green-500 transition-all backdrop-blur-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black italic">ACTIVE</div>
          <h3 class="text-2xl font-bold text-white mb-2 uppercase italic">Kill Team</h3>
          <span class="text-green-500 font-mono text-sm block mb-4">Ciclo 2026</span>
          <p class="text-slate-400 text-xs uppercase tracking-widest leading-relaxed">Operaciones de reconocimiento y escaramuzas en curso.</p>
        </RouterLink>

        <RouterLink to="/ranking/40k1k2026" class="group bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-green-500 transition-all backdrop-blur-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black italic">ACTIVE</div>
          <h3 class="text-2xl font-bold text-white mb-2 uppercase italic">40K (1000 PTS)</h3>
          <span class="text-green-500 font-mono text-sm block mb-4">Ciclo 2026</span>
          <p class="text-slate-400 text-xs uppercase tracking-widest leading-relaxed">Despliegue de fuerzas de patrulla y asaltos tácticos.</p>
        </RouterLink>
      </div>
    </div>

    <div class="relative py-10">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-slate-800"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="bg-slate-950 px-4 text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em] border border-slate-800 rounded-full py-1">
          Archivos Encriptados
        </span>
      </div>
    </div>

    <div class="opacity-80">
      <div class="flex items-center gap-4 mb-8">
        <span class="h-px flex-1 bg-gradient-to-r from-transparent via-orange-900 to-transparent"></span>
        <h3 class="text-slate-500 font-mono text-xs uppercase tracking-[0.4em]">Registros de Rankings Pasadas</h3>
        <span class="h-px flex-1 bg-gradient-to-r from-transparent via-orange-900 to-transparent"></span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink to="/ranking/kt2025" class="group bg-slate-950/60 border border-slate-900 p-6 rounded-xl hover:border-orange-900 transition-all grayscale hover:grayscale-0">
          <h3 class="text-xl font-bold text-slate-300 mb-1 uppercase italic">Kill Team</h3>
          <span class="text-orange-900 font-mono text-xs block mb-4 italic">Ciclo 2025 (Finalizado)</span>
          <p class="text-slate-600 text-[10px] uppercase tracking-tighter">Acceso a logs históricos de batalla.</p>
        </RouterLink>
        
        </div>
    </div>
  </div>
</template>
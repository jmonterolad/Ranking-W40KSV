<script setup>
defineProps(['ranking', 'searchQuery'])
</script>

<template>
  <div v-if="!searchQuery" class="mt-24 mb-32 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 lg:gap-24 transition-all duration-500 scale-100 md:scale-110">
    
    <div v-if="ranking[1]" class="order-2 md:order-1 flex flex-col items-center">
      <div class="relative w-52 h-32 md:w-60 md:h-36 flex items-center justify-center bg-slate-900/60 rounded-lg overflow-hidden group border border-slate-800 shadow-2xl">
        <div class="text-center z-20 pr-4 ml-16 drop-shadow-lg">
          <p class="text-xs md:text-sm font-black uppercase text-white leading-tight mb-1 truncate w-28 md:w-32">{{ ranking[1]['Jugadores'] }}</p>
          <p class="text-[10px] text-slate-300 font-mono font-bold tracking-widest uppercase">{{ ranking[1]['Puntos'] }} PTS</p>
          <p class="text-[9px] text-green-500 font-mono font-black tracking-tighter uppercase opacity-80">{{ ranking[1]['Victorias'] }} VICTORIAS</p>
        </div>
        <img src="/marcos/plata.png" class="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none opacity-100 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div class="mt-4 bg-slate-700 text-slate-100 px-5 py-1 rounded-full text-[9px] font-black italic tracking-widest border border-slate-500/30 uppercase">RANK #2</div>
    </div>

    <div v-if="ranking[0]" class="order-1 md:order-2 flex flex-col items-center scale-125 mb-16 md:mb-0">
      <div class="relative w-60 h-40 md:w-72 md:h-44 flex items-center justify-center bg-slate-900/80 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.25)] border-2 border-orange-500/30">
        <div class="text-center z-20 pr-4 ml-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <p class="text-sm md:text-base font-black uppercase text-orange-400 tracking-tight mb-1 truncate w-36 md:w-44">{{ ranking[0]['Jugadores'] }}</p>
          <p class="text-[10px] text-white font-black tracking-widest bg-orange-600/40 px-3 py-1 rounded border border-orange-500/40 inline-block mb-1">{{ ranking[0]['Puntos'] }} PTS</p>
          <p class="text-[10px] text-green-400 font-mono font-black tracking-widest uppercase block">{{ ranking[0]['Victorias'] }} VICTORIAS</p>
        </div>
        <img src="/marcos/oro.png" class="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none drop-shadow-[0_0_25px_rgba(249,115,22,0.6)]" />
        <div class="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent z-0"></div>
      </div>
      <div class="mt-8 bg-orange-500 text-black px-6 py-1.5 rounded-full text-[11px] font-black italic tracking-[0.2em] shadow-lg shadow-orange-500/40 uppercase text-center ring-2 ring-orange-500/50">OPERATIVO SUPREMO</div>
    </div>

    <div v-if="ranking[2]" class="order-3 md:order-3 flex flex-col items-center">
      <div class="relative w-52 h-32 md:w-60 md:h-36 flex items-center justify-center bg-slate-900/60 rounded-lg overflow-hidden group border border-slate-800 shadow-2xl">
        <div class="text-center z-20 pr-4 ml-16 drop-shadow-lg">
          <p class="text-xs md:text-sm font-black uppercase text-orange-200/90 leading-tight mb-1 truncate w-28 md:w-32">{{ ranking[2]['Jugadores'] }}</p>
          <p class="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase">{{ ranking[2]['Puntos'] }} PTS</p>
          <p class="text-[9px] text-green-600 font-mono font-black tracking-tighter uppercase opacity-80">{{ ranking[2]['Victorias'] }} VICTORIAS</p>
        </div>
        <img src="/marcos/bronce.png" class="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none opacity-100 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div class="mt-4 bg-orange-950 text-orange-300 px-5 py-1 rounded-full text-[9px] font-black italic tracking-widest border border-orange-900/30 uppercase">RANK #3</div>
    </div>
  </div>
</template>
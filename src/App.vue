<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-warhammer text-white font-sans selection:bg-orange-500/30">
    
    <nav class="bg-slate-950/80 border-b border-orange-600/50 p-3 md:p-4 sticky top-0 z-50 backdrop-blur-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        
        <RouterLink to="/" class="flex items-center group">
          <img 
            src="./assets/warhammersv.png" 
            alt="W40K SV Logo" 
            class="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-110"
          />
        </RouterLink>

        <div class="flex space-x-4 md:space-x-8">
          <RouterLink 
            to="/" 
            class="hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-medium" 
            active-class="text-orange-500 font-bold border-b border-orange-500"
          >
            Home
          </RouterLink>
          <RouterLink 
            to="/ranking" 
            class="hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-medium" 
            active-class="text-orange-500 font-bold border-b border-orange-500"
          >
            Ranking
          </RouterLink>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.bg-warhammer {
  background-image: 
    linear-gradient(rgba(10, 15, 25, 0.7), rgba(10, 15, 25, 0.85)), 
    url('./assets/background-warhammer.jpeg');
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
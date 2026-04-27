<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
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

        <div class="flex items-center space-x-4 md:space-x-6">
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
          <RouterLink 
            to="/calendario" 
            class="hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-medium" 
            active-class="text-orange-500 font-bold border-b border-orange-500"
          >
            calendario
          </RouterLink>

          <RouterLink 
            v-if="authStore.user"
            to="/admin" 
            class="hover:text-green-400 text-green-500 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-black" 
            active-class="text-green-400 font-black border-b border-green-500"
          >
            Terminal
          </RouterLink>

          <button 
            v-if="!authStore.user" 
            @click="authStore.loginWithGoogle()"
            class="bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white border border-slate-600 hover:border-orange-500 px-3 py-1.5 rounded text-[9px] md:text-[10px] font-mono uppercase tracking-widest transition-all shadow-sm"
          >
            Login
          </button>
          
          <button 
            v-else 
            @click="authStore.logout()"
            class="bg-red-950/50 hover:bg-red-600 text-red-400 hover:text-white border border-red-900 hover:border-red-500 px-3 py-1.5 rounded text-[9px] md:text-[10px] font-mono uppercase tracking-widest transition-all shadow-sm"
          >
            Logout
          </button>

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
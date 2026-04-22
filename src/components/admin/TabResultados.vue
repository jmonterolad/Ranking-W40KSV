<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import DropdownTactico from './DropdownTactico.vue'

const authStore = useAuthStore()
const hoy = new Date().toISOString().split('T')[0]
const enviando = ref(false)
const mensajeStatus = ref(null)

const formResultado = ref({ 
  juego: 'kt2026', fecha: hoy, season: 'S2026',
  jugador1: '', faccion_j1: '', rango_j1: 'Aestartes', puntos_j1: 0, resultado_j1: 'victoria',
  jugador2: '', faccion_j2: '', rango_j2: 'Aestartes', puntos_j2: 0
})

const faccionesDisponibles = ref([])
const jugadoresDisponibles = ref([])
const cargandoDatos = ref(false)

// Carga simultánea de Jugadores y Facciones
const cargarDatosInteligencia = async () => {
  cargandoDatos.value = true
  try {
    const urlFacciones = `http://127.0.0.1:8000/api/facciones/${formResultado.value.juego}`
    const urlJugadores = `http://127.0.0.1:8000/api/jugadores/${formResultado.value.juego}`
    
    // Disparamos ambas peticiones al mismo tiempo para que sea rapidísimo
    const [resFacciones, resJugadores] = await Promise.all([
      fetch(urlFacciones),
      fetch(urlJugadores)
    ])
    
    const dataFacciones = await resFacciones.json()
    const dataJugadores = await resJugadores.json()
    
    if (dataFacciones.facciones) faccionesDisponibles.value = dataFacciones.facciones
    if (dataJugadores.jugadores) jugadoresDisponibles.value = dataJugadores.jugadores
    
  } catch (error) { 
    console.error("Error descargando paquetes de inteligencia:", error) 
  } finally { 
    cargandoDatos.value = false 
  }
}

onMounted(() => { cargarDatosInteligencia() })

watch(() => formResultado.value.juego, () => { 
  formResultado.value.jugador1 = ''; formResultado.value.faccion_j1 = ''; 
  formResultado.value.jugador2 = ''; formResultado.value.faccion_j2 = ''; 
  cargarDatosInteligencia() 
})

const submitResultado = async () => {
  enviando.value = true
  mensajeStatus.value = null
  try {
    const token = await authStore.user.getIdToken()
    const response = await fetch('http://127.0.0.1:8000/api/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formResultado.value)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Fallo en la transmisión')
    mensajeStatus.value = { tipo: 'exito', texto: 'Log registrado con éxito.' }
    formResultado.value.jugador1 = ''; formResultado.value.faccion_j1 = ''; formResultado.value.puntos_j1 = 0; formResultado.value.resultado_j1 = 'victoria';
    formResultado.value.jugador2 = ''; formResultado.value.faccion_j2 = ''; formResultado.value.puntos_j2 = 0;
  } catch (error) {
    mensajeStatus.value = { tipo: 'error', texto: error.message }
  } finally { enviando.value = false }
}
</script>

<template>
  <section class="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-xl animate-fade-in relative z-10">
    <h3 class="text-xl font-black text-white uppercase italic mb-6">Registrar Log de Batalla</h3>
    <div v-if="mensajeStatus" :class="mensajeStatus.tipo === 'exito' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'" class="border p-4 rounded-lg mb-6 font-mono text-xs uppercase tracking-widest">
      {{ mensajeStatus.texto }}
    </div>
    
    <form @submit.prevent="submitResultado" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2 grid grid-cols-3 gap-4 border-b border-slate-800 pb-4 mb-2">
         <div class="flex flex-col gap-1 relative z-50">
          <label class="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Temporada</label>
          <DropdownTactico 
            v-model="formResultado.juego" 
            :opciones="[{value: 'kt2026', label: 'Kill Team 2026'}, {value: '40k1k2026', label: '40K (1000 Pts)'}]" 
          />
        </div>
        <div class="flex flex-col gap-1 relative z-40">
          <label class="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Fecha</label>
          <input v-model="formResultado.fecha" type="date" required class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm text-white outline-none focus:border-orange-500 w-full h-full">
        </div>
        <div class="flex flex-col gap-1 relative z-30">
          <label class="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Season</label>
          <input v-model="formResultado.season" type="text" placeholder="S2026" required class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm text-white outline-none focus:border-orange-500 h-full w-full">
        </div>
      </div>

      <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative z-20">
        <h4 class="text-orange-500 font-black text-xs uppercase tracking-widest mb-3">Jugador 1 (Principal)</h4>
        <div class="space-y-3">
          <div class="relative z-50">
            <DropdownTactico v-model="formResultado.jugador1" :opciones="jugadoresDisponibles" permitirCrear placeholder="Nombre Jugador 1 (Selecciona o escribe)" />
          </div>
          
          <div class="relative z-40">
            <DropdownTactico v-model="formResultado.faccion_j1" :opciones="faccionesDisponibles" permitirCrear placeholder="Facción J1 (Selecciona o escribe)" />
          </div>

          <div class="grid grid-cols-2 gap-2 relative z-30">
            <input v-model="formResultado.puntos_j1" type="number" placeholder="Pts J1" required class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm text-white outline-none focus:border-orange-500">
            <DropdownTactico v-model="formResultado.rango_j1" :opciones="['Aestartes', 'Iniciado']" />
          </div>
          <div class="mt-2 relative z-20">
            <label class="text-[9px] text-slate-500 font-mono uppercase block mb-1">Resultado J1</label>
            <DropdownTactico v-model="formResultado.resultado_j1" :opciones="[{value: 'victoria', label: 'Victoria'}, {value: 'empate', label: 'Empate'}, {value: 'derrota', label: 'Derrota'}]" />
          </div>
        </div>
      </div>

      <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative z-10">
        <h4 class="text-slate-400 font-black text-xs uppercase tracking-widest mb-3">Jugador 2 (Rival)</h4>
        <div class="space-y-3">
          <div class="relative z-50">
            <DropdownTactico v-model="formResultado.jugador2" :opciones="jugadoresDisponibles" permitirCrear placeholder="Nombre Jugador 2 (Selecciona o escribe)" />
          </div>
          
          <div class="relative z-40">
            <DropdownTactico v-model="formResultado.faccion_j2" :opciones="faccionesDisponibles" permitirCrear placeholder="Facción J2 (Selecciona o escribe)" />
          </div>

          <div class="grid grid-cols-2 gap-2 relative z-30">
            <input v-model="formResultado.puntos_j2" type="number" placeholder="Pts J2" required class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm text-white outline-none focus:border-orange-500">
            <DropdownTactico v-model="formResultado.rango_j2" :opciones="['Aestartes', 'Iniciado']" />
          </div>
        </div>
      </div>

      <div class="md:col-span-2 mt-4 relative z-0">
        <button type="submit" :disabled="enviando || cargandoDatos" class="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-black disabled:text-slate-500 font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg shadow-orange-500/20">
          {{ enviando ? 'TRANSMITIENDO...' : (cargandoDatos ? 'CARGANDO INTELIGENCIA...' : 'REGISTRAR LOG DE BATALLA') }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
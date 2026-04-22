<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const juegoSeleccionado = ref('kt2026')
const eventos = ref([])
const cargando = ref(true)

const ahora = ref(new Date())
let intervaloTimer = null 

const cargarEventos = async () => {
  cargando.value = true
  try {
    const API_URL = `http://127.0.0.1:8000/api/eventos/${juegoSeleccionado.value}`
    const response = await fetch(API_URL)
    const data = await response.json()
    
    eventos.value = (data.eventos || []).reverse()
  } catch (error) {
    console.error("Fallo de comunicación con la base de datos:", error)
  } finally {
    cargando.value = false
  }
}

const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Fecha por confirmar'
  const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  const fecha = new Date(fechaString)
  return fecha.toLocaleDateString('es-SV', opciones)
}

const esEventoCerrado = (fechaString) => {
  if (!fechaString) return false
  const fechaEvento = new Date(fechaString)
  return fechaEvento < ahora.value 
}

// --- DIVISIÓN DE TROPAS (COMPUTADAS) ---
// Separamos los eventos automáticamente en dos grupos
const eventosActivos = computed(() => {
  return eventos.value.filter(evento => !esEventoCerrado(evento.fecha))
})

const eventosPasados = computed(() => {
  return eventos.value.filter(evento => esEventoCerrado(evento.fecha))
})

const calcularTiempoRestante = (fechaString) => {
  if (!fechaString || esEventoCerrado(fechaString)) return null

  const t = Date.parse(fechaString) - Date.parse(ahora.value)
  if (t <= 0) return null 
  
  const segundos = Math.floor((t / 1000) % 60)
  const minutos = Math.floor((t / 1000 / 60) % 60)
  const horas = Math.floor((t / (1000 * 60 * 60)) % 24)
  const dias = Math.floor(t / (1000 * 60 * 60 * 24))
  
  const pad = (num) => num.toString().padStart(2, '0')

  return { dias: pad(dias), horas: pad(horas), minutos: pad(minutos), segundos: pad(segundos) }
}

onMounted(() => {
  cargarEventos()
  intervaloTimer = setInterval(() => { ahora.value = new Date() }, 1000)
})

onUnmounted(() => {
  if (intervaloTimer) clearInterval(intervaloTimer)
})

watch(juegoSeleccionado, () => { cargarEventos() })
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-10 text-slate-100 min-h-screen">
    
    <header class="mb-10 text-center">
      <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-lg">
        Cronograma de <span class="text-orange-500">Misiones</span>
      </h1>
      <p class="text-slate-400 font-mono uppercase tracking-widest text-xs md:text-sm">
        Registro de operaciones activas y archivadas en el sector.
      </p>
    </header>

    <div class="flex justify-center mb-10">
      <div class="bg-slate-900/60 p-2 rounded-xl backdrop-blur-sm border border-slate-800 flex flex-wrap gap-2">
        <button 
          @click="juegoSeleccionado = 'kt2026'" 
          class="px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-all"
          :class="juegoSeleccionado === 'kt2026' ? 'bg-orange-600 text-black shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
        >
          Kill Team 26
        </button>
        <button 
          @click="juegoSeleccionado = '40k1k2026'" 
          class="px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-all"
          :class="juegoSeleccionado === '40k1k2026' ? 'bg-orange-600 text-black shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
        >
          WH40K (1000pts)
        </button>
      </div>
    </div>

    <div v-if="cargando" class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p class="font-mono text-xs uppercase tracking-widest text-orange-500">Descargando coordenadas...</p>
      </div>
    </div>

    <div v-else-if="eventos.length === 0" class="bg-slate-900/40 border border-slate-800 rounded-xl p-10 text-center backdrop-blur-sm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 text-slate-600">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <h3 class="text-xl font-bold text-slate-300 uppercase italic tracking-wider mb-2">Sin Operaciones Registradas</h3>
      <p class="text-sm text-slate-500 font-mono">El Administratum no tiene datos de misiones para este sistema.</p>
    </div>

    <div v-else>
      <div v-if="eventosActivos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div 
          v-for="evento in eventosActivos" 
          :key="evento.id" 
          class="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col relative"
        >
          <div class="absolute top-4 right-4 text-[9px] px-2 py-1 rounded font-black font-mono tracking-widest uppercase shadow-sm z-10 bg-green-950/80 text-green-400 border border-green-900/50">
            🟢 Infiltración Activa
          </div>

          <div class="h-2 w-full transition-colors bg-orange-600"></div>
          
          <div class="p-6 pt-10 flex-grow flex flex-col">
            <h3 class="text-xl font-black text-white uppercase italic tracking-tight mb-4 group-hover:text-orange-400 transition-colors">
              {{ evento.titulo }}
            </h3>
            
            <div class="space-y-4 mb-6 flex-grow">
              <div v-if="calcularTiempoRestante(evento.fecha)" class="flex flex-col gap-2 items-center bg-slate-950/70 border border-slate-800 rounded-lg p-4 font-mono shadow-inner relative overflow-hidden">
                  <div class="absolute inset-0 bg-orange-500/5 opacity-30 pointer-events-none"></div>
                  <p class="text-orange-500 text-[10px] uppercase tracking-widest mb-1 relative z-10">Infiltración comienza en:</p>
                  <div class="flex gap-3 text-center relative z-10">
                      <div class="flex flex-col items-center">
                          <span class="text-3xl font-black text-white tabular-nums drop-shadow-lg">{{ calcularTiempoRestante(evento.fecha).dias }}</span>
                          <span class="block text-[8px] text-slate-500 uppercase tracking-widest">Días</span>
                      </div>
                      <div class="text-3xl font-black text-slate-700">:</div>
                      <div class="flex flex-col items-center">
                          <span class="text-3xl font-black text-white tabular-nums drop-shadow-lg">{{ calcularTiempoRestante(evento.fecha).horas }}</span>
                          <span class="block text-[8px] text-slate-500 uppercase tracking-widest">Horas</span>
                      </div>
                      <div class="text-3xl font-black text-slate-700">:</div>
                      <div class="flex flex-col items-center">
                          <span class="text-3xl font-black text-white tabular-nums drop-shadow-lg">{{ calcularTiempoRestante(evento.fecha).minutos }}</span>
                          <span class="block text-[8px] text-slate-500 uppercase tracking-widest">Min</span>
                      </div>
                      <div class="text-3xl font-black text-slate-700">:</div>
                      <div class="flex flex-col items-center">
                          <span class="text-3xl font-black text-white tabular-nums drop-shadow-lg text-orange-400">{{ calcularTiempoRestante(evento.fecha).segundos }}</span>
                          <span class="block text-[8px] text-slate-500 uppercase tracking-widest">Seg</span>
                      </div>
                  </div>
              </div>

              <div class="flex items-start gap-3 text-sm p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-slate-600 font-mono text-[10px] uppercase tracking-widest mb-0.5">Coordenadas Temporales (DD/MM/YYYY)</p>
                  <p class="text-slate-300 font-medium">{{ formatearFecha(evento.fecha) }}</p>
                </div>
              </div>
            </div>
            
            <a 
              v-if="evento.link" 
              :href="evento.link" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="block w-full text-center py-3 rounded font-black uppercase tracking-widest text-xs transition-all border bg-orange-600/10 text-orange-500 hover:bg-orange-500 hover:text-black border-orange-500/50 hover:border-orange-500"
            >
              Inscribete al torneo
            </a>
            <button v-else disabled class="block w-full text-center bg-slate-900/50 text-slate-600 border border-slate-800 py-3 rounded font-black uppercase tracking-widest text-xs cursor-not-allowed">
              Sin Enlace
            </button>
          </div>
        </div>
      </div>

      <div v-if="eventosPasados.length > 0" class="mt-20">
        
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="h-[1px] bg-slate-800 flex-grow"></div>
          <span class="bg-slate-950 border border-slate-800 px-6 py-2 rounded-full text-[10px] text-slate-500 font-mono uppercase tracking-widest shadow-inner">Archivos Encriptados</span>
          <div class="h-[1px] bg-slate-800 flex-grow"></div>
        </div>
        <div class="flex items-center justify-center gap-4 mb-10 opacity-60">
          <div class="h-[1px] bg-orange-900/30 w-1/4"></div>
          <span class="text-[9px] text-orange-500/60 font-mono uppercase tracking-widest">Misiones Completadas</span>
          <div class="h-[1px] bg-orange-900/30 w-1/4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="evento in eventosPasados" 
            :key="evento.id" 
            class="bg-slate-950/60 border border-slate-800/60 rounded-xl p-6 hover:bg-slate-900/80 hover:border-slate-700 transition-all group flex flex-col"
          >
            <h4 class="text-lg font-black text-slate-400 uppercase italic tracking-tight mb-1 group-hover:text-slate-300 transition-colors">
              {{ evento.titulo }}
            </h4>
            <p class="text-[10px] font-mono text-slate-600 mb-6 uppercase tracking-widest">
              {{ formatearFecha(evento.fecha) }} <span class="text-red-900/80 font-bold">(Finalizado)</span>
            </p>
            
            <div class="mt-auto">
              <a 
                v-if="evento.link" 
                :href="evento.link" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[9px] text-slate-500 uppercase tracking-widest font-mono hover:text-orange-500 transition-colors flex items-center gap-2"
              >
                Acceso a logs históricos <span class="text-orange-500/50">&rarr;</span>
              </a>
              <span v-else class="text-[9px] text-slate-700 uppercase tracking-widest font-mono">
                Sin registros en el administratum
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import DropdownTactico from './DropdownTactico.vue'

const authStore = useAuthStore()
const formEvento = ref({ juego: 'kt2026', titulo: '', fecha: '', link: '' })
const enviandoEvento = ref(false)
const mensajeEventoStatus = ref(null)

const eventosList = ref([])
const editandoId = ref(null)
const cargandoLista = ref(true)

const cargarEventosAdmin = async () => {
  cargandoLista.value = true
  try {
    const [resKt26, res40k] = await Promise.all([
      fetch('http://127.0.0.1:8000/api/eventos/kt2026'),
      fetch('http://127.0.0.1:8000/api/eventos/40k1k2026')
    ])
    
    const dataKt26 = await resKt26.json()
    const data40k = await res40k.json()
    
    let todos = [...(dataKt26.eventos || []), ...(data40k.eventos || [])]
    eventosList.value = todos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  } catch (error) {
    console.error("Error cargando eventos:", error)
  } finally {
    cargandoLista.value = false
  }
}

onMounted(() => {
  cargarEventosAdmin()
})

const submitEvento = async () => {
  enviandoEvento.value = true
  mensajeEventoStatus.value = null
  try {
    const token = await authStore.user.getIdToken()
    let url = 'http://127.0.0.1:8000/api/eventos'
    let method = 'POST'
    
    if (editandoId.value) {
      url = `http://127.0.0.1:8000/api/eventos/${editandoId.value}`
      method = 'PUT'
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formEvento.value)
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Fallo al agendar la misión')
    
    mensajeEventoStatus.value = { tipo: 'exito', texto: data.mensaje }
    
    formEvento.value.titulo = ''
    formEvento.value.fecha = ''
    formEvento.value.link = ''
    editandoId.value = null
    
    cargarEventosAdmin()
  } catch (error) { 
    mensajeEventoStatus.value = { tipo: 'error', texto: error.message }
  } finally { 
    enviandoEvento.value = false 
  }
}

const editarEvento = (evento) => {
  if (esEventoCerrado(evento.fecha)) return // Doble validación de seguridad
  formEvento.value.juego = evento.juego
  formEvento.value.titulo = evento.titulo
  formEvento.value.fecha = evento.fecha
  formEvento.value.link = evento.link
  editandoId.value = evento.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelarEdicion = () => {
  formEvento.value.titulo = ''
  formEvento.value.fecha = ''
  formEvento.value.link = ''
  editandoId.value = null
  mensajeEventoStatus.value = null
}

const eliminarEvento = async (id) => {
  if (!confirm("¿Seguro que deseas purgar esta misión de los registros?")) return
  
  try {
    const token = await authStore.user.getIdToken()
    const response = await fetch(`http://127.0.0.1:8000/api/eventos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Fallo al eliminar')
    cargarEventosAdmin()
  } catch (error) {
    alert("Error al eliminar: " + error.message)
  }
}

const formatearFecha = (fechaString) => {
  if (!fechaString) return ''
  const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(fechaString).toLocaleDateString('es-SV', opciones)
}

const esEventoCerrado = (fechaString) => {
  if (!fechaString) return false
  return new Date(fechaString) < new Date()
}
</script>

<template>
  <div class="space-y-8 animate-fade-in relative z-10">
    
    <section class="bg-slate-900/40 border p-6 md:p-8 rounded-xl transition-colors duration-300" :class="editandoId ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-slate-800'">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-black text-white uppercase italic">
          <span v-if="editandoId" class="text-orange-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            Modificando Coordenadas
          </span>
          <span v-else>Programar Nueva Misión (Evento)</span>
        </h3>
        <button v-if="editandoId" @click="cancelarEdicion" class="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-red-400 underline transition-colors">
          Cancelar Edición
        </button>
      </div>

      <form @submit.prevent="submitEvento" class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div class="flex flex-col gap-2 md:col-span-2 border-b border-slate-800 pb-4 relative z-50">
          <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Formato</label>
          <div class="w-full md:w-1/2">
            <DropdownTactico v-model="formEvento.juego" :opciones="[{value: 'kt2026', label: 'Kill Team 2026'}, {value: '40k1k2026', label: 'Warhammer 40K (1000 Pts)'}]" />
          </div>
        </div>
        <div class="flex flex-col gap-2 relative z-30">
          <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Título de la Misión</label>
          <input v-model="formEvento.titulo" type="text" required placeholder="Ej. Torneo Skirmish" class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none">
        </div>
        <div class="flex flex-col gap-2 relative z-20">
          <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Fecha de comienzo</label>
          <input v-model="formEvento.fecha" type="datetime-local" lang="es-SV" required class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-orange-500 outline-none">
        </div>
        <div class="flex flex-col gap-2 md:col-span-2 relative z-10">
          <label class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Enlace o URL de Inscripcion/Info</label>
          <input v-model="formEvento.link" type="url" placeholder="https://..." class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none">
        </div>
        <div class="md:col-span-2 mt-4">
          <button type="submit" :disabled="enviandoEvento" class="w-full transition-colors font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg" :class="editandoId ? 'bg-orange-500 text-black' : 'bg-orange-600 hover:bg-orange-500 text-black disabled:bg-slate-700 disabled:text-slate-500'">
            {{ enviandoEvento ? 'PROCESANDO...' : (editandoId ? 'ACTUALIZAR DATOS' : 'AGENDAR EN CRONOGRAMA') }}
          </button>
        </div>
      </form>
    </section>

    <section class="bg-slate-900/20 border border-slate-800/50 p-6 md:p-8 rounded-xl relative z-0">
      <h3 class="text-lg font-black text-slate-300 uppercase italic mb-6">Bitácora de Operaciones</h3>
      
      <div v-if="eventosList.length === 0" class="text-center text-slate-600 font-mono text-xs uppercase py-10">
        No hay transmisiones registradas.
      </div>

      <div v-else class="space-y-3">
        <div v-for="evento in eventosList" :key="evento.id" class="bg-slate-950/50 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all" :class="esEventoCerrado(evento.fecha) ? 'opacity-50 border-slate-900' : 'hover:border-slate-600'">
          
          <div class="flex-grow">
            <div class="flex items-center gap-3 mb-1">
              <span class="text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-widest" :class="evento.juego === 'kt2026' ? 'bg-orange-950/50 text-orange-500' : 'bg-blue-950/50 text-blue-400'">
                {{ evento.juego === 'kt2026' ? 'Kill Team' : '40K (1K)' }}
              </span>
              <h4 class="text-sm font-bold text-white uppercase">{{ evento.titulo }}</h4>
            </div>
            <p class="text-xs font-mono text-slate-400">
              Finalizada: {{ formatearFecha(evento.fecha) }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <template v-if="!esEventoCerrado(evento.fecha)">
              <button @click="editarEvento(evento)" class="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded border border-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
              </button>
              <button @click="eliminarEvento(evento.id)" class="bg-red-950/30 hover:bg-red-900/60 text-red-500 p-2 rounded border border-red-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </template>

            <div v-else class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-800 bg-slate-900/50 text-[9px] font-mono text-slate-500 uppercase tracking-widest italic">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              Evento archivado
            </div>
          </div>
          
        </div>
      </div>
    </section>

  </div>
</template>
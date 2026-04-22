<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  opciones: { type: Array, required: true }, 
  placeholder: { type: String, default: 'Seleccionar opción...' },
  permitirCrear: { type: Boolean, default: false } // True para Facciones, False para selectores fijos
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const inputValue = ref('')

const opcionesNormalizadas = computed(() => {
  return props.opciones.map(opt => {
    if (typeof opt === 'object') return opt
    return { value: opt, label: opt }
  })
})

watch(() => props.modelValue, (newVal) => {
  const opt = opcionesNormalizadas.value.find(o => o.value === newVal)
  inputValue.value = opt ? opt.label : newVal
}, { immediate: true })

const opcionesFiltradas = computed(() => {
  if (!props.permitirCrear) return opcionesNormalizadas.value
  
  const busqueda = inputValue.value.toString().toLowerCase().trim()
  if (!busqueda) return opcionesNormalizadas.value
  
  return opcionesNormalizadas.value.filter(o => o.label.toString().toLowerCase().includes(busqueda))
})

const seleccionar = (opcion) => {
  inputValue.value = opcion.label
  emit('update:modelValue', opcion.value)
  isOpen.value = false
}

const handleInput = (e) => {
  inputValue.value = e.target.value
  if (props.permitirCrear) {
    emit('update:modelValue', e.target.value)
  }
}
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <input 
        type="text" 
        :value="inputValue"
        @input="handleInput"
        :placeholder="placeholder"
        :readonly="!permitirCrear"
        @focus="isOpen = true"
        @keydown.esc="isOpen = false"
        class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs md:text-sm text-white outline-none focus:border-orange-500 pr-8 relative z-10 transition-colors"
        :class="{ 'cursor-pointer': !permitirCrear }"
      >
      <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-20 transition-transform duration-200" :class="{ 'rotate-180 text-orange-500': isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" /></svg>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-30" @click="isOpen = false"></div>

    <transition name="fade-down">
      <ul v-if="isOpen && opcionesFiltradas.length > 0" class="absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto z-40 backdrop-blur-md scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <li 
          v-for="(opcion, index) in opcionesFiltradas" 
          :key="index"
          @click="seleccionar(opcion)"
          class="px-4 py-3 text-xs text-slate-300 hover:bg-orange-600 hover:text-black cursor-pointer transition-colors font-mono uppercase tracking-wider border-b border-slate-800/50 last:border-0"
        >
          {{ opcion.label }}
        </li>
      </ul>
      <ul v-else-if="isOpen && permitirCrear && inputValue" class="absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-orange-500/50 rounded-lg shadow-2xl z-40 p-4 backdrop-blur-md">
        <li class="text-[10px] text-orange-400 font-mono uppercase tracking-widest animate-pulse flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.533 5.012l-2.3 2.3A.75.75 0 002.76 18.5l2.88-1.44a8.134 8.134 0 004.36 1.274c4.31 0 8-3.033 8-7s-3.69-7-8-7zM8.75 7.5a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5z" clip-rule="evenodd" /></svg>
          Creando nueva entrada táctica...
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fade-down-enter-active, .fade-down-leave-active { transition: all 0.2s ease-out; }
.fade-down-enter-from, .fade-down-leave-to { opacity: 0; transform: translateY(-5px); }
.scrollbar-thin::-webkit-scrollbar { width: 6px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; }
.scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #f97316; }
</style>
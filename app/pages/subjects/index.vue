<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title">Хичээлүүд</h1>
      <button v-if="auth.canManage && schoolId" @click="showModal = true" class="btn-primary">+ Хичээл нэмэх</button>
    </div>

    <div class="mb-6">
      <label class="label">Сургууль</label>
      <select v-model="schoolId" @change="load" class="select-field max-w-xs">
        <option value="">Сонгох...</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
    </div>

    <div v-if="!schoolId" class="empty-state">
      <div class="empty-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
      <p class="text-sm text-stone-400">Сургууль сонгоно уу</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="s in subjects" :key="s.subjectId" class="card p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
            <svg class="w-4.5 h-4.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          </div>
          <p class="font-semibold text-stone-800">{{ s.name }}</p>
        </div>
        <p v-if="s.description" class="text-xs text-stone-400 ml-12">{{ s.description }}</p>
      </div>
      <div v-if="!subjects.length" class="col-span-full empty-state">
        <p class="text-sm text-stone-400">Хичээл байхгүй</p>
        <button v-if="auth.canManage" @click="showModal = true" class="text-sm text-emerald-600 hover:underline mt-2">+ Нэмэх</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Хичээл нэмэх</h2>
        <div class="space-y-3">
          <div><label class="label">Хичээлийн нэр</label><input v-model="form.name" class="input-field" placeholder="Математик" /></div>
          <div><label class="label">Тайлбар</label><input v-model="form.desc" class="input-field" placeholder="Заавал биш" /></div>
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="showModal = false" class="btn-secondary">Болих</button>
          <button @click="add" class="btn-primary">Хадгалах</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">Хичээл нэмэгдлээ!</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore(); const { get, post } = useApi()
const schools = ref<any[]>([]); const subjects = ref<any[]>([]); const schoolId = ref('')
const showModal = ref(false); const toast = ref(false); const form = reactive({ name: '', desc: '' })

onMounted(async () => { try { schools.value = await get('/schools') as any[] } catch {} })
const load = async () => { if (!schoolId.value) { subjects.value = []; return }; subjects.value = await get(`/subjects?schoolId=${schoolId.value}`) as any[] }
const add = async () => {
  if (!form.name) return
  await post('/subjects', { name: form.name, description: form.desc || null, schoolId: schoolId.value })
  showModal.value = false; Object.assign(form, { name: '', desc: '' })
  toast.value = true; setTimeout(() => toast.value = false, 2000); await load()
}
</script>

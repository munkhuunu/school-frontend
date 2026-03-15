<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title">Багш нар</h1>
      <button v-if="auth.canManage && schoolId" @click="showAdd = true" class="btn-primary">+ Багш нэмэх</button>
    </div>

    <div class="mb-6">
      <label class="label">Сургууль</label>
      <select v-model="schoolId" @change="load" class="select-field max-w-xs">
        <option value="">Сонгох...</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
    </div>

    <div v-if="!schoolId" class="empty-state">
      <div class="empty-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg></div>
      <p class="text-sm text-stone-400">Сургууль сонгоно уу</p>
    </div>

    <div v-else class="space-y-2.5">
      <div v-for="t in teachers" :key="t.teacherId" class="card p-5 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 text-sm font-bold border border-amber-100">
            {{ t.firstName?.charAt(0) }}
          </div>
          <div>
            <p class="font-semibold text-stone-800">{{ t.lastName }} {{ t.firstName }}</p>
            <p class="text-xs text-stone-400">{{ t.email || 'И-мэйл байхгүй' }}</p>
            <p v-if="t.classIds?.length" class="text-xs text-emerald-600 mt-0.5 font-medium">{{ t.classIds.length }} ангид</p>
          </div>
        </div>
        <button v-if="auth.canManage" @click="openAssign(t)" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Анги хуваарилах</button>
      </div>
      <div v-if="!teachers.length" class="empty-state">
        <p class="text-sm text-stone-400">Багш байхгүй байна</p>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAdd" class="modal-overlay" @click.self="showAdd = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Багш нэмэх</h2>
        <div class="space-y-3">
          <div><label class="label">Овог</label><input v-model="form.lastName" class="input-field" /></div>
          <div><label class="label">Нэр</label><input v-model="form.firstName" class="input-field" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="label">И-мэйл</label><input v-model="form.email" class="input-field" /></div>
            <div><label class="label">Утас</label><input v-model="form.phone" class="input-field" /></div>
          </div>
        </div>
        <p v-if="err" class="text-sm text-red-600 mt-2">{{ err }}</p>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="showAdd = false" class="btn-secondary">Болих</button>
          <button @click="addTeacher" class="btn-primary">Хадгалах</button>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="showAssign" class="modal-overlay" @click.self="showAssign = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-1">Анги хуваарилах</h2>
        <p class="text-sm text-stone-400 mb-4">{{ assignTarget?.lastName }} {{ assignTarget?.firstName }}</p>
        <select v-model="assignClassId" class="select-field mb-4">
          <option value="">Анги сонгох...</option>
          <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }} ({{ c.grade }}-р)</option>
        </select>
        <div class="flex gap-2 justify-end">
          <button @click="showAssign = false" class="btn-secondary">Болих</button>
          <button @click="assign" class="btn-primary">Хуваарилах</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore(); const { get, post } = useApi()
const schools = ref<any[]>([]); const teachers = ref<any[]>([]); const classes = ref<any[]>([])
const schoolId = ref(''); const showAdd = ref(false); const showAssign = ref(false)
const assignTarget = ref<any>(null); const assignClassId = ref(''); const err = ref('')
const form = reactive({ lastName: '', firstName: '', email: '', phone: '' })

onMounted(async () => { try { schools.value = await get('/schools') as any[] } catch {} })
const load = async () => {
  if (!schoolId.value) return
  teachers.value = await get(`/teachers?schoolId=${schoolId.value}`) as any[]
  classes.value = await get(`/schools/${schoolId.value}/classes`) as any[]
}
const addTeacher = async () => {
  if (!form.lastName || !form.firstName) { err.value = 'Овог нэр оруулна уу'; return }
  await post('/teachers', { ...form, schoolId: schoolId.value })
  showAdd.value = false; err.value = ''; Object.assign(form, { lastName: '', firstName: '', email: '', phone: '' }); await load()
}
const openAssign = (t: any) => { assignTarget.value = t; assignClassId.value = ''; showAssign.value = true }
const assign = async () => { if (!assignClassId.value) return; await post('/teachers/assign', { teacherId: assignTarget.value.teacherId, classId: assignClassId.value }); showAssign.value = false; await load() }
</script>

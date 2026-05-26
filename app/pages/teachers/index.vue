<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title">Багш нар</h1>
      <button v-if="auth.canManage && schoolId" @click="showAdd = true" class="btn-primary">+ Багш нэмэх</button>
    </div>

    <div v-if="auth.isSuperAdmin" class="mb-6">
      <label class="label">Сургууль</label>
      <select v-model="schoolId" @change="load" class="select-field max-w-xs">
        <option value="">Сонгох...</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
    </div>

    <div v-if="!schoolId" class="empty-state">
      <p class="text-sm text-stone-400">{{ auth.isSuperAdmin ? 'Сургууль сонгоно уу' : 'Та сургуульд харьяалагдаагүй байна' }}</p>
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
            <p v-if="t.assignmentCount" class="text-xs text-emerald-600 mt-0.5 font-medium">{{ t.assignmentCount }} хичээлд</p>
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
          <button @click="addTeacher" :disabled="saving" class="btn-primary">{{ saving ? '...' : 'Хадгалах' }}</button>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="showAssign" class="modal-overlay" @click.self="showAssign = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-1">Анги хуваарилах</h2>
        <p class="text-sm text-stone-400 mb-4">{{ assignTarget?.lastName }} {{ assignTarget?.firstName }}</p>
        <select v-model="assignClassId" class="select-field mb-3">
          <option value="">Анги сонгох...</option>
          <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }} ({{ c.grade }}-р)</option>
        </select>
        <select v-model="assignSubjectId" class="select-field mb-4">
          <option value="">Хичээл сонгох...</option>
          <option v-for="s in subjects" :key="s.subjectId" :value="s.subjectId">{{ s.name }}</option>
        </select>
        <div class="flex gap-2 justify-end">
          <button @click="showAssign = false" class="btn-secondary">Болих</button>
          <button @click="assign" :disabled="!assignClassId || !assignSubjectId || assigning" class="btn-primary">
            {{ assigning ? '...' : 'Хуваарилах' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post } = useApi()
const schools = ref<any[]>([])
const teachers = ref<any[]>([])
const classes = ref<any[]>([])
const subjects = ref<any[]>([])
const schoolId = ref(auth.schoolId ?? '')
const showAdd = ref(false)
const showAssign = ref(false)
const assignTarget = ref<any>(null)
const assignClassId = ref('')
const assignSubjectId = ref('')
const err = ref('')
const saving = ref(false)
const assigning = ref(false)
const form = reactive({ lastName: '', firstName: '', email: '', phone: '' })

onMounted(async () => {
  if (auth.isSuperAdmin) {
    try { schools.value = await get('/schools') as any[] } catch {}
  }
  if (schoolId.value) await load()
})

const load = async () => {
  if (!schoolId.value) return
  try {
    teachers.value = (await get(`/schools/${schoolId.value}/teachers`) as any[]) ?? []
    classes.value = (await get(`/schools/${schoolId.value}/classes`) as any[]) ?? []
    // ✅ FIX: subjects endpoint нь /schools/{id}/subjects, query param БИШ
    subjects.value = (await get(`/schools/${schoolId.value}/subjects`) as any[]) ?? []
  } catch {}
}

const addTeacher = async () => {
  if (!form.lastName || !form.firstName) { err.value = 'Овог нэр оруулна уу'; return }
  saving.value = true; err.value = ''
  try {
    await post(`/schools/${schoolId.value}/teachers`, { ...form })
    showAdd.value = false
    Object.assign(form, { lastName: '', firstName: '', email: '', phone: '' })
    await load()
  } catch (e: any) {
    err.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { saving.value = false }
}

const openAssign = (t: any) => {
  assignTarget.value = t
  assignClassId.value = ''
  assignSubjectId.value = ''
  showAssign.value = true
}

const assign = async () => {
  if (!assignClassId.value || !assignSubjectId.value) return
  assigning.value = true
  try {
    await post(`/schools/${schoolId.value}/teachers/assign`, {
      teacherId: assignTarget.value.teacherId,
      classId: assignClassId.value,
      subjectId: assignSubjectId.value,
    })
    showAssign.value = false
    await load()
  } finally { assigning.value = false }
}
</script>
  
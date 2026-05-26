<template>
  <div class="p-6 lg:p-8 max-w-6xl">
    <h1 class="page-title mb-6">Ирц бүртгэх</h1>

    <div class="card p-5 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="label">Сургууль</label>
          <select v-model="schoolId" @change="onSchool" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Анги</label>
          <select v-model="classId" @change="onClass" :disabled="!schoolId" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="c in classes" :key="c.classId" :value="c.classId">
              {{ c.name }}<span v-if="c.grade"> ({{ c.grade }}-р)</span>
            </option>
          </select>
        </div>
        <div>
          <label class="label">Огноо</label>
          <input v-model="date" type="date" class="input-field" />
        </div>
      </div>
    </div>

    <div v-if="loading" class="empty-state"><p class="text-stone-400">Уншиж байна...</p></div>

    <div v-else-if="students.length" class="card overflow-hidden">
      <div class="px-5 py-3 border-b border-stone-100 flex flex-wrap gap-2 items-center bg-stone-50/50">
        <span class="text-xs text-stone-500 font-medium mr-2">Бүгдийг тэмдэглэх:</span>
        <button @click="markAll('PRESENT')" class="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Ирсэн</button>
        <button @click="markAll('ABSENT')" class="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100">Тасалсан</button>
        <button @click="markAll('LATE')" class="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100">Хоцорсон</button>
        <button @click="markAll('EXCUSED')" class="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100">Чөлөө</button>
      </div>

      <table class="w-full">
        <thead><tr class="border-b border-stone-100">
          <th class="table-header w-12">#</th>
          <th class="table-header">Сурагч</th>
          <th class="table-header text-center w-20">Ирсэн</th>
          <th class="table-header text-center w-20">Тасалсан</th>
          <th class="table-header text-center w-20">Хоцорсон</th>
          <th class="table-header text-center w-20">Чөлөө</th>
        </tr></thead>
        <tbody>
          <tr v-for="(s, i) in students" :key="s.studentId" class="border-b border-stone-50 last:border-0 hover:bg-stone-50/40">
            <td class="table-cell text-stone-400 font-mono text-xs">{{ i + 1 }}</td>
            <td class="table-cell font-medium text-stone-800">{{ s.lastName }} {{ s.firstName }}</td>
            <td v-for="st in statuses" :key="st" class="table-cell text-center">
              <input type="radio" :name="s.studentId" :value="st" v-model="att[s.studentId]"
                class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-stone-300" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="px-5 py-4 border-t border-stone-100 flex justify-between items-center bg-stone-50/50">
        <p class="text-xs text-stone-400">Нийт {{ students.length }} сурагч</p>
        <button @click="submit" :disabled="saving" class="btn-primary">
          {{ saving ? 'Хадгалж байна...' : 'Ирц хадгалах' }}
        </button>
      </div>
      <p v-if="errMsg" class="text-sm text-red-600 px-5 pb-4">{{ errMsg }}</p>
    </div>

    <div v-else-if="classId" class="empty-state"><p class="text-sm text-stone-400">Сурагч байхгүй</p></div>
    <div v-else-if="!schoolId" class="empty-state"><p class="text-sm text-stone-400">Сургууль сонгоно уу</p></div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post } = useApi()

const schools = ref<any[]>([])
const classes = ref<any[]>([])
const students = ref<any[]>([])
const schoolId = ref<string>(auth.user?.schoolId ?? '')
const classId = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const att = reactive<Record<string, string>>({})
const saving = ref(false)
const loading = ref(false)
const toast = ref('')
const errMsg = ref('')

const statuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']

const showToast = (msg: string) => { toast.value = msg; setTimeout(() => (toast.value = ''), 2000) }

onMounted(async () => {
  try { schools.value = (await get('/schools')) as any[] } catch { schools.value = [] }
  if (schoolId.value) await onSchool()
})

const onSchool = async () => {
  classId.value = ''; students.value = []; classes.value = []
  if (!schoolId.value) return
  try { classes.value = (await get(`/schools/${schoolId.value}/classes`)) as any[] } catch { classes.value = [] }
}

const onClass = async () => {
  students.value = []
  Object.keys(att).forEach(k => delete att[k])
  if (!classId.value) return
  loading.value = true
  try {
    const r: any = await get(`/classes/${classId.value}/students`)
    students.value = r?.students ?? r ?? []
    for (const s of students.value) att[s.studentId] = 'PRESENT'
  } catch { students.value = [] } finally { loading.value = false }
}

const markAll = (status: string) => {
  for (const s of students.value) att[s.studentId] = status
}

const submit = async () => {
  errMsg.value = ''
  if (!classId.value || !students.value.length) return
  saving.value = true
  try {
    const records = students.value.map(s => ({ studentId: s.studentId, status: att[s.studentId] || 'PRESENT' }))
    await post('/attendance', { classId: classId.value, date: date.value, records })
    showToast('Ирц хадгалагдлаа')
  } catch (e: any) {
    errMsg.value = e?.data?.message ?? 'Хадгалах үед алдаа гарлаа'
  } finally { saving.value = false }
}
</script>

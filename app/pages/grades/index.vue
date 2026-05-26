<template>
  <div class="p-6 lg:p-8 max-w-6xl">
    <h1 class="page-title mb-6">Дүн оруулах</h1>

    <div class="card p-5 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-if="auth.isSuperAdmin">
          <label class="label">Сургууль</label>
          <select v-model="schoolId" @change="onSchool" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Анги</label>
          <select v-model="classId" @change="onClass" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Хичээл</label>
          <select v-model="subjectId" @change="loadAssignments" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="s in subjects" :key="s.subjectId" :value="s.subjectId">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Даалгавар</label>
          <select v-model="assignmentId" @change="onAssignment" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="a in assignments" :key="a.assignmentId" :value="a.assignmentId">
              {{ a.title }} ({{ a.maxScore ?? 100 }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="students.length && assignmentId" class="card overflow-hidden">
      <table class="w-full">
        <thead><tr class="border-b border-stone-100">
          <th class="table-header w-12">#</th>
          <th class="table-header">Сурагч</th>
          <th class="table-header w-28">Оноо</th>
          <th class="table-header">Тайлбар</th>
          <th class="table-header w-24"></th>
        </tr></thead>
        <tbody>
          <tr v-for="(s, i) in students" :key="s.studentId" class="border-b border-stone-50 last:border-0">
            <td class="table-cell text-stone-400 font-mono text-xs">{{ i + 1 }}</td>
            <td class="table-cell font-medium text-stone-800">{{ s.lastName }} {{ s.firstName }}</td>
            <td class="table-cell">
              <input v-model.number="scores[s.studentId]" type="number" min="0" :max="currentMaxScore"
                class="input-field !py-1.5 !px-3 text-center w-20" />
            </td>
            <td class="table-cell"><input v-model="comments[s.studentId]" class="input-field !py-1.5 !px-3" placeholder="..." /></td>
            <td class="table-cell">
              <button @click="save(s.studentId)"
                :disabled="scores[s.studentId] === undefined || savingId === s.studentId"
                class="text-xs text-emerald-600 hover:text-emerald-700 font-medium disabled:text-stone-300">
                {{ savingId === s.studentId ? '...' : 'Хадгалах' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="classId && !assignmentId" class="empty-state">
      <p class="text-sm text-stone-400">Даалгавар сонгоно уу</p>
    </div>
    <div v-else-if="assignmentId && !students.length" class="empty-state">
      <p class="text-sm text-stone-400">Сурагч байхгүй</p>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post } = useApi()

const schools = ref<any[]>([])
const classes = ref<any[]>([])
const subjects = ref<any[]>([])
const assignments = ref<any[]>([])
const students = ref<any[]>([])

const schoolId = ref(auth.schoolId ?? '')
const classId = ref('')
const subjectId = ref('')
const assignmentId = ref('')

const scores = reactive<Record<string, number | undefined>>({})
const comments = reactive<Record<string, string>>({})
const toast = ref('')
const savingId = ref('')

const currentAssignment = computed(() => assignments.value.find(a => a.assignmentId === assignmentId.value))
const currentMaxScore = computed(() => currentAssignment.value?.maxScore ?? 100)

onMounted(async () => {
  if (auth.isSuperAdmin) {
    try { schools.value = await get('/schools') as any[] } catch {}
  }
  if (schoolId.value) await loadSchoolData()
})

const loadSchoolData = async () => {
  try {
    classes.value = (await get(`/schools/${schoolId.value}/classes`) as any[]) ?? []
    // ✅ FIX: зөв subjects endpoint
    subjects.value = (await get(`/schools/${schoolId.value}/subjects`) as any[]) ?? []
  } catch {}
}

const onSchool = async () => {
  classId.value = ''; subjectId.value = ''; assignmentId.value = ''
  students.value = []; assignments.value = []
  if (schoolId.value) await loadSchoolData()
}

const onClass = async () => {
  assignmentId.value = ''
  students.value = []
  assignments.value = []
  if (!classId.value) return
  try {
    const r: any = await get(`/classes/${classId.value}/students`)
    students.value = r?.students ?? r ?? []
  } catch { students.value = [] }
  await loadAssignments()
}

const loadAssignments = async () => {
  assignmentId.value = ''
  assignments.value = []
  if (!classId.value || !subjectId.value || !schoolId.value) return
  try {
    assignments.value = (await get(
      `/schools/${schoolId.value}/assignments?classId=${classId.value}&subjectId=${subjectId.value}`
    ) as any[]) ?? []
  } catch { assignments.value = [] }
}

const onAssignment = async () => {
  // Аль хэдийн оруулсан дүнг load хийх
  if (!assignmentId.value) return
  try {
    const existingGrades: any = await get(
      `/schools/${schoolId.value}/assignments/${assignmentId.value}/grades`
    )
    if (Array.isArray(existingGrades)) {
      for (const g of existingGrades) {
        scores[g.studentId] = g.score
        comments[g.studentId] = g.comment ?? ''
      }
    }
  } catch {}
}

const save = async (sid: string) => {
  if (scores[sid] === undefined || !assignmentId.value) return
  if ((scores[sid] as number) > currentMaxScore.value) {
    toast.value = `Оноо ${currentMaxScore.value}-аас их байж болохгүй`
    setTimeout(() => toast.value = '', 2000)
    return
  }
  savingId.value = sid
  try {
    // ✅ FIX: backend нь зөвхөн assignment-аар дүн авдаг
    await post(`/schools/${schoolId.value}/assignments/${assignmentId.value}/grades`, {
      studentId: sid,
      score: scores[sid],
      comment: comments[sid] || null,
      subjectId: subjectId.value,
      maxScore: currentMaxScore.value,
    })
    toast.value = 'Дүн хадгалагдлаа'
    setTimeout(() => toast.value = '', 2000)
  } catch (e: any) {
    toast.value = e?.data?.message ?? 'Алдаа гарлаа'
    setTimeout(() => toast.value = '', 2500)
  } finally { savingId.value = '' }
}
</script>

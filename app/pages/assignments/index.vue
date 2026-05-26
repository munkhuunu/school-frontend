<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Даалгавар &amp; Дүн</h2>
        <p class="text-sm text-stone-400 mt-1">Хичээл тус бүрээр даалгавар, шалгалт, дүн</p>
      </div>
      <button v-if="auth.canTeach && schoolId" @click="showForm = !showForm" class="btn-primary">
        Шинэ даалгавар
      </button>
    </div>

    <!-- School / Class / Subject filters -->
    <div class="card p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="label">Сургууль</label>
        <select v-model="schoolId" @change="onSchool" class="select-field">
          <option value="">Сонгох...</option>
          <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="label">Анги</label>
        <select v-model="filter.classId" @change="loadAssignments" :disabled="!schoolId" class="select-field">
          <option value="">Сонгох...</option>
          <option v-for="c in classes" :key="c.classId" :value="c.classId">
            {{ c.name }}<span v-if="c.grade"> ({{ c.grade }}-р)</span>
          </option>
        </select>
      </div>
      <div>
        <label class="label">Хичээл</label>
        <select v-model="filter.subjectId" @change="loadAssignments" :disabled="!schoolId" class="select-field">
          <option value="">Сонгох...</option>
          <option v-for="s in subjects" :key="s.subjectId" :value="s.subjectId">{{ s.name }}</option>
        </select>
      </div>
    </div>

    <!-- Create form -->
    <div v-if="showForm" class="card p-5 mb-6">
      <h3 class="text-sm font-semibold text-stone-700 mb-4">Даалгавар үүсгэх</h3>
      <form @submit.prevent="createAssignment" class="grid grid-cols-2 gap-3">
        <div class="col-span-2">
          <label class="label">Гарчиг</label>
          <input v-model="form.title" class="input-field" required placeholder="1-р бүлгийн даалгавар" />
        </div>
        <div>
          <label class="label">Төрөл</label>
          <select v-model="form.type" class="select-field">
            <option value="HOMEWORK">Гэрийн даалгавар</option>
            <option value="EXAM">Шалгалт</option>
            <option value="QUIZ">Квиз</option>
            <option value="PROJECT">Төсөл</option>
          </select>
        </div>
        <div>
          <label class="label">Дээд оноо</label>
          <input v-model.number="form.maxScore" type="number" min="1" class="input-field" placeholder="100" />
        </div>
        <div>
          <label class="label">Анги</label>
          <select v-model="form.classId" class="select-field" required>
            <option value="">Сонгох...</option>
            <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Хичээл</label>
          <select v-model="form.subjectId" class="select-field" required>
            <option value="">Сонгох...</option>
            <option v-for="s in subjects" :key="s.subjectId" :value="s.subjectId">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Дуусгах огноо</label>
          <input v-model="form.dueDate" type="date" class="input-field" />
        </div>
        <div class="col-span-2">
          <label class="label">Тайлбар (заавал биш)</label>
          <textarea v-model="form.description" class="input-field" rows="2" />
        </div>
        <p v-if="formError" class="col-span-2 text-sm text-red-600">{{ formError }}</p>
        <div class="col-span-2 flex justify-end gap-2">
          <button type="button" @click="showForm = false" class="btn-secondary">Цуцлах</button>
          <button type="submit" :disabled="creating" class="btn-primary">
            {{ creating ? '...' : 'Үүсгэх' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Assignment list -->
    <div class="space-y-3">
      <div v-if="!schoolId" class="card p-8 text-center text-sm text-stone-400">Сургууль сонгоно уу</div>
      <div v-else-if="!filter.classId || !filter.subjectId" class="card p-8 text-center text-sm text-stone-400">
        Анги болон хичээл сонгоход даалгавар харагдана
      </div>
      <div v-else-if="loading" class="card p-8 text-center text-sm text-stone-400">Уншиж байна...</div>
      <div v-else-if="!assignments.length" class="card p-8 text-center text-sm text-stone-400">Даалгавар байхгүй</div>
      <div v-for="a in assignments" :key="a.assignmentId" class="card p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-0.5 rounded-lg text-xs font-medium" :class="typeBadge(a.type)">
              {{ typeLabel(a.type) }}
            </span>
            <div>
              <p class="font-medium text-stone-800">{{ a.title }}</p>
              <p class="text-xs text-stone-400 mt-0.5">
                Дээд: {{ a.maxScore ?? 100 }} оноо
                <span v-if="a.dueDate"> &bull; {{ a.dueDate }}</span>
              </p>
              <p v-if="a.description" class="text-xs text-stone-500 mt-1">{{ a.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="auth.canTeach" @click="openGradeModal(a)" class="text-xs text-emerald-600 font-medium hover:underline">
              Дүн оруулах
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grade modal -->
    <div v-if="gradeModal" class="modal-overlay" @click.self="gradeModal = null">
      <div class="modal-card">
        <h3 class="font-semibold text-stone-800 mb-4">Дүн оруулах — {{ gradeModal.title }}</h3>
        <form @submit.prevent="submitGrade" class="space-y-3">
          <div>
            <label class="label">Сурагч</label>
            <select v-model="gradeForm.studentId" class="select-field" required>
              <option value="">Сонгох...</option>
              <option v-for="s in students" :key="s.studentId" :value="s.studentId">
                {{ s.lastName }} {{ s.firstName }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">Дүн ({{ gradeModal.maxScore ?? 100 }} дээдтэй)</label>
            <input v-model.number="gradeForm.score" type="number" :max="gradeModal.maxScore ?? 100" min="0" class="input-field" required />
          </div>
          <div>
            <label class="label">Сэтгэгдэл (заавал биш)</label>
            <input v-model="gradeForm.comment" class="input-field" />
          </div>
          <p v-if="gradeError" class="text-sm text-red-600">{{ gradeError }}</p>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="gradeModal = null" class="btn-secondary">Цуцлах</button>
            <button type="submit" :disabled="grading" class="btn-primary">
              {{ grading ? '...' : 'Хадгалах' }}
            </button>
          </div>
        </form>
      </div>
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
const students = ref<any[]>([])
const assignments = ref<any[]>([])

const schoolId = ref<string>(auth.user?.schoolId ?? '')
const filter = reactive({ classId: '', subjectId: '' })

const loading = ref(false)
const showForm = ref(false)
const creating = ref(false)
const formError = ref('')

const gradeModal = ref<any>(null)
const grading = ref(false)
const gradeError = ref('')
const gradeForm = reactive({ studentId: '', score: 0, comment: '' })

const toast = ref('')

const form = reactive({
  title: '', type: 'HOMEWORK', classId: '', subjectId: '',
  dueDate: '', maxScore: 100, description: '',
})

const typeBadge = (t: string) => ({
  HOMEWORK: 'bg-sky-50 text-sky-700', EXAM: 'bg-red-50 text-red-700',
  QUIZ: 'bg-amber-50 text-amber-700', PROJECT: 'bg-violet-50 text-violet-700',
}[t] ?? 'bg-stone-100 text-stone-600')

const typeLabel = (t: string) => ({
  HOMEWORK: 'Гэрийн даалгавар', EXAM: 'Шалгалт', QUIZ: 'Квиз', PROJECT: 'Төсөл',
}[t] ?? t)

const showToast = (msg: string) => { toast.value = msg; setTimeout(() => (toast.value = ''), 2000) }

const onSchool = async () => {
  filter.classId = ''; filter.subjectId = ''
  classes.value = []; subjects.value = []; assignments.value = []
  if (!schoolId.value) return
  try {
    const [c, s] = await Promise.all([
      get(`/schools/${schoolId.value}/classes`) as Promise<any[]>,
      get(`/schools/${schoolId.value}/subjects`) as Promise<any[]>,
    ])
    classes.value = c ?? []; subjects.value = s ?? []
  } catch { classes.value = []; subjects.value = [] }
}

const loadAssignments = async () => {
  if (!filter.classId || !filter.subjectId) { assignments.value = []; return }
  loading.value = true
  try {
    assignments.value = ((await get(
      `/schools/${schoolId.value}/assignments?classId=${filter.classId}&subjectId=${filter.subjectId}`
    )) as any[]) ?? []
  } catch { assignments.value = [] } finally { loading.value = false }
}

const createAssignment = async () => {
  formError.value = ''
  if (!schoolId.value) { formError.value = 'Сургууль сонгоно уу'; return }
  creating.value = true
  try {
    const res: any = await post(`/schools/${schoolId.value}/assignments`, { ...form })
    assignments.value.unshift(res)
    showForm.value = false
    Object.assign(form, { title: '', type: 'HOMEWORK', dueDate: '', description: '', maxScore: 100 })
    showToast('Даалгавар үүслээ')
  } catch (e: any) { formError.value = e?.data?.message ?? 'Алдаа гарлаа' } finally { creating.value = false }
}

const openGradeModal = async (a: any) => {
  gradeModal.value = a
  gradeForm.studentId = ''; gradeForm.score = 0; gradeForm.comment = ''
  gradeError.value = ''
  try {
    const r: any = await get(`/classes/${a.classId}/students`)
    students.value = r?.students ?? r ?? []
  } catch { students.value = [] }
}

const submitGrade = async () => {
  gradeError.value = ''
  if (!gradeForm.studentId) { gradeError.value = 'Сурагч сонгоно уу'; return }
  grading.value = true
  try {
    await post(`/schools/${schoolId.value}/assignments/${gradeModal.value.assignmentId}/grades`, {
      studentId: gradeForm.studentId, score: gradeForm.score, comment: gradeForm.comment || null,
    })
    gradeModal.value = null
    showToast('Дүн хадгалагдлаа')
  } catch (e: any) { gradeError.value = e?.data?.message ?? 'Алдаа гарлаа' } finally { grading.value = false }
}

onMounted(async () => {
  try { schools.value = (await get('/schools')) as any[] } catch { schools.value = [] }
  if (schoolId.value) await onSchool()
})

watch(() => [filter.classId, filter.subjectId] as const, ([c, s]) => {
  if (c) form.classId = c
  if (s) form.subjectId = s
})
</script>

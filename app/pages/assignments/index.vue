<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Даалгавар &amp; Дүн</h2>
        <p class="text-sm text-stone-400 mt-1">Хичээл бүртгүээр даалгавар, шалгалт, дүн</p>
      </div>
      <button v-if="auth.canTeach" @click="showForm = !showForm" class="btn-primary">Шинэ даалгавар</button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6 flex flex-wrap gap-3">
      <div class="flex-1 min-w-[160px]">
        <label class="label">Анги ID</label>
        <input v-model="filter.classId" class="input-field" placeholder="classId..." @input="load" />
      </div>
      <div class="flex-1 min-w-[160px]">
        <label class="label">Хичээл ID</label>
        <input v-model="filter.subjectId" class="input-field" placeholder="subjectId..." @input="load" />
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
            <option value="PROJECT">Проект</option>
          </select>
        </div>
        <div>
          <label class="label">Дээд оноо</label>
          <input v-model="form.maxScore" type="number" class="input-field" placeholder="100" />
        </div>
        <div>
          <label class="label">Анги ID</label>
          <input v-model="form.classId" class="input-field" required />
        </div>
        <div>
          <label class="label">Хичээл ID</label>
          <input v-model="form.subjectId" class="input-field" required />
        </div>
        <div>
          <label class="label">Дуусгах огноо</label>
          <input v-model="form.dueDate" type="date" class="input-field" />
        </div>
        <div class="col-span-2">
          <label class="label">Тайлбар (заалгавар)</label>
          <textarea v-model="form.description" class="input-field" rows="2" />
        </div>
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
      <div v-if="!assignments.length && !loading" class="card p-8 text-center text-sm text-stone-400">
        Анги болон хичээл сонгоход даалгавар харах
      </div>
      <div v-for="a in assignments" :key="a.assignmentId" class="card p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2 py-0.5 rounded-lg text-xs font-medium" :class="typeBadge(a.type)">{{ typeLabel(a.type) }}</span>
            <div>
              <p class="font-medium text-stone-800">{{ a.title }}</p>
              <p class="text-xs text-stone-400 mt-0.5">
                Дээд: {{ a.maxScore ?? 100 }} оноо
                <span v-if="a.dueDate"> &bull; {{ a.dueDate }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="auth.canTeach" @click="openGradeModal(a)" class="text-xs text-emerald-600 font-medium hover:underline">Дүн оруулах</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grade modal -->
    <div v-if="gradeModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="font-semibold text-stone-800 mb-4">Дүн оруулах — {{ gradeModal.title }}</h3>
        <form @submit.prevent="submitGrade" class="space-y-3">
          <div>
            <label class="label">Сурагчийн ID</label>
            <input v-model="gradeForm.studentId" class="input-field" required />
          </div>
          <div>
            <label class="label">Дүн ({{ gradeModal.maxScore ?? 100 }}-аас дээдтэй)</label>
            <input v-model.number="gradeForm.score" type="number" :max="gradeModal.maxScore ?? 100" min="0" class="input-field" required />
          </div>
          <div>
            <label class="label">Сэтгэлт (заалгавар)</label>
            <input v-model="gradeForm.comment" class="input-field" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="gradeModal = null" class="btn-secondary">Цуцлах</button>
            <button type="submit" :disabled="grading" class="btn-primary">
              {{ grading ? '...' : 'Хадгалах' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { sget, spost } = useApi()

const assignments = ref<any[]>([])
const loading = ref(false)
const showForm = ref(false)
const creating = ref(false)
const gradeModal = ref<any>(null)
const grading = ref(false)
const filter = reactive({ classId: '', subjectId: '' })
const form = reactive({ title: '', type: 'HOMEWORK', classId: '', subjectId: '', dueDate: '', maxScore: 100, description: '' })
const gradeForm = reactive({ studentId: '', score: 0, comment: '' })

const typeBadge = (t: string) => ({ HOMEWORK: 'bg-sky-50 text-sky-700', EXAM: 'bg-red-50 text-red-700', QUIZ: 'bg-amber-50 text-amber-700', PROJECT: 'bg-violet-50 text-violet-700' }[t] ?? 'bg-stone-100 text-stone-600')
const typeLabel = (t: string) => ({ HOMEWORK: 'Гэрийн даалгавар', EXAM: 'Шалгалт', QUIZ: 'Квиз', PROJECT: 'Проект' }[t] ?? t)

const load = async () => {
  if (!filter.classId || !filter.subjectId) { assignments.value = []; return }
  loading.value = true
  try {
    assignments.value = (await sget(`/assignments?classId=${filter.classId}&subjectId=${filter.subjectId}`) as any[]) ?? []
  } finally { loading.value = false }
}

const createAssignment = async () => {
  creating.value = true
  try {
    const res: any = await spost('/assignments', { ...form })
    assignments.value.unshift(res)
    showForm.value = false
    Object.assign(form, { title: '', type: 'HOMEWORK', dueDate: '', description: '' })
  } finally { creating.value = false }
}

const openGradeModal = (a: any) => {
  gradeModal.value = a
  gradeForm.studentId = ''; gradeForm.score = 0; gradeForm.comment = ''
}

const submitGrade = async () => {
  grading.value = true
  try {
    await spost(`/assignments/${gradeModal.value.assignmentId}/grades`, {
      studentId: gradeForm.studentId, score: gradeForm.score, comment: gradeForm.comment,
      maxScore: gradeModal.value.maxScore, subjectId: gradeModal.value.subjectId,
    })
    gradeModal.value = null
  } finally { grading.value = false }
}
</script>

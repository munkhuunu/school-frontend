<template>
  <div class="p-6 lg:p-8 max-w-6xl">
    <h1 class="page-title mb-2">Дүн харах</h1>
    <p class="text-sm text-stone-400 mb-6">Сурагчийн бүх дүнг энд харна. Дүн оруулахын тулд <NuxtLink to="/assignments" class="text-emerald-600 hover:underline">Даалгавар</NuxtLink> хуудас ашиглана уу.</p>

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
          <select v-model="classId" @change="onClass" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Сурагч</label>
          <select v-model="studentId" @change="loadGrades" class="select-field">
            <option value="">Сонгох...</option>
            <option v-for="s in students" :key="s.studentId" :value="s.studentId">{{ s.lastName }} {{ s.firstName }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="grades.length" class="card overflow-hidden">
      <table class="w-full">
        <thead><tr class="border-b border-stone-100">
          <th class="table-header">Даалгавар</th>
          <th class="table-header w-24 text-center">Оноо</th>
          <th class="table-header w-24 text-center">Дээд</th>
          <th class="table-header w-20 text-center">%</th>
          <th class="table-header">Тайлбар</th>
          <th class="table-header w-28">Огноо</th>
        </tr></thead>
        <tbody>
          <tr v-for="g in grades" :key="g.gradeId ?? g.SK" class="border-b border-stone-50 last:border-0 hover:bg-stone-50/50">
            <td class="table-cell font-medium text-stone-800">{{ g.assignmentId?.slice(0,8) }}...</td>
            <td class="table-cell text-center font-semibold text-emerald-700">{{ g.score }}</td>
            <td class="table-cell text-center text-stone-400">{{ g.maxScore ?? 100 }}</td>
            <td class="table-cell text-center">
              <span :class="pctClass(g.score, g.maxScore)" class="px-2 py-0.5 rounded text-xs font-medium">
                {{ Math.round(g.score / (g.maxScore ?? 100) * 100) }}%
              </span>
            </td>
            <td class="table-cell text-stone-500 text-xs">{{ g.comment || '—' }}</td>
            <td class="table-cell text-stone-400 text-xs">{{ g.gradedAt?.slice(0,10) ?? g.createdAt?.slice(0,10) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="px-5 py-3 bg-stone-50/50 border-t border-stone-100 text-xs text-stone-500">
        Нийт {{ grades.length }} дүн · Дундаж: {{ avg }}%
      </div>
    </div>

    <div v-else-if="studentId && !loading" class="empty-state">
      <p class="text-sm text-stone-400">Дүн байхгүй байна</p>
    </div>
    <div v-else-if="loading" class="empty-state">
      <p class="text-sm text-stone-400">Уншиж байна...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { get } = useApi()
const schools = ref<any[]>([])
const classes = ref<any[]>([])
const students = ref<any[]>([])
const grades = ref<any[]>([])
const schoolId = ref('')
const classId = ref('')
const studentId = ref('')
const loading = ref(false)

const avg = computed(() => {
  if (!grades.value.length) return 0
  const sum = grades.value.reduce((a, g) => a + Math.round(g.score / (g.maxScore ?? 100) * 100), 0)
  return Math.round(sum / grades.value.length)
})

const pctClass = (score: number, max: number = 100) => {
  const p = score / max * 100
  if (p >= 90) return 'bg-emerald-50 text-emerald-700'
  if (p >= 70) return 'bg-sky-50 text-sky-700'
  if (p >= 50) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

onMounted(async () => { try { schools.value = await get('/schools') as any[] } catch {} })

const onSchool = async () => {
  classId.value = ''; studentId.value = ''; students.value = []; grades.value = []
  if (!schoolId.value) return
  classes.value = await get(`/schools/${schoolId.value}/classes`) as any[]
}

const onClass = async () => {
  studentId.value = ''; grades.value = []
  if (!classId.value) return
  const r: any = await get(`/classes/${classId.value}/students`)
  students.value = r?.students ?? r ?? []
}

const loadGrades = async () => {
  grades.value = []
  if (!studentId.value || !schoolId.value) return
  loading.value = true
  try {
    // ✅ зөв endpoint: /schools/{schoolId}/students/{studentId}/grades
    grades.value = await get(`/schools/${schoolId.value}/students/${studentId.value}/grades`) as any[]
  } catch { grades.value = [] } finally { loading.value = false }
}
</script>
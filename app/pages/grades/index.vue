<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Дүн оруулах</h1>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Сургууль</label>
            <select v-model="selectedSchoolId" @change="onSchoolChange"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Сонгох...</option>
              <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Анги</label>
            <select v-model="selectedClassId" @change="onClassChange"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Сонгох...</option>
              <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Хичээл</label>
            <select v-model="selectedSubjectId"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Сонгох...</option>
              <option v-for="sub in subjects" :key="sub.subjectId" :value="sub.subjectId">{{ sub.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grade Table -->
      <div v-if="students.length && selectedSubjectId" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">#</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Сурагч</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Оноо (0-100)</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Тайлбар</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in students" :key="s.studentId" class="border-t">
              <td class="px-5 py-3 text-sm text-gray-400">{{ i + 1 }}</td>
              <td class="px-5 py-3 font-medium">{{ s.lastName }} {{ s.firstName }}</td>
              <td class="px-5 py-3">
                <input v-model.number="gradeInputs[s.studentId]" type="number" min="0" max="100"
                  class="w-20 border border-gray-200 rounded px-3 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </td>
              <td class="px-5 py-3">
                <input v-model="commentInputs[s.studentId]" type="text"
                  class="w-full border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="..." />
              </td>
              <td class="px-5 py-3">
                <button @click="saveGrade(s.studentId)"
                  :disabled="gradeInputs[s.studentId] === undefined"
                  class="text-sm text-blue-600 hover:underline disabled:text-gray-300">Хадгалах</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="selectedClassId && selectedSubjectId" class="text-center py-12 text-gray-400">Сурагч байхгүй</div>
      <div v-else-if="selectedClassId" class="text-center py-12 text-gray-400">Хичээл сонгоно уу</div>

      <!-- Toast -->
      <div v-if="toast" class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        Дүн амжилттай хадгалагдлаа!
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { get, post } = useApi()
const schools = ref<any[]>([])
const classes = ref<any[]>([])
const subjects = ref<any[]>([])
const students = ref<any[]>([])
const selectedSchoolId = ref('')
const selectedClassId = ref('')
const selectedSubjectId = ref('')
const gradeInputs = reactive<Record<string, number | undefined>>({})
const commentInputs = reactive<Record<string, string>>({})
const toast = ref(false)

onMounted(async () => {
  try { schools.value = await get('/schools') as any[] } catch {}
})

const onSchoolChange = async () => {
  selectedClassId.value = ''; selectedSubjectId.value = ''
  students.value = []; classes.value = []; subjects.value = []
  if (!selectedSchoolId.value) return
  try {
    classes.value = await get(`/schools/${selectedSchoolId.value}/classes`) as any[]
    subjects.value = await get(`/subjects?schoolId=${selectedSchoolId.value}`) as any[]
  } catch {}
}

const onClassChange = async () => {
  students.value = []
  if (!selectedClassId.value) return
  try {
    const res: any = await get(`/classes/${selectedClassId.value}/students`)
    students.value = res?.students ?? res ?? []
  } catch {}
}

const saveGrade = async (studentId: string) => {
  const score = gradeInputs[studentId]
  if (score === undefined || !selectedSubjectId.value) return
  try {
    await post('/grades', {
      studentId, subjectId: selectedSubjectId.value,
      classId: selectedClassId.value, score,
      comment: commentInputs[studentId] || null,
    })
    toast.value = true
    setTimeout(() => toast.value = false, 2000)
  } catch {}
}
</script>

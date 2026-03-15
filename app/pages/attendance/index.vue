<template>
  <NuxtLayout>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Ирц бүртгэх</h1>

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
            <label class="block text-sm font-medium mb-1">Огноо</label>
            <input v-model="selectedDate" type="date"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Attendance Table -->
      <div v-if="students.length" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">#</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Сурагч</th>
              <th class="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">Ирсэн</th>
              <th class="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">Тасалсан</th>
              <th class="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">Хоцорсон</th>
              <th class="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">Чөлөөтэй</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in students" :key="s.studentId" class="border-t">
              <td class="px-5 py-3 text-sm text-gray-400">{{ i + 1 }}</td>
              <td class="px-5 py-3 font-medium">{{ s.lastName }} {{ s.firstName }}</td>
              <td v-for="status in statuses" :key="status" class="px-3 py-3 text-center">
                <input type="radio" :name="s.studentId" :value="status"
                  v-model="attendanceMap[s.studentId]"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="p-5 border-t flex justify-between items-center">
          <p class="text-sm text-gray-400">Нийт {{ students.length }} сурагч</p>
          <button @click="submit" :disabled="saving"
            class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition">
            {{ saving ? 'Хадгалж байна...' : 'Ирц хадгалах' }}
          </button>
        </div>
      </div>

      <div v-else-if="selectedClassId" class="text-center py-12 text-gray-400">Сурагч байхгүй</div>

      <!-- Toast -->
      <div v-if="toast" class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        Ирц амжилттай хадгалагдлаа!
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { get, post } = useApi()
const schools = ref<any[]>([])
const classes = ref<any[]>([])
const students = ref<any[]>([])
const selectedSchoolId = ref('')
const selectedClassId = ref('')
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const attendanceMap = reactive<Record<string, string>>({})
const saving = ref(false)
const toast = ref(false)
const statuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']

onMounted(async () => {
  try { schools.value = await get('/schools') as any[] } catch {}
})

const onSchoolChange = async () => {
  selectedClassId.value = ''; students.value = []; classes.value = []
  if (!selectedSchoolId.value) return
  try { classes.value = await get(`/schools/${selectedSchoolId.value}/classes`) as any[] } catch {}
}

const onClassChange = async () => {
  students.value = []
  if (!selectedClassId.value) return
  try {
    const res: any = await get(`/classes/${selectedClassId.value}/students`)
    students.value = res?.students ?? res ?? []
    for (const s of students.value) attendanceMap[s.studentId] = 'PRESENT'
  } catch {}
}

const submit = async () => {
  saving.value = true
  try {
    const records = students.value.map(s => ({
      studentId: s.studentId,
      status: attendanceMap[s.studentId] || 'PRESENT',
    }))
    await post('/attendance', { classId: selectedClassId.value, date: selectedDate.value, records })
    toast.value = true
    setTimeout(() => toast.value = false, 2000)
  } catch {}
  finally { saving.value = false }
}
</script>

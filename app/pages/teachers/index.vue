<template>
  
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Багш нар</h1>
        <button v-if="auth.canManage && selectedSchoolId" @click="showModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          + Багш нэмэх
        </button>
      </div>

      <!-- School selector -->
      <div class="mb-6">
        <select v-model="selectedSchoolId" @change="loadTeachers"
          class="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Сургууль сонгох...</option>
          <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
        </select>
      </div>

      <div v-if="!selectedSchoolId" class="text-center py-12 text-gray-400">
        <p class="text-4xl mb-2">👨‍🏫</p>
        <p>Сургууль сонгоно уу</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="t in teachers" :key="t.teacherId"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ t.lastName }} {{ t.firstName }}</p>
            <p class="text-sm text-gray-400">{{ t.email || 'И-мэйл байхгүй' }}</p>
            <p v-if="t.classIds?.length" class="text-xs text-blue-500 mt-1">{{ t.classIds.length }} ангид хуваарилагдсан</p>
          </div>
          <button v-if="auth.canManage" @click="openAssign(t)" class="text-sm text-blue-600 hover:underline">Анги хуваарилах</button>
        </div>
        <div v-if="!teachers.length" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-2">👨‍🏫</p>
          <p>Багш байхгүй байна</p>
        </div>
      </div>

      <!-- Add Teacher Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-bold mb-4">Багш нэмэх</h2>
          <div class="space-y-3">
            <input v-model="form.lastName" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Овог" />
            <input v-model="form.firstName" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Нэр" />
            <input v-model="form.email" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="И-мэйл" />
            <input v-model="form.phone" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Утас" />
          </div>
          <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
          <div class="flex gap-2 justify-end mt-4">
            <button @click="showModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
            <button @click="addTeacher" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Хадгалах</button>
          </div>
        </div>
      </div>

      <!-- Assign Modal -->
      <div v-if="showAssign" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-bold mb-4">Анги хуваарилах</h2>
          <p class="text-sm text-gray-500 mb-3">{{ assignTarget?.lastName }} {{ assignTarget?.firstName }}</p>
          <select v-model="assignClassId" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Анги сонгох...</option>
            <option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }} ({{ c.grade }}-р анги)</option>
          </select>
          <div class="flex gap-2 justify-end">
            <button @click="showAssign = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
            <button @click="assignTeacher" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Хуваарилах</button>
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
const selectedSchoolId = ref('')
const showModal = ref(false)
const showAssign = ref(false)
const assignTarget = ref<any>(null)
const assignClassId = ref('')
const formError = ref('')
const form = reactive({ lastName: '', firstName: '', email: '', phone: '' })

onMounted(async () => {
  try { schools.value = await get('/schools') as any[] } catch {}
})

const loadTeachers = async () => {
  if (!selectedSchoolId.value) return
  try {
    teachers.value = await get(`/teachers?schoolId=${selectedSchoolId.value}`) as any[]
    classes.value = await get(`/schools/${selectedSchoolId.value}/classes`) as any[]
  } catch {}
}

const addTeacher = async () => {
  if (!form.lastName || !form.firstName) { formError.value = 'Овог нэр оруулна уу'; return }
  try {
    await post('/teachers', { ...form, schoolId: selectedSchoolId.value })
    showModal.value = false; formError.value = ''
    Object.assign(form, { lastName: '', firstName: '', email: '', phone: '' })
    await loadTeachers()
  } catch (e: any) { formError.value = e?.data?.message ?? 'Алдаа' }
}

const openAssign = (t: any) => { assignTarget.value = t; assignClassId.value = ''; showAssign.value = true }

const assignTeacher = async () => {
  if (!assignClassId.value) return
  try {
    await post('/teachers/assign', { teacherId: assignTarget.value.teacherId, classId: assignClassId.value })
    showAssign.value = false; await loadTeachers()
  } catch {}
}
</script>

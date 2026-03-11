<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="text-gray-400 hover:text-gray-600 text-sm">← Dashboard</NuxtLink>
        <span class="text-gray-300">|</span>
        <NuxtLink :to="`/schools/${route.params.id}/classes`" class="text-gray-400 hover:text-gray-600 text-sm">
          ← Ангиуд
        </NuxtLink>
        <h1 class="text-xl font-bold">Сурагчид</h1>
      </div>
      <button
        v-if="auth.isDirector || auth.isManager"
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        + Сурагч нэмэх
      </button>
    </nav>

    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-400">
        Уншиж байна...
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">#</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">Овог нэр</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">Утас</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-gray-500">И-мэйл</th>
              <th class="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, i) in students"
              :key="student.studentId"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm text-gray-400">{{ i + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ student.lastName }} {{ student.firstName }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ student.phone || '—' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ student.email || '—' }}</td>
              <td class="px-4 py-3">
                <button
                  v-if="auth.isDirector || auth.isManager"
                  @click="deleteStudent(student.studentId)"
                  class="text-red-500 text-sm hover:underline"
                >
                  Устгах
                </button>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="students.length === 0">
              <td colspan="5" class="px-4 py-12 text-center text-gray-400">
                <p class="text-4xl mb-2">👤</p>
                <p>Сурагч байхгүй байна</p>
                <button
                  v-if="auth.isDirector || auth.isManager"
                  @click="showModal = true"
                  class="mt-3 text-blue-600 hover:underline text-sm"
                >
                  + Сурагч нэмэх
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Count -->
      <p v-if="students.length > 0" class="text-sm text-gray-400 mt-3">
        Нийт {{ students.length }} сурагч
      </p>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold mb-4">Сурагч нэмэх</h2>
        <div class="space-y-3">
          <input v-model="form.lastName" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Овог" />
          <input v-model="form.firstName" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Нэр" />
          <input v-model="form.phone" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Утас" />
          <input v-model="form.email" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="И-мэйл" />
        </div>
        <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
        <div class="flex gap-2 justify-end mt-4">
          <button @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-50">Болих</button>
          <button
            @click="addStudent"
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Хадгалж байна...' : 'Хадгалах' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { get, post, del } = useApi()
const route = useRoute()
const students = ref<any[]>([])
const showModal = ref(false)
const loading = ref(true)
const saving = ref(false)
const formError = ref('')
const form = reactive({ lastName: '', firstName: '', phone: '', email: '' })

const load = async () => {
  loading.value = true
  try {
    const res: any = await get(`/classes/${route.params.classId}/students`)
    students.value = res?.students ?? res ?? []
  } catch {
    students.value = []
  } finally {
    loading.value = false
  }
}

const addStudent = async () => {
  if (!form.lastName || !form.firstName) {
    formError.value = 'Овог нэр оруулна уу'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    await post('/students', {
      ...form,
      classId: route.params.classId,
      schoolId: route.params.id,
    })
    closeModal()
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally {
    saving.value = false
  }
}

const deleteStudent = async (studentId: string) => {
  if (!confirm('Энэ сурагчийг устгах уу?')) return
  try {
    await del(`/students/${studentId}`)
    await load()
  } catch {}
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
  Object.assign(form, { lastName: '', firstName: '', phone: '', email: '' })
}

onMounted(load)
</script>
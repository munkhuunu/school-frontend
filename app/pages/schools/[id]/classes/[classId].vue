<template>
  <NuxtLayout>
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <NuxtLink :to="`/schools/${route.params.id}/classes`" class="text-sm text-gray-400 hover:underline">← Ангиуд</NuxtLink>
          <h1 class="text-2xl font-bold mt-1">Сурагчид</h1>
        </div>
        <button v-if="auth.canManage" @click="showModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          + Сурагч нэмэх
        </button>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-400">Уншиж байна...</div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">#</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Овог нэр</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Утас</th>
              <th class="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">И-мэйл</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in students" :key="s.studentId" class="border-t hover:bg-gray-50 transition">
              <td class="px-5 py-3 text-sm text-gray-400">{{ i + 1 }}</td>
              <td class="px-5 py-3 font-medium">{{ s.lastName }} {{ s.firstName }}</td>
              <td class="px-5 py-3 text-sm text-gray-500">{{ s.phone || '—' }}</td>
              <td class="px-5 py-3 text-sm text-gray-500">{{ s.email || '—' }}</td>
              <td class="px-5 py-3 text-right">
                <button v-if="auth.isDirector" @click="deleteStudent(s.studentId)"
                  class="text-red-500 text-sm hover:underline">Устгах</button>
              </td>
            </tr>
            <tr v-if="!students.length">
              <td colspan="5" class="px-5 py-12 text-center text-gray-400">
                <p class="text-4xl mb-2">👤</p>
                <p>Сурагч байхгүй байна</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="students.length" class="text-sm text-gray-400 mt-3">Нийт {{ students.length }} сурагч</p>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-bold mb-4">Сурагч нэмэх</h2>
          <div class="space-y-3">
            <input v-model="form.lastName" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Овог" />
            <input v-model="form.firstName" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Нэр" />
            <input v-model="form.phone" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Утас" />
            <input v-model="form.email" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="И-мэйл" />
          </div>
          <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
          <div class="flex gap-2 justify-end mt-4">
            <button @click="closeModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
            <button @click="addStudent" :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              {{ saving ? 'Хадгалж байна...' : 'Хадгалах' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

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
  } catch { students.value = [] }
  finally { loading.value = false }
}

const addStudent = async () => {
  if (!form.lastName || !form.firstName) { formError.value = 'Овог нэр оруулна уу'; return }
  saving.value = true; formError.value = ''
  try {
    await post('/students', { ...form, classId: route.params.classId, schoolId: route.params.id })
    closeModal(); await load()
  } catch (e: any) { formError.value = e?.data?.message ?? 'Алдаа гарлаа' }
  finally { saving.value = false }
}

const deleteStudent = async (studentId: string) => {
  if (!confirm('Устгах уу?')) return
  try { await del(`/students/${studentId}`); await load() } catch {}
}

const closeModal = () => {
  showModal.value = false; formError.value = ''
  Object.assign(form, { lastName: '', firstName: '', phone: '', email: '' })
}

onMounted(load)
</script>

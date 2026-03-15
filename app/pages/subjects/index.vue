<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Хичээлүүд</h1>
      <button v-if="auth.canManage && selectedSchoolId" @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
        + Хичээл нэмэх
      </button>
    </div>

    <!-- School selector -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">Сургууль</label>
      <select v-model="selectedSchoolId" @change="loadSubjects"
        class="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]">
        <option value="">Сургууль сонгох...</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
    </div>

    <div v-if="!selectedSchoolId" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">📖</p>
      <p>Сургууль сонгоно уу</p>
    </div>

    <div v-else-if="loading" class="text-center py-16 text-gray-400">Уншиж байна...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="sub in subjects" :key="sub.subjectId"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="font-semibold text-gray-800">{{ sub.name }}</p>
        <p v-if="sub.description" class="text-sm text-gray-400 mt-1">{{ sub.description }}</p>
        <p class="text-xs text-gray-300 mt-2">{{ sub.createdAt?.slice(0, 10) }}</p>
      </div>
      <div v-if="!subjects.length" class="col-span-full text-center py-16 text-gray-400">
        <p class="text-4xl mb-3">📖</p>
        <p>Хичээл байхгүй байна</p>
        <button v-if="auth.canManage" @click="showModal = true"
          class="mt-3 text-blue-600 hover:underline text-sm">+ Хичээл нэмэх</button>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-lg font-bold mb-4">Хичээл нэмэх</h2>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Хичээлийн нэр</label>
            <input v-model="form.name"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Математик" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Тайлбар (заавал биш)</label>
            <input v-model="form.description"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Алгебр, геометр..." />
          </div>
        </div>
        <p v-if="formError" class="text-red-500 text-sm mt-2">{{ formError }}</p>
        <div class="flex gap-2 justify-end mt-4">
          <button @click="closeModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
          <button @click="addSubject" :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {{ saving ? 'Хадгалж байна...' : 'Хадгалах' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      Хичээл амжилттай нэмэгдлээ!
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { get, post } = useApi()
const schools = ref<any[]>([])
const subjects = ref<any[]>([])
const selectedSchoolId = ref('')
const showModal = ref(false)
const loading = ref(false)
const saving = ref(false)
const formError = ref('')
const toast = ref(false)
const form = reactive({ name: '', description: '' })

onMounted(async () => {
  try { schools.value = await get('/schools') as any[] } catch {}
})

const loadSubjects = async () => {
  if (!selectedSchoolId.value) { subjects.value = []; return }
  loading.value = true
  try {
    subjects.value = await get(`/subjects?schoolId=${selectedSchoolId.value}`) as any[]
  } catch { subjects.value = [] }
  finally { loading.value = false }
}

const addSubject = async () => {
  if (!form.name) { formError.value = 'Хичээлийн нэр оруулна уу'; return }
  saving.value = true; formError.value = ''
  try {
    await post('/subjects', {
      name: form.name,
      description: form.description || null,
      schoolId: selectedSchoolId.value,
    })
    closeModal()
    toast.value = true
    setTimeout(() => toast.value = false, 2000)
    await loadSubjects()
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { saving.value = false }
}

const closeModal = () => {
  showModal.value = false; formError.value = ''
  Object.assign(form, { name: '', description: '' })
}
</script>

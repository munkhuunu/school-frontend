<template>
  <NuxtLayout>
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Сургуулиуд</h1>
        <button v-if="auth.isDirector" @click="showModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          + Нэмэх
        </button>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-400">Уншиж байна...</div>

      <div v-else class="space-y-3">
        <div v-for="school in schools" :key="school.schoolId"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center hover:shadow-md transition">
          <div>
            <p class="font-semibold text-gray-800">{{ school.name }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ school.createdAt?.slice(0, 10) }}</p>
          </div>
          <NuxtLink :to="`/schools/${school.schoolId}/classes`"
            class="text-blue-600 hover:underline text-sm font-medium">Ангиуд →</NuxtLink>
        </div>
        <div v-if="!schools.length" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-2">🏫</p>
          <p>Сургууль байхгүй байна</p>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-bold mb-4">Сургууль нэмэх</h2>
          <input v-model="newName" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Сургуулийн нэр" @keyup.enter="addSchool" />
          <div class="flex gap-2 justify-end">
            <button @click="showModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
            <button @click="addSchool" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Хадгалах</button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const { get, post } = useApi()
const schools = ref<any[]>([])
const showModal = ref(false)
const newName = ref('')
const loading = ref(true)

const load = async () => {
  loading.value = true
  try { schools.value = await get('/schools') as any[] } catch {}
  finally { loading.value = false }
}

const addSchool = async () => {
  if (!newName.value) return
  await post('/schools', { name: newName.value })
  newName.value = ''; showModal.value = false
  await load()
}

onMounted(load)
</script>

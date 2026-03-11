<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Сургуулиуд</h1>
      <button
        v-if="auth.isDirector"
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Нэмэх
      </button>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div
        v-for="school in schools"
        :key="school.schoolId"
        class="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition"
      >
        <div>
          <p class="font-semibold">{{ school.name }}</p>
          <p class="text-sm text-gray-400">{{ school.schoolId }}</p>
        </div>
        <NuxtLink
          :to="`/schools/${school.schoolId}/classes`"
          class="text-blue-600 hover:underline text-sm"
        >
          Ангиуд харах →
        </NuxtLink>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">Сургууль нэмэх</h2>
        <input
          v-model="newSchoolName"
          class="w-full border rounded px-3 py-2 mb-4"
          placeholder="Сургуулийн нэр"
        />
        <div class="flex gap-2 justify-end">
          <button @click="showModal = false" class="px-4 py-2 border rounded">Болих</button>
          <button @click="addSchool" class="px-4 py-2 bg-blue-600 text-white rounded">Хадгалах</button>
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
const showModal = ref(false)
const newSchoolName = ref('')

const load = async () => {
  schools.value = await get('/schools') as any[]
}

const addSchool = async () => {
  await post('/schools', { name: newSchoolName.value })
  newSchoolName.value = ''
  showModal.value = false
  await load()
}

onMounted(load)
</script>
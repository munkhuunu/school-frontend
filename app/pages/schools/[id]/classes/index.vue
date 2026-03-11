<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink to="/schools" class="text-sm text-gray-400 hover:underline">← Сургуулиуд</NuxtLink>
        <h1 class="text-2xl font-bold mt-1">Ангиуд</h1>
      </div>
      <button
        v-if="auth.isDirector || auth.isManager"
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Анги нэмэх
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="cls in classes"
        :key="cls.classId"
        class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ cls.name }}</p>
          <p class="text-sm text-gray-400">{{ cls.grade }}-р анги</p>
        </div>
        <NuxtLink
          :to="`/schools/${route.params.id}/classes/${cls.classId}/students`"
          class="text-blue-600 hover:underline text-sm"
        >
          Сурагчид →
        </NuxtLink>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">Анги нэмэх</h2>
        <input v-model="form.name" class="w-full border rounded px-3 py-2 mb-3" placeholder="Ангийн нэр (7А)" />
        <input v-model="form.grade" type="number" class="w-full border rounded px-3 py-2 mb-4" placeholder="Дугаар (7)" />
        <div class="flex gap-2 justify-end">
          <button @click="showModal = false" class="px-4 py-2 border rounded">Болих</button>
          <button @click="addClass" class="px-4 py-2 bg-blue-600 text-white rounded">Хадгалах</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { get, post } = useApi()
const route = useRoute()
const classes = ref<any[]>([])
const showModal = ref(false)
const form = reactive({ name: '', grade: 1 })

const load = async () => {
  classes.value = await get(`/schools/${route.params.id}/classes`) as any[]
}

const addClass = async () => {
  await post(`/schools/${route.params.id}/classes`, {
    name: form.name,
    grade: Number(form.grade)
  })
  showModal.value = false
  await load()
}

onMounted(load)
</script>
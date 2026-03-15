<template>
  <NuxtLayout>
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <NuxtLink to="/schools" class="text-sm text-gray-400 hover:underline">← Сургуулиуд</NuxtLink>
          <h1 class="text-2xl font-bold mt-1">Ангиуд</h1>
        </div>
        <button v-if="auth.canManage" @click="showModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
          + Анги нэмэх
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="cls in classes" :key="cls.classId"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center hover:shadow-md transition">
          <div>
            <p class="font-semibold">{{ cls.name }}</p>
            <p class="text-sm text-gray-400">{{ cls.grade }}-р анги</p>
          </div>
          <NuxtLink :to="`/schools/${route.params.id}/classes/${cls.classId}`"
            class="text-blue-600 hover:underline text-sm font-medium">Сурагчид →</NuxtLink>
        </div>
        <div v-if="!classes.length" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-2">📚</p>
          <p>Анги байхгүй байна</p>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <h2 class="text-lg font-bold mb-4">Анги нэмэх</h2>
          <input v-model="form.name" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ангийн нэр (7А)" />
          <input v-model="form.grade" type="number" min="1" max="12" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Дугаар (7)" />
          <div class="flex gap-2 justify-end">
            <button @click="showModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Болих</button>
            <button @click="addClass" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Хадгалах</button>
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
const route = useRoute()
const classes = ref<any[]>([])
const showModal = ref(false)
const form = reactive({ name: '', grade: 1 })

const load = async () => {
  classes.value = await get(`/schools/${route.params.id}/classes`) as any[]
}

const addClass = async () => {
  await post(`/schools/${route.params.id}/classes`, { name: form.name, grade: Number(form.grade) })
  showModal.value = false
  await load()
}

onMounted(load)
</script>

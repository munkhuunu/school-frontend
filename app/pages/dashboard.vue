<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">🏫 Сургуулийн систем</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ auth.user?.email }}</span>
        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
          {{ roleLabel }}
        </span>
        <button @click="auth.logout()" class="text-sm text-red-500 hover:underline">
          Гарах
        </button>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 py-8">
      <!-- Welcome -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Сайн байна уу 👋</h2>
        <p class="text-gray-500 mt-1">{{ auth.user?.email }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <p class="text-3xl font-bold text-blue-600">{{ stats.schools }}</p>
          <p class="text-gray-500 mt-1">Сургууль</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <p class="text-3xl font-bold text-green-600">{{ stats.classes }}</p>
          <p class="text-gray-500 mt-1">Анги</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <p class="text-3xl font-bold text-purple-600">{{ stats.students }}</p>
          <p class="text-gray-500 mt-1">Сурагч</p>
        </div>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-2 gap-4">
        <NuxtLink
          to="/schools"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex items-center gap-4 group"
        >
          <span class="text-3xl">🏫</span>
          <div>
            <p class="font-semibold group-hover:text-blue-600 transition">Сургуулиуд</p>
            <p class="text-sm text-gray-500">Жагсаалт харах, нэмэх</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/schools"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex items-center gap-4 group"
        >
          <span class="text-3xl">📚</span>
          <div>
            <p class="font-semibold group-hover:text-blue-600 transition">Ангиуд & Сурагчид</p>
            <p class="text-sm text-gray-500">Анги, сурагч удирдах</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { get } = useApi()
const stats = reactive({ schools: 0, classes: 0, students: 0 })

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    DIRECTOR: 'Захирал',
    MANAGER: 'Менежер',
    TEACHER: 'Багш',
    PARENT: 'Эцэг эх',
    STUDENT: 'Сурагч',
  }
  return map[auth.user?.role] ?? auth.user?.role
})

onMounted(async () => {
  try {
    const schools: any = await get('/schools')
    stats.schools = schools?.length ?? 0

    // Бүх сургуулийн ангиудыг тоолох
    let totalClasses = 0
    let totalStudents = 0
    for (const school of schools ?? []) {
      try {
        const classes: any = await get(`/schools/${school.schoolId}/classes`)
        totalClasses += classes?.length ?? 0
        for (const cls of classes ?? []) {
          try {
            const res: any = await get(`/classes/${cls.classId}/students`)
            totalStudents += (res?.students ?? res)?.length ?? 0
          } catch {}
        }
      } catch {}
    }
    stats.classes = totalClasses
    stats.students = totalStudents
  } catch {}
})
</script>
<template>
  
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-1">Сайн байна уу 👋</h2>
      <p class="text-gray-400 mb-8">{{ auth.user?.email }}</p>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div v-for="s in statCards" :key="s.label"
          class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p class="text-2xl font-bold" :class="s.color">{{ s.value }}</p>
          <p class="text-gray-500 text-sm mt-1">{{ s.label }}</p>
        </div>
      </div>

      <!-- Quick links -->
      <h3 class="text-lg font-semibold mb-4">Шууд үйлдлүүд</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to"
          class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition group">
          <span class="text-2xl">{{ link.icon }}</span>
          <p class="font-medium mt-2 group-hover:text-blue-600 transition">{{ link.label }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ link.desc }}</p>
        </NuxtLink>
      </div>

      <!-- Recent Grades -->
      <div v-if="recentGrades.length" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold mb-4">Сүүлийн дүнгүүд</h3>
        <div class="space-y-2">
          <div v-for="g in recentGrades" :key="g.gradeId"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium">Сурагч: {{ g.studentId?.slice(0, 8) }}...</p>
              <p class="text-xs text-gray-400">{{ g.createdAt?.slice(0, 10) }}</p>
            </div>
            <span class="text-lg font-bold" :class="g.score >= 60 ? 'text-green-600' : 'text-red-500'">
              {{ g.score }}
            </span>
          </div>
        </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { get } = useApi()

const stats = reactive({ schools: 0, classes: 0, students: 0, teachers: 0, subjects: 0, todayAttendance: 0 })
const recentGrades = ref<any[]>([])

const statCards = computed(() => [
  { label: 'Сургууль', value: stats.schools, color: 'text-blue-600' },
  { label: 'Анги', value: stats.classes, color: 'text-green-600' },
  { label: 'Сурагч', value: stats.students, color: 'text-purple-600' },
  { label: 'Багш', value: stats.teachers, color: 'text-orange-600' },
  { label: 'Хичээл', value: stats.subjects, color: 'text-teal-600' },
  { label: 'Өнөөдрийн ирц', value: stats.todayAttendance, color: 'text-pink-600' },
])

const quickLinks = [
  { to: '/schools', icon: '🏫', label: 'Сургуулиуд', desc: 'Жагсаалт, нэмэх' },
  { to: '/teachers', icon: '👨‍🏫', label: 'Багш нар', desc: 'Багш удирдах' },
  { to: '/grades', icon: '📝', label: 'Дүн оруулах', desc: 'Дүн бүртгэх' },
  { to: '/attendance', icon: '📋', label: 'Ирц бүртгэх', desc: 'Ирц тэмдэглэх' },
]

onMounted(async () => {
  try {
    const res: any = await get('/dashboard')
    Object.assign(stats, res.stats)
    recentGrades.value = res.recentGrades ?? []
  } catch {}
})
</script>

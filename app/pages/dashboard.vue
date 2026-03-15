<template>
  <div class="p-6 lg:p-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="page-title">Сайн байна уу 👋</h2>
      <p class="text-sm text-stone-400 mt-1">{{ auth.user?.email }} — Өнөөдрийн мэдээлэл</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      <div v-for="s in statCards" :key="s.label" class="stat-card">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" :class="s.bg">
          <span v-html="s.icon" class="w-4 h-4" :class="s.iconColor" />
        </div>
        <p class="stat-value" :class="s.color">{{ s.value }}</p>
        <p class="stat-label">{{ s.label }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="mb-8">
      <h3 class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Шууд үйлдлүүд</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NuxtLink v-for="q in quickLinks" :key="q.to" :to="q.to" class="card-hover p-4 group">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors" :class="q.bg">
            <span v-html="q.icon" class="w-4.5 h-4.5" :class="q.iconColor" />
          </div>
          <p class="text-sm font-semibold text-stone-700 group-hover:text-emerald-700 transition-colors">{{ q.label }}</p>
          <p class="text-xs text-stone-400 mt-0.5">{{ q.desc }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent grades -->
    <div v-if="recentGrades.length" class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-stone-100">
        <h3 class="text-sm font-semibold text-stone-700">Сүүлийн дүнгүүд</h3>
      </div>
      <div class="divide-y divide-stone-50">
        <div v-for="g in recentGrades" :key="g.gradeId" class="px-5 py-3 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-stone-700">{{ g.studentId?.slice(0, 8) }}...</p>
            <p class="text-xs text-stone-400">{{ g.createdAt?.slice(0, 10) }}</p>
          </div>
          <div class="px-3 py-1 rounded-lg text-sm font-bold"
            :class="g.score >= 90 ? 'bg-emerald-50 text-emerald-700' : g.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'">
            {{ g.score }}
          </div>
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

const ic = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const statCards = computed(() => [
  { label: 'Сургууль', value: stats.schools, color: 'text-emerald-700', bg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { label: 'Анги', value: stats.classes, color: 'text-sky-700', bg: 'bg-sky-50', iconColor: 'text-sky-600', icon: ic('M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21') },
  { label: 'Сурагч', value: stats.students, color: 'text-violet-700', bg: 'bg-violet-50', iconColor: 'text-violet-600', icon: ic('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  { label: 'Багш', value: stats.teachers, color: 'text-amber-700', bg: 'bg-amber-50', iconColor: 'text-amber-600', icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
  { label: 'Хичээл', value: stats.subjects, color: 'text-teal-700', bg: 'bg-teal-50', iconColor: 'text-teal-600', icon: ic('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25') },
  { label: 'Өнөөдрийн ирц', value: stats.todayAttendance, color: 'text-rose-700', bg: 'bg-rose-50', iconColor: 'text-rose-600', icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
])

const quickLinks = [
  { to: '/schools', label: 'Сургуулиуд', desc: 'Жагсаалт харах, нэмэх', bg: 'bg-emerald-50 group-hover:bg-emerald-100', iconColor: 'text-emerald-600', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/teachers', label: 'Багш нар', desc: 'Багш удирдах', bg: 'bg-amber-50 group-hover:bg-amber-100', iconColor: 'text-amber-600', icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
  { to: '/grades', label: 'Дүн оруулах', desc: 'Дүн бүртгэх', bg: 'bg-sky-50 group-hover:bg-sky-100', iconColor: 'text-sky-600', icon: ic('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z') },
  { to: '/attendance', label: 'Ирц бүртгэх', desc: 'Ирц тэмдэглэх', bg: 'bg-violet-50 group-hover:bg-violet-100', iconColor: 'text-violet-600', icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
]

onMounted(async () => {
  try { const r: any = await get('/dashboard'); Object.assign(stats, r.stats); recentGrades.value = r.recentGrades ?? [] } catch {}
})
</script>

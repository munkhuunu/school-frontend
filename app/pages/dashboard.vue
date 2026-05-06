<template>
  <div class="p-6 lg:p-8 max-w-7xl">
    <!-- Welcome hero -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 lg:p-8 mb-8 shadow-lg shadow-emerald-200">
      <div class="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      <div class="absolute bottom-0 left-1/2 w-80 h-40 bg-teal-500/10 rounded-full blur-2xl" />
      <div class="relative z-10 flex items-start justify-between">
        <div>
          <p class="text-emerald-200/70 text-sm font-medium mb-1">{{ today }}</p>
          <h2 class="text-2xl font-bold text-white tracking-tight mb-1">Сайн байна уу!</h2>
          <p class="text-emerald-100/80 text-sm">
            <span class="font-semibold text-white">{{ auth.user?.email }}</span>
            <span class="mx-2 text-emerald-300/40">·</span>
            <span class="bg-white/15 px-2 py-0.5 rounded-full text-xs font-medium">{{ auth.roleLabel }}</span>
          </p>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <NuxtLink to="/announcements" class="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2 text-sm text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.34 15.84c-.196-.138-.38-.29-.553-.456a5.995 5.995 0 01-1.8-4.27c0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.58-.612 3.016-1.609 4.087M12 6v6l3 3"/>
            </svg>
            Мэдэгдэл
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      <div v-for="s in statCards" :key="s.label"
        class="group bg-white rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-md transition-all duration-200">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3" :class="s.iconBg">
          <span v-html="s.icon" class="w-4.5 h-4.5" :class="s.iconColor" />
        </div>
        <p class="text-2xl font-bold leading-none mb-1" :class="s.valueColor">{{ s.value }}</p>
        <p class="text-xs text-slate-400 font-medium">{{ s.label }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Quick actions -->
      <div class="lg:col-span-2">
        <h3 class="section-title mb-4">Шууд үйлдлүүд</h3>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink v-for="q in quickLinks" :key="q.to" :to="q.to"
            class="group bg-white rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :class="q.iconBg">
              <span v-html="q.icon" class="w-5 h-5" :class="q.iconColor" />
            </div>
            <p class="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{{ q.label }}</p>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">{{ q.desc }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Announcements sidebar -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Мэдэгдэлүүд</h3>
          <NuxtLink to="/announcements" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline">Бүгд →</NuxtLink>
        </div>
        <div class="space-y-2.5">
          <div v-if="loadingAnn" class="space-y-2.5">
            <div v-for="i in 3" :key="i" class="skeleton h-20 rounded-2xl" />
          </div>
          <div v-else-if="!announcements.length"
            class="bg-white rounded-2xl border border-slate-100 p-5 text-center">
            <svg class="w-8 h-8 text-slate-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-sm text-slate-400">Мэдэгдэл байхгүй</p>
          </div>
          <div v-for="a in announcements" :key="a.announcementId"
            class="bg-white rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-sm transition-all"
            :class="audienceBorder(a.audience)">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <p class="text-sm font-semibold text-slate-800 leading-snug">{{ a.title }}</p>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" :class="audienceBadge(a.audience)">
                {{ audienceLabel(a.audience) }}
              </span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">{{ a.content }}</p>
            <p class="text-xs text-slate-300 mt-2">{{ formatDate(a.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { sget } = useApi()

const stats = reactive({ schools: 0, classes: 0, students: 0, teachers: 0, subjects: 0, todayAttendance: 0 })
const announcements = ref<any[]>([])
const loadingAnn = ref(true)

const today = computed(() => {
  return new Date().toLocaleDateString('mn-MN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const ic = (d: string) =>
  `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const statCards = computed(() => [
  { label: 'Сургууль', value: stats.schools, valueColor: 'text-emerald-700', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { label: 'Анги', value: stats.classes, valueColor: 'text-sky-700', iconBg: 'bg-sky-50', iconColor: 'text-sky-500', icon: ic('M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21') },
  { label: 'Сурагч', value: stats.students, valueColor: 'text-violet-700', iconBg: 'bg-violet-50', iconColor: 'text-violet-500', icon: ic('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  { label: 'Багш', value: stats.teachers, valueColor: 'text-amber-700', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
  { label: 'Хичээл', value: stats.subjects, valueColor: 'text-teal-700', iconBg: 'bg-teal-50', iconColor: 'text-teal-500', icon: ic('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25') },
  { label: 'Өнөөдрийн ирц', value: stats.todayAttendance, valueColor: 'text-rose-700', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
])

const quickLinks = computed(() => [
  { to: '/schools', label: 'Сургуулиуд', desc: 'Сургуулийн жагсаалт харах', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/assignments', label: 'Даалгавар & Дүн', desc: 'Хичээлийн дүн бүртгэх', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', icon: ic('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z') },
  { to: '/teachers', label: 'Багш нар', desc: 'Багш удирдах, хуваарь', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
  { to: '/attendance', label: 'Ирц бүртгэх', desc: 'Өнөөдрийн ирц тэмдэглэх', iconBg: 'bg-violet-50', iconColor: 'text-violet-600', icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  ...(auth.canManage ? [
    { to: '/invitations', label: 'Урилга', desc: 'Хэрэглэгч урилгалах', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', icon: ic('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') },
    { to: '/parents', label: 'Эцэг эх', desc: 'Сурагчтай холбох', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', icon: ic('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  ] : []),
])

const audienceBorder = (a: string) => ({
  ALL: 'border-l-2 border-l-slate-300',
  TEACHER: 'border-l-2 border-l-amber-400',
  STUDENT: 'border-l-2 border-l-sky-400',
  PARENT: 'border-l-2 border-l-teal-400',
}[a] ?? 'border-l-2 border-l-slate-200')

const audienceBadge = (a: string) => ({
  ALL: 'bg-slate-100 text-slate-600',
  TEACHER: 'bg-amber-50 text-amber-700',
  STUDENT: 'bg-sky-50 text-sky-700',
  PARENT: 'bg-teal-50 text-teal-700',
}[a] ?? 'bg-slate-100 text-slate-600')

const audienceLabel = (a: string) => ({ ALL: 'Бүгд', TEACHER: 'Багш', STUDENT: 'Сурагч', PARENT: 'Эцэг эх' }[a] ?? a)

const formatDate = (iso: string) => {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' }) } catch { return iso.slice(0, 10) }
}

onMounted(async () => {
  try {
    const r: any = await sget('/announcements')
    announcements.value = Array.isArray(r) ? r.slice(0, 5) : []
  } catch {}
  finally { loadingAnn.value = false }

  try {
    const schools: any = await sget('/schools')
    stats.schools = Array.isArray(schools) ? schools.length : 0
  } catch {}

  try {
    const classes: any = await sget('/classes')
    stats.classes = Array.isArray(classes) ? classes.length : 0
  } catch {}

  try {
    const students: any = await sget('/students')
    stats.students = Array.isArray(students) ? students.length : 0
  } catch {}

  try {
    const teachers: any = await sget('/teachers')
    stats.teachers = Array.isArray(teachers) ? teachers.length : 0
  } catch {}

  try {
    const subjects: any = await sget('/subjects')
    stats.subjects = Array.isArray(subjects) ? subjects.length : 0
  } catch {}
})
</script>

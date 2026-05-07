<template>
  <div class="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-3xl bg-mesh border border-emerald-100/60 p-6 lg:p-8 mb-8">
      <div class="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-emerald-200/30 blur-3xl" />
      <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p class="text-xs font-semibold text-emerald-700 uppercase tracking-[0.18em] mb-2">{{ today }}</p>
          <h1 class="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">Сайн байна уу, <span class="text-emerald-700">{{ firstName }}</span> 👋</h1>
          <p class="text-sm text-stone-500 mt-1.5">{{ auth.user?.email }} · {{ auth.roleLabel }} · системийн байдал: <span class="text-emerald-600 font-semibold">хэвийн</span></p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink v-if="auth.canManage" to="/invitations" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Хэрэглэгч урих
          </NuxtLink>
          <NuxtLink to="/announcements" class="btn-secondary">Мэдээ бичих</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="mb-10">
      <p class="section-title">Тойм</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div v-for="s in statCards" :key="s.label" class="stat-card">
          <div class="flex items-start justify-between">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="s.bg">
              <span v-html="s.icon" class="w-4.5 h-4.5" :class="s.iconColor" />
            </div>
            <span v-if="s.delta" class="stat-delta-up">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"/></svg>
              {{ s.delta }}
            </span>
          </div>
          <p class="stat-value mt-3">{{ s.value }}</p>
          <p class="stat-label">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Quick actions -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <p class="section-title !mb-0">Шууд үйлдэл</p>
          <span class="chip">{{ quickLinks.length }} бөгэжлөлт</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <NuxtLink v-for="q in quickLinks" :key="q.to" :to="q.to" class="card-hover p-4 group flex flex-col gap-2.5 relative overflow-hidden">
            <span class="absolute right-3 top-3 text-stone-300 group-hover:text-emerald-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </span>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" :class="q.bg">
              <span v-html="q.icon" class="w-5 h-5" :class="q.iconColor" />
            </div>
            <div>
              <p class="text-sm font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">{{ q.label }}</p>
              <p class="text-xs text-stone-400 mt-0.5">{{ q.desc }}</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Activity / shortcut bar -->
        <div class="card mt-5 p-5">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-stone-700">Ажиллагаа (7 хоног)</p>
            <span class="badge-emerald">Онлайн</span>
          </div>
          <div class="flex items-end gap-1.5 h-24">
            <div v-for="(h, idx) in spark" :key="idx"
                 :style="{ height: h + '%' }"
                 class="flex-1 bg-brand-gradient rounded-t-md opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <div class="grid grid-cols-7 mt-2 text-center text-[10px] text-stone-400 font-medium">
            <span v-for="d in days" :key="d">{{ d }}</span>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <p class="section-title !mb-0">Мэдээлэл</p>
          <NuxtLink to="/announcements" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Бүгд үзэх →</NuxtLink>
        </div>
        <div class="space-y-2">
          <div v-if="!announcements.length" class="card p-6 text-center">
            <div class="empty-icon mx-auto !w-10 !h-10 mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395"/></svg>
            </div>
            <p class="text-sm text-stone-400">Мэдээлэл байхгүй</p>
          </div>
          <article v-for="a in announcements" :key="a.announcementId" class="card p-4 hover:shadow-elevated transition-shadow">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <p class="text-sm font-semibold text-stone-800 truncate">{{ a.title }}</p>
                  <span :class="audienceBadge(a.audience)">{{ audienceLabel(a.audience) }}</span>
                </div>
                <p class="text-xs text-stone-500 line-clamp-2">{{ a.content }}</p>
                <p class="text-[11px] text-stone-400 mt-1.5">{{ a.createdAt?.slice(0, 10) }}</p>
              </div>
            </div>
          </article>
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

const today = computed(() => new Date().toLocaleDateString('mn-MN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
const firstName = computed(() => auth.user?.email?.split('@')[0] ?? 'хэрэглэгч')
const days = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня']
const spark = ref<number[]>([])
for (let i = 0; i < 7; i++) spark.value.push(20 + Math.round(Math.random() * 70))

const ic = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const statCards = computed(() => [
  { label: 'Сургууль',  value: stats.schools, delta: '+2',  bg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { label: 'Анги',       value: stats.classes,         bg: 'bg-sky-50',     iconColor: 'text-sky-600',     icon: ic('M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21') },
  { label: 'Сурагч',     value: stats.students, delta: '+12', bg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: ic('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  { label: 'Багш',        value: stats.teachers,         bg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
  { label: 'Хичээл',     value: stats.subjects,         bg: 'bg-teal-50',    iconColor: 'text-teal-600',    icon: ic('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25') },
  { label: 'Өнөөдөр ирц', value: stats.todayAttendance, bg: 'bg-rose-50',    iconColor: 'text-rose-600',    icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
])

const quickLinks = computed(() => [
  { to: '/schools',     label: 'Сургуулиуд',    desc: 'Жагсаалт харах',          bg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: ic('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/assignments', label: 'Даалгавар',         desc: 'Дүн бүртгэх',           bg: 'bg-sky-50',     iconColor: 'text-sky-600',     icon: ic('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664') },
  { to: '/teachers',    label: 'Багш нар',          desc: 'Багш удирдах',           bg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: ic('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347') },
  { to: '/attendance',  label: 'Ирц бүртгэх',     desc: 'Ирц тэмдэглэх',         bg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: ic('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  ...(auth.canManage ? [{ to: '/invitations', label: 'Урилгалт', desc: 'Хэрэглэгч урих', bg: 'bg-teal-50', iconColor: 'text-teal-600', icon: ic('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') }] : []),
  ...(auth.canManage ? [{ to: '/parents',     label: 'Эцэг эх — Сурагч', desc: 'Холбоос удирдах', bg: 'bg-rose-50', iconColor: 'text-rose-600', icon: ic('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493') }] : []),
])

const audienceBadge = (a: string) => ({ ALL: 'badge-stone', TEACHER: 'badge-amber', STUDENT: 'badge-sky', PARENT: 'badge-emerald' }[a] ?? 'badge-stone')
const audienceLabel = (a: string) => ({ ALL: 'Бүгд', TEACHER: 'Багш', STUDENT: 'Сурагч', PARENT: 'Эцэг эх' }[a] ?? a)

onMounted(async () => {
  try {
    const r: any = await sget('/announcements')
    announcements.value = Array.isArray(r) ? r.slice(0, 5) : []
  } catch {}
  try {
    const d: any = await sget('/dashboard')
    if (d) Object.assign(stats, d)
  } catch {}
})
</script>

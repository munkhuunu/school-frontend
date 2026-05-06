<template>
  <div class="min-h-screen bg-slate-50 flex">
    <div v-if="mob" @click="mob = false" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden" />

    <aside :class="mob ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="w-64 bg-white border-r border-stone-100 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300">

      <!-- Logo -->
      <div class="px-5 py-5 border-b border-stone-100">
        <NuxtLink to="/dashboard" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-stone-900 leading-tight">Сургуулийн</p>
            <p class="text-[11px] text-stone-400 leading-tight">Удирдлагын систем</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div v-for="group in navGroups" :key="group.label">
          <p class="px-3 mb-1.5 section-title">{{ group.label }}</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="item in group.items" :key="item.to" :to="item.to" @click="mob = false"
              class="nav-item"
              :class="isActive(item.to) ? 'nav-item-active' : 'nav-item-inactive'">
              <span v-html="item.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ item.label }}</span>
              <span v-if="item.badge" class="ml-auto badge bg-emerald-100 text-emerald-700">{{ item.badge }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- User -->
      <div class="px-4 py-4 border-t border-stone-100">
        <div class="flex items-center gap-2.5 mb-2.5">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
            :class="avatarColor">
            {{ auth.user?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-stone-800 truncate">{{ auth.user?.email }}</p>
            <p class="text-[10px] text-stone-400">{{ roleLabel }}</p>
          </div>
        </div>
        <button @click="auth.logout()"
          class="w-full text-xs text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl px-3 py-2 transition-all text-left flex items-center gap-2">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
          </svg>
          Системээс гарах
        </button>
      </div>
    </aside>

    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Mobile header -->
      <div class="lg:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <button @click="mob = true" class="text-stone-500 p-1.5 -ml-1.5 hover:bg-stone-100 rounded-xl transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <p class="text-sm font-semibold text-stone-800">Сургуулийн систем</p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mob = ref(false)

const roleLabel = computed(() => ({
  SUPER_ADMIN: 'Супер Админ', DIRECTOR: 'Захирал', MANAGER: 'Менежер',
  TEACHER: 'Багш', STUDENT: 'Сурагч', PARENT: 'Эцэг эх',
}[auth.user?.role ?? ''] ?? auth.user?.role ?? ''))

const avatarColor = computed(() => ({
  SUPER_ADMIN: 'bg-purple-500', DIRECTOR: 'bg-emerald-600', MANAGER: 'bg-sky-500',
  TEACHER: 'bg-amber-500', STUDENT: 'bg-violet-500', PARENT: 'bg-teal-500',
}[auth.user?.role ?? ''] ?? 'bg-stone-400'))

const s = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const navGroups = computed(() => [
  {
    label: 'Үндсэн',
    items: [
      { to: '/dashboard', label: 'Дашбоард', svg: s('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z') },
      { to: '/announcements', label: 'Мэдээллэгүүд', svg: s('M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0') },
    ]
  },
  {
    label: 'Сургууль',
    items: [
      { to: '/schools', label: 'Сургуулиуд', svg: s('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
      { to: '/teachers', label: 'Багш нар', svg: s('M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342') },
      { to: '/subjects', label: 'Хичээлүүд', svg: s('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25') },
    ]
  },
  {
    label: 'Бүртгэл',
    items: [
      { to: '/assignments', label: 'Даалгавар & Дүн', svg: s('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z') },
      { to: '/attendance', label: 'Ирц бүртгэх', svg: s('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
      ...(auth.canManage ? [
        { to: '/invitations', label: 'Урилгалтаа', svg: s('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') },
        { to: '/parents', label: 'Эцэг эх — Сурагч', svg: s('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
      ] : [])
    ]
  }
])

const isActive = (to: string) => to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(to)
</script>

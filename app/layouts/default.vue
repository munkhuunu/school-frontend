<template>
  <div class="min-h-screen bg-stone-50 flex">
    <div v-if="mob" @click="mob = false" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden" />

    <!-- ══ SIDEBAR ══ -->
    <aside :class="mob ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="w-64 bg-white border-r border-stone-100 flex flex-col fixed inset-y-0 left-0 z-50
             transition-transform duration-200 ease-out">

      <!-- Brand -->
      <div class="px-5 py-5 border-b border-stone-100">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-elevated transition-shadow">
            <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[14px] font-bold text-stone-800 leading-tight">School OS</p>
            <p class="text-[11px] text-stone-400 leading-tight">Сургуулийн удирдлага</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Search -->
      <div class="px-3 pt-3">
        <div class="relative">
          <svg class="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"/>
          </svg>
          <input type="text" placeholder="Хайх..."
            class="w-full pl-8 pr-12 py-2 text-[12px] bg-stone-50 border border-stone-100 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 placeholder:text-stone-400" />
          <span class="kbd absolute right-2 top-1/2 -translate-y-1/2">⌘K</span>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-2">Үндсэн</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in mainNav" :key="i.to" :to="i.to" @click="mob = false"
              :class="['nav-item', active(i.to) && 'nav-item-active']">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
              <span v-if="i.badge" class="ml-auto badge-emerald">{{ i.badge }}</span>
            </NuxtLink>
          </div>
        </div>
        <div>
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-2">Бүртгэл</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in recNav" :key="i.to" :to="i.to" @click="mob = false"
              :class="['nav-item', active(i.to) && 'nav-item-active']">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
            </NuxtLink>
          </div>
        </div>
        <div v-if="auth.canManage">
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-2">Үйл ажиллагаа</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in mgmtNav" :key="i.to" :to="i.to" @click="mob = false"
              :class="['nav-item', active(i.to) && 'nav-item-active']">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- User card -->
      <div class="p-3 border-t border-stone-100">
        <div class="card p-3 flex items-center gap-2.5">
          <div class="w-9 h-9 bg-brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shadow-soft shrink-0">
            {{ auth.user?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-semibold text-stone-800 truncate">{{ auth.user?.email }}</p>
            <p class="text-[10px] text-stone-400 truncate">{{ roles[auth.user?.role] ?? auth.user?.role }}</p>
          </div>
          <button @click="auth.logout()" title="Гарах"
            class="text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══ -->
    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Top bar -->
      <header class="bg-white/80 backdrop-blur border-b border-stone-100 px-4 lg:px-8 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button @click="mob = true" class="lg:hidden text-stone-500 p-1.5 -ml-1 hover:bg-stone-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-[12px] text-stone-400 hidden sm:block">{{ breadcrumb }}</p>
          <p class="text-sm font-semibold text-stone-800 truncate">{{ pageLabel }}</p>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <span class="chip">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulseSoft_2s_infinite]" />
            Систем хэвийн
          </span>
          <span class="chip">{{ auth.roleLabel }}</span>
        </div>
      </header>

      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mob = ref(false)
const roles: Record<string, string> = { SUPER_ADMIN: 'Супер Админ', DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш', PARENT: 'Эцэг эх', STUDENT: 'Сурагч' }

const svg = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', svg: svg('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z') },
  { to: '/schools', label: 'Сургуулиуд', svg: svg('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/teachers', label: 'Багш нар', svg: svg('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  { to: '/subjects', label: 'Хичээлүүд', svg: svg('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25') },
  { to: '/announcements', label: 'Мэдээ', svg: svg('M10.34 3.94c.09-.542.56-.94 1.11-.94h1.1c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z') },
]
const recNav = [
  { to: '/grades', label: 'Дүн оруулах', svg: svg('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664M11.5 4.5h.5') },
  { to: '/attendance', label: 'Ирц бүртгэх', svg: svg('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  { to: '/assignments', label: 'Даалгавр', svg: svg('M16.5 6v.75a3 3 0 11-6 0V6a3 3 0 116 0zM12 12.75c-2.485 0-4.5 2.015-4.5 4.5v1.5h9v-1.5c0-2.485-2.015-4.5-4.5-4.5z') },
]
const mgmtNav = [
  { to: '/invitations', label: 'Урилгалт', svg: svg('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75') },
  { to: '/parents', label: 'Эцэг эх холбоос', svg: svg('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07') },
]

const active = (to: string) => to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(to)

const pageLabel = computed(() => {
  const all = [...mainNav, ...recNav, ...mgmtNav]
  return all.find(i => active(i.to))?.label ?? 'Сургуулийн систем'
})
const breadcrumb = computed(() => {
  const seg = route.path.split('/').filter(Boolean)
  if (!seg.length) return 'Home'
  return seg.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
})
</script>

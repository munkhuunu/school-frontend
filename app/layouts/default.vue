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

      <nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-2">Үндсэн</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in mainNav" :key="i.to" :to="i.to" @click="mob = false"
              :class="['nav-item', active(i.to) && 'nav-item-active']">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
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
            <p class="text-[10px] text-stone-400 truncate">{{ auth.roleLabel }}</p>
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

const svg = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', svg: svg('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z') },
  { to: '/schools', label: 'Сургуулиуд', svg: svg('M12 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/teachers', label: 'Багш нар', svg: svg('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493') },
  { to: '/subjects', label: 'Хичээлүүд', svg: svg('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25') },
  { to: '/announcements', label: 'Мэдээ', svg: svg('M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09') },
]
const recNav = [
  { to: '/grades', label: 'Дүн оруулах', svg: svg('M9 12h3.75M9 15h3.75M9 18h3.75') },
  { to: '/attendance', label: 'Ирц бүртгэх', svg: svg('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  { to: '/assignments', label: 'Даалгавар', svg: svg('M16.5 6v.75a3 3 0 11-6 0V6a3 3 0 116 0zM12 12.75c-2.485 0-4.5 2.015-4.5 4.5v1.5h9v-1.5c0-2.485-2.015-4.5-4.5-4.5z') },
]
const mgmtNav = [
  // ✅ FIX: "Урилгалт" → "Урилга"
  { to: '/invitations', label: 'Урилга', svg: svg('M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75') },
  { to: '/parents', label: 'Эцэг эх — Сурагч', svg: svg('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952') },
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

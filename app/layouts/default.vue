<template>
  <div class="min-h-screen bg-stone-50 flex">
    <div v-if="mob" @click="mob = false" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden" />

    <aside :class="mob ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="w-60 bg-white border-r border-stone-100 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform">

      <div class="px-5 py-5 border-b border-stone-100">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-stone-800 leading-tight">Сургуулийн</p>
            <p class="text-[11px] text-stone-400 leading-tight">удирдлагын систем</p>
          </div>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Үндсэн</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in mainNav" :key="i.to" :to="i.to" @click="mob = false"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
              :class="active(i.to) ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
            </NuxtLink>
          </div>
        </div>
        <div>
          <p class="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Бүртгэл</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="i in recNav" :key="i.to" :to="i.to" @click="mob = false"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
              :class="active(i.to) ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'">
              <span v-html="i.svg" class="w-[18px] h-[18px] shrink-0" />
              <span>{{ i.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="px-4 py-4 border-t border-stone-100">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold border border-emerald-100">
            {{ auth.user?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-stone-700 truncate">{{ auth.user?.email }}</p>
            <p class="text-[10px] text-stone-400">{{ roles[auth.user?.role] ?? auth.user?.role }}</p>
          </div>
        </div>
        <button @click="auth.logout()" class="w-full text-xs text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-all text-left">
          Системээс гарах
        </button>
      </div>
    </aside>

    <div class="flex-1 lg:ml-60 min-h-screen">
      <div class="lg:hidden bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button @click="mob = true" class="text-stone-500 p-1 -ml-1 hover:bg-stone-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <p class="text-sm font-semibold text-stone-700">Сургуулийн систем</p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mob = ref(false)
const roles: Record<string, string> = { DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш', PARENT: 'Эцэг эх', STUDENT: 'Сурагч' }

const svg = (d: string) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', svg: svg('M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z') },
  { to: '/schools', label: 'Сургуулиуд', svg: svg('M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21') },
  { to: '/teachers', label: 'Багш нар', svg: svg('M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z') },
  { to: '/subjects', label: 'Хичээлүүд', svg: svg('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25') },
]
const recNav = [
  { to: '/grades', label: 'Дүн оруулах', svg: svg('M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z') },
  { to: '/attendance', label: 'Ирц бүртгэх', svg: svg('M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
]

const active = (to: string) => to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(to)
</script>

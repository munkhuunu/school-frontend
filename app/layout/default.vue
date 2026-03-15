<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile overlay -->
    <div v-if="mobileOpen" @click="mobileOpen = false" class="fixed inset-0 bg-black/40 z-40 lg:hidden"></div>

    <!-- Sidebar -->
    <aside
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="w-64 bg-white shadow-lg flex flex-col fixed inset-y-0 left-0 z-50 transition-transform"
    >
      <div class="p-5 border-b">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <span class="text-2xl">🏫</span>
          <span class="text-lg font-bold text-blue-600">Сургуулийн систем</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          @click="mobileOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition"
          :class="isActive(item.to) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'"
        >
          <span class="text-lg w-6 text-center">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
            {{ auth.user?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.email }}</p>
            <p class="text-xs text-gray-400">{{ roleLabel }}</p>
          </div>
        </div>
        <button @click="auth.logout()" class="w-full text-sm text-red-500 hover:bg-red-50 rounded-lg px-3 py-2 transition text-left">
          Гарах
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 lg:ml-64 min-h-screen">
      <!-- Mobile header -->
      <div class="lg:hidden bg-white shadow px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button @click="mobileOpen = true" class="text-gray-600 p-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="font-semibold text-gray-800">🏫 Сургуулийн систем</span>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mobileOpen = ref(false)

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш',
    PARENT: 'Эцэг эх', STUDENT: 'Сурагч',
  }
  return map[auth.user?.role] ?? auth.user?.role
})

const menuItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/schools', icon: '🏫', label: 'Сургуулиуд' },
  { to: '/teachers', icon: '👨‍🏫', label: 'Багш нар' },
  { to: '/subjects', icon: '📖', label: 'Хичээлүүд' },
  { to: '/grades', icon: '📝', label: 'Дүн оруулах' },
  { to: '/attendance', icon: '📋', label: 'Ирц бүртгэх' },
]

const isActive = (to: string) => {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}
</script>

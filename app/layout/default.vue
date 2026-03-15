<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg flex flex-col fixed inset-y-0 left-0 z-30">
      <div class="p-6 border-b">
        <h1 class="text-xl font-bold text-blue-600">🏫 Сургуулийн систем</h1>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition"
          :class="route.path.startsWith(item.to) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
            {{ auth.user?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.email }}</p>
            <p class="text-xs text-gray-400">{{ roleLabel }}</p>
          </div>
        </div>
        <button @click="auth.logout()" class="w-full text-sm text-red-500 hover:bg-red-50 rounded px-3 py-1.5 transition">
          Гарах
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 ml-64 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

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
  { to: '/grades', icon: '📝', label: 'Дүн' },
  { to: '/attendance', icon: '📋', label: 'Ирц' },
]
</script>

<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink to="/schools" class="text-xs text-stone-400 hover:text-emerald-600 transition">← Сургуулиуд</NuxtLink>
        <h1 class="page-title mt-1">Ангиуд</h1>
      </div>
      <button v-if="auth.canManage" @click="showModal = true" class="btn-primary">+ Анги нэмэх</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <NuxtLink v-for="c in classes" :key="c.classId" :to="`/schools/${route.params.id}/classes/${c.classId}`"
        class="card-hover p-5 flex justify-between items-center block">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-bold text-sm">
            {{ c.grade }}
          </div>
          <div>
            <p class="font-semibold text-stone-800">{{ c.name }}</p>
            <p class="text-xs text-stone-400">{{ c.grade }}-р анги</p>
          </div>
        </div>
        <span class="text-xs text-emerald-600 font-medium">Сурагчид →</span>
      </NuxtLink>
    </div>

    <div v-if="!classes.length" class="empty-state">
      <div class="empty-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"/></svg></div>
      <p class="text-sm text-stone-400">Анги байхгүй байна</p>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Анги нэмэх</h2>
        <div class="space-y-3">
          <div><label class="label">Ангийн нэр</label><input v-model="form.name" class="input-field" placeholder="7А" /></div>
          <div><label class="label">Анги (1-12)</label><input v-model="form.grade" type="number" min="1" max="12" class="input-field" placeholder="7" /></div>
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="showModal = false" class="btn-secondary">Болих</button>
          <button @click="addClass" class="btn-primary">Хадгалах</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore(); const { get, post } = useApi(); const route = useRoute()
const classes = ref<any[]>([]); const showModal = ref(false); const form = reactive({ name: '', grade: 1 })
const load = async () => { classes.value = await get(`/schools/${route.params.id}/classes`) as any[] }
const addClass = async () => { await post(`/schools/${route.params.id}/classes`, { name: form.name, grade: Number(form.grade) }); showModal.value = false; await load() }
onMounted(load)
</script>

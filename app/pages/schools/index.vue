<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title">Сургуулиуд</h1>
      <!-- ✅ FIX: Backend нь зөвхөн SUPER_ADMIN-д POST /schools зөвшөөрнө -->
      <button v-if="auth.isSuperAdmin" @click="showModal = true" class="btn-primary">+ Сургууль нэмэх</button>
    </div>

    <div v-if="loading" class="empty-state"><p class="text-stone-400">Уншиж байна...</p></div>

    <div v-else class="space-y-2.5">
      <NuxtLink v-for="s in schools" :key="s.schoolId" :to="`/schools/${s.schoolId}/classes`"
        class="card-hover p-5 flex justify-between items-center block">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold text-stone-800">{{ s.name }}</p>
            <p class="text-xs text-stone-400 mt-0.5">{{ s.createdAt?.slice(0, 10) }}</p>
          </div>
        </div>
        <span class="text-xs text-emerald-600 font-medium">Ангиуд →</span>
      </NuxtLink>

      <div v-if="!schools.length" class="empty-state">
        <p class="text-sm text-stone-400">Сургууль байхгүй байна</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Сургууль нэмэх</h2>
        <input v-model="newName" class="input-field mb-3" placeholder="Сургуулийн нэр" @keyup.enter="add" />
        <input v-model="newAddress" class="input-field mb-4" placeholder="Хаяг (заавал биш)" />
        <p v-if="err" class="text-sm text-red-600 mb-2">{{ err }}</p>
        <div class="flex gap-2 justify-end">
          <button @click="showModal = false" class="btn-secondary">Болих</button>
          <button @click="add" :disabled="saving" class="btn-primary">{{ saving ? '...' : 'Хадгалах' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post } = useApi()
const schools = ref<any[]>([])
const showModal = ref(false)
const newName = ref('')
const newAddress = ref('')
const loading = ref(true)
const saving = ref(false)
const err = ref('')

const load = async () => {
  loading.value = true
  try { schools.value = await get('/schools') as any[] } catch {} finally { loading.value = false }
}
const add = async () => {
  if (!newName.value) { err.value = 'Нэр шаардлагатай'; return }
  saving.value = true; err.value = ''
  try {
    await post('/schools', { name: newName.value, address: newAddress.value || undefined })
    newName.value = ''; newAddress.value = ''; showModal.value = false
    await load()
  } catch (e: any) {
    err.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { saving.value = false }
}
onMounted(load)
</script>

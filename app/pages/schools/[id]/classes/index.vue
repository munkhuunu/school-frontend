<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink to="/schools" class="text-xs text-stone-400 hover:text-emerald-600 transition">← Сургуулиуд</NuxtLink>
        <h1 class="page-title mt-1">{{ school?.name ?? 'Анги бүртгэл' }}</h1>
        <p v-if="school?.address" class="text-xs text-stone-400 mt-1">{{ school.address }}</p>
      </div>
      <button v-if="auth.canManage" @click="showModal = true" class="btn-primary">+ Анги нэмэх</button>
    </div>

    <div v-if="loading" class="empty-state"><p class="text-stone-400">Уншиж байна...</p></div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <NuxtLink v-for="c in classes" :key="c.classId"
        :to="`/schools/${route.params.id}/classes/${c.classId}`"
        class="card-hover p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
            <span class="text-sky-700 font-bold text-sm">{{ c.grade }}</span>
          </div>
          <span class="badge-stone">{{ c.academicYear ?? '—' }}</span>
        </div>
        <p class="font-semibold text-stone-800">{{ c.name }}</p>
        <p class="text-xs text-stone-400 mt-1">{{ c.grade }}-р анги · {{ c.createdAt?.slice(0, 10) }}</p>
      </NuxtLink>

      <div v-if="!classes.length" class="col-span-full empty-state">
        <p class="text-sm text-stone-400">Анги байхгүй байна</p>
        <button v-if="auth.canManage" @click="showModal = true" class="text-sm text-emerald-600 hover:underline mt-2">+ Нэмэх</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Анги нэмэх</h2>
        <div class="space-y-3">
          <div>
            <label class="label">Ангийн нэр</label>
            <input v-model="form.name" class="input-field" placeholder="10А анги" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Анги (1-12)</label>
              <input v-model.number="form.grade" type="number" min="1" max="12" class="input-field" />
            </div>
            <div>
              <label class="label">Хичээлийн жил</label>
              <input v-model="form.academicYear" class="input-field" placeholder="2025-2026" />
            </div>
          </div>
        </div>
        <p v-if="err" class="text-sm text-red-600 mt-2">{{ err }}</p>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="showModal = false" class="btn-secondary">Болих</button>
          <button @click="add" :disabled="saving" class="btn-primary">{{ saving ? '...' : 'Хадгалах' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const auth = useAuthStore()
const { get, post } = useApi()

const schoolId = computed(() => route.params.id as string)
const school = ref<any>(null)
const classes = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const err = ref('')
const form = reactive({ name: '', grade: 10 as number, academicYear: '' })

const load = async () => {
  loading.value = true
  try {
    // Сургуулийн дэлгэрэнгүй
    try { school.value = await get(`/schools/${schoolId.value}`) } catch {}
    // ✅ FIX: copy-paste-аас зөв ангиудын endpoint
    classes.value = (await get(`/schools/${schoolId.value}/classes`) as any[]) ?? []
  } catch {
    classes.value = []
  } finally {
    loading.value = false
  }
}

const add = async () => {
  if (!form.name || !form.grade) { err.value = 'Нэр болон ангийг бөглөнө үү'; return }
  saving.value = true; err.value = ''
  try {
    await post(`/schools/${schoolId.value}/classes`, {
      name: form.name,
      grade: form.grade,
      academicYear: form.academicYear || undefined,
    })
    Object.assign(form, { name: '', grade: 10, academicYear: '' })
    showModal.value = false
    await load()
  } catch (e: any) {
    err.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { saving.value = false }
}

onMounted(load)
</script>

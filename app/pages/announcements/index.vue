<template>
  <div class="p-6 lg:p-8 max-w-3xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Мэдээ</h2>
        <p class="text-sm text-stone-400 mt-1">Сургуулийн зар болон мэдээллүүд</p>
      </div>
      <button v-if="auth.canTeach && activeSchoolId" @click="showForm = !showForm" class="btn-primary">
        Нэмэх
      </button>
    </div>

    <!-- Debug info -->
    <div class="text-xs text-stone-400 mb-4">
      Role: <span class="font-semibold">{{ auth.user?.role }}</span>
      · SchoolId: <span class="font-mono">{{ auth.user?.schoolId ?? 'null' }}</span>
    </div>

    <!-- SUPER_ADMIN: сургууль сонгох -->
    <div v-if="isSuperAdmin" class="card p-4 mb-6">
      <label class="label">Сургууль сонгох</label>
      <select v-model="selectedSchoolId" @change="loadAnnouncements" class="select-field max-w-md">
        <option value="">— Сонгох —</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
      <p v-if="!selectedSchoolId" class="text-xs text-stone-400 mt-2">
        Мэдээ оруулах, харахын тулд сургууль сонгоно уу
      </p>
      <p v-if="schoolsError" class="text-xs text-red-600 mt-2">{{ schoolsError }}</p>
    </div>

    <!-- Шинэ мэдээ оруулах форм -->
    <div v-if="showForm && auth.canTeach && activeSchoolId" class="card p-5 mb-6">
      <form @submit.prevent="submitPost" class="space-y-3">
        <div>
          <label class="label">Гарчиг</label>
          <input v-model="form.title" class="input-field" required placeholder="Мэдээний гарчиг" />
        </div>
        <div>
          <label class="label">Хүлээн авагч</label>
          <select v-model="form.audience" class="select-field">
            <option value="ALL">Бүгд</option>
            <option value="TEACHER">Багш нар</option>
            <option value="STUDENT">Сурагчид</option>
            <option value="PARENT">Эцэг эх</option>
          </select>
        </div>
        <div>
          <label class="label">Дэлгэрэнгүй</label>
          <textarea v-model="form.content" class="input-field" rows="4" required />
        </div>
        <div v-if="formError" class="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p class="text-sm text-red-700">⚠️ {{ formError }}</p>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="showForm = false" class="btn-secondary">Цуцлах</button>
          <button type="submit" :disabled="posting" class="btn-primary">
            {{ posting ? '...' : 'Нийтлэх' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Хүлээн авагчаар шүүх -->
    <div v-if="activeSchoolId" class="flex gap-2 mb-4 flex-wrap">
      <button v-for="f in filters" :key="f.val"
              @click="activeFilter = f.val; loadAnnouncements()"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              :class="activeFilter === f.val
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-300'">
        {{ f.label }}
      </button>
    </div>

    <!-- Мэдээний жагсаалт -->
    <div class="space-y-3">
      <div v-if="!activeSchoolId" class="card p-8 text-center text-sm text-stone-400">
        Сургууль сонгоно уу
      </div>
      <div v-else-if="loading" class="card p-8 text-center text-sm text-stone-400">
        Уншиж байна...
      </div>
      <div v-else-if="loadError" class="card p-8 text-center text-sm text-red-600">
        ⚠️ {{ loadError }}
      </div>
      <div v-else-if="!announcements.length" class="card p-8 text-center text-sm text-stone-400">
        Мэдээ байхгүй
      </div>
      <div v-for="a in announcements" :key="a.announcementId" class="card p-5">
        <div class="flex items-start justify-between gap-3 mb-2">
          <h3 class="font-semibold text-stone-800">{{ a.title }}</h3>
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium shrink-0"
                :class="audienceBadge(a.audience)">{{ audienceLabel(a.audience) }}</span>
        </div>
        <p class="text-sm text-stone-600 whitespace-pre-wrap">{{ a.content }}</p>
        <p class="text-xs text-stone-400 mt-3">{{ a.createdAt?.slice(0, 16).replace('T', ' ') }}</p>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post } = useApi()

const isSuperAdmin = computed(() => auth.user?.role === 'SUPER_ADMIN')

const schools = ref<any[]>([])
const schoolsError = ref('')
const selectedSchoolId = ref('')
const announcements = ref<any[]>([])
const showForm = ref(false)
const posting = ref(false)
const loading = ref(false)
const loadError = ref('')
const formError = ref('')
const toast = ref('')
const activeFilter = ref('')

const form = reactive({ title: '', content: '', audience: 'ALL' })

const activeSchoolId = computed(() => {
  if (isSuperAdmin.value) return selectedSchoolId.value || ''
  return auth.user?.schoolId ?? ''
})

const filters = [
  { val: '',         label: 'Бүгд' },
  { val: 'TEACHER',  label: 'Багш нар' },
  { val: 'STUDENT',  label: 'Сурагчид' },
  { val: 'PARENT',   label: 'Эцэг эх' },
]

const audienceBadge = (a: string) => ({
  ALL:      'bg-stone-100 text-stone-600',
  TEACHER:  'bg-amber-50 text-amber-700',
  STUDENT:  'bg-sky-50 text-sky-700',
  PARENT:   'bg-teal-50 text-teal-700',
}[a] ?? 'bg-stone-100 text-stone-600')

const audienceLabel = (a: string) => ({
  ALL: 'Бүгд', TEACHER: 'Багш', STUDENT: 'Сурагч', PARENT: 'Эцэг эх',
}[a] ?? a)

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2500)
}

const extractError = (e: any): string =>
  e?.data?.message || e?.data?.error ||
  e?.response?._data?.message || e?.response?._data?.error ||
  e?.message || 'Алдаа гарлаа'

const loadAnnouncements = async () => {
  loadError.value = ''
  announcements.value = []
  if (!activeSchoolId.value) return
  loading.value = true
  try {
    const q = activeFilter.value ? `?audience=${activeFilter.value}` : ''
    announcements.value =
      ((await get(`/schools/${activeSchoolId.value}/announcements${q}`)) as any[]) ?? []
  } catch (e: any) {
    loadError.value = extractError(e)
  } finally {
    loading.value = false
  }
}

const submitPost = async () => {
  formError.value = ''
  if (!activeSchoolId.value) {
    formError.value = 'Сургууль сонгоно уу'
    return
  }
  posting.value = true
  try {
    const res: any = await post(`/schools/${activeSchoolId.value}/announcements`, { ...form })
    announcements.value.unshift(res)
    showForm.value = false
    Object.assign(form, { title: '', content: '', audience: 'ALL' })
    showToast('Мэдээ нийтлэгдлээ')
  } catch (e: any) {
    formError.value = extractError(e)
  } finally {
    posting.value = false
  }
}

const loadSchools = async () => {
  schoolsError.value = ''
  try {
    schools.value = ((await get('/schools')) as any[]) ?? []
    if (!schools.value.length) {
      schoolsError.value = 'Сургууль олдсонгүй'
    }
  } catch (e: any) {
    schoolsError.value = extractError(e)
  }
}

onMounted(async () => {
  if (isSuperAdmin.value) {
    await loadSchools()
  } else {
    await loadAnnouncements()
  }
})

watch(activeSchoolId, () => {
  if (isSuperAdmin.value) loadAnnouncements()
})
</script>
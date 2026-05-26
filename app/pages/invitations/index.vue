<template>
  <div class="p-6 lg:p-8 max-w-4xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Урилга</h2>
        <p class="text-sm text-stone-400 mt-1">Хэрэглэгчдэд урилга илгээх</p>
      </div>
      <button @click="showForm = !showForm" :disabled="!activeSchoolId" class="btn-primary">Шинэ урилга</button>
    </div>

    <!-- SUPER_ADMIN: сургууль сонгох -->
    <div v-if="auth.isSuperAdmin" class="card p-4 mb-6">
      <label class="label">Сургууль</label>
      <select v-model="selectedSchoolId" @change="loadInvites" class="select-field max-w-md">
        <option value="">Сонгох...</option>
        <option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option>
      </select>
      <p v-if="!selectedSchoolId" class="text-xs text-stone-400 mt-2">
        Урилга үүсгэхийн тулд сургууль сонгоно уу
      </p>
    </div>

    <!-- Шинэ урилга үүсгэх форм -->
    <div v-if="showForm && activeSchoolId" class="card p-5 mb-6">
      <h3 class="text-sm font-semibold text-stone-700 mb-4">Урилга үүсгэх</h3>
      <form @submit.prevent="createInvite" class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[140px]">
          <label class="label">Эрх</label>
          <select v-model="form.role" class="select-field">
            <option value="MANAGER">Менежер</option>
            <option value="TEACHER">Багш</option>
            <option value="PARENT">Эцэг эх</option>
            <option value="STUDENT">Сурагч</option>
            <option v-if="auth.isSuperAdmin" value="DIRECTOR">Захирал</option>
          </select>
        </div>
        <div class="flex-1 min-w-[180px]">
          <label class="label">И-мэйл (заавал биш)</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="email@example.com" />
        </div>
        <button type="submit" :disabled="creating" class="btn-primary h-10 px-5">
          {{ creating ? '...' : 'Үүсгэх' }}
        </button>
      </form>

      <!-- Алдааны мэдэгдэл -->
      <div v-if="formError" class="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <p class="text-sm text-red-700">{{ formError }}</p>
        </div>
      </div>

      <!-- Шинэ урилгын линк -->
      <div v-if="newInvite" class="mt-4 p-3 bg-emerald-50 rounded-xl">
        <p class="text-xs text-stone-500 mb-1">Урилгын линкийг илгээнэ үү</p>
        <div class="flex items-center gap-2">
          <code class="text-xs text-emerald-800 flex-1 break-all">{{ inviteUrl(newInvite.token) }}</code>
          <button @click="copy(inviteUrl(newInvite.token))" class="text-xs text-emerald-700 font-medium hover:underline whitespace-nowrap">
            {{ copied ? 'Хуулагдсан!' : 'Хуулах' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Урилгуудын жагсаалт -->
    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-stone-700">Урилгууд</h3>
        <span v-if="invites.length" class="text-xs text-stone-400">{{ invites.length }} урилга</span>
      </div>

      <div v-if="loading" class="px-5 py-8 text-center text-sm text-stone-400">Уншиж байна...</div>
      <div v-else-if="!activeSchoolId" class="px-5 py-8 text-center text-sm text-stone-400">
        Сургууль сонгоно уу
      </div>
      <div v-else-if="!invites.length" class="px-5 py-8 text-center text-sm text-stone-400">Урилга байхгүй</div>

      <div v-for="inv in invites" :key="inv.token"
           class="px-5 py-3 flex items-center justify-between border-b border-stone-50 last:border-0">
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium" :class="roleBadge(inv.role)">
            {{ roleLabels[inv.role] ?? inv.role }}
          </span>
          <div>
            <p class="text-sm font-medium text-stone-700">{{ inv.email ?? 'И-мэйлгүй' }}</p>
            <p class="text-xs text-stone-400">{{ statusText(inv) }} • {{ inv.expiresAt?.slice(0, 10) }} хүртэл</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="!inv.usedAt && !inv.revokedAt"
                  @click="copy(inviteUrl(inv.token))"
                  class="text-xs text-emerald-600 hover:underline">Хуулах</button>
          <button v-if="!inv.usedAt && !inv.revokedAt"
                  @click="revokeInvite(inv)"
                  class="text-xs text-red-500 hover:underline">Цуцлах</button>
          <span v-if="inv.usedAt" class="text-xs text-stone-400">Хэрэглэгдсэн</span>
          <span v-if="inv.revokedAt" class="text-xs text-red-400">Цуцлагдсан</span>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { get, post, del } = useApi()

const invites = ref<any[]>([])
const schools = ref<any[]>([])
const selectedSchoolId = ref('')
const showForm = ref(false)
const creating = ref(false)
const loading = ref(false)
const newInvite = ref<any>(null)
const copied = ref(false)
const formError = ref('')
const toast = ref('')
const form = reactive({ role: 'TEACHER', email: '' })

// SUPER_ADMIN бол сонгосон, бусдад нь өөрийн сургууль
const activeSchoolId = computed(() => {
  if (auth.isSuperAdmin) return selectedSchoolId.value || ''
  return auth.user?.schoolId ?? ''
})

const roleLabels: Record<string, string> = {
  DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш',
  PARENT: 'Эцэг эх', STUDENT: 'Сурагч',
}

const roleBadge = (role: string) => ({
  DIRECTOR: 'bg-violet-50 text-violet-700',
  MANAGER:  'bg-sky-50 text-sky-700',
  TEACHER:  'bg-amber-50 text-amber-700',
  PARENT:   'bg-teal-50 text-teal-700',
  STUDENT:  'bg-emerald-50 text-emerald-700',
}[role] ?? 'bg-stone-100 text-stone-600')

const statusText = (inv: any) => {
  if (inv.revokedAt) return 'Цуцлагдсан'
  if (inv.usedAt) return 'Хэрэглэгдсэн'
  if (new Date(inv.expiresAt) < new Date()) return 'Дууссан'
  return 'Идэвхтэй'
}

const inviteUrl = (token: string) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2000)
}

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    formError.value = 'Хуулж чадсангүй'
  }
}

// Backend-аас алдааны мессеж гаргаж авах helper
const extractError = (e: any): string => {
  return (
    e?.data?.message ||
    e?.data?.error ||
    e?.response?._data?.message ||
    e?.response?._data?.error ||
    e?.message ||
    'Алдаа гарлаа'
  )
}

const loadInvites = async () => {
  formError.value = ''
  if (!activeSchoolId.value) {
    invites.value = []
    return
  }
  loading.value = true
  try {
    invites.value = (await get(`/schools/${activeSchoolId.value}/invitations`) as any[]) ?? []
  } catch (e: any) {
    invites.value = []
    formError.value = extractError(e)
  } finally {
    loading.value = false
  }
}

const createInvite = async () => {
  formError.value = ''
  newInvite.value = null
  if (!activeSchoolId.value) {
    formError.value = 'Эхлээд сургууль сонгоно уу'
    return
  }
  creating.value = true
  try {
    const res: any = await post(`/schools/${activeSchoolId.value}/invitations`, {
      role: form.role,
      email: form.email || undefined,
    })
    newInvite.value = res
    invites.value.unshift(res)
    form.email = ''
    showToast('Урилга үүслээ')
  } catch (e: any) {
    formError.value = extractError(e)
  } finally {
    creating.value = false
  }
}

const revokeInvite = async (inv: any) => {
  if (!confirm('Цуцлах уу?')) return
  try {
    await del(`/schools/${activeSchoolId.value}/invitations/${inv.token}`)
    inv.revokedAt = new Date().toISOString()
    showToast('Урилга цуцлагдлаа')
  } catch (e: any) {
    formError.value = extractError(e)
  }
}

onMounted(async () => {
  // SUPER_ADMIN-д сургуулиудыг dropdown-д ачаалах
  if (auth.isSuperAdmin) {
    try {
      schools.value = (await get('/schools')) as any[]
    } catch (e: any) {
      formError.value = extractError(e)
    }
  } else {
    // Бусад role-д өөрийн сургуулийн урилгууд автоматаар
    await loadInvites()
  }
})

// SUPER_ADMIN сургууль сольсон үед урилгууд дахин ачаалах
watch(activeSchoolId, () => {
  if (auth.isSuperAdmin) loadInvites()
})
</script>
<template>
  <div class="p-6 lg:p-8 max-w-4xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Урилгалтаа</h2>
        <p class="text-sm text-stone-400 mt-1">Хэрэглэгчд урилгалтаа илгээнүү</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary">Шинэ урилгалтаа</button>
    </div>

    <div v-if="showForm" class="card p-5 mb-6">
      <h3 class="text-sm font-semibold text-stone-700 mb-4">Урилгалтаа үүсгэх</h3>
      <form @submit.prevent="createInvite" class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[140px]">
          <label class="label">Эрх</label>
          <select v-model="form.role" class="select-field">
          <option value="SUPER_ADMIN">Админ</option>
            <option value="MANAGER">Менежер</option>
            <option value="TEACHER">Багш</option>
            <option value="PARENT">Эцэг эх</option>
            <option value="STUDENT">Сурагч</option>
            <option v-if="auth.isDirector || auth.isSuperAdmin" value="DIRECTOR">Захирал</option>
          </select>
        </div>
        <div class="flex-1 min-w-[180px]">
          <label class="label">И-мэйл (заалгавар)</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="email@example.com" />
        </div>
        <button type="submit" :disabled="creating" class="btn-primary h-10 px-5">
          {{ creating ? '...' : 'Үүсгэх' }}
        </button>
      </form>
      <div v-if="newInvite" class="mt-4 p-3 bg-emerald-50 rounded-xl">
        <p class="text-xs text-stone-500 mb-1">Урилгалтааны линк илгээрэй</p>
        <div class="flex items-center gap-2">
          <code class="text-xs text-emerald-800 flex-1 break-all">{{ inviteUrl(newInvite.token) }}</code>
          <button @click="copy(inviteUrl(newInvite.token))" class="text-xs text-emerald-700 font-medium hover:underline whitespace-nowrap">
            {{ copied ? 'Хуулагдсан!' : 'Хуулах' }}
          </button>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-stone-100">
        <h3 class="text-sm font-semibold text-stone-700">Одоогийн урилгалтаанууд</h3>
      </div>
      <div v-if="!invites.length" class="px-5 py-8 text-center text-sm text-stone-400">Урилгалтаа байхгүй</div>
      <div v-for="inv in invites" :key="inv.token" class="px-5 py-3 flex items-center justify-between border-b border-stone-50 last:border-0">
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium"
            :class="roleBadge(inv.role)">{{ roleLabels[inv.role] ?? inv.role }}</span>
          <div>
            <p class="text-sm font-medium text-stone-700">{{ inv.email ?? 'И-мэйлгүй' }}</p>
            <p class="text-xs text-stone-400">{{ statusText(inv) }} • {{ inv.expiresAt?.slice(0, 10) }} хүртэл</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="!inv.usedAt && !inv.revokedAt" @click="copy(inviteUrl(inv.token))" class="text-xs text-emerald-600 hover:underline">Хуулах</button>
          <button v-if="!inv.usedAt && !inv.revokedAt" @click="revokeInvite(inv)" class="text-xs text-red-500 hover:underline">Цуцлах</button>
          <span v-if="inv.usedAt" class="text-xs text-stone-400">Хэрэглэгдсэн</span>
          <span v-if="inv.revokedAt" class="text-xs text-red-400">Цуцлагдсан</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { sget, spost, sdel } = useApi()
const config = useRuntimeConfig()

const invites = ref<any[]>([])
const showForm = ref(false)
const creating = ref(false)
const newInvite = ref<any>(null)
const copied = ref(false)
const form = reactive({ role: 'TEACHER', email: '' })

const roleLabels: Record<string, string> = {
  DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш', PARENT: 'Эцэг эх', STUDENT: 'Сурагч',
}

const roleBadge = (role: string) => ({
  DIRECTOR: 'bg-violet-50 text-violet-700', MANAGER: 'bg-sky-50 text-sky-700',
  TEACHER: 'bg-amber-50 text-amber-700', PARENT: 'bg-teal-50 text-teal-700',
  STUDENT: 'bg-emerald-50 text-emerald-700',
}[role] ?? 'bg-stone-100 text-stone-600')

const statusText = (inv: any) => {
  if (inv.revokedAt) return 'Цуцлагдсан'
  if (inv.usedAt) return 'Хэрэглэгдсэн'
  if (new Date(inv.expiresAt) < new Date()) return 'Дууссан'
  return 'Идэвхийн'
}

const inviteUrl = (token: string) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text).catch(() => {})
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const createInvite = async () => {
  creating.value = true
  try {
    const res: any = await spost('/invitations', { role: form.role, email: form.email || undefined })
    newInvite.value = res
    invites.value.unshift(res)
    form.email = ''
  } finally { creating.value = false }
}

const revokeInvite = async (inv: any) => {
  if (!confirm('Цуцлах уу?')) return
  await sdel(`/invitations/${inv.token}`)
  inv.revokedAt = new Date().toISOString()
}

onMounted(async () => {
  try { invites.value = (await sget('/invitations') as any[]) ?? [] } catch {}
})
</script>

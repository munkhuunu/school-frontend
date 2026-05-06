<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-stone-50">
    <div class="w-full max-w-[400px]">
      <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
          </svg>
        </div>
        <span class="font-bold text-stone-800">Сургуулийн систем</span>
      </div>

      <div v-if="loading" class="text-center py-12 text-stone-400">Түр хүлээнүү...</div>

      <div v-else-if="inviteError" class="card p-6 text-center">
        <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <h3 class="font-semibold text-stone-800 mb-2">Урилгалтгаа алдаа гарлаа</h3>
        <p class="text-sm text-stone-400">{{ inviteError }}</p>
        <NuxtLink to="/login" class="btn-primary mt-4 inline-block">Нэвтрэх</NuxtLink>
      </div>

      <div v-else-if="invite">
        <div class="card p-4 mb-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs text-stone-400">Урилгалтаа</p>
            <p class="text-sm font-semibold text-stone-800">Таны эрх: <span class="text-emerald-700">{{ roleLabel }}</span></p>
          </div>
        </div>

        <h2 class="text-xl font-bold text-stone-800 mb-1">Бүртгүүлэх</h2>
        <p class="text-sm text-stone-400 mb-6">Урилгалтаар байгаагаар бүртгүүлээрэй</p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="label">И-мэйл</label>
            <input v-model="form.email" type="email" required class="input-field"
              :placeholder="invite.email ?? 'email@example.com'"
              :readonly="!!invite.email" />
          </div>
          <div>
            <label class="label">Нууц үг</label>
            <input v-model="form.password" type="password" required class="input-field" placeholder="6+ тэмдэгт" />
          </div>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{{ error }}</p>
          <p v-if="success" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">Амжилттай! Нэвтрэх хуудас шилжийнэ...</p>
          <button type="submit" :disabled="loading || success" class="btn-primary w-full">
            {{ loading ? 'Түр хүлээнүү...' : 'Бүртгүүлэх' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const route = useRoute()
const auth = useAuthStore()
const { get } = useApi()
const config = useRuntimeConfig()

const token = route.params.token as string
const invite = ref<any>(null)
const inviteError = ref('')
const loading = ref(true)
const error = ref('')
const success = ref(false)
const form = reactive({ email: '', password: '' })

const roleLabels: Record<string, string> = {
  DIRECTOR: 'Захирал', MANAGER: 'Менежер', TEACHER: 'Багш', PARENT: 'Эцэг эх', STUDENT: 'Сурагч',
}
const roleLabel = computed(() => roleLabels[invite.value?.role] ?? invite.value?.role)

onMounted(async () => {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/invitations/validate/${token}`)
    invite.value = res
    if (res.email) form.email = res.email
  } catch (e: any) {
    inviteError.value = e?.data?.message ?? 'Урилгалтаа хучинсан эсвэл дууссан '
  } finally {
    loading.value = false
  }
})

const handleRegister = async () => {
  loading.value = true; error.value = ''
  try {
    await auth.register(form.email, form.password, token)
    success.value = true
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally {
    loading.value = false
  }
}
</script>

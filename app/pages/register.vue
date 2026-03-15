<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-stone-50">
    <div class="w-full max-w-[360px]">
      <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
          </svg>
        </div>
        <span class="font-bold text-stone-800">Сургуулийн систем</span>
      </div>

      <h2 class="text-xl font-bold text-stone-800 mb-1">Бүртгүүлэх</h2>
      <p class="text-sm text-stone-400 mb-8">Шинэ хэрэглэгч үүсгэх</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="label">И-мэйл</label>
          <input v-model="form.email" type="email" required class="input-field" placeholder="email@example.com" />
        </div>
        <div>
          <label class="label">Нууц үг</label>
          <input v-model="form.password" type="password" required class="input-field" placeholder="6+ тэмдэгт" />
        </div>
        <div>
          <label class="label">Эрх</label>
          <select v-model="form.role" class="select-field">
            <option value="DIRECTOR">Захирал</option>
            <option value="MANAGER">Менежер</option>
            <option value="TEACHER">Багш</option>
            <option value="PARENT">Эцэг эх</option>
            <option value="STUDENT">Сурагч</option>
          </select>
        </div>
        <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{{ error }}</p>
        <p v-if="success" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">Амжилттай бүртгэгдлээ!</p>
        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх' }}
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-stone-400">
        Бүртгэлтэй юу?
        <NuxtLink to="/login" class="text-emerald-600 hover:text-emerald-700 font-medium">Нэвтрэх</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })
const auth = useAuthStore()
const form = reactive({ email: '', password: '', role: 'TEACHER' })
const error = ref(''); const success = ref(false); const loading = ref(false)
const handleRegister = async () => {
  loading.value = true; error.value = ''; success.value = false
  try { await auth.register(form.email, form.password, form.role); success.value = true; setTimeout(() => navigateTo('/login'), 1500) }
  catch (e: any) { error.value = e?.data?.message ?? 'Алдаа гарлаа' }
  finally { loading.value = false }
}
</script>

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

      <!-- Super admin first-time setup -->
      <div v-if="mode === 'super'">
        <h2 class="text-xl font-bold text-stone-800 mb-1">Супер админ үүсгэх</h2>
        <p class="text-sm text-stone-400 mb-6">Платформын анхны бүртгүүлэлт</p>
        <form @submit.prevent="handleSuperAdmin" class="space-y-4">
          <div>
            <label class="label">И-мэйл</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="admin@example.com" />
          </div>
          <div>
            <label class="label">Нууц үг</label>
            <input v-model="form.password" type="password" required class="input-field" placeholder="8+ тэмдэгт" />
          </div>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{{ error }}</p>
          <p v-if="success" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">Амжилттай үүсгэлээ!</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Түр хүлээнүү...' : 'Үүсгэх' }}
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-stone-400">
          <button @click="mode = 'info'" class="text-emerald-600 hover:underline">Урилгалтаагаар бүртгүүлэх</button>
        </p>
      </div>

      <!-- Default: info about invitation-based system -->
      <div v-else>
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
            </svg>
          </div>
          <h2 class="text-lg font-bold text-stone-800 mb-2">Урилгалтаагаар бүртгүүлэх</h2>
          <p class="text-sm text-stone-500 mb-4 leading-relaxed">
            Енэ систем урилгалтаанд тулгууран дээр ажилладдаг.
            Хэрэглэхийн урилгалтааны захирал эсвэл менежереэс авах хэрэгтэй.
          </p>
          <NuxtLink to="/login" class="btn-primary inline-block">Нэвтрэх хуудас руу</NuxtLink>
        </div>
        <p class="mt-6 text-center text-sm text-stone-400">
          Платформ тохируулгач уу?
          <button @click="mode = 'super'" class="text-emerald-600 hover:underline">Супер админ үүсгэх</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })
const auth = useAuthStore()
const mode = ref<'info' | 'super'>('info')
const form = reactive({ email: '', password: '' })
const error = ref(''); const success = ref(false); const loading = ref(false)

const handleSuperAdmin = async () => {
  loading.value = true; error.value = ''
  try {
    await auth.registerSuperAdmin(form.email, form.password)
    success.value = true
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { loading.value = false }
}
</script>

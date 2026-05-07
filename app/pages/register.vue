<template>
  <div class="min-h-screen flex bg-stone-50">
    <!-- Left visual -->
    <div class="hidden lg:flex lg:w-[45%] bg-brand-gradient relative overflow-hidden items-center justify-center">
      <div class="absolute inset-0 opacity-[0.08]">
        <div class="absolute top-20 left-12 w-72 h-72 border-2 border-white rounded-full" />
        <div class="absolute bottom-12 right-12 w-48 h-48 border-2 border-white rounded-full" />
      </div>
      <div class="relative z-10 px-14 max-w-sm">
        <h1 class="text-[30px] font-bold text-white leading-tight tracking-tight">Шинээр бүртгүүлэх</h1>
        <p class="text-emerald-50/90 mt-3 text-[14px] leading-relaxed">Бидний систем урилгатаар ажилладаг. Захирал эсвэл менежерээс урилгахыг хүсэж авна уу.</p>
        <ul class="mt-8 space-y-3 text-sm text-emerald-50/90">
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 shrink-0 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            Олон сургуулийн (multi-tenant) дэмжлэгээ
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 shrink-0 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            JWT хамгаалалт бүхий роль
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 shrink-0 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            Сурагч, эцэг эх, багшийн портал
          </li>
        </ul>
      </div>
    </div>

    <!-- Right form -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-[400px]">
        <div class="flex items-center gap-2.5 mb-10">
          <div class="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow">
            <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <span class="font-bold text-stone-800">School OS</span>
        </div>

        <!-- Super admin first-time setup -->
        <div v-if="mode === 'super'">
          <h2 class="text-[26px] font-bold text-stone-900 tracking-tight">Супер админ үүсгэх</h2>
          <p class="text-sm text-stone-500 mt-1 mb-7">Платформын анхны бүртгэл. Зөвхөн нэг удаа үүсгэнэ.</p>
          <form @submit.prevent="handleSuperAdmin" class="space-y-4">
            <div>
              <label class="label">И-мэйл</label>
              <input v-model="form.email" type="email" required class="input-field" placeholder="admin@example.com" />
            </div>
            <div>
              <label class="label">Нууц үг</label>
              <input v-model="form.password" type="password" required minlength="8" class="input-field" placeholder="8+ тэмдэгт" />
            </div>
            <p v-if="error" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{{ error }}</p>
            <p v-if="success" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5">Амжилттай үүсгэлээ!</p>
            <button type="submit" :disabled="loading" class="btn-primary w-full !py-3">
              {{ loading ? 'Түр хүлээнэ үү...' : 'Үүсгэх' }}
            </button>
          </form>
          <p class="mt-7 text-center text-sm text-stone-500">
            <button @click="mode = 'info'" class="text-emerald-600 hover:text-emerald-700 font-semibold">« Буцах</button>
          </p>
        </div>

        <!-- Default invitation info -->
        <div v-else>
          <div class="card p-7 text-center">
            <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-1 ring-emerald-100">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
            </div>
            <h2 class="text-lg font-bold text-stone-900">Урилгаар бүртгүүлэх</h2>
            <p class="text-sm text-stone-500 mt-2 leading-relaxed">Энэ систем урилганд тулгуурлан ажилладаг.<br/>Сургуулийн захирал/менежерээс урилга авах хэрэгтэй.</p>
            <NuxtLink to="/login" class="btn-primary inline-flex mt-6 px-7">Нэвтрэх хуудас руу</NuxtLink>
          </div>
          <p class="mt-7 text-center text-sm text-stone-500">
            Платформын анхны тохируулга уу?
            <button @click="mode = 'super'" class="text-emerald-600 hover:text-emerald-700 font-semibold">Супер админ үүсгэх</button>
          </p>
        </div>
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

<template>
  <div class="min-h-screen flex">
    <!-- Left branding -->
    <div class="hidden lg:flex lg:w-[45%] bg-emerald-600 relative overflow-hidden items-center justify-center">
      <div class="absolute inset-0 opacity-[0.07]">
        <div class="absolute top-16 left-16 w-72 h-72 border-2 border-white rounded-full" />
        <div class="absolute bottom-24 right-12 w-52 h-52 border-2 border-white rounded-full" />
        <div class="absolute top-1/2 left-1/3 w-36 h-36 border-2 border-white rounded-full" />
      </div>
      <div class="relative z-10 px-14 max-w-md">
        <div class="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-8 border border-white/20">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-3 leading-snug">Сургуулийн<br/>удирдлагын систем</h1>
        <p class="text-emerald-100/80 text-sm leading-relaxed">Сурагч, багш, анги, хичээл, дүн, ирцийн бүртгэлийг нэг дороос удирдах боломжтой.</p>
        <div class="mt-10 flex gap-6 text-emerald-200/60 text-xs">
          <div><p class="text-2xl font-bold text-white/90">100+</p><p>Сургууль</p></div>
          <div><p class="text-2xl font-bold text-white/90">500+</p><p>Багш</p></div>
          <div><p class="text-2xl font-bold text-white/90">10K+</p><p>Сурагч</p></div>
        </div>
      </div>
    </div>

    <!-- Right form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-stone-50">
      <div class="w-full max-w-[360px]">
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <span class="font-bold text-stone-800">Сургуулийн систем</span>
        </div>

        <h2 class="text-xl font-bold text-stone-800 mb-1">Нэвтрэх</h2>
        <p class="text-sm text-stone-400 mb-8">Мэдээллээ оруулна уу</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">И-мэйл</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="email@example.com" />
          </div>
          <div>
            <label class="label">Нууц үг</label>
            <input v-model="form.password" type="password" required class="input-field" placeholder="••••••••" />
          </div>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх' }}
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-stone-400">
          Бүртгэл байхгүй юу?
          <NuxtLink to="/register" class="text-emerald-600 hover:text-emerald-700 font-medium">Бүртгүүлэх</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const error = ref(''); const loading = ref(false)
const handleLogin = async () => {
  loading.value = true; error.value = ''
  try { await auth.login(form.email, form.password); navigateTo('/dashboard') }
  catch (e: any) { error.value = e?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа' }
  finally { loading.value = false }
}
</script>

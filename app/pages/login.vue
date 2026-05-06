<template>
  <div class="min-h-screen flex">
    <!-- Left branding panel -->
    <div class="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden items-center justify-center">
      <!-- Blur blobs -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-teal-400/10 rounded-full blur-3xl" />
      <!-- Geometric rings -->
      <div class="absolute inset-0 opacity-[0.06]">
        <div class="absolute top-14 left-14 w-72 h-72 border border-white rounded-full" />
        <div class="absolute bottom-20 right-8 w-56 h-56 border border-white rounded-full" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full" />
      </div>

      <div class="relative z-10 px-14 max-w-md">
        <!-- Logo mark -->
        <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl shadow-black/20">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
          </svg>
        </div>
        <h1 class="text-[2rem] font-bold text-white mb-3 leading-snug tracking-tight">Сургуулийн<br/>удирдлагын систем</h1>
        <p class="text-emerald-100/70 text-sm leading-relaxed mb-10">Сурагч, багш, анги, хичээл, дүн, ирцийн бүртгэлийг нэг дороос удирдах боломжтой платформ.</p>

        <!-- Feature list -->
        <div class="space-y-3 mb-10">
          <div v-for="f in features" :key="f" class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-emerald-100/80 text-sm">{{ f }}</span>
          </div>
        </div>

        <!-- Platform stats -->
        <div class="flex gap-8 pt-8 border-t border-white/10">
          <div v-for="s in platformStats" :key="s.label">
            <p class="text-2xl font-bold text-white leading-none">{{ s.value }}</p>
            <p class="text-emerald-200/60 text-xs mt-1">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: login form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-[380px]">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2.5 mb-10">
          <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <span class="font-bold text-slate-800 text-lg">EduSys</span>
        </div>

        <!-- Demo mode badge -->
        <div class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-8">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-xs font-medium text-amber-700">Demo горим идэвхтэй</span>
        </div>

        <h2 class="text-2xl font-bold text-slate-800 mb-1.5 tracking-tight">Тавтай морил</h2>
        <p class="text-sm text-slate-400 mb-8">Системд нэвтрэхийн тулд мэдээллээ оруулна уу</p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="label">И-мэйл хаяг</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="email@example.com" autocomplete="email" />
          </div>
          <div>
            <label class="label">Нууц үг</label>
            <input v-model="form.password" type="password" required class="input-field" placeholder="••••••••" autocomplete="current-password" />
          </div>

          <div v-if="error" class="flex items-start gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full py-3">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Нэвтэрч байна...
            </span>
            <span v-else>Нэвтрэх →</span>
          </button>
        </form>

        <!-- Demo credentials hint -->
        <div class="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Demo нэвтрэх мэдээлэл</p>
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500">И-мэйл</span>
              <button type="button" @click="form.email = 'director@school.edu.mn'" class="text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline">director@school.edu.mn</button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500">Нууц үг</span>
              <button type="button" @click="form.password = 'demo1234'" class="text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline">demo1234</button>
            </div>
          </div>
        </div>

        <p class="mt-8 text-center text-sm text-slate-400">
          Бүртгэл байхгүй юу?
          <NuxtLink to="/register" class="text-emerald-600 hover:text-emerald-700 font-semibold">Бүртгүүлэх</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const features = [
  'Сурагч, багш, анги удирдах',
  'Хичээл, даалгавар, дүн бүртгэл',
  'Ирцийн хяналт',
  'Эцэг эхийн холбоос',
]
const platformStats = [
  { value: '100+', label: 'Сургууль' },
  { value: '500+', label: 'Багш' },
  { value: '10K+', label: 'Сурагч' },
]

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.email, form.password)
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа'
  } finally {
    loading.value = false
  }
}
</script>

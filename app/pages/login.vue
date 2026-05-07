<template>
  <div class="min-h-screen flex bg-stone-50">
    <!-- Left brand panel -->
    <div class="hidden lg:flex lg:w-[48%] bg-brand-gradient relative overflow-hidden items-center justify-center">
      <!-- Decorative shapes -->
      <div class="absolute inset-0 opacity-[0.08]">
        <div class="absolute top-12 left-16 w-80 h-80 border-2 border-white rounded-full" />
        <div class="absolute bottom-16 right-8 w-60 h-60 border-2 border-white rounded-full" />
        <div class="absolute top-1/2 left-1/3 w-40 h-40 border-2 border-white rounded-full" />
      </div>
      <div class="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 blur-3xl rounded-full" />

      <div class="relative z-10 px-14 max-w-md">
        <div class="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-8 border border-white/25">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
          </svg>
        </div>
        <h1 class="text-[34px] font-bold text-white mb-3 leading-[1.15] tracking-tight">Сургуулийн<br/>удирдлагын систем</h1>
        <p class="text-emerald-50/90 text-[15px] leading-relaxed">Сурагч, багш, анги, хичээл, дүн, ирцийн бүртгэлийг нэг дороос удирдах боломжтой.</p>

        <div class="mt-10 grid grid-cols-3 gap-4 text-emerald-50/80 text-xs">
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <p class="text-[26px] font-bold text-white leading-none">100+</p>
            <p class="mt-1.5">Сургууль</p>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <p class="text-[26px] font-bold text-white leading-none">500+</p>
            <p class="mt-1.5">Багш</p>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <p class="text-[26px] font-bold text-white leading-none">10K+</p>
            <p class="mt-1.5">Сурагч</p>
          </div>
        </div>

        <div class="mt-10 flex items-center gap-2 text-emerald-50/70 text-xs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          AWS Lambda — multi-tenant, invitation-based
        </div>
      </div>
    </div>

    <!-- Right form -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-[400px]">
        <div class="lg:hidden flex items-center gap-2.5 mb-10">
          <div class="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow">
            <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <span class="font-bold text-stone-800">School OS</span>
        </div>

        <h2 class="text-[28px] font-bold text-stone-900 tracking-tight">Тавтай морилно уу</h2>
        <p class="text-sm text-stone-500 mt-1 mb-8">Мэдээллээ оруулж хувийн хуудас руу орно уу.</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">И-мэйл</label>
            <div class="relative">
              <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
              <input v-model="form.email" type="email" required class="input-field pl-10" placeholder="email@example.com" autocomplete="email" />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label !mb-0">Нууц үг</label>
              <a href="#" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Мартасан уу?</a>
            </div>
            <div class="relative">
              <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" required class="input-field pl-10 pr-10" placeholder="••••••••" autocomplete="current-password" />
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <svg v-if="!showPwd" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"/></svg>
              </button>
            </div>
          </div>

          <Transition name="fade">
            <p v-if="error" class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
              {{ error }}
            </p>
          </Transition>

          <button type="submit" :disabled="loading" class="btn-primary w-full !py-3 text-[14px]">
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
            {{ loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх' }}
          </button>
        </form>

        <div class="my-7 flex items-center gap-3">
          <div class="flex-1 h-px bg-stone-200" />
          <span class="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">эсвэл</span>
          <div class="flex-1 h-px bg-stone-200" />
        </div>

        <p class="text-center text-sm text-stone-500">
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
const error = ref(''); const loading = ref(false); const showPwd = ref(false)
const handleLogin = async () => {
  loading.value = true; error.value = ''
  try { await auth.login(form.email, form.password); navigateTo('/dashboard') }
  catch (e: any) { error.value = e?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа' }
  finally { loading.value = false }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease, transform .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>

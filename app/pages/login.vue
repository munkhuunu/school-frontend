<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-4xl">🏫</span>
        <h1 class="text-2xl font-bold mt-3">Нэвтрэх</h1>
        <p class="text-gray-400 text-sm mt-1">Сургуулийн удирдлагын систем</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">И-мэйл</label>
          <input v-model="form.email" type="email" required
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@example.com" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Нууц үг</label>
          <input v-model="form.password" type="password" required
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition">
          {{ loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-gray-500">
        Бүртгэл байхгүй юу?
        <NuxtLink to="/register" class="text-blue-600 hover:underline font-medium">Бүртгүүлэх</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true; error.value = ''
  try {
    await auth.login(form.email, form.password)
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Нэвтрэх</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">И-мэйл</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Нууц үг</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Бүртгэл байхгүй юу?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">Бүртгүүлэх</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

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
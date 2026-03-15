<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-4xl">🏫</span>
        <h1 class="text-2xl font-bold mt-3">Бүртгүүлэх</h1>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">И-мэйл</label>
          <input v-model="form.email" type="email" required
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Нууц үг</label>
          <input v-model="form.password" type="password" required
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Эрх</label>
          <select v-model="form.role" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="DIRECTOR">Захирал</option>
            <option value="MANAGER">Менежер</option>
            <option value="TEACHER">Багш</option>
            <option value="PARENT">Эцэг эх</option>
            <option value="STUDENT">Сурагч</option>
          </select>
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-lg">Амжилттай бүртгэгдлээ!</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition">
          {{ loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-gray-500">
        Бүртгэлтэй юу?
        <NuxtLink to="/login" class="text-blue-600 hover:underline font-medium">Нэвтрэх</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const form = reactive({ email: '', password: '', role: 'TEACHER' })
const error = ref('')
const success = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true; error.value = ''; success.value = false
  try {
    await auth.register(form.email, form.password, form.role)
    success.value = true
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Бүртгэхэд алдаа гарлаа'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Бүртгүүлэх</h1>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">И-мэйл</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Нууц үг</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Эрх</label>
          <select v-model="form.role" class="w-full border rounded px-3 py-2">
            <option value="DIRECTOR">Захирал</option>
            <option value="MANAGER">Менежер</option>
            <option value="TEACHER">Багш</option>
            <option value="PARENT">Эцэг эх</option>
            <option value="STUDENT">Сурагч</option>
          </select>
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-sm mb-4">Амжилттай бүртгэгдлээ!</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Бүртгэлтэй юу?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">Нэвтрэх</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const form = reactive({ email: '', password: '', role: 'TEACHER' })
const error = ref('')
const success = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await auth.register(form.email, form.password, form.role)
    success.value = true
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Бүртгэхэд алдаа гарлаа'
  } finally {
    loading.value = false
  }
}
</script>
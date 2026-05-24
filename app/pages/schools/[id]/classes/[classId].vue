<template>
  <div class="p-6 lg:p-8 max-w-5xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <NuxtLink :to="`/schools/${route.params.id}/classes`" class="text-xs text-stone-400 hover:text-emerald-600 transition">← Ангиуд</NuxtLink>
        <h1 class="page-title mt-1">Сурагчид</h1>
      </div>
      <button v-if="auth.canManage" @click="showModal = true" class="btn-primary">+ Сурагч нэмэх</button>
    </div>

    <div v-if="loading" class="empty-state"><p class="text-stone-400">Уншиж байна...</p></div>

    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-stone-100">
            <th class="table-header w-12">#</th>
            <th class="table-header">Овог нэр</th>
            <th class="table-header hidden md:table-cell">Утас</th>
            <th class="table-header hidden md:table-cell">И-мэйл</th>
            <th class="table-header w-20"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in students" :key="s.studentId" class="border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition">
            <td class="table-cell text-stone-400 font-mono text-xs">{{ i + 1 }}</td>
            <td class="table-cell">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold border border-emerald-100">
                  {{ s.firstName?.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-stone-800">{{ s.lastName }} {{ s.firstName }}</p>
                </div>
              </div>
            </td>
            <td class="table-cell text-stone-500 hidden md:table-cell">{{ s.phone || '—' }}</td>
            <td class="table-cell text-stone-500 hidden md:table-cell">{{ s.email || '—' }}</td>
            <td class="table-cell text-right">
              <button v-if="auth.isDirector" @click="del(s.studentId)" class="btn-danger text-xs">Устгах</button>
            </td>
          </tr>
          <tr v-if="!students.length">
            <td colspan="5" class="empty-state">
              <div class="empty-icon"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></div>
              <p class="text-sm text-stone-400">Сурагч байхгүй байна</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="students.length" class="text-xs text-stone-400 mt-3">Нийт {{ students.length }} сурагч</p>

    <!-- Add Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="close">
      <div class="modal-card">
        <h2 class="text-lg font-bold text-stone-800 mb-4">Сурагч нэмэх</h2>
        <div class="space-y-3">
          <div><label class="label">Овог</label><input v-model="form.lastName" class="input-field" placeholder="Бат" /></div>
          <div><label class="label">Нэр</label><input v-model="form.firstName" class="input-field" placeholder="Дорж" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="label">Утас</label><input v-model="form.phone" class="input-field" placeholder="99112233" /></div>
            <div><label class="label">И-мэйл</label><input v-model="form.email" class="input-field" placeholder="email" /></div>
          </div>
        </div>
        <p v-if="err" class="text-sm text-red-600 mt-2">{{ err }}</p>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="close" class="btn-secondary">Болих</button>
          <button @click="add" :disabled="saving" class="btn-primary">{{ saving ? 'Хадгалж байна...' : 'Хадгалах' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore(); const api = useApi(); const route = useRoute()
const students = ref<any[]>([]); const showModal = ref(false); const loading = ref(true); const saving = ref(false); const err = ref('')
const form = reactive({ lastName: '', firstName: '', phone: '', email: '' })

const load = async () => { loading.value = true; try { const r: any = await api.get(`/classes/${route.params.classId}/students`); students.value = r?.students ?? r ?? [] } catch { students.value = [] } finally { loading.value = false } }
const add = async () => {
  if (!form.lastName || !form.firstName) { err.value = 'Овог нэр оруулна уу'; return }
  saving.value = true; err.value = ''
  try {
    // ✅ зөв endpoint: /schools/{schoolId}/students
    await api.post(`/schools/${route.params.id}/students`, { ...form, classId: route.params.classId })
    close(); await load()
  }
  catch (e: any) { err.value = e?.data?.message ?? 'Алдаа' } finally { saving.value = false }
}
const del = async (sid: string) => {
  if (!confirm('Устгах уу?')) return
  try {
    // ✅ зөв endpoint: /schools/{schoolId}/students/{studentId}
    await api.del(`/schools/${route.params.id}/students/${sid}`)
    await load()
  } catch {}
}
const close = () => { showModal.value = false; err.value = ''; Object.assign(form, { lastName: '', firstName: '', phone: '', email: '' }) }
onMounted(load)
</script>
<template>
  <div class="p-6 lg:p-8 max-w-4xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Эцэг эх — Сурагч холбоос</h2>
        <p class="text-sm text-stone-400 mt-1">Олон-олон холбос удирдах</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary">Холбоос нэмэх</button>
    </div>

    <div v-if="showForm" class="card p-5 mb-6">
      <h3 class="text-sm font-semibold text-stone-700 mb-4">Эцэг эх — хүүхэд холбоос үүсгэх</h3>
      <form @submit.prevent="linkParent" class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[180px]">
          <label class="label">Эцэг эхийн userId</label>
          <input v-model="form.parentId" class="input-field" placeholder="userId..." required />
        </div>
        <div class="flex-1 min-w-[180px]">
          <label class="label">Сурагчийн studentId</label>
          <input v-model="form.studentId" class="input-field" placeholder="studentId..." required />
        </div>
        <button type="submit" :disabled="linking" class="btn-primary h-10 px-5">
          {{ linking ? '...' : 'Холбох' }}
        </button>
      </form>
      <p v-if="linkError" class="text-sm text-red-600 mt-2">{{ linkError }}</p>
    </div>

    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-stone-100">
        <h3 class="text-sm font-semibold text-stone-700">Холбоосууд</h3>
      </div>
      <div v-if="!links.length" class="px-5 py-8 text-center text-sm text-stone-400">Холбоос байхгүй</div>
      <div v-for="link in links" :key="link.SK" class="px-5 py-3 flex items-center justify-between border-b border-stone-50 last:border-0">
        <div class="flex items-center gap-4">
          <div class="text-sm">
            <span class="font-medium text-stone-700">Эцэг эх:</span>
            <code class="text-xs text-stone-500 ml-1">{{ link.parentId }}</code>
          </div>
          <svg class="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
          <div class="text-sm">
            <span class="font-medium text-stone-700">Сурагч:</span>
            <code class="text-xs text-stone-500 ml-1">{{ link.studentId }}</code>
          </div>
        </div>
        <button @click="removeLink(link)" class="text-xs text-red-500 hover:underline">Салгах</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { sget, spost, sdel } = useApi()

const links = ref<any[]>([])
const showForm = ref(false)
const linking = ref(false)
const linkError = ref('')
const form = reactive({ parentId: '', studentId: '' })

const linkParent = async () => {
  linking.value = true; linkError.value = ''
  try {
    const res: any = await spost(`/parents/${form.parentId}/students`, { studentId: form.studentId })
    links.value.push(res)
    form.parentId = ''; form.studentId = ''
    showForm.value = false
  } catch (e: any) {
    linkError.value = e?.data?.message ?? 'Алдаа гарлаа'
  } finally { linking.value = false }
}

const removeLink = async (link: any) => {
  if (!confirm('Холбоосыг салгах уу?')) return
  await sdel(`/parents/${link.parentId}/students/${link.studentId}`)
  links.value = links.value.filter(l => l.SK !== link.SK)
}

onMounted(async () => {
  // Load a sampling of recent links — in production add pagination/search
  try { links.value = [] } catch {}
})
</script>

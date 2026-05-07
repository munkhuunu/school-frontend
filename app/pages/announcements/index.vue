<template>
  <div class="p-6 lg:p-8 max-w-3xl">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="page-title">Мэдээллэгүүд</h2>
        <p class="text-sm text-stone-400 mt-1">Сургуулийн зар далдаан мэдээллэгүүд</p>
      </div>
      <button v-if="auth.canTeach" @click="showForm = !showForm" class="btn-primary">Нэмэх</button>
    </div>

    <div v-if="showForm && auth.canTeach" class="card p-5 mb-6">
      <form @submit.prevent="post" class="space-y-3">
        <div>
          <label class="label">Гарчиг</label>
          <input v-model="form.title" class="input-field" required placeholder="Ойр мэдээллэгээний гарчиг" />
        </div>
        <div>
          <label class="label">Хүлээн авагч</label>
          <select v-model="form.audience" class="select-field">
            <option value="ALL">Бүгд</option>
            <option value="TEACHER">Багш нар</option>
            <option value="STUDENT">Сурагчид</option>
            <option value="PARENT">Эцэг эхэд</option>
          </select>
        </div>
        <div>
          <label class="label">Дэлгэрэнгүй</label>
          <textarea v-model="form.content" class="input-field" rows="4" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="showForm = false" class="btn-secondary">Цуцлах</button>
          <button type="submit" :disabled="posting" class="btn-primary">{{ posting ? '...' : 'Нийтлэх' }}</button>
        </div>
      </form>
    </div>

    <!-- Audience filter -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="f in filters" :key="f.val"
        @click="activeFilter = f.val; loadAnnouncements()"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        :class="activeFilter === f.val ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-300'">
        {{ f.label }}
      </button>
    </div>

    <div class="space-y-3">
      <div v-if="!announcements.length" class="card p-8 text-center text-sm text-stone-400">Мэдээллэгүү байхгүй</div>
      <div v-for="a in announcements" :key="a.announcementId" class="card p-5">
        <div class="flex items-start justify-between gap-3 mb-2">
          <h3 class="font-semibold text-stone-800">{{ a.title }}</h3>
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium shrink-0"
            :class="audienceBadge(a.audience)">{{ audienceLabel(a.audience) }}</span>
        </div>
        <p class="text-sm text-stone-600 whitespace-pre-wrap">{{ a.content }}</p>
        <p class="text-xs text-stone-400 mt-3">{{ a.createdAt?.slice(0, 16).replace('T', ' ') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const { sget, spost } = useApi()

const announcements = ref<any[]>([])
const showForm = ref(false)
const posting = ref(false)
const activeFilter = ref('')
const form = reactive({ title: '', content: '', audience: 'ALL' })

const filters = [
  { val: '', label: 'Бүгд' },
  { val: 'TEACHER', label: 'Багш нар' },
  { val: 'STUDENT', label: 'Сурагчид' },
  { val: 'PARENT', label: 'Эцэг эхэд' },
]

const audienceBadge = (a: string) => ({ ALL: 'bg-stone-100 text-stone-600', TEACHER: 'bg-amber-50 text-amber-700', STUDENT: 'bg-sky-50 text-sky-700', PARENT: 'bg-teal-50 text-teal-700' }[a] ?? 'bg-stone-100 text-stone-600')
const audienceLabel = (a: string) => ({ ALL: 'Бүгд', TEACHER: 'Багш нар', STUDENT: 'Сурагчид', PARENT: 'Эцэг эхэд' }[a] ?? a)

const loadAnnouncements = async () => {
  const q = activeFilter.value ? `?audience=${activeFilter.value}` : ''
  announcements.value = (await sget(`/announcements${q}`) as any[]) ?? []
}

const post = async () => {
  posting.value = true
  try {
    const res: any = await spost('/announcements', { ...form })
    announcements.value.unshift(res)
    showForm.value = false
    form.title = ''; form.content = ''; form.audience = 'ALL'
  } finally { posting.value = false }
}

onMounted(loadAnnouncements)
</script>

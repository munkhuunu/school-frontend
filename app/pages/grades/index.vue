<template>
  <div class="p-6 lg:p-8 max-w-6xl">
    <h1 class="page-title mb-6">Дүн оруулах</h1>

    <div class="card p-5 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label class="label">Сургууль</label><select v-model="schoolId" @change="onSchool" class="select-field"><option value="">Сонгох...</option><option v-for="s in schools" :key="s.schoolId" :value="s.schoolId">{{ s.name }}</option></select></div>
        <div><label class="label">Анги</label><select v-model="classId" @change="onClass" class="select-field"><option value="">Сонгох...</option><option v-for="c in classes" :key="c.classId" :value="c.classId">{{ c.name }}</option></select></div>
        <div><label class="label">Хичээл</label><select v-model="subjectId" class="select-field"><option value="">Сонгох...</option><option v-for="s in subjects" :key="s.subjectId" :value="s.subjectId">{{ s.name }}</option></select></div>
      </div>
    </div>

    <div v-if="students.length && subjectId" class="card overflow-hidden">
      <table class="w-full">
        <thead><tr class="border-b border-stone-100">
          <th class="table-header w-12">#</th>
          <th class="table-header">Сурагч</th>
          <th class="table-header w-28">Оноо</th>
          <th class="table-header">Тайлбар</th>
          <th class="table-header w-24"></th>
        </tr></thead>
        <tbody>
          <tr v-for="(s, i) in students" :key="s.studentId" class="border-b border-stone-50 last:border-0">
            <td class="table-cell text-stone-400 font-mono text-xs">{{ i + 1 }}</td>
            <td class="table-cell font-medium text-stone-800">{{ s.lastName }} {{ s.firstName }}</td>
            <td class="table-cell"><input v-model.number="scores[s.studentId]" type="number" min="0" max="100" class="input-field !py-1.5 !px-3 text-center w-20" /></td>
            <td class="table-cell"><input v-model="comments[s.studentId]" class="input-field !py-1.5 !px-3" placeholder="..." /></td>
            <td class="table-cell"><button @click="save(s.studentId)" :disabled="scores[s.studentId] === undefined" class="text-xs text-emerald-600 hover:text-emerald-700 font-medium disabled:text-stone-300">Хадгалах</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="classId && !subjectId" class="empty-state"><p class="text-sm text-stone-400">Хичээл сонгоно уу</p></div>
    <div v-else-if="classId && subjectId && !students.length" class="empty-state"><p class="text-sm text-stone-400">Сурагч байхгүй</p></div>

    <div v-if="toast" class="toast">Дүн хадгалагдлаа!</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { get, post } = useApi()
const schools = ref<any[]>([]); const classes = ref<any[]>([]); const subjects = ref<any[]>([]); const students = ref<any[]>([])
const schoolId = ref(''); const classId = ref(''); const subjectId = ref('')
const scores = reactive<Record<string, number | undefined>>({}); const comments = reactive<Record<string, string>>({}); const toast = ref(false)

onMounted(async () => { try { schools.value = await get('/schools') as any[] } catch {} })
const onSchool = async () => { classId.value = ''; subjectId.value = ''; students.value = []; if (!schoolId.value) return; classes.value = await get(`/schools/${schoolId.value}/classes`) as any[]; subjects.value = await get(`/subjects?schoolId=${schoolId.value}`) as any[] }
const onClass = async () => { students.value = []; if (!classId.value) return; const r: any = await get(`/classes/${classId.value}/students`); students.value = r?.students ?? r ?? [] }
const save = async (sid: string) => {
  if (scores[sid] === undefined || !subjectId.value) return
  await post('/grades', { studentId: sid, subjectId: subjectId.value, classId: classId.value, score: scores[sid], comment: comments[sid] || null })
  toast.value = true; setTimeout(() => toast.value = false, 2000)
}
</script>

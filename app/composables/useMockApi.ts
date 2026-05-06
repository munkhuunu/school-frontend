const SCHOOL_ID = 'school-demo-1'

const schools = [
  { schoolId: SCHOOL_ID, name: 'МУ-ын 1-р Дунд Сургууль', address: 'УБ хот, Чингэлтэй дүүрэг', createdAt: '2024-01-15T00:00:00.000Z' },
]

const classes = [
  { classId: 'cls-1', name: '10А', grade: 10, schoolId: SCHOOL_ID },
  { classId: 'cls-2', name: '10Б', grade: 10, schoolId: SCHOOL_ID },
  { classId: 'cls-3', name: '11А', grade: 11, schoolId: SCHOOL_ID },
  { classId: 'cls-4', name: '11Б', grade: 11, schoolId: SCHOOL_ID },
  { classId: 'cls-5', name: '12А', grade: 12, schoolId: SCHOOL_ID },
]

const subjects = [
  { subjectId: 'sub-1', name: 'Математик', description: 'Алгебр, Геометр', schoolId: SCHOOL_ID },
  { subjectId: 'sub-2', name: 'Монгол хэл', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-3', name: 'Физик', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-4', name: 'Хими', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-5', name: 'Биологи', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-6', name: 'Англи хэл', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-7', name: 'Түүх', description: null, schoolId: SCHOOL_ID },
  { subjectId: 'sub-8', name: 'Газарзүй', description: null, schoolId: SCHOOL_ID },
]

const teachers = [
  { teacherId: 'tea-1', firstName: 'Батбаяр', lastName: 'Нямаа', email: 'batbayar@school.mn', phone: '99112233', schoolId: SCHOOL_ID, assignments: [{ classId: 'cls-1', subjectId: 'sub-1' }, { classId: 'cls-2', subjectId: 'sub-1' }] },
  { teacherId: 'tea-2', firstName: 'Дэлгэрмаа', lastName: 'Гантулга', email: 'delgermaa@school.mn', phone: '88223344', schoolId: SCHOOL_ID, assignments: [{ classId: 'cls-1', subjectId: 'sub-2' }, { classId: 'cls-3', subjectId: 'sub-2' }] },
  { teacherId: 'tea-3', firstName: 'Ганбаатар', lastName: 'Цэрэн', email: 'ganbaa@school.mn', phone: '99334455', schoolId: SCHOOL_ID, assignments: [{ classId: 'cls-3', subjectId: 'sub-3' }, { classId: 'cls-4', subjectId: 'sub-3' }] },
  { teacherId: 'tea-4', firstName: 'Уянга', lastName: 'Болд', email: 'uyanga@school.mn', phone: '88445566', schoolId: SCHOOL_ID, assignments: [{ classId: 'cls-4', subjectId: 'sub-6' }, { classId: 'cls-5', subjectId: 'sub-6' }] },
  { teacherId: 'tea-5', firstName: 'Энхтайван', lastName: 'Дорж', email: 'enkh@school.mn', phone: '99556677', schoolId: SCHOOL_ID, assignments: [{ classId: 'cls-5', subjectId: 'sub-4' }] },
]

const students = [
  { studentId: 'stu-1', firstName: 'Анхбаяр', lastName: 'Баатар', classId: 'cls-1', schoolId: SCHOOL_ID, email: 'ankh@gmail.com', phone: null },
  { studentId: 'stu-2', firstName: 'Болортуяа', lastName: 'Гомбо', classId: 'cls-1', schoolId: SCHOOL_ID, email: null, phone: '99001122' },
  { studentId: 'stu-3', firstName: 'Ганзориг', lastName: 'Дамба', classId: 'cls-1', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-4', firstName: 'Дөлгөөн', lastName: 'Эрдэнэ', classId: 'cls-2', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-5', firstName: 'Энхжаргал', lastName: 'Нэргүй', classId: 'cls-2', schoolId: SCHOOL_ID, email: 'enkhjargal@gmail.com', phone: null },
  { studentId: 'stu-6', firstName: 'Жаргал', lastName: 'Батсүх', classId: 'cls-3', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-7', firstName: 'Золбаяр', lastName: 'Цэнд', classId: 'cls-3', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-8', firstName: 'Идэрчулуун', lastName: 'Мөнх', classId: 'cls-4', schoolId: SCHOOL_ID, email: null, phone: '88112233' },
  { studentId: 'stu-9', firstName: 'Лхагва', lastName: 'Хурц', classId: 'cls-4', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-10', firstName: 'Мөнхбат', lastName: 'Содном', classId: 'cls-5', schoolId: SCHOOL_ID, email: 'munkhbat@gmail.com', phone: null },
  { studentId: 'stu-11', firstName: 'Нармандах', lastName: 'Очир', classId: 'cls-5', schoolId: SCHOOL_ID, email: null, phone: null },
  { studentId: 'stu-12', firstName: 'Оюунцэцэг', lastName: 'Пунсаг', classId: 'cls-1', schoolId: SCHOOL_ID, email: null, phone: null },
]

const assignments = [
  { assignmentId: 'asg-1', title: '1-р бүлгийн гэрийн даалгавар', type: 'HOMEWORK', classId: 'cls-1', subjectId: 'sub-1', maxScore: 10, dueDate: '2026-05-10', academicYear: '2025-2026', teacherId: 'tea-1', createdAt: '2026-05-01T00:00:00.000Z' },
  { assignmentId: 'asg-2', title: 'Хагас жилийн шалгалт', type: 'EXAM', classId: 'cls-1', subjectId: 'sub-1', maxScore: 100, dueDate: '2026-05-15', academicYear: '2025-2026', teacherId: 'tea-1', createdAt: '2026-05-02T00:00:00.000Z' },
  { assignmentId: 'asg-3', title: 'Дүрмийн бичгийн ажил', type: 'QUIZ', classId: 'cls-1', subjectId: 'sub-2', maxScore: 20, dueDate: '2026-05-08', academicYear: '2025-2026', teacherId: 'tea-2', createdAt: '2026-05-03T00:00:00.000Z' },
  { assignmentId: 'asg-4', title: 'Хими лабораторийн тайлан', type: 'PROJECT', classId: 'cls-5', subjectId: 'sub-4', maxScore: 50, dueDate: '2026-05-20', academicYear: '2025-2026', teacherId: 'tea-5', createdAt: '2026-05-04T00:00:00.000Z' },
  { assignmentId: 'asg-5', title: 'Физикийн жишиг бодлого', type: 'HOMEWORK', classId: 'cls-3', subjectId: 'sub-3', maxScore: 10, dueDate: '2026-05-07', academicYear: '2025-2026', teacherId: 'tea-3', createdAt: '2026-05-05T00:00:00.000Z' },
]

const grades = [
  { gradeId: 'gr-1', assignmentId: 'asg-1', studentId: 'stu-1', score: 9, maxScore: 10, subjectId: 'sub-1', status: 'GRADED', gradedAt: '2026-05-11T00:00:00.000Z' },
  { gradeId: 'gr-2', assignmentId: 'asg-1', studentId: 'stu-2', score: 7, maxScore: 10, subjectId: 'sub-1', status: 'GRADED', gradedAt: '2026-05-11T00:00:00.000Z' },
  { gradeId: 'gr-3', assignmentId: 'asg-2', studentId: 'stu-1', score: 88, maxScore: 100, subjectId: 'sub-1', status: 'GRADED', gradedAt: '2026-05-16T00:00:00.000Z' },
  { gradeId: 'gr-4', assignmentId: 'asg-2', studentId: 'stu-2', score: 72, maxScore: 100, subjectId: 'sub-1', status: 'GRADED', gradedAt: '2026-05-16T00:00:00.000Z' },
  { gradeId: 'gr-5', assignmentId: 'asg-3', studentId: 'stu-1', score: 18, maxScore: 20, subjectId: 'sub-2', status: 'GRADED', gradedAt: '2026-05-09T00:00:00.000Z' },
  { gradeId: 'gr-6', assignmentId: 'asg-3', studentId: 'stu-3', score: 15, maxScore: 20, subjectId: 'sub-2', status: 'GRADED', gradedAt: '2026-05-09T00:00:00.000Z' },
]

const announcements = [
  { announcementId: 'ann-1', title: 'Эцэг эхийн хурал', content: '2026 оны 5-р сарын 15-нд 18:00 цагт эцэг эхийн хурал болно. Бүх ангийн эцэг эхчүүдийг оролцохыг хүсэж байна.', audience: 'PARENT', authorRole: 'DIRECTOR', createdAt: '2026-05-01T08:00:00.000Z' },
  { announcementId: 'ann-2', title: 'Хагас жилийн шалгалтын хуваарь', content: '5-р сарын 15-20-нд хагас жилийн шалгалтууд болно. Хуваарийг анги удирдсан багшаасаа авна уу.', audience: 'ALL', authorRole: 'MANAGER', createdAt: '2026-05-02T09:00:00.000Z' },
  { announcementId: 'ann-3', title: 'Багш нарын арга зүйн хурал', content: '5-р сарын 10-нд 14:00 цагт багш нарын арга зүйн хурал болно. 301 тоот өрөөнд.', audience: 'TEACHER', authorRole: 'DIRECTOR', createdAt: '2026-05-03T10:00:00.000Z' },
  { announcementId: 'ann-4', title: 'Спортын баяр', content: '5-р сарын 25-нд сургуулийн спортын баяр болно. Бүх ангийн сурагчид оролцоно.', audience: 'ALL', authorRole: 'MANAGER', createdAt: '2026-05-04T11:00:00.000Z' },
]

const invitations = [
  { token: 'inv-tok-1', role: 'TEACHER', email: 'newteacher@school.mn', schoolId: SCHOOL_ID, expiresAt: '2026-05-13T00:00:00.000Z', createdAt: '2026-05-06T00:00:00.000Z' },
  { token: 'inv-tok-2', role: 'PARENT', email: null, schoolId: SCHOOL_ID, expiresAt: '2026-05-13T00:00:00.000Z', usedAt: '2026-05-05T00:00:00.000Z', createdAt: '2026-05-04T00:00:00.000Z' },
]

const parentLinks = [
  { parentId: 'par-user-1', studentId: 'stu-1', schoolId: SCHOOL_ID, SK: 'PS#par-user-1#stu-1', createdAt: '2024-09-10T00:00:00.000Z' },
  { parentId: 'par-user-1', studentId: 'stu-3', schoolId: SCHOOL_ID, SK: 'PS#par-user-1#stu-3', createdAt: '2024-09-10T00:00:00.000Z' },
  { parentId: 'par-user-2', studentId: 'stu-5', schoolId: SCHOOL_ID, SK: 'PS#par-user-2#stu-5', createdAt: '2024-09-10T00:00:00.000Z' },
]

const DEMO_USER = { userId: 'user-demo-1', email: 'demo@school.mn', role: 'DIRECTOR', schoolId: SCHOOL_ID }

const resolve = (path: string, method: string, body: any): any => {
  if (path.endsWith('/dashboard')) return { stats: { schools: 1, classes: 5, students: 12, teachers: 5, subjects: 8, todayAttendance: 10 }, recentGrades: grades.slice(0, 5) }
  if (path.match(/\/auth\/login$/)) return { token: 'mock-token-demo', user: DEMO_USER }
  if (path.match(/\/schools\/[^/]+\/classes$/)) return method === 'POST' ? { ...body, classId: 'cls-new', schoolId: SCHOOL_ID, createdAt: new Date().toISOString() } : classes
  if (path.match(/\/schools\/[^/]+\/subjects$/)) return method === 'POST' ? { ...body, subjectId: 'sub-new', schoolId: SCHOOL_ID, createdAt: new Date().toISOString() } : subjects
  if (path.match(/\/schools\/[^/]+\/teachers\/assign$/)) return { message: 'Assigned' }
  if (path.match(/\/schools\/[^/]+\/teachers$/)) return method === 'POST' ? { ...body, teacherId: 'tea-new', assignments: [], createdAt: new Date().toISOString() } : teachers
  if (path.match(/\/schools\/[^/]+\/students\/[^/]+\/grades$/)) return grades
  if (path.match(/\/schools\/[^/]+\/students\/[^/]+\/parents$/)) return parentLinks
  if (path.match(/\/schools\/[^/]+\/students\/[^/]+$/)) return students[0]
  if (path.match(/\/schools\/[^/]+\/students$/)) return method === 'POST' ? { ...body, studentId: 'stu-new', schoolId: SCHOOL_ID, createdAt: new Date().toISOString() } : students
  if (path.match(/\/schools\/[^/]+\/assignments\/[^/]+\/grades$/)) return method === 'POST' ? { ...body, gradeId: 'gr-new', status: 'GRADED', createdAt: new Date().toISOString() } : grades.slice(0, 3)
  if (path.match(/\/schools\/[^/]+\/assignments\/[^/]+$/)) return method === 'PUT' ? { message: 'Updated' } : assignments[0]
  if (path.match(/\/schools\/[^/]+\/assignments$/)) return method === 'POST' ? { ...body, assignmentId: 'asg-new', createdAt: new Date().toISOString() } : assignments
  if (path.match(/\/schools\/[^/]+\/announcements/)) return method === 'POST' ? { ...body, announcementId: 'ann-new', createdAt: new Date().toISOString() } : announcements
  if (path.match(/\/schools\/[^/]+\/invitations\/[^/]+$/)) return { message: 'Revoked' }
  if (path.match(/\/schools\/[^/]+\/invitations$/)) return method === 'POST' ? { ...body, token: 'inv-' + Math.random().toString(36).slice(2), schoolId: SCHOOL_ID, expiresAt: new Date(Date.now() + 7*86400000).toISOString(), createdAt: new Date().toISOString() } : invitations
  if (path.match(/\/schools\/[^/]+\/parents\/[^/]+\/students\/[^/]+$/)) return null
  if (path.match(/\/schools\/[^/]+\/parents\/[^/]+\/students$/)) return method === 'POST' ? { parentId: body.parentId, studentId: body.studentId, SK: `PS#${body.parentId}#${body.studentId}`, createdAt: new Date().toISOString() } : parentLinks
  if (path.match(/\/schools\/[^/]+$/)) return schools[0]
  if (path.match(/\/schools$/)) return method === 'POST' ? { ...body, schoolId: 'school-new', createdAt: new Date().toISOString() } : schools
  return []
}

export const useMockApi = () => {
  const wait = () => new Promise(r => setTimeout(r, 120))
  const call = async (path: string, method = 'GET', body: any = null) => { await wait(); return resolve(path, method, body) }
  const get = (path: string) => call(path, 'GET')
  const post = (path: string, body: any) => call(path, 'POST', body)
  const put = (path: string, body: any) => call(path, 'PUT', body)
  const del = (path: string) => call(path, 'DELETE')
  const sid = SCHOOL_ID
  const sget = (path: string) => get(`/schools/${sid}${path}`)
  const spost = (path: string, body: any) => post(`/schools/${sid}${path}`, body)
  const sput = (path: string, body: any) => put(`/schools/${sid}${path}`, body)
  const sdel = (path: string) => del(`/schools/${sid}${path}`)
  const schoolId = () => sid
  return { get, post, put, del, sget, spost, sput, sdel, schoolId }
}

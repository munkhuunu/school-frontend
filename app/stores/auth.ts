import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as { userId: string; email: string; role: string; schoolId: string | null } | null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    role: (s) => s.user?.role ?? null,
    schoolId: (s) => s.user?.schoolId ?? null,
    isSuperAdmin: (s) => s.user?.role === 'SUPER_ADMIN',
    isDirector: (s) => s.user?.role === 'DIRECTOR',
    isManager: (s) => s.user?.role === 'MANAGER',
    isTeacher: (s) => s.user?.role === 'TEACHER',
    isStudent: (s) => s.user?.role === 'STUDENT',
    isParent: (s) => s.user?.role === 'PARENT',
    canManage: (s) => ['SUPER_ADMIN', 'DIRECTOR', 'MANAGER'].includes(s.user?.role ?? ''),
    canTeach: (s) => ['SUPER_ADMIN', 'DIRECTOR', 'MANAGER', 'TEACHER'].includes(s.user?.role ?? ''),
    roleLabel: (s) => ({
      SUPER_ADMIN: 'Супер Админ', DIRECTOR: 'Захирал', MANAGER: 'Менежер',
      TEACHER: 'Багш', STUDENT: 'Сурагч', PARENT: 'Эцэг эх',
    }[s.user?.role ?? ''] ?? s.user?.role ?? ''),
  },
  actions: {
    async login(email: string, password: string) {
      const { post } = useApi()
      const res: any = await post('/auth/login', { email, password })
      this.token = res.token
      this.user = res.user
      useCookie('token', { maxAge: 86400 }).value = res.token
      useCookie('user', { maxAge: 86400 }).value = JSON.stringify(res.user)
    },
    async register(email: string, password: string, inviteToken: string) {
      const { post } = useApi()
      return await post('/auth/register', { email, password, inviteToken })
    },
    async registerSuperAdmin(email: string, password: string) {
      const { post } = useApi()
      return await post('/auth/register', { email, password, role: 'SUPER_ADMIN' })
    },
    logout() {
      this.token = null
      this.user = null
      useCookie('token').value = null
      useCookie('user').value = null
      navigateTo('/login')
    },
    init() {
      this.token = useCookie('token').value ?? null
      const u = useCookie('user').value
      if (u) {
        try { this.user = typeof u === 'string' ? JSON.parse(u) : u } catch { this.user = null }
      }
    },
  },
})

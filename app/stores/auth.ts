import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface AuthUser {
  userId: string
  email: string
  role: string
  schoolId: string | null
}

const COOKIE_OPTS = {
  maxAge: 86400,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
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
      // ✅ FIX: useCookie нь автомат encode хийдэг — гараар JSON.stringify хийхгүй
      useCookie<string>('token', COOKIE_OPTS).value = res.token
      useCookie<AuthUser>('user', COOKIE_OPTS).value = res.user
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
      useCookie('token', COOKIE_OPTS).value = null
      useCookie('user', COOKIE_OPTS).value = null
      navigateTo('/login')
    },
    init() {
      this.token = useCookie<string | null>('token').value ?? null
      // ✅ FIX: cookie нь шууд object буцаана (string ч хатуу JSON.parse шаардлагагүй)
      const u = useCookie<AuthUser | string | null>('user').value
      if (u) {
        if (typeof u === 'string') {
          try { this.user = JSON.parse(u) } catch { this.user = null }
        } else {
          this.user = u
        }
      }
    },
  },
})

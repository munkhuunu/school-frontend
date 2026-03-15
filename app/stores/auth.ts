import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    role: (state) => state.user?.role ?? null,
    isDirector: (state) => state.user?.role === 'DIRECTOR',
    isManager: (state) => state.user?.role === 'MANAGER',
    isTeacher: (state) => state.user?.role === 'TEACHER',
    isParent: (state) => state.user?.role === 'PARENT',
    isStudent: (state) => state.user?.role === 'STUDENT',
    canManage: (state) => ['DIRECTOR', 'MANAGER'].includes(state.user?.role),
  },

  actions: {
    async login(email: string, password: string) {
      const { post } = useApi()
      const res: any = await post('/auth/login', { email, password })
      this.token = res.token
      this.user = res.user
      useCookie('token', { maxAge: 60 * 60 * 24 }).value = res.token
      useCookie('user', { maxAge: 60 * 60 * 24 }).value = JSON.stringify(res.user)
    },

    async register(email: string, password: string, role: string) {
      const { post } = useApi()
      return await post('/auth/register', { email, password, role })
    },

    logout() {
      this.token = null
      this.user = null
      useCookie('token').value = null
      useCookie('user').value = null
      navigateTo('/login')
    },

    init() {
      const tokenCookie = useCookie('token')
      const userCookie = useCookie('user')
      this.token = tokenCookie.value ?? null
      if (userCookie.value) {
        try {
          this.user = typeof userCookie.value === 'string'
            ? JSON.parse(userCookie.value)
            : userCookie.value
        } catch { this.user = null }
      }
    }
  }
})

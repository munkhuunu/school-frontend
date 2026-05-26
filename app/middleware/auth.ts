export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  // ✅ FIX: middleware app.vue setup-аас өмнө ажиллах магадлалтай тул idempotent init
  if (!auth.token) auth.init()

  const publicRoutes = ['/login', '/register']
  const isInvitePage = to.path.startsWith('/invite/')

  if (!auth.isLoggedIn && !publicRoutes.includes(to.path) && !isInvitePage) {
    return navigateTo('/login')
  }
  if (auth.isLoggedIn && publicRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})

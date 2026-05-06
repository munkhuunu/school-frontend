export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.init()
  const publicRoutes = ['/login', '/register']
  const isInvitePage = to.path.startsWith('/invite/')
  if (!auth.isLoggedIn && !publicRoutes.includes(to.path) && !isInvitePage) {
    return navigateTo('/login')
  }
  if (auth.isLoggedIn && publicRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  const pub = ['/login', '/register']
  if (!token.value && !pub.includes(to.path)) return navigateTo('/login')
  if (token.value && pub.includes(to.path)) return navigateTo('/dashboard')
})

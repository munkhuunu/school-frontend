export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const schoolId = () => {
    try {
      const u = useCookie('user').value
      const user = typeof u === 'string' ? JSON.parse(u) : u
      return user?.schoolId ?? null
    } catch { return null }
  }

  const h = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    return headers
  }

  const onErr = ({ response }: any) => {
    if (response?.status === 401) navigateTo('/login')
  }

  const base = config.public.apiBase

  const get = (path: string) => $fetch(`${base}${path}`, { headers: h(), onResponseError: onErr })
  const post = (path: string, body: any) => $fetch(`${base}${path}`, { method: 'POST', headers: h(), body, onResponseError: onErr })
  const put = (path: string, body: any) => $fetch(`${base}${path}`, { method: 'PUT', headers: h(), body, onResponseError: onErr })
  const del = (path: string) => $fetch(`${base}${path}`, { method: 'DELETE', headers: h(), onResponseError: onErr })

  const sid = schoolId()
  const sget = (path: string) => get(`/schools/${sid}${path}`)
  const spost = (path: string, body: any) => post(`/schools/${sid}${path}`, body)
  const sput = (path: string, body: any) => put(`/schools/${sid}${path}`, body)
  const sdel = (path: string) => del(`/schools/${sid}${path}`)

  return { get, post, put, del, sget, spost, sput, sdel, schoolId }
}

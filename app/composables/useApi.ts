export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')
  // ✅ FIX: useCookie нь автомат JSON encode/decode хийдэг — гараар stringify хийх хэрэггүй
  const userCookie = useCookie<{ schoolId?: string | null } | null>('user')

  const schoolId = computed<string | null>(() => userCookie.value?.schoolId ?? null)

  const h = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    return headers
  }

  const onErr = ({ response }: any) => {
    if (response?.status === 401) navigateTo('/login')
  }

  const base = config.public.apiBase

  const get  = (path: string)            => $fetch(`${base}${path}`, { headers: h(), onResponseError: onErr })
  const post = (path: string, body: any) => $fetch(`${base}${path}`, { method: 'POST',   headers: h(), body, onResponseError: onErr })
  const put  = (path: string, body: any) => $fetch(`${base}${path}`, { method: 'PUT',    headers: h(), body, onResponseError: onErr })
  const del  = (path: string)            => $fetch(`${base}${path}`, { method: 'DELETE', headers: h(), onResponseError: onErr })

  // ✅ FIX: schoolId null үед буруу URL үүсгэхгүй
  const ensureSchool = (): string => {
    if (!schoolId.value) {
      throw new Error('Та сургуульд харьяалагдаагүй байна. SUPER_ADMIN бол сургууль сонгох шаардлагатай.')
    }
    return schoolId.value
  }

  const sget  = (path: string)            => get(`/schools/${ensureSchool()}${path}`)
  const spost = (path: string, body: any) => post(`/schools/${ensureSchool()}${path}`, body)
  const sput  = (path: string, body: any) => put(`/schools/${ensureSchool()}${path}`, body)
  const sdel  = (path: string)            => del(`/schools/${ensureSchool()}${path}`)

  return { get, post, put, del, sget, spost, sput, sdel, schoolId }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const h = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    return headers
  }

  const onErr = ({ response }: any) => { if (response.status === 401) navigateTo('/login') }

  const get = (path: string) => $fetch(`${config.public.apiBase}${path}`, { headers: h(), onResponseError: onErr })
  const post = (path: string, body: any) => $fetch(`${config.public.apiBase}${path}`, { method: 'POST', headers: h(), body, onResponseError: onErr })
  const put = (path: string, body: any) => $fetch(`${config.public.apiBase}${path}`, { method: 'PUT', headers: h(), body, onResponseError: onErr })
  const del = (path: string) => $fetch(`${config.public.apiBase}${path}`, { method: 'DELETE', headers: h(), onResponseError: onErr })

  return { get, post, put, del }
}

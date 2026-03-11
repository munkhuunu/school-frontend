export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const getHeaders = (): Record<string, string> => {
    if (token.value) {
      return { Authorization: `Bearer ${token.value}` }
    }
    return {}
  }

  const get = async (path: string) => {
    return await $fetch(`${config.public.apiBase}${path}`, {
      headers: getHeaders(),
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      }
    })
  }

  const post = async (path: string, body: any) => {
    return await $fetch(`${config.public.apiBase}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body,
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      }
    })
  }

  const put = async (path: string, body: any) => {
    return await $fetch(`${config.public.apiBase}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body,
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      }
    })
  }

  const del = async (path: string) => {
    return await $fetch(`${config.public.apiBase}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
      onResponseError({ response }) {
        if (response.status === 401) navigateTo('/login')
      }
    })
  }

  return { get, post, put, del }
}
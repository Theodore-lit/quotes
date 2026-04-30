import api from '@/api/axios.config.js'

export async function apiFetch(url, options = {}) {
  const {
    method = 'get',
    headers = {},
    body,
    params,
  } = options

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const finalHeaders = { ...headers }

  // Equivalent au wrapper fetch précédent
  if (!isFormData && body !== undefined && !finalHeaders['Content-Type'] && !finalHeaders['content-type']) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  const res = await api.request({
    url,
    method,
    headers: finalHeaders,
    params,
    data: body,
  })

  return res.data
}


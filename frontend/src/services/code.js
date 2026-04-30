import api from '@/api/axios.config.js'

export async function createCode({ email, code }) {
  const res = await api.post('/code/create', { email, code })
  return res.data?.data ?? res.data
}

export async function verifyCode({ email, code }) {
  const res = await api.post('/code/verify', { email, code })
  return res.data
}


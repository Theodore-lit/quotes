import api from '@/api/axios.config.js'

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  // backend returns: { token, user }
  return res.data
}

export async function register(formData) {
  const res = await api.post('/auth/register', formData)
  return res.data
}

export async function getProfile(userId) {
  const res = await api.get(`/auth/profil/${userId}`)
  return res.data
}


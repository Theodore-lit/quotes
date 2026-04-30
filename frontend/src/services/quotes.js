import api from '@/api/axios.config.js'

export async function listQuotes({ page, limit, search, tags } = {}) {
  const res = await api.get('/quotes', {
    params: {
      page,
      limit,
      search,
      tags,
    },
  })
  // backend: { data: quotes.items }
  return res.data.data ?? res.data
}

export async function listTags() {
  const res = await api.get('/quotes/tags')
  return res.data.data ?? res.data
}

export async function getQuoteById(id) {
  const res = await api.get(`/quotes/${id}`)
  // backend: { data: article }
  return res.data.data ?? res.data
}

export async function userQuotes(userId) {
  const res = await api.get(`/quotes/userQuotes/${userId}`)
  // backend: quotes array
  return res.data
}

export async function userBookmarks(userId) {
  const res = await api.get(`/quotes/bookMark/${userId}`)
  // backend: quotes array
  return res.data
}

export async function createQuote(formData) {
  const res = await api.post('/quotes', formData)
  return res.data.data ?? res.data
}

export async function updateQuote(id, formData) {
  const res = await api.patch(`/quotes/${id}`, formData)
  return res.data.data ?? res.data
}

export async function deleteQuote(id) {
  await api.delete(`/quotes/${id}`)
}


import api from '@/api/axios.config.js'

export async function listComments({ page, limit, quoteId } = {}) {
  const res = await api.get('/comments', {
    params: {
      page,
      limit,
      quoteId,
    },
  })
  // backend: { items: [...] } (selon ton implémentation service)
  return res.data
}

export async function getCommentById(id) {
  const res = await api.get(`/comments/${id}`)
  return res.data
}

export async function createComment(payload) {
  const res = await api.post('/comments', payload)
  return res.data
}

export async function updateComment(id, payload) {
  const res = await api.patch(`/comments/${id}`, payload)
  return res.data
}

export async function deleteComment(id) {
  await api.delete(`/comments/${id}`)
}


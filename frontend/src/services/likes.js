import api from '@/api/axios.config.js'

export async function getLikesForQuote({ userId, quoteId }) {
  const res = await api.get('/likes', {
    params: {
      userId,
      quoteId,
    },
  })
  return res.data
}

export async function likeQuote({ user, quote }) {
  const res = await api.post('/likes', { user, quote })
  return res.data
}

export async function unlikeLike(likeId) {
  await api.delete(`/likes/${likeId}`)
}

export async function getLikesForComment({ userId, commentId }) {
  const res = await api.get('/likes/comment', {
    params: {
      userId,
      commentId,
    },
  })
  return res.data
}

export async function likeComment({ user, comment }) {
  const res = await api.post('/likes/comment', { user, comment })
  return res.data
}
export async function unLikeComment(likeId) {
 await api.delete(`/likes/comment/${likeId}`)
}



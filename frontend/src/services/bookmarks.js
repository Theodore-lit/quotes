import api from '@/api/axios.config.js'

export async function getBookmarksForQuote({ userId, quoteId }) {
  const res = await api.get('/bookmarks', {
    params: {
      userId,
      quoteId,
    },
  })
  return res.data
}

export async function createBookmark({ user, quote }) {
  const res = await api.post('/bookmarks', { user, quote })
  return res.data
}

export async function deleteBookmark(bookmarkId) {
  await api.delete(`/bookmarks/${bookmarkId}`)
}


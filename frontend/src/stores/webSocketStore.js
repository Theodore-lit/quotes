import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'
export const useWebSocketStore = defineStore('webSocket', () => {
  const quotes = ref([])
  const userQuotes = ref([])
  const comments = ref([])
  const likes = ref([])
  const bookmarksForQuote = ref([])
  const socket = ref(null)

  // Initialisation des écouteurs globaux
  const initSocket = () => {
    // Si déjà connecté, on ne fait rien
    if (socket.value?.connected) return

    // On crée la connexion seulement quand on appelle initSocket
    socket.value = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'], // FORCE le mode WebSocket (évite l'erreur 400 polling)
      upgrade: false,
      // reconnectionAttempts: 5,
    })

    socket.value.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.io !')
    })

    // Citations
    socket.value.on('initial_quotes', (data) => {
      quotes.value = data.items || data // On remplit le store avec tout le contenu de la base
    })

socket.value.on('quote_of_user', (data) => {
      userQuotes.value = data 
    })

    socket.value.on('quote_created', (newQuote) => {
      if (!quotes.value.some((q) => q._id === newQuote._id)) {
        quotes.value.unshift(newQuote)
      }
    })

    socket.value.on('quote_updated', (updatedQuote) => {
      const index = quotes.value.findIndex((q) => q._id === updatedQuote._id)
      if (index !== -1) quotes.value[index] = updatedQuote
    })

    socket.value.on('quote_deleted', (id) => {
      quotes.value = quotes.value.filter((q) => q._id !== id)
    })

    // Commentaires
    socket.value.on('initial_comments', (data) => {
      console.log("Commentaires initiaux reçus via WebSocket:", data)
      comments.value = data.items // On remplit le store avec tout le contenu de la base
    })

    socket.value.on('comment_created', (newComment) => {
      console.log(" commentaires reçu via WebSocket:", comments.value)
      const index = quotes.value.findIndex((q) => q._id === newComment.quote)
      const updatedQuote = { ...quotes.value[index] }
      comments.value.push(newComment);
      if (index !== -1) {
        if (!updatedQuote.commentsCount) updatedQuote.commentsCount = []
        if (!updatedQuote.commentsCount.includes(newComment._id)) {
          updatedQuote.commentsCount.push(newComment._id)
        }
        quotes.value[index] = updatedQuote
        if (!comments.value) comments.value = []
        if (!comments.value.some((c) => {if(c._id){ return c._id === newComment._id }})) {
          comments.value.push(newComment)
        }
      }
    })

    socket.value.on('comment_updated', (updatedComment) => {
      const index = comments.value.findIndex((c) => c._id === updatedComment._id)
      if (index !== -1) comments.value[index] = updatedComment
    })

    socket.value.on('comment_deleted', (id) => {
      const index = quotes.value.findIndex((q) => q.commentsCount?.includes(id))
      const updatedQuote = { ...quotes.value[index] }
      if (index !== -1) {
        updatedQuote.commentsCount = updatedQuote.commentsCount.filter(
          (commentId) => commentId !== id,
        )
        quotes.value[index] = updatedQuote
        comments.value = comments.value.filter((c) => c._id !== id)
      }
    })

    // Interractions pour les citations
    socket.value.on('initial_likes', (data) => {
      likes.value = data // On remplit le store avec tout le contenu de la base
    })
        
    socket.value.on('like_quote_created', (newLike) => {
      // 1. Mise à jour de la liste de référence

      likes.value.unshift(newLike)
      // 2. Mise à jour de la citation dans la liste (pour le compteur visuel)
      const index = quotes.value.findIndex((q) => q._id === newLike.quote)
      if (index !== -1) {
        if (!quotes.value[index].likesCount) quotes.value[index].likesCount = []
        if (!quotes.value[index].likesCount.some((l) => l._id === newLike._id)) { 

          quotes.value[index].likesCount.push(newLike)
        }
      }
    })

    socket.value.on('like_quote_deleted', (id) => {
      likes.value = likes.value.filter((l) => l._id !== id)
      const index = quotes.value.findIndex((q) => q.likesCount?.some((l) => l._id === id))
      if (index !== -1) {
        quotes.value[index].likesCount = quotes.value[index].likesCount.filter(
          (l)=> l._id !== id
        )
      }
    })

    // Interractions pour les commentaires
    socket.value.on('like_comment_created', (newLike) => {
      // 1. Mise à jour de la liste de référence
      console.log(comments.value)
      likes.value.unshift(newLike)

      // 2. Mise à jour de la citation dans la liste (pour le compteur visuel)
      const index = comments.value.findIndex((q) => q._id === newLike.comment)
      console.log("Commentaire trouvé pour le like:", comments.value) 
      if (index !== -1) {
        console.log("Index trouvé :", index)
        if (!comments.value[index].likesCount) comments.value[index].likesCount = []
        if (!comments.value[index].likesCount.some((l) => l._id === newLike._id)) {
          comments.value[index].likesCount.push(newLike);
        }
      }
    })

    socket.value.on('like_comment_deleted', (id) => {
      likes.value = likes.value.filter((l) => l._id !== id)
      const index = comments.value.findIndex((q) => q.likesCount?.some((l) => l._id === id))
      if (index !== -1) {
        comments.value[index].likesCount = comments.value[index].likesCount.filter(
          (l) => l._id !== id,
        )
      }
    })

    // Interractions pour les marque-pages
    socket.value.on('initial_bookmarks_for_quote', (data) => {
      bookmarksForQuote.value = data // On remplit le store avec tout le contenu de la base
    })
    socket.value.on('bookmark_quote_created', (newBookmark) => {
      const index = quotes.value.findIndex((q) => q._id === newBookmark.quote)
      if (index !== -1) {
        if (!quotes.value[index].bookmarksCount) quotes.value[index].bookmarksCount = []
        if (!quotes.value[index].bookmarksCount.some((l) => l._id === newBookmark._id)) { 

          quotes.value[index].bookmarksCount.push(newBookmark)
        }
      }
      // bookmarksForQuote.value.unshift(newBookmarkForQuote)
    })

    socket.value.on('bookmark_quote_deleted', (id) => {
      const index = quotes.value.findIndex((q) => q.commentsCount?.includes(id))
      const updatedQuote = { ...quotes.value[index] }
      if (index !== -1) {
        updatedQuote.bookmarksCount = updatedQuote.bookmarksCount.filter(
          (commentId) => commentId !== id,
        )
        quotes.value[index] = updatedQuote
      }
      // bookmarksForQuote.value = bookmarksForQuote.value.filter((b) => b._id !== id)
    })
  }

  return { quotes, comments, likes, bookmarksForQuote, initSocket }
})

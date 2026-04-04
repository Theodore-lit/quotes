import { defineStore } from 'pinia'

export const useEditStore = defineStore('edit', {
  state: () => ({
    edit: null
  }),

  actions: {
    toEdit(quote) {
      this.edit = quote
    },
    reset() {
      this.edit = null
    },
  },
})

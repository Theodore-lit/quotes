<script setup>
const props = defineProps({
  quote: Object,
})
</script>

<template>
    <div class="bg-gray-100">
      <div class="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl">
          <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{ props.quote.author.username }}
              </h3>
              <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p class="font-medium text-indigo-600">
                  {{timeAgo(props.quote.createdAt) }}
                </p>
                <div class="mt-3 text-sm text-gray-700">
                  <p>{{ props.quote.text }}</p>
                </div>
              </div>

              <!-- Section Boutons -->
              <div class="mt-6 flex items-center gap-6 border-t border-gray-100 pt-4">
                <!-- Coeur (Like) -->
                <button
                  class="group flex items-center text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <span>{{ props.quote.likesCount.length }}</span>
                </button>

                <!-- Commentaire -->
                <button
                  class="group flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.32 21l3.364-1.121c1.332.242 2.733.371 4.316.371Z"
                    />
                  </svg>
                  {{ props.quote.commentsCount.length }}
                </button>

                <!-- Favoris (Bookmark) -->
                <button
                  class="group flex items-center text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                </button>
              </div>
              <!-- Fin Section Boutons -->
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped></style>

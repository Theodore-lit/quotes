<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { useEditStore } from '@/stores/edit'
import { jwtDecode } from 'jwt-decode'
import MyQuotesView from './MyQuotesView.vue'
import { toLowerCase } from 'zod'
import FileUpload from 'primevue/fileupload'
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notifications.js';
import { createQuote, updateQuote } from '@/services/quotes'
const reloadQuotes = ref(null);

// État du formulaire
const text = ref('')
const image = ref('')
const tagInput = ref('')
const tags = ref([])
const router = useRouter()
const loginStore = useLoginStore()
const editStore = useEditStore()
const curImage = ref(null)

const fillForm = () => {
  if (editStore.edit) {
    text.value = editStore.edit.text
    if (editStore.edit.tags) {
      tags.value = [...editStore.edit.tags]
    }
    image.value = editStore.edit.image || ''
  }
}
watch(
  () => editStore.edit,
  (newEdit) => fillForm()
)


// Récupération de l'ID utilisateur via le token
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null

// Ajouter un tag à la liste
const addTag = () => {
  const val = tagInput.value.trim().toLocaleLowerCase()
  if (val && !tags.value.includes(val)) {
    tags.value.push(val)
    tagInput.value = ''
  }
}

// Retirer un tag
const removeTag = (index) => tags.value.splice(index, 1)

async function send() {
  if (editStore.edit) {
    await edit()
  } else {
    await sendQuote()
  }
}

function reset() {
  text.value = ''
  image.value = ''
  tags.value = []
  editStore.reset()
}

async function edit() {
  try {
    if (!text.value.trim() || text.value.length < 10) {
      return notifyWarning('Le texte doit faire au moins 10 caractères.')
    }
    const formData = new FormData()
    formData.append('text', text.value)
    if (image.value) {
      formData.append('image', image.value)
    }
    if (tags.value.length > 1) {
      formData.append('tags', tags.value.join(','))
    }

    await updateQuote(editStore.edit._id, formData)
    text.value = ''
    image.value = ''
    tags.value = []
    editStore.reset()
    notifySuccess("Modifier avec success")
    reloadQuotes.value = true;
  } catch (error) {
    notifyWarning('Le texte doit faire au moins 10 caractères.')
  }
  reloadQuotes.value = false;
}

async function sendQuote() {
  try {
    if (!text.value.trim() || text.value.length < 10) {
      return notifyWarning('Le texte doit faire au moins 10 caractères.')
    }
    const formData = new FormData()
    formData.append('text', text.value)
    if (image.value) {
      formData.append('image', image.value)
    }
    if (tags.value.length > 0) {
      formData.append('tags', tags.value.join(','))
    }
    formData.append('author', decoded?.sub)

    await createQuote(formData)
    notifySuccess("Citation ajouté avec success")
    reloadQuotes.value = true;
  } catch (error) {
    notifyWarning('Le texte doit faire au moins 10 caractères.')
  }
  reloadQuotes.value = false;
}

const handleFileUpload = (event) => {
  image.value = event.files[0]
  curImage.value = event.files[0].objectURL
}
onMounted(
  fillForm
)

</script>

<template>
  <div class=" min-h-screen py-12 px-4">
    <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
      <div class="bg-white shadow sm:rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Créer une citation</h2>

        <form @submit.prevent="send" class="space-y-6" enctype="multipart/form-data">
          <!-- Champ Texte -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Votre citation </label>
            <textarea v-model="text" rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              placeholder="Écrivez quelque chose d'inspirant..." required></textarea>
          </div>


          <!-- Champ Image (URL) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">URL de l'image (optionnel)</label>
            <!-- <input type="file" v-on:change="handleFileUpload" accept="image/*"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              placeholder="Charger une image(optionel)" /> -->
            <FileUpload mode="basic" name="image" url="/api/uploads" accept="image/*" :maxFileSize="1000000"
              @select="handleFileUpload" chooseLabel="Ajouter une image" class="p-button-sm p-button-outlined mt-2" />
          </div>

          <div class="relative">
            <img v-if="image" :src="curImage" class="w-full h-100 object-cover border border-gray-300" />
          </div>

          <!-- Section Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Tags: <span
                class="text-gray-400 text-sm font-light">thèmes abordés</span></label>
            <div class="mt-1 flex gap-2">
              <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text"
                class="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border p-2"
                placeholder="Appuyez sur Entrée pour ajouter" />
              <button @click.prevent="addTag" type="button"
                class="cursor-pointer bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                Ajouter
              </button>
            </div>
            <!-- Liste des tags -->
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="(tag, index) in tags" :key="index"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                #{{ tag }}
                <button @click="removeTag(index)" type="button" class="font-bold hover:text-red-500">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Boutons Actions -->
          <div class="flex justify-end gap-4 pt-4 border-t">
            <button @click="reset" type="button"
              class="cursor-pointer text-gray-600 hover:text-gray-800 text-sm font-medium">
              Annuler
            </button>
            <button type="submit"
              class="cursor-pointer inline-flex justify-center rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {{ editStore.edit ? 'Modifier la citation' : 'Publier la citation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <MyQuotesView :reload="reloadQuotes" />
  </div>
</template>

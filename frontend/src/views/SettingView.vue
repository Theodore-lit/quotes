<script setup>
import userService from '@/services/user.js'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import OPTmodal from '@/ui/OPTmodal.vue'
import router from '@/router'
import { confirmEdit, notifyError, notifySuccess, notifyWarning } from '@/utils/notifications'
import { createCode } from '@/services/code'
const editPwd = ref(null)
const editUser = ref(null)
const updateType = ref(null)
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const confirm = ref(null)
const badpwd = ref(null)
const curImage = ref(null)
const toUpdate = ref(null)

// États réactifs (simulant les données de ton utilisateur MongoDB)
const user = ref({
  username: '',
  bio: '',
  avatar: null,
})

const reset = () => {
  editPwd.value = null
  editUser.value = null
  updateType.value = null
  confirm.value = null
  badpwd.value = null
  curImage.value = null
  toUpdate.value = null
  router.push('/settings')
  user.username = null;
  user.bio = null;
  user.avatar = null;
  
}



const passwordData = ref({
  current: '',
  new: '',
  confirm: '',
})
const onUpload = (event) => {
  // Logique pour envoyer l'image à ton dossier /uploads (Multer)
  user.value.avatar = event.files[0]
  curImage.value = event.files[0].objectURL
}

const loading = ref(false)

// Fonctions pour les appels API (Backend)
function updateProfile() {
    loading.value = true
    const formData = new FormData()
    // confirmation des entrées de l'utilisateur
    if ( passwordData.value.new && passwordData.value.new !== passwordData.value.confirm) {
      badpwd.value = true
      return
    }
    if ( passwordData.value.new && passwordData.value.current == passwordData.value.confirm) {
      notifyError('Vous utilisez ce mot de passe sur plusieurs plateforme')
      return
    }

    if (passwordData.value.current) {
        formData.append('current', passwordData.value.current)
      }
      if (passwordData.value.confirm) {
        formData.append('passwordHash', passwordData.value.confirm)
      }
    // Modification des informations de l'utilisateur
    if (user.value.username) {
      formData.append('username', user.value.username)
    }
    if (user.value.bio) {
      formData.append('bio', user.value.bio)
    }
    if (user.value.avatar) {
      formData.append('avatar', user.value.avatar)
    }
    userService.updateProfile(decoded?.sub, formData).then((response) => {
      setTimeout(() => {
      loading.value = false
    }, 1000)
    notifySuccess('Modification réussi')
    reset();
    }).catch((error) => {
      notifyError('Modification échoué', error)
    })
}

async function askModification(msg, type) {
  try {
    const ok = await confirmEdit(msg)
    if (!ok) return
    confirm.value = true
    updateType.value = type
    await createCode({
      email: decoded?.email,
      code: Math.floor(100000 + Math.random() * 900000),
    })
  } catch (error) {
    notifyWarning('Partientez un moment avant de faire une nouvelle demande')
    console.error(error)
  }
}

const handleSecurity = () => {
  updateType.value == 'username' ? (editUser.value = true) : (editPwd.value = true)
}
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto p-6 bg-white">
      <!-- <button
        class="p-1 cursor-pointer text-xs text-amber-300 border rounded-lg border-yellow-200"
        @click="router.back()"
      >
        Retour
      </button> -->
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Paramètres du compte</h1>

      <div class="w-full mx-auto bg-white rounded-xl border-slate-200 overflow-hidden">
        <div class="flex flex-col gap-6">
          <!-- <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
      <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Paramètres du compte</h3>
    </div> -->

          <nav v-if="!toUpdate && !confirm" class="flex flex-col">
            <p
              @click="toUpdate = 'profil'"
              class="px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-200 flex items-center border-b border-slate-100 last:border-0"
            >
              <span class="font-medium">Modifier le Profil</span>
            </p>

            <p
              @click="toUpdate = 'bio'"
              class="px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-200 flex items-center border-b border-slate-100 last:border-0"
            >
              <span class="font-medium">Ajouter une Bio</span>
            </p>

            <p
              @click="askModification('Voulez-vous modifier votre username ?', 'username')"
              class="px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-200 flex items-center border-b border-slate-100 last:border-0"
            >
              <span class="font-medium">Changer de nom</span>
            </p>

            <p
              @click="askModification('Voulez-vous vraiment modifier votre mot de passe ?', 'pwd')"
              class="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-200 flex items-center"
            >
              <span class="font-medium">Modifier le mot de passe</span>
            </p>
          </nav>
        </div>
      </div>

      <!-- <TabPanels> -->
      <!-- <TabPanel value="0"> -->
      <div class="flex flex-col gap-6 py-4">
        <div
          v-if="toUpdate == 'profil'"
          class="flex relative flex-col gap-6 p-4 bg-slate-50 rounded-lg"
        >
          <div class="flex items-center gap-6">
            <div class="relative">
              <img
                v-if="user.avatar"
                :src="curImage"
                class="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
              <div
                v-else
                class="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-white text-2xl font-bold"
              ></div>
            </div>
            <div>
              <h3 class="font-medium text-gray-700">Photo de profil</h3>
              <FileUpload
                mode="basic"
                name="avatar"
                url="/api/uploads"
                accept="image/*"
                :maxFileSize="1000000"
                @select="onUpload"
                chooseLabel="Changer l'avatar"
                class="p-button-sm p-button-outlined mt-2"
              />
            </div>
          </div>
          <Button
            label="Enregistrer les modifications"
            :loading="loading"
            @click="updateProfile"
            class="w-fit bg-green-500"
          />

          <button
            class="absolute top-2 text-gray-400 rounded-lg p-1 right-5 cursor-pointer border border-gray-600"
            @click="reset()"
          >
            Annuler
          </button>
        </div>

        <div v-if="editUser" class="flex flex-col gap-2 relative">
          <label for="username" class="font-semibold text-sm">Nom d'utilisateur</label>
          <InputText
            id="username"
            v-model="user.username"
            placeholder="Votre pseudo"
            class="w-full"
          />
          <Button
            label="Enregistrer les modifications"
            :loading="loading"
            @click="updateProfile"
            class="w-fit"
          />
          <button
            class="absolute bottom-0 text-gray-400 rounded-lg p-1 right-5 cursor-pointer border border-gray-600"
            @click="reset()"
          >
            Annuler
          </button>
        </div>

        <div v-if="toUpdate == 'bio'" class="flex flex-col gap-2 opacity-60 relative">
          <label for="bio" class="font-semibold text-sm">Bio</label>
          <InputText id="bio" v-model="user.bio" class="w-full" />
          <Button
            label="Enregistrer les modifications"
            :loading="loading"
            @click="updateProfile"
            class="w-fit"
          />
          <button
            class="absolute bottom-0 text-gray-400 rounded-lg p-1 right-5 cursor-pointer border border-gray-600"
            @click="reset()"
          >
            Annuler
          </button>
        </div>
      </div>

      <div class="relative" v-if="confirm && !editPwd && !editUser">
        <OPTmodal @codeValid="handleSecurity()" />

        <div class="flex gap-6 justify-center">
          <Button
            v-if="confirm && !editPwd"
            label="Renvoyer"
            severity="danger"
            @click="askModification()"
            icon="pi pi-shield"
            class="w-fit"
          />
          <button
            class="top-2 text-gray-400 rounded-lg p-2 cursor-pointer border border-gray-600"
            @click="reset()"
          >
            Annuler
          </button>
        </div>
      </div>

      <div v-if="editPwd" class="flex flex-col gap-6 py-4 relative">
        <Message severity="info">Le mot de passe doit contenir au moins 8 caractères.</Message>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm">Mot de passe actuel</label>
          <Password
            v-model="passwordData.current"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm">Nouveau mot de passe</label>
          <Password v-model="passwordData.new" toggleMask class="w-full" inputClass="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm">Confirmer le nouveau mot de passe</label>
          <Password
            v-model="passwordData.confirm"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full"
          />
          <samp v-if="badpwd" class="text-red-500 text-xm font-medium"
            >Vérifier votre mot de passe</samp
          >
        </div>

        <Button
          label="Mettre à jour le mot de passe"
          severity="danger"
          @click="updateProfile"
          icon="pi pi-shield"
          class="w-fit"
        />
        <button
          class="absolute top-2 text-gray-400 rounded-lg p-1 right-5 cursor-pointer border border-gray-600"
          @click="reset()"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tu peux surcharger le style de PrimeVue ici si besoin */
:deep(.p-tablist-tab-list) {
  border-bottom: 1px solid #e2e8f0;
}
</style>

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
  user.value.username = '';
  user.value.bio = '';
  user.value.avatar = null;
  
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
    badpwd.value = false
    const formData = new FormData()
    // confirmation des entrées de l'utilisateur
    if ( passwordData.value.new && passwordData.value.new !== passwordData.value.confirm) {
      badpwd.value = true
      loading.value = false
      return
    }
    if ( passwordData.value.new && passwordData.value.current === passwordData.value.new) {
      notifyError('Le nouveau mot de passe doit être différent de l\'ancien')
      loading.value = false
      return
    }

    if (passwordData.value.current) {
        formData.append('current', passwordData.value.current)
      }
      if (passwordData.value.new) {
        formData.append('passwordHash', passwordData.value.new)
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
      badpwd.value = false
    }, 1000)
    notifySuccess('Modification réussi')
    reset();
    }).catch((error) => {
      loading.value = false
      badpwd.value = false
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
  }
}

const handleSecurity = () => {
  updateType.value == 'username' ? (editUser.value = true) : (editPwd.value = true)
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-white">
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-amber-200">
      <!-- <button
        class="p-1 cursor-pointer text-xs text-amber-300 border rounded-lg border-yellow-200"
        @click="router.back()"
      >
        Retour
      </button> -->
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Paramètres du compte</h1>

      <div class="w-full mx-auto bg-white rounded-xl border-amber-200 overflow-hidden">
        <div class="flex flex-col gap-6">
          <!-- <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
      <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Paramètres du compte</h3>
    </div> -->

          <nav v-if="!toUpdate && !confirm" class="flex flex-col">
            <p
              @click="toUpdate = 'profil'"
              class="px-4 py-3 text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer transition-colors duration-200 flex items-center border-b border-amber-100 last:border-0 font-medium"
            >
              <span class="font-medium">Modifier le Profil</span>
            </p>

            <p
              @click="toUpdate = 'bio'"
              class="px-4 py-3 text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer transition-colors duration-200 flex items-center border-b border-amber-100 last:border-0 font-medium"
            >
              <span class="font-medium">Ajouter une Bio</span>
            </p>

            <p
              @click="askModification('Voulez-vous modifier votre username ?', 'username')"
              class="px-4 py-3 text-amber-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer transition-colors duration-200 flex items-center border-b border-amber-100 last:border-0 font-medium"
            >
              <span class="font-medium">Changer de nom</span>
            </p>

            <p
              @click="askModification('Voulez-vous vraiment modifier votre mot de passe ?', 'pwd')"
              class="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-200 flex items-center font-medium"
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
          class="flex relative flex-col gap-6 p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200"
        >
          <div class="flex items-center gap-6">
            <div class="relative">
              <img
                v-if="user.avatar"
                :src="curImage"
                class="w-20 h-20 rounded-full object-cover border-2 border-amber-600"
              />
              <div
                v-else
                class="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 text-2xl font-bold"
              ></div>
            </div>
            <div>
              <h3 class="font-medium text-gray-700">Photo de profil</h3>
              <FileUpload
                mode="basic"
                name="avatar"
                url="/api/uploads"
                accept="image/*"
                :maxFileSize="52428800"
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
            class="w-fit"
            style="background-color: #f59e0b; color: white;"
          />

          <button
            class="absolute top-2 text-amber-600 hover:text-amber-700 rounded-lg p-1 right-5 cursor-pointer border border-amber-300 transition-colors"
            @click="reset()"
          >
            Annuler
          </button>
        </div>

        <div v-if="editUser" class="flex flex-col gap-2 relative bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-200">
          <label for="username" class="font-semibold text-sm text-amber-900">Nom d'utilisateur</label>
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
            style="background-color: #f59e0b; color: white;"
          />
          <button
            class="absolute bottom-0 text-amber-600 hover:text-amber-700 rounded-lg p-1 right-5 cursor-pointer border border-amber-300 transition-colors"
            @click="reset()"
          >
            Annuler
          </button>
        </div>

        <div v-if="toUpdate == 'bio'" class="flex flex-col gap-2 relative bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-200">
          <label for="bio" class="font-semibold text-sm text-amber-900">Bio</label>
          <InputText id="bio" v-model="user.bio" class="w-full" />
          <Button
            label="Enregistrer les modifications"
            :loading="loading"
            @click="updateProfile"
            class="w-fit"
            style="background-color: #f59e0b; color: white;"
          />
          <button
            class="absolute bottom-0 text-amber-600 hover:text-amber-700 rounded-lg p-1 right-5 cursor-pointer border border-amber-300 transition-colors"
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

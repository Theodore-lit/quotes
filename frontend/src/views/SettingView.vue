<script setup lang="ts">
import { ref } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import { useLoginStore } from '@/stores/login'
import { jwtDecode } from 'jwt-decode'
import OPTmodal from '@/ui/OPTmodal.vue'
import Swal from 'sweetalert2'
import router from '@/router'
const edidNow = ref(null);
const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null
const confirm = ref(null)

const makeSure = () => {
  Swal.fire({
    title: 'Modification',
    text: 'Voulez-vous modifier votre mot de pass ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Edit',
  }).then((result) => {
    if (result.isConfirmed) {
      confirm.value = true;
      Swal.fire({
        title: 'Great!',
        text: `Un code vous est envoyé sur ${decoded?.email}`,
        icon: 'success',
        footer: "Le code s'expire dans 10 min",
      })
    }
  })
}

// États réactifs (simulant les données de ton utilisateur MongoDB)
const user = ref({
  username: '',
  bio: '',
  avatar: null,
})

const passwordData = ref({
  current: '',
  new: '',
  confirm: '',
})

const loading = ref(false)

// Fonctions pour les appels API (Backend)
const updateProfile = () => {
  loading.value = true
  // Simuler db.users.updateOne({ _id: ... }, { $set: { username: ... } })
  setTimeout(() => {
    loading.value = false
    console.log('Profil mis à jour !')
  }, 1000)
}

const onUpload = (event: any) => {
  // Logique pour envoyer l'image à ton dossier /uploads (Multer)
  user.value.avatar = event.files[0].objectURL
}


async function askModification() {
  try {
    await makeSure()
    const response = await fetch(`http://localhost:4000/api/code/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: decoded?.email,
        code: Math.floor(100000 + Math.random() * 900000),
      }),
    })
    if (!response.ok) throw new Error('Erreur réseau')
    const result = await response.json()
    // Si ton API renvoie { data: [...] }, ajuste ici
  } catch (error) {
    console.error('Problème au cours du chargement :', error)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-2xl border border-gray-100 mt-10">
    <button class="p-1 cursor-pointer text-xs text-amber-300 border rounded-lg border-yellow-200" @click="router.back()" >Retour</button>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Paramètres du compte</h1>

    <Tabs value="0">
      <TabList>
        <Tab value="0" icon="pi pi-user" label="Profil" class="gap-2" />
        <Tab value="1" icon="pi pi-lock" label="Sécurité" class="gap-2" />
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <div class="flex flex-col gap-6 py-4">
            <div class="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
              <div class="relative">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  class="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                />
                <div
                  v-else
                  class="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold"
                >
                  {{ user.username.substring(0, 2).toUpperCase() }}
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-700">Photo de profil</h3>
                <FileUpload
                  mode="basic"
                  name="avatar"
                  url="/api/upload"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @select="onUpload"
                  chooseLabel="Changer l'avatar"
                  class="p-button-sm p-button-outlined mt-2"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="username" class="font-semibold text-sm">Nom d'utilisateur</label>
              <InputText
                id="username"
                v-model="user.username"
                placeholder="Votre pseudo"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-2 opacity-60">
              <label for="bio" class="font-semibold text-sm">Bio</label>
              <InputText id="bio" v-model="user.bio" class="w-full" />
            </div>

            <Button
              label="Enregistrer les modifications"
              :loading="loading"
              @click="updateProfile"
              class="w-fit"
            />
          </div>
        </TabPanel>

        <TabPanel value="1">
          <Button v-if="!confirm" @click="askModification()">Modifier votre mot de passe</Button>

          <OPTmodal @codeValid="edidNow = true"  v-if="confirm && !edidNow" />

          <div v-if="edidNow" class="flex flex-col gap-6 py-4">
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
            </div>

            <Button
              label="Mettre à jour le mot de passe"
              severity="danger"
              icon="pi pi-shield"
              class="w-fit"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
/* Tu peux surcharger le style de PrimeVue ici si besoin */
:deep(.p-tablist-tab-list) {
  border-bottom: 1px solid #e2e8f0;
}
</style>

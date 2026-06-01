<script setup>
import { reactive, ref } from 'vue'
import { ShieldCheck, UserIcon} from 'lucide-vue-next'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steppist'
import Step from 'primevue/step'
import StepPanels from 'primevue/steppanels'
import StepPanel from 'primevue/steppanel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
const url = import.meta.env.VITE_API_URL;
import { register as registerUser } from '@/services/auth'

const activeStep = ref(0); // On commence à l'étape 0 (Profil)

// Fonction pour valider le profil avant de passer à la sécurité

import { useRouter } from 'vue-router'
import { notifySuccess, notifyError, notifyWarning } from '@/utils/notifications.js';
const router = useRouter()
const confirmPass = ref('')
const badPass = ref(null)
const badEmail = ref(null)
const curImage = ref(null)



const newUser = reactive({
  username: '',
  avatar: '',
  email: '',
  password: '',
  gender: '',
  bio: '',
})

const goToSecurity = () => {
  // Ajoute ici ta logique de validation (ex: pseudo non vide)
  if (newUser.username && newUser.gender) {
    activeStep.value = 1;
  } else {
    // Alerte ou message d'erreur
    notifyWarning("Formulaire invalide");
  }
};

async function register() {
  try {
    if (confirmPass.value !== newUser.password) return notifyWarning('Le mot de passe dois avoir au moins 6 caractères')
    const formData = new FormData();
    formData.append("username", newUser.username);
    formData.append("email", newUser.email);
    formData.append("gender", newUser.gender);
    formData.append("password", newUser.password);
    formData.append("bio", newUser.bio);
    if (newUser.avatar) formData.append('avatar', newUser.avatar)
    await registerUser(formData)
    notifySuccess("Vous vous êtes inscrit avec success")
    router.push('/login')
  } catch (error) {
    notifyError(error.response?.data?.message ?? error.message)
  }
}
const handleFileUpload = (event) => {
  newUser.avatar = event.files[0]
  curImage.value = event.files[0].objectURL
}
</script>

<template>
   <!-- <template> -->
  <div class="card shadow-lg rounded-2xl w-full p-10 bg-white border border-amber-200">
          <div class="w-full flex items-center justify-center"><svg width="100" height="100" viewBox="0 0 100 100"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 25C36.19 25 25 36.19 25 50C25 54.2 26.05 58.15 27.85 61.6L25 72L35.4 69.15C38.85 70.95 42.8 72 47 72C60.81 72 72 60.81 72 47"
            stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <circle cx="50" cy="48" r="13" stroke="#F59E0B" stroke-width="6" />

          <path d="M68 33L66.5 29.5L63 28L66.5 26.5L68 23L69.5 26.5L73 28L69.5 29.5L68 33Z" fill="#F59E0B" />

          <line x1="62" y1="21" x2="63.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="68" y1="18" x2="68" y2="15" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
          <line x1="74" y1="21" x2="72.5" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
        </svg></div>
      <p class="text-amber-700 text-center py-3 text-2xl font-medium">Inscription</p>
    <Stepper v-model:value="activeStep">
      <StepList>
        <Step :value="0"> <UserIcon :size="30" /> </Step>
        <Step :value="1"> <ShieldCheck :size="30" /> </Step>
      </StepList>

      <StepPanels>
        <StepPanel :value="0">
          <div class="relative items-center flex w-full">
            <img :src="curImage" class="w-20 h-20 rounded-full object-cover border-2 border-amber-300 bg-amber-100"
              alt="Avatar" />
          </div>
          <div class="flex flex-col gap-6 py-4">
            <FileUpload mode="basic" name="avatar" url="/api/uploads" accept="image/*" :maxFileSize="52428800"
              @select="handleFileUpload" chooseLabel="Ajouter votre avatar"
              class="p-button-sm p-button-outlined mt-2" />
              
              <div><label class="block text-gray-500 font-medium mb-1">Username</label>
                <InputText type='text' placeholder="Prince" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" v-model="newUser.username" /></div>
                <div>
                  <div><label class="block text-gray-500 font-medium mb-1">Bio</label> 
                    <InputText type='text' class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" v-model="newUser.bio" placeholder="Votre bio..." /></div>
                  <div class="mb-4">
            <div class="mt-5" >
              <label class="block text-gray-500 font-medium mb-1">Gender</label>
            <select v-model="newUser.gender"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="" disabled>Select your gender</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            </div>
          </div>
                </div>
                <!-- <InputText placeholder="Pseudo requis" /> -->

            <Button label="Suivant : Sécurité" icon="pi pi-arrow-right" iconPos="right" @click="goToSecurity"
              class="w-fit" />
          </div>
        </StepPanel>

        <StepPanel :value="1">
          <div class="flex flex-col gap-6 py-4">
            <div><label class="block text-gray-500 font-medium mb-1">Email</label>
              
              <input type="email" name="email" placeholder="Enter your email" v-model="newUser.email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div>
                <label class="block text-gray-500 font-medium mb-1">Password</label>
                <Password toggleMask :feedback="false" v-model="newUser.password" class="w-full" inputClass="w-full" />
              </div>
              <div>
                <label class="block text-gray-500 font-medium mb-1">Confirm Password</label>
                <Password toggleMask :feedback="false" class="w-full" v-model="confirmPass" inputClass="w-full" />
</div>


<div class="flex gap-4">

              <Button label="Retour" severity="secondary" @click="activeStep = 0" />
              <Button label="Terminer" @click="register()" />
            </div>
          </div>
        </StepPanel>
        <a :href="`${url}/auth/google`"
          class="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="w-5 h-5 mr-2" />
          Sign-up with Google
      </a>
      <p class="mt-6 text-sm text-center text-gray-600">
          Already have an account?
        <spam @click="router.push('/login')" class=" cursor-pointer text-amber-600 hover:underline"> Se connecter </spam>
        </p>
      </StepPanels>
    </Stepper>
  </div>
  <!-- </template> -->

</template>

<style scoped></style>

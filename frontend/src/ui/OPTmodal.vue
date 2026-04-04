<template>
  <h2 class="text-2xl text-center">Entrez le code envoyé sur {{ decoded?.email }}</h2>

  <div class="card flex justify-center p-10">
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <InputOtp name="passcode" v-model="initialValues.passcode" integerOnly :length="6" />

        <Message v-if="error" severity="error" size="small" variant="simple">
          {{ error }}
        </Message>
      </div>

      <Button type="submit" severity="secondary" label="Vérifier le code" />
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form } from '@primevue/forms'
import InputOtp from 'primevue/inputotp'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { jwtDecode } from 'jwt-decode'
import { useLoginStore } from '@/stores/login'
import Swal from 'sweetalert2'
const emit = defineEmits(['codeValid', 'codeUnvalid'])

const loginStore = useLoginStore()
const token = loginStore.token
const decoded = token ? jwtDecode(token) : null

// L'objet qui contient la valeur
const initialValues = ref({
  passcode: '',
})

const error = ref('')

async function onFormSubmit(event) {
  // 1. On récupère la valeur directement depuis notre ref initialValues
  // PrimeVue InputOtp peut renvoyer un tableau ou une string, on sécurise
  let codeFinal = initialValues.value.passcode

  if (Array.isArray(codeFinal)) {
    codeFinal = codeFinal.join('')
  }

  // 2. Validation manuelle (plus fiable que le resolver dans ce cas précis)
  if (!codeFinal || codeFinal.length < 6) {
    error.value = 'Veuillez entrer les 6 chiffres.'
    return
  }
  error.value = '' // On efface l'erreur si c'est bon
  await toValid(codeFinal)
}

async function toValid(codeFinal) {
  try {
    const response = await fetch(`http://localhost:4000/api/code/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: decoded?.email,
        code: codeFinal,
      }),
    })
    if (response.ok) {
      emit('codeValid')
      // 3. Succès
      Swal.fire({
        icon: 'success',
        title: 'Code récupéré !',
        text: `Le code est valid`,
        confirmButtonColor: '#4f46e5',
      })
      return
    }
    emit('codeUnvalid')

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Code incorret!',
    })
  } catch (error) {
    console.error('Problème au cours de vérification du code :', error)
  }
}
</script>

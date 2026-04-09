<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
const router = useRouter()
const confirmPass = ref('')
// const avatar = ref(null);
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

const confirm = () => {
  Swal.fire({
    title: 'Drag me!',
    icon: 'success',
    draggable: true,
  })
}

async function register() {
  try {
    if (confirmPass.value !== newUser.password) return (badPass.value = true)
    const formData = new FormData();
  formData.append("username", newUser.username);
  formData.append("email", newUser.email);
  formData.append("gender", newUser.gender);
  formData.append("password", newUser.password);
  formData.append("bio", newUser.bio);
  if (newUser.avatar) formData.append('avatar', newUser.avatar)
    const data = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
      },
      body: formData,
      // body: JSON.stringify({
      //   username: newUser.username,
      //   email: newUser.email,
      //   password: newUser.password,
      //   gender: newUser.gender,
      //   bio: newUser.bio,
      // }),
    })
    console.log(formData)
    if (!data.ok) return console.log("Impossible de s'inscrire")
    const user = await data.json();
    await confirm()
    router.push('/login')
  } catch (error) {
    console.log(error);
    badEmail.value = true
  }
}
const handleFileUpload = (event) => {
  newUser.avatar = event.files[0]
  curImage.value = event.files[0].objectURL
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="w-full flex items-center justify-center">
      <div class="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold text-blue-600 mb-6">Sign up</h2>
        <form @submit.prevent="register">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2"> Username </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="newUser.username"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              v-model="newUser.email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <samp v-if="badEmail" class="text-red">Email Invalid</samp>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2"> Password </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              v-model="newUser.password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2"> Confirm Password </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="confirmPass"
            />
            <samp v-if="badPass" class="text-red">Mot de passe Invalid</samp>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2">Bio</label>
            <input
              type="text"
              name="bio"
              placeholder="Enter your email"
              v-model="newUser.bio"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2">Bio</label>
            <!-- <input
              type="file"
              name="bio"
              placeholder="Votre avatar"
              v-on:change="handleFileUpload"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> -->

            <FileUpload mode="basic" name="avatar" url="/api/uploads" accept="image/*" :maxFileSize="1000000"
                  @select="handleFileUpload" chooseLabel="Ajouter votre avatar" class="p-button-sm p-button-outlined mt-2" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm mb-2">Gender</label>
            <select
              v-model="newUser.gender"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select your gender</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            S'incrire
          </button>
        </form>
        <button
          class="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            class="w-5 h-5 mr-2"
          />
          Sign-up with Google
        </button>

        <p class="mt-6 text-sm text-center text-gray-600">
          Already have an account?
          <p @click="router.push('/login')" class=" cursor-pointer text-blue-600 hover:underline"> Se connecter </p>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

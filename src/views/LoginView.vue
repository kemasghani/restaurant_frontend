<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <div
            class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p class="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <!-- Error Message -->
        <Message v-if="errorMessage" severity="error" :closable="true" @close="errorMessage = ''">
          {{ errorMessage }}
        </Message>

        <!-- Form -->
        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">Email</label>
            <InputText
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full"
              :disabled="authStore.loading"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">Password</label>
            <Password
              v-model="password"
              placeholder="••••••••"
              :feedback="false"
              toggleMask
              class="w-full"
              :disabled="authStore.loading"
              @keyup.enter="handleLogin"
            />
          </div>

          <Button
            label="Sign In"
            :loading="authStore.loading"
            @click="handleLogin"
            :disabled="!email || !password"
            class="w-full"
            :pt="{
              root: {
                class:
                  'w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
              },
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  // Clear previous error
  errorMessage.value = ''

  // Basic validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (success) {
      // Redirect to dashboard or home page after successful login
      router.push('/')
    } else {
      errorMessage.value = 'Invalid email or password. Please try again.'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.'
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

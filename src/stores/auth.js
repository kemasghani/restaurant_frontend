// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: sessionStorage.getItem('token') || null,
        user: JSON.parse(sessionStorage.getItem('user')) || null,
        loading: false,
    }),
    actions: {
        async login(credentials) {
            this.loading = true
            try {
                const res = await axios.post('https://restaurant-backend-one-theta.vercel.app/api/auth/login', credentials)
                const { token, user } = res.data

                sessionStorage.setItem('token', token)
                this.token = token
                this.user = user
                sessionStorage.setItem('user', JSON.stringify(this.user))

                return true
            } catch (error) {
                console.error('Login failed:', error)
                return false
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null

            localStorage.removeItem('user')
            localStorage.removeItem('token')

        },

        isAuthenticated() {
            return !!this.token
        },
    },
})

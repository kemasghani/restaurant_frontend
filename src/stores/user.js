// src/stores/user.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUsers() {
            this.loading = true
            const authStore = useAuthStore()
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/users', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                this.users = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
            } finally {
                this.loading = false
            }
        },

        async addUser(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/users', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchUsers()
                return { success: true }
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        async updateUser(id, payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.put(`https://restaurant-backend-one-theta.vercel.app/api/users/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchUsers()
                return { success: true }
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.delete(`https://restaurant-backend-one-theta.vercel.app/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchUsers()
                return { success: true }
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },
    },
})

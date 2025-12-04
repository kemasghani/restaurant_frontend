import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useBahanStore = defineStore('bahanStore', {
    state: () => ({
        data: [],
        loading: false,
        error: null,
    }),

    actions: {
        // ✅ Ambil semua bahan
        async fetchBahan() {
            this.loading = true
            const authStore = useAuthStore()
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/bahan', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                this.data = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('fetchBahan error:', this.error)
            } finally {
                this.loading = false
            }
        },

        // ✅ Tambah bahan baru
        async addBahan(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/bahan', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchBahan() // refresh setelah tambah
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('addBahan error:', this.error)
                throw err
            } finally {
                this.loading = false
            }
        },

        // 🟠 Update bahan
        async updateBahan(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.put(`https://restaurant-backend-one-theta.vercel.app/api/bahan/${payload.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchBahan() // refresh data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('updateBahan error:', this.error)
                throw err
            } finally {
                this.loading = false
            }
        },

        // ❌ Hapus bahan
        async deleteBahan(id) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.delete(`https://restaurant-backend-one-theta.vercel.app/api/bahan/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchBahan() // refresh setelah delete
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('deleteBahan error:', this.error)
                throw err
            } finally {
                this.loading = false
            }
        },
    },
})

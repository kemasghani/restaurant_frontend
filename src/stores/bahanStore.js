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
        // (Backend now handles the logic: if User is Branch, it returns branch-specific stock)
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
        // Payload should include: nama_bahan, kategori_id, satuan_id, stok_minimal
        // (Stok is automatically set to 0 by backend)
        async addBahan(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/bahan', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchBahan() // refresh list to see new item
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('addBahan error:', this.error)
                throw err
            } finally {
                this.loading = false
            }
        },

        // 🟠 Update bahan
        // Changed to accept ID and Payload separately for safer URL construction
        async updateBahan(id, payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                // Backend will update: nama_bahan, kategori, satuan, stok_minimal
                // Backend will IGNORE: stok (cannot be edited here)
                await axios.put(`https://restaurant-backend-one-theta.vercel.app/api/bahan/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.fetchBahan() // refresh list to see changes
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
                await this.fetchBahan() // refresh list after delete
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
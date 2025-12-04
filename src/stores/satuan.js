import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useToast } from 'primevue/usetoast'

export const useSatuanStore = defineStore('satuan', {
    state: () => ({
        data: [],
        loading: false,
        form: {
            nama_satuan: ''
        },
        error: null
    }),

    actions: {
        async fetchSatuan() {
            const auth = useAuthStore()
            this.loading = true
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/satuan', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                this.data = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('❌ fetchSatuan error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async addSatuan() {
            const auth = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/satuan', this.form, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                await this.fetchSatuan()
                this.resetForm()
                return { success: true }
            } catch (err) {
                const msg = err.response?.data?.message || 'Gagal menambah satuan'
                return { success: false, message: msg }
            }
        },

        async updateSatuan(payload) {
            const auth = useAuthStore()
            try {
                await axios.put(`https://restaurant-backend-one-theta.vercel.app/api/satuan/${payload.id}`, payload, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (err) {
                this.error = err.response?.data?.message || 'Gagal update satuan'
                throw err
            }
        },

        async deleteSatuan(id) {
            const auth = useAuthStore()
            try {
                await axios.delete(`https://restaurant-backend-one-theta.vercel.app/api/satuan/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (err) {
                this.error = err.response?.data?.message || 'Gagal hapus satuan'
                throw err
            }
        },

        resetForm() {
            this.form = { nama_satuan: '' }
        }
    }
})

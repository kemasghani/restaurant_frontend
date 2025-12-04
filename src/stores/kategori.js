import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useKategoriStore = defineStore('kategoriStore', {
    state: () => ({
        data: [],
        loading: false,
        error: null,
        form: {
            nama_kategori: '',
            deskripsi: ''
        }
    }),

    actions: {
        async fetchKategori() {
            const auth = useAuthStore()
            this.loading = true
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/kategori', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                this.data = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('❌ fetchKategori error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async addKategori() {
            const auth = useAuthStore()
            this.loading = true
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/kategori', this.form, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                await this.fetchKategori()
                this.resetForm()
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('❌ addKategori error:', this.error)
                throw err
            } finally {
                this.loading = false
            }
        },
        async updateKategori(payload) {
            const auth = useAuthStore()
            try {
                await axios.put(`https://restaurant-backend-one-theta.vercel.app/api/kategori/${payload.id}`, payload, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (err) {
                this.error = err.response?.data?.message || 'Gagal update kategori'
                throw err
            }
        },

        async deleteKategori(id) {
            const auth = useAuthStore()
            try {
                await axios.delete(`https://restaurant-backend-one-theta.vercel.app/api/kategori/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (err) {
                this.error = err.response?.data?.message || 'Gagal hapus kategori'
                throw err
            }
        },

        resetForm() {
            this.form = { nama_kategori: '', deskripsi: '' }
        }
    }
})

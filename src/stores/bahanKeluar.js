import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useBahanKeluarStore = defineStore('bahanKeluar', {
    state: () => ({
        list: [],
        loading: false,
        form: {
            bahan_id: null,
            jumlah: null,
            keterangan: ''
        },
        error: null
    }),

    actions: {
        // ✅ Ambil daftar bahan keluar
        async fetchList() {
            const auth = useAuthStore()
            this.loading = true
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/bahan-keluar', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                this.list = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('❌ fetchList error:', this.error)
            } finally {
                this.loading = false
            }
        },

        // ✅ Submit form bahan keluar
        async submitForm() {
            const auth = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/bahan-keluar', this.form, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                await this.fetchList()
                this.resetForm()
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('❌ submitForm error:', this.error)
                throw err
            }
        },

        resetForm() {
            this.form = { bahan_id: null, jumlah: null, keterangan: '' }
        }
    }
})

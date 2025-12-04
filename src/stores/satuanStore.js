import { defineStore } from 'pinia'
import axios from 'axios'

export const useSatuanStore = defineStore('satuanStore', {
    state: () => ({
        data: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchSatuan() {
            this.loading = true
            try {
                const token = sessionStorage.getItem('token')
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/satuan', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                this.data = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
            } finally {
                this.loading = false
            }
        },
    },
})

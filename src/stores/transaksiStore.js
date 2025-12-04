// src/stores/transaksi.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTransaksiStore = defineStore('transaksiStore', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),

    actions: {
        async listTransaksi() {
            this.loading = true
            const authStore = useAuthStore()
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/transaksi', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                this.list = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('listTransaksi error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async createManualTransaksi(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/transaksi/manual', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.listTransaksi()
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('createManualTransaksi error:', this.error)
            } finally {
                this.loading = false
            }
        },
    },
})

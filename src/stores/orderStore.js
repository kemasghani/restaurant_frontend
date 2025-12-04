// src/stores/order.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useOrderStore = defineStore('orderStore', {
    state: () => ({
        orders: [],
        selectedOrder: null,
        loading: false,
        error: null,
    }),

    actions: {
        async listOrders() {
            this.loading = true
            const authStore = useAuthStore()
            try {
                const res = await axios.get('https://restaurant-backend-one-theta.vercel.app/api/orders', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                this.orders = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('listOrders error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async getOrder(id) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                const res = await axios.get(`https://restaurant-backend-one-theta.vercel.app/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                this.selectedOrder = res.data
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('getOrder error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async createOrder(payload) {
            this.loading = true
            const authStore = useAuthStore()
            try {
                await axios.post('https://restaurant-backend-one-theta.vercel.app/api/orders', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                })
                await this.listOrders()
            } catch (err) {
                this.error = err.response?.data?.message || err.message
                console.error('createOrder error:', this.error)
            } finally {
                this.loading = false
            }
        },

        async acceptOrder(id) {
            const authStore = useAuthStore()
            await axios.post(`https://restaurant-backend-one-theta.vercel.app/api/orders/${id}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                }
            })
            await this.listOrders()
        },

        async rejectOrder(id) {
            const authStore = useAuthStore()
            await axios.post(`https://restaurant-backend-one-theta.vercel.app/api/orders/${id}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                }
            })
            await this.listOrders()
        },

        async deliverOrder(id) {
            const authStore = useAuthStore()
            await axios.post(`https://restaurant-backend-one-theta.vercel.app/api/orders/${id}/deliver`, {}, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                }
            })
            await this.listOrders()
        },
    },
})

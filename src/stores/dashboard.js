// stores/dashboard.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth' // Importing your existing auth store

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    branchReports: [],
    supplierReports: [],
    lowStockItems: [],
    expiringItems: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardData() {
      const auth = useAuthStore()
      this.isLoading = true
      this.error = null

      const baseUrl = 'https://restaurant-backend-one-theta.vercel.app/api/dashboard'

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }

        const [supplierRes, stockRes, expiringRes] = await Promise.all([
          axios.get(`${baseUrl}/supplier-reports`, config),
          axios.get(`${baseUrl}/low-stock`, config),
          axios.get(`${baseUrl}/expiring`, config),
        ])

        this.supplierReports = supplierRes.data.data || []
        this.lowStockItems = stockRes.data.data || []
        this.expiringItems = expiringRes.data.data || []
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        this.error = err.response?.data?.message || 'Failed to load dashboard data'
      } finally {
        this.isLoading = false
      }
    },
  },
})

// stores/dashboard.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth' // Importing your existing auth store

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    branchReports: [],
    lowStockItems: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardData() {
      const auth = useAuthStore()
      this.isLoading = true
      this.error = null

      // API Base URL
      const baseUrl = 'https://restaurant-backend-one-theta.vercel.app/api/dashboard'

      try {
        // Prepare headers with token
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }

        // Fetch both endpoints in parallel
        const [reportsRes, stockRes] = await Promise.all([
          axios.get(`${baseUrl}/branch-reports`, config),
          axios.get(`${baseUrl}/low-stock`, config),
        ])

        // Update state
        this.branchReports = reportsRes.data.data
        this.lowStockItems = stockRes.data.data
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        this.error = err.response?.data?.message || 'Failed to load dashboard data'
      } finally {
        this.isLoading = false
      }
    },
  },
})

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard Overview</h1>

    <div v-if="dashboardStore.isLoading" class="p-4 text-center">Loading data...</div>

    <div v-else-if="dashboardStore.error" class="p-4 text-red-500 bg-red-100 rounded">
      {{ dashboardStore.error }}
    </div>

    <div v-else class="grid gap-8">
      <div class="card">
        <h2 class="text-xl font-semibold mb-2 text-red-600">
          ⚠️ Low Stock Alerts ({{ dashboardStore.lowStockItems.length }})
        </h2>
        <DataTable
          :value="dashboardStore.lowStockItems"
          tableStyle="min-width: 50rem"
          showGridlines
          stripedRows
        >
          <Column field="nama_bahan" header="Item Name"></Column>
          <Column field="sisa_stok" header="Current Stock">
            <template #body="slotProps">
              <span class="font-bold text-red-600">{{ slotProps.data.sisa_stok }}</span>
            </template>
          </Column>
          <Column field="batas_minimum" header="Min Limit"></Column>
          <Column field="satuan" header="Unit"></Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
                {{ slotProps.data.status }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold mb-2">Branch Usage Reports</h2>

        <DataTable
          v-model:expandedRows="expandedRows"
          :value="dashboardStore.branchReports"
          dataKey="cabang_id"
          tableStyle="min-width: 60rem"
        >
          <Column expander style="width: 5rem" />

          <Column field="cabang_name" header="Branch Name"></Column>
          <Column field="total_transaksi" header="Total Transactions"></Column>

          <template #expansion="slotProps">
            <div class="p-4 bg-gray-50">
              <h5 class="font-bold mb-2">
                Material Usage Details for {{ slotProps.data.cabang_name }}
              </h5>
              <DataTable :value="slotProps.data.detail_bahan" size="small">
                <Column field="nama_bahan" header="Material Name"></Column>
                <Column field="jumlah_total" header="Total Used"></Column>
                <Column field="satuan" header="Unit"></Column>
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDashboardStore } from '../stores/dashboard' // Adjust path if needed
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const dashboardStore = useDashboardStore()
const expandedRows = ref({}) // Controls which rows are open

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<style scoped>
/* Optional styling adjustments */
.card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}
</style>

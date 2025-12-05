<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard Overview</h1>

    <div v-if="dashboardStore.isLoading" class="flex justify-center p-8">
      <span class="text-gray-500">Loading dashboard data...</span>
    </div>

    <div v-else-if="dashboardStore.error" class="p-4 mb-4 text-red-500 bg-red-100 rounded border border-red-200">
      <i class="pi pi-exclamation-circle mr-2"></i>
      {{ dashboardStore.error }}
    </div>

    <div v-else class="grid gap-8">
      
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-red-600 flex items-center gap-2">
            <i class="pi pi-exclamation-triangle"></i>
            Peringatan Stok Menipis ({{ dashboardStore.lowStockItems.length }})
          </h2>
        </div>

        <DataTable
          :value="dashboardStore.lowStockItems"
          tableStyle="min-width: 50rem"
          showGridlines
          stripedRows
          paginator
          :rows="5"
        >
          <Column field="lokasi" header="Cabang / Lokasi" sortable style="width: 20%">
            <template #body="slotProps">
              <span class="font-semibold text-gray-700">{{ slotProps.data.lokasi }}</span>
            </template>
          </Column>

          <Column field="nama_bahan" header="Nama Bahan" sortable></Column>
          
          <Column field="sisa_stok" header="Sisa Stok" style="width: 15%">
            <template #body="slotProps">
              <span class="font-bold text-gray-800">{{ slotProps.data.sisa_stok }}</span>
            </template>
          </Column>

          <Column field="batas_minimum" header="Min. Limit" style="width: 15%"></Column>
          <Column field="satuan" header="Satuan" style="width: 10%"></Column>
          
          <Column field="status" header="Status" style="width: 15%">
            <template #body="{ data }">
              <span 
                class="px-2 py-1 rounded text-xs font-bold inline-block text-center min-w-[80px]"
                :class="getStatusClass(data.status)"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-chart-bar"></i>
          Laporan Penggunaan per Cabang
        </h2>

        <DataTable
          v-model:expandedRows="expandedRows"
          :value="dashboardStore.branchReports"
          dataKey="cabang_id"
          tableStyle="min-width: 60rem"
          stripedRows
        >
          <Column expander style="width: 5rem" />

          <Column field="cabang_name" header="Nama Cabang" sortable></Column>
          <Column field="total_transaksi" header="Total Transaksi Masuk" sortable>
             <template #body="slotProps">
              <span class="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                {{ slotProps.data.total_transaksi }}x Order
              </span>
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-4 bg-slate-50 border-t border-b border-gray-200">
              <h5 class="font-bold mb-3 text-gray-600 text-sm uppercase tracking-wide">
                Detail Bahan Masuk: {{ slotProps.data.cabang_name }}
              </h5>
              <DataTable 
                :value="slotProps.data.detail_bahan" 
                size="small" 
                class="p-datatable-sm shadow-sm"
              >
                <Column field="nama_bahan" header="Nama Bahan"></Column>
                <Column field="jumlah_total" header="Total Diterima">
                  <template #body="subProps">
                    <span class="font-semibold">{{ subProps.data.jumlah_total }}</span>
                  </template>
                </Column>
                <Column field="satuan" header="Satuan"></Column>
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
import { useDashboardStore } from '../stores/dashboard' 
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import 'primeicons/primeicons.css' // Ensure icons are loaded

const dashboardStore = useDashboardStore()
const expandedRows = ref({}) 

onMounted(() => {
  dashboardStore.fetchDashboardData()
})

// Helper for dynamic status coloring
const getStatusClass = (status) => {
  if (status === 'HABIS') {
    return 'bg-red-100 text-red-600 border border-red-200'
  }
  // Assume "MENIPIS"
  return 'bg-orange-100 text-orange-600 border border-orange-200'
}
</script>

<style scoped>
.card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
}
</style>
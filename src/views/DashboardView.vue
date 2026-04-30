<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard Overview</h1>

    <div v-if="dashboardStore.isLoading" class="flex justify-center p-8">
      <span class="text-gray-500">Loading dashboard data...</span>
    </div>

    <div
      v-else-if="dashboardStore.error"
      class="p-4 mb-4 text-red-500 bg-red-100 rounded border border-red-200"
    >
      <i class="pi pi-exclamation-circle mr-2"></i>
      {{ dashboardStore.error }}
    </div>

    <div v-else class="grid gap-8">
      <!-- Bahan Akan Kadaluarsa -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-amber-600 flex items-center gap-2">
            <i class="pi pi-clock"></i>
            Bahan Mendekati Kadaluarsa ({{ dashboardStore.expiringItems.length }})
          </h2>
          <span class="text-xs text-gray-400">Auto-update tiap detik</span>
        </div>

        <DataTable
          :value="dashboardStore.expiringItems"
          tableStyle="min-width: 50rem"
          showGridlines
          stripedRows
          paginator
          :rows="5"
        >
          <template #empty>
            <div class="text-center text-gray-500 py-4">
              Tidak ada bahan yang mendekati kadaluarsa
            </div>
          </template>

          <Column field="nama_bahan" header="Nama Bahan" sortable />
          <Column field="stok" header="Stok" style="width: 10%">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.stok }} {{ data.satuan }}</span>
            </template>
          </Column>
          <Column field="tanggal_kadaluarsa" header="Tanggal Kadaluarsa" sortable>
            <template #body="{ data }">
              {{ formatDate(data.tanggal_kadaluarsa) }}
            </template>
          </Column>
          <Column header="Sisa Waktu" style="width: 25%">
            <template #body="{ data }">
              <span
                class="font-mono text-sm font-bold px-2 py-1 rounded"
                :class="getCountdownClass(data)"
              >
                {{ getCountdown(data.tanggal_kadaluarsa, currentTime) }}
              </span>
            </template>
          </Column>
          <Column field="status" header="Status" style="width: 15%">
            <template #body="{ data }">
              <span
                class="px-2 py-1 rounded text-xs font-bold inline-block text-center min-w-[90px]"
                :class="getExpiryStatusClass(data.status)"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Stok Menipis -->
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

      <!-- Laporan Pemesanan Supplier -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-truck"></i>
          Laporan Pemesanan dari Berbagai Supplier
        </h2>

        <DataTable
          v-model:expandedRows="expandedRows"
          :value="dashboardStore.supplierReports"
          dataKey="supplier_id"
          tableStyle="min-width: 60rem"
          stripedRows
        >
          <template #empty>
            <div class="text-center text-gray-500 py-4">Belum ada data pemesanan supplier</div>
          </template>

          <Column expander style="width: 5rem" />
          <Column field="supplier_name" header="Nama Supplier" sortable />
          <Column field="total_pesanan" header="Total Pesanan" sortable>
            <template #body="slotProps">
              <span class="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                {{ slotProps.data.total_pesanan }}x Order
              </span>
            </template>
          </Column>
          <Column field="total_disetujui" header="Disetujui" sortable>
            <template #body="slotProps">
              <span class="text-green-600 font-semibold">{{ slotProps.data.total_disetujui }}</span>
            </template>
          </Column>
          <Column field="total_dibatalkan" header="Dibatalkan" sortable>
            <template #body="slotProps">
              <span class="text-red-600 font-semibold">{{ slotProps.data.total_dibatalkan }}</span>
            </template>
          </Column>
          <Column field="total_dikirim" header="Dikirim" sortable>
            <template #body="slotProps">
              <span class="text-blue-600 font-semibold">{{ slotProps.data.total_dikirim }}</span>
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-4 bg-slate-50 border-t border-b border-gray-200">
              <h5 class="font-bold mb-3 text-gray-600 text-sm uppercase tracking-wide">
                Detail Bahan: {{ slotProps.data.supplier_name }}
              </h5>
              <DataTable
                :value="slotProps.data.detail_bahan"
                size="small"
                class="p-datatable-sm shadow-sm"
              >
                <Column field="nama_bahan" header="Nama Bahan"></Column>
                <Column field="jumlah_total" header="Total Dipesan">
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
import { onMounted, onUnmounted, ref } from 'vue'
import { useDashboardStore } from '../stores/dashboard'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import 'primeicons/primeicons.css'

const dashboardStore = useDashboardStore()
const expandedRows = ref({})
const currentTime = ref(Date.now())
let timerId = null

onMounted(() => {
  dashboardStore.fetchDashboardData()
  timerId = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

const getStatusClass = (status) => {
  if (status === 'HABIS') return 'bg-red-100 text-red-600 border border-red-200'
  return 'bg-orange-100 text-orange-600 border border-orange-200'
}

const getExpiryStatusClass = (status) => {
  if (status === 'KADALUARSA') return 'bg-red-100 text-red-700 border border-red-200'
  if (status === 'MENDESAK') return 'bg-orange-100 text-orange-700 border border-orange-200'
  if (status === 'PERINGATAN') return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  return 'bg-green-100 text-green-700 border border-green-200'
}

const getCountdownClass = (data) => {
  if (data.status === 'KADALUARSA') return 'bg-red-50 text-red-700'
  if (data.status === 'MENDESAK') return 'bg-orange-50 text-orange-700'
  if (data.status === 'PERINGATAN') return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
}

function getCountdown(targetDate, now) {
  if (!targetDate) return '-'
  const expiry = new Date(targetDate).getTime()
  const diff = expiry - now

  if (diff <= 0) {
    const past = Math.abs(diff)
    const days = Math.floor(past / (1000 * 60 * 60 * 24))
    return `Lewat ${days} hari`
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${days}h ${hours}j ${minutes}m ${seconds}d`
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
}
</style>

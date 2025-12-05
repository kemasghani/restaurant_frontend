<template>
  <div class="p-6">
    <Toast />
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Bahan Masuk (Disetujui)</h2>
    </div>

    <DataTable
      :value="filteredOrders"
      :loading="orderStore.loading"
      paginator
      :rows="10"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
      class="shadow-md rounded-lg"
    >
      <template #empty>
        <div class="text-center text-gray-500 py-4">Tidak ada data order yang disetujui</div>
      </template>
      <Column field="bahan_baku.nama_bahan" header="Nama Bahan" sortable />
      <Column field="jumlah" header="Jumlah" sortable>
        <template #body="{ data }">
          <span class="font-medium">{{ data.jumlah }}</span>
        </template>
      </Column>
      <!-- <Column field="supplier.name" header="Action By" sortable /> -->
      <!-- <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <span
            class="px-3 py-1 rounded-full text-sm font-semibold"
            :class="{
              'bg-yellow-100 text-yellow-700': data.status === 'pending',
              'bg-green-100 text-green-700':
                data.status === 'accepted' ||
                data.status === 'approved' ||
                data.status === 'delivered',
              'bg-red-100 text-red-700': data.status === 'rejected',
            }"
          >
            {{ data.status }}
          </span>
        </template>
      </Column> -->

      <Column header="Dibuat Pada" field="created_at" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { useOrderStore } from '@/stores/orderStore'
import { useBahanStore } from '@/stores/bahanStore'
import { useAuthStore } from '@/stores/auth'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

const toast = useToast()
const orderStore = useOrderStore()
const bahanStore = useBahanStore()
const authStore = useAuthStore()
const role = computed(() => authStore.user?.role)

const form = ref({
  bahan_id: null,
  jumlah: null,
  supplier_id: null,
})

// === LOGIKA FILTER DITAMBAHKAN DI SINI ===
const filteredOrders = computed(() => {
  if (!orderStore.orders) return []

  // Filter array berdasarkan status.
  // Sesuaikan string 'disetujui' dengan data asli di database (misal: 'approved')
  return orderStore.orders.filter((order) => order.status === 'disetujui')
})
// =========================================

onMounted(async () => {
  await orderStore.listOrders()
  await bahanStore.fetchBahan()
})

async function handleSubmit() {
  try {
    await orderStore.createOrder(form.value)
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Order berhasil dibuat',
      life: 3000,
    })
    form.value = { bahan_id: null, jumlah: null, supplier_id: null }
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal membuat order, coba lagi.',
      life: 3000,
    })
  }
}

async function handleAccept(id) {
  try {
    await orderStore.acceptOrder(id)
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Order diterima',
      life: 2500,
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Tidak bisa menerima order',
      life: 2500,
    })
  }
}

async function handleReject(id) {
  try {
    await orderStore.rejectOrder(id)
    toast.add({
      severity: 'warn',
      summary: 'Ditolak',
      detail: 'Order telah ditolak',
      life: 2500,
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Tidak bisa menolak order',
      life: 2500,
    })
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="p-6">
    <!-- Toast -->
    <Toast position="top-right" />

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Bahan Keluar</h2>
      <Button label="Tambah Bahan Keluar" icon="pi pi-plus" @click="showDialog = true" />
    </div>

    <!-- Tabel -->
    <DataTable
      :value="bahanKeluarStore.list"
      :loading="bahanKeluarStore.loading"
      paginator
      :rows="10"
      class="shadow rounded-xl"
    >
      <Column field="id" header="ID" sortable />
      <Column field="bahan_baku.nama_bahan" header="Nama Bahan" sortable />
      <Column field="jumlah" header="Jumlah" />
      <Column field="keterangan" header="Keterangan" />
      <Column header="Tanggal" field="created_at" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Form -->
    <Dialog v-model:visible="showDialog" modal header="Tambah Bahan Keluar" class="w-96">
      <div class="flex flex-col gap-3">
        <Dropdown
          v-model="bahanKeluarStore.form.bahan_id"
          :options="bahanStore.data"
          optionLabel="nama_bahan"
          optionValue="id"
          placeholder="Pilih Bahan"
          class="w-full"
        />
        <InputNumber
          v-model="bahanKeluarStore.form.jumlah"
          placeholder="Jumlah Keluar"
          class="w-full"
        />
        <Textarea
          v-model="bahanKeluarStore.form.keterangan"
          placeholder="Keterangan (opsional)"
          rows="3"
          class="w-full"
        />
      </div>
      <template #footer>
        <Button label="Batal" severity="secondary" @click="showDialog = false" />
        <Button label="Simpan" @click="handleSubmit" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

import { useBahanKeluarStore } from '@/stores/bahanKeluar'
import { useBahanStore } from '@/stores/bahanStore'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

const showDialog = ref(false)
const bahanKeluarStore = useBahanKeluarStore()
const bahanStore = useBahanStore()
const toast = useToast()

async function handleSubmit() {
  try {
    await bahanKeluarStore.submitForm()
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Data bahan keluar berhasil disimpan',
      life: 3000,
    })
    showDialog.value = false
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: err.message || 'Terjadi kesalahan saat menyimpan data',
      life: 4000,
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

onMounted(() => {
  bahanStore.fetchBahan()
  bahanKeluarStore.fetchList()
})
</script>

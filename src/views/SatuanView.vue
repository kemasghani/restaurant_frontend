<template>
  <div class="p-6">
    <!-- Toast & ConfirmDialog -->
    <Toast />
    <ConfirmDialog />

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Satuan</h2>
      <Button label="Tambah Satuan" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <DataTable
      :value="satuanStore.data"
      :loading="satuanStore.loading"
      paginator
      :rows="10"
      stripedRows
      showGridlines
      class="shadow rounded-xl"
    >
      <Column field="id" header="ID" sortable />
      <Column field="nama_satuan" header="Nama Satuan" sortable />
      <Column field="created_at" header="Dibuat Pada" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <!-- Kolom Aksi -->
      <Column header="Aksi" style="width: 150px; text-align: center">
        <template #body="{ data }">
          <div class="flex justify-center gap-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-sm"
              v-tooltip.bottom="'Edit Satuan'"
              @click="openEditDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm"
              v-tooltip.bottom="'Hapus Satuan'"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Tambah/Edit -->
    <Dialog
      v-model:visible="showDialog"
      modal
      :header="isEditing ? 'Edit Satuan' : 'Tambah Satuan'"
      class="w-96"
    >
      <div class="flex flex-col gap-3">
        <InputText v-model="form.nama_satuan" placeholder="Nama satuan" class="w-full" />
      </div>

      <template #footer>
        <Button label="Batal" severity="secondary" @click="showDialog = false" />
        <Button :label="isEditing ? 'Perbarui' : 'Simpan'" @click="handleSave" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSatuanStore } from '@/stores/satuan'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

const satuanStore = useSatuanStore()
const toast = useToast()
const confirm = useConfirm()

const showDialog = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, nama_satuan: '' })

onMounted(() => {
  satuanStore.fetchSatuan()
})

// 🟢 Tambah
function openAddDialog() {
  isEditing.value = false
  form.value = { id: null, nama_satuan: '' }
  showDialog.value = true
}

// 🟠 Edit
function openEditDialog(item) {
  isEditing.value = true
  form.value = { ...item }
  showDialog.value = true
}

// 🧾 Simpan (Tambah/Edit)
async function handleSave() {
  try {
    if (isEditing.value) {
      await satuanStore.updateSatuan(form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Satuan berhasil diperbarui',
        life: 3000,
      })
    } else {
      await satuanStore.addSatuan(form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Satuan berhasil ditambahkan',
        life: 3000,
      })
    }

    showDialog.value = false
    satuanStore.fetchSatuan()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: satuanStore.error || 'Terjadi kesalahan',
      life: 4000,
    })
  }
}

// ❌ Hapus dengan konfirmasi
function confirmDelete(item) {
  confirm.require({
    message: `Apakah Anda yakin ingin menghapus satuan "${item.nama_satuan}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Batal',
    acceptLabel: 'Ya, Hapus',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await satuanStore.deleteSatuan(item.id)
        toast.add({
          severity: 'success',
          summary: 'Dihapus',
          detail: 'Satuan berhasil dihapus',
          life: 3000,
        })
        satuanStore.fetchSatuan()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: satuanStore.error || 'Gagal menghapus satuan',
          life: 4000,
        })
      }
    },
  })
}

// Format tanggal
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

<style scoped>
.p-tooltip {
  font-size: 0.8rem;
}
</style>

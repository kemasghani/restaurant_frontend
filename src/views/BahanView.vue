<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Bahan Baku</h2>

      <Button v-if="canManage" label="Tambah Bahan" icon="pi pi-plus" @click="openDialog('add')" />
    </div>

    <DataTable
      :value="bahanStore.data"
      :loading="bahanStore.loading"
      paginator
      :rows="10"
      stripedRows
      showGridlines
      responsiveLayout="scroll"
    >
      <Column field="id" header="No" style="width: 80px" />
      <Column field="nama_bahan" header="Nama Bahan" />
      <Column field="kategori_bahan.nama_kategori" header="Kategori" />
      <Column field="satuan_bahan.nama_satuan" header="Satuan" />
      <Column field="stok" header="Stok" />
      <Column field="stok_minimal" header="Stok Minimal" />
      <Column header="Dibuat Pada" field="created_at">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column v-if="canManage" header="Aksi" style="width: 150px; text-align: center">
        <template #body="{ data }">
          <div class="flex justify-center gap-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-sm"
              v-tooltip.bottom="'Edit bahan'"
              @click="openDialog('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm"
              v-tooltip.bottom="'Hapus bahan'"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="showDialog"
      modal
      :header="isEditing ? 'Edit Bahan' : 'Tambah Bahan Baru'"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nama Bahan</label>
          <InputText v-model="form.nama_bahan" placeholder="Masukkan nama bahan" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Kategori</label>
          <Dropdown
            v-model="form.kategori_id"
            :options="kategoriStore.data"
            optionLabel="nama_kategori"
            optionValue="id"
            placeholder="Pilih kategori"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Stok</label>
          <InputNumber v-model="form.stok" placeholder="Masukkan stok" class="w-full" min="0" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Satuan</label>
          <Dropdown
            v-model="form.satuan_id"
            :options="satuanStore.data"
            optionLabel="nama_satuan"
            optionValue="id"
            placeholder="Pilih satuan"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Batal" severity="secondary" @click="showDialog = false" />
          <Button
            :label="isEditing ? 'Perbarui' : 'Simpan'"
            :icon="isEditing ? 'pi pi-check' : 'pi pi-save'"
            @click="handleSave"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' // Tambahkan computed
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useBahanStore } from '@/stores/bahanStore'
import { useSatuanStore } from '@/stores/satuanStore'
import { useKategoriStore } from '@/stores/kategori'
import { useAuthStore } from '@/stores/auth' // Import Auth Store

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()

const bahanStore = useBahanStore()
const satuanStore = useSatuanStore()
const kategoriStore = useKategoriStore()
const authStore = useAuthStore() // Inisialisasi Auth Store

// === LOGIKA ROLE ===
// Menghasilkan true jika role BUKAN 'cabang' dan BUKAN 'supplier'
const canManage = computed(() => {
  const role = authStore.user?.role
  return role !== 'cabang' && role !== 'supplier'
})
// ===================

const showDialog = ref(false)
const isEditing = ref(false)
const selectedBahan = ref(null)
const form = ref({
  nama_bahan: '',
  stok: null,
  kategori_id: null,
  satuan_id: null,
})

onMounted(async () => {
  await bahanStore.fetchBahan()
  await satuanStore.fetchSatuan()
  await kategoriStore.fetchKategori()
})

// Fungsi buka dialog (add/edit)
const openDialog = (mode, data = null) => {
  isEditing.value = mode === 'edit'
  showDialog.value = true
  if (isEditing.value && data) {
    selectedBahan.value = data
    form.value = { ...data }
  } else {
    resetForm()
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    nama_bahan: '',
    stok: null,
    kategori_id: null,
    satuan_id: null,
  }
}

// Simpan perubahan / tambah baru
const handleSave = async () => {
  try {
    if (isEditing.value) {
      await bahanStore.updateBahan(selectedBahan.value.id, form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Data bahan berhasil diperbarui',
        life: 3000,
      })
    } else {
      await bahanStore.addBahan(form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Bahan baru berhasil ditambahkan',
        life: 3000,
      })
    }
    showDialog.value = false
    await bahanStore.fetchBahan()
    resetForm()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Terjadi kesalahan saat menyimpan data',
      life: 3000,
    })
  }
}

// Konfirmasi hapus
const confirmDelete = (data) => {
  confirm.require({
    message: `Apakah Anda yakin ingin menghapus bahan "${data.nama_bahan}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await bahanStore.deleteBahan(data.id)
        toast.add({
          severity: 'success',
          summary: 'Dihapus',
          detail: `Bahan "${data.nama_bahan}" telah dihapus`,
          life: 3000,
        })
        await bahanStore.fetchBahan()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: 'Tidak dapat menghapus bahan ini',
          life: 3000,
        })
      }
    },
  })
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

<style scoped>
.p-button {
  font-weight: 500;
}
</style>

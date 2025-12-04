<template>
  <div class="p-6">
    <!-- Toast & ConfirmDialog -->
    <Toast />
    <ConfirmDialog />

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Kategori Bahan</h2>
      <Button label="Tambah Kategori" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <!-- Tabel -->
    <DataTable
      :value="kategoriStore.data"
      :loading="kategoriStore.loading"
      paginator
      :rows="10"
      stripedRows
      showGridlines
      class="shadow rounded-xl"
    >
      <Column field="id" header="ID" sortable />
      <Column field="nama_kategori" header="Nama Kategori" sortable />
      <Column header="Dibuat Pada" field="created_at" sortable>
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
              v-tooltip.bottom="'Edit Kategori'"
              @click="openEditDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm"
              v-tooltip.bottom="'Hapus Kategori'"
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
      :header="isEditing ? 'Edit Kategori Bahan' : 'Tambah Kategori Bahan'"
      class="w-96"
    >
      <div class="flex flex-col gap-3">
        <InputText v-model="form.nama_kategori" placeholder="Nama Kategori" class="w-full" />
        <Textarea
          v-model="form.deskripsi"
          placeholder="Deskripsi (opsional)"
          rows="3"
          class="w-full"
        />
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
import { useKategoriStore } from '@/stores/kategori'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const kategoriStore = useKategoriStore()
const toast = useToast()
const confirm = useConfirm()

const showDialog = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  nama_kategori: '',
  deskripsi: '',
})

// 🧠 Fetch data saat halaman dibuka
onMounted(() => {
  kategoriStore.fetchKategori()
})

// 🟢 Open Tambah
function openAddDialog() {
  isEditing.value = false
  form.value = { id: null, nama_kategori: '', deskripsi: '' }
  showDialog.value = true
}

// 🟠 Open Edit
function openEditDialog(item) {
  isEditing.value = true
  form.value = { ...item }
  showDialog.value = true
}

// 🧾 Simpan (Tambah / Edit)
async function handleSave() {
  try {
    if (isEditing.value) {
      await kategoriStore.updateKategori(form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Kategori berhasil diperbarui',
        life: 3000,
      })
    } else {
      await kategoriStore.addKategori(form.value)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Kategori berhasil ditambahkan',
        life: 3000,
      })
    }

    showDialog.value = false
    kategoriStore.fetchKategori()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: kategoriStore.error || 'Terjadi kesalahan',
      life: 4000,
    })
  }
}

// ❌ Konfirmasi hapus
function confirmDelete(item) {
  confirm.require({
    message: `Apakah Anda yakin ingin menghapus kategori "${item.nama_kategori}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Batal',
    acceptLabel: 'Ya, Hapus',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await kategoriStore.deleteKategori(item.id)
        toast.add({
          severity: 'success',
          summary: 'Dihapus',
          detail: 'Kategori berhasil dihapus',
          life: 3000,
        })
        kategoriStore.fetchKategori()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: kategoriStore.error || 'Gagal menghapus kategori',
          life: 4000,
        })
      }
    },
  })
}

// Format tanggal tampilan
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
/* Tooltip style lebih lembut */
.p-tooltip {
  font-size: 0.8rem;
}
</style>

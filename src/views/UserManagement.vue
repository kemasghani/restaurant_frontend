<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">User Management</h2>
      <Button label="Tambah User" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <DataTable
      :value="userStore.users"
      :loading="userStore.loading"
      stripedRows
      paginator
      :rows="10"
      dataKey="id"
    >
      <Column field="id" header="ID" style="width: 70px" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="role" header="Role" sortable />
      <Column header="Aksi" bodyClass="text-center">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-sm text-blue-600"
            @click="openEditDialog(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-sm text-red-600"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Tambah/Edit -->
    <Dialog
      v-model:visible="showDialog"
      :header="isEdit ? 'Edit User' : 'Tambah User'"
      modal
      class="w-96"
    >
      <div class="flex flex-col gap-3">
        <InputText v-model="form.name" placeholder="Name" />
        <InputText v-model="form.email" placeholder="Email" />
        <InputText v-if="!isEdit" type="password" v-model="form.password" placeholder="Password" />
        <Dropdown
          v-model="form.role"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="Pilih Role"
        />
      </div>

      <template #footer>
        <Button label="Batal" class="p-button-text" @click="showDialog = false" />
        <Button :label="isEdit ? 'Simpan Perubahan' : 'Tambah'" @click="saveUser" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const userStore = useUserStore()
const confirm = useConfirm()
const toast = useToast()

const showDialog = ref(false)
const isEdit = ref(false)
const form = ref({ name: '', email: '', password: '', role: 'user' })

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Cabang', value: 'cabang' },
  { label: 'Supplier', value: 'supplier' },
]

onMounted(() => userStore.fetchUsers())

function openAddDialog() {
  isEdit.value = false
  form.value = { name: '', email: '', password: '', role: 'user' }
  showDialog.value = true
}

function openEditDialog(data) {
  isEdit.value = true
  form.value = { ...data }
  showDialog.value = true
}

async function saveUser() {
  const payload = { ...form.value }
  const result = isEdit.value
    ? await userStore.updateUser(payload.id, payload)
    : await userStore.addUser(payload)

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: isEdit.value ? 'User diperbarui' : 'User ditambahkan',
      life: 3000,
    })
    showDialog.value = false
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 4000,
    })
  }
}

function confirmDelete(data) {
  confirm.require({
    message: `Hapus user "${data.name}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      const result = await userStore.deleteUser(data.id)
      if (result.success) {
        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'User dihapus',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: result.message,
          life: 4000,
        })
      }
    },
  })
}
</script>

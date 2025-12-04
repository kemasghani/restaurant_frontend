<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Transaksi Bahan Baku</h2>
      <Button label="Tambah Transaksi" @click="openDialog" class="p-button-sm" />
    </div>

    <!-- 🧾 Table -->
    <DataTable :value="transaksiStore.list" :loading="transaksiStore.loading" paginator :rows="10" class="shadow-sm">
      <Column field="id" sortable  header="No" />
      <Column field="tipe_transaksi" sortable  header="Tipe" />
      <Column field="status" sortable  header="Status" />
      <Column field="tanggal_transaksi" sortable  header="Tanggal" />
    </DataTable>

    <!-- 🪟 Dialog Modal -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Tambah Transaksi Baru"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <!-- Tipe Transaksi -->
        <div>
          <label class="text-sm font-medium block mb-1">Tipe Transaksi</label>
          <Dropdown
            v-model="form.tipe_transaksi"
            :options="['masuk', 'keluar']"
            placeholder="Pilih tipe"
            class="w-full"
          />
        </div>

        <!-- Pilih Bahan -->
        <div>
          <label class="text-sm font-medium block mb-1">Bahan</label>
          <Dropdown
            v-model="form.bahan_id"
            :options="bahanOptions"
            optionLabel="nama_bahan"
            optionValue="id"
            placeholder="Pilih bahan"
            filter
            showClear
            class="w-full"
          />
        </div>

        <!-- Jumlah -->
        <div>
          <label class="text-sm font-medium block mb-1">Jumlah</label>
          <InputNumber v-model="form.jumlah" placeholder="Jumlah" inputClass="w-full" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Batal"
            severity="secondary"
            @click="showDialog = false"
          />
          <Button label="Simpan" @click="handleAdd" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransaksiStore } from '@/stores/transaksiStore'
import { useBahanStore } from '@/stores/bahanStore'

// 🧩 PrimeVue components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const transaksiStore = useTransaksiStore()
const bahanStore = useBahanStore()

const showDialog = ref(false)
const form = ref({ tipe_transaksi: null, bahan_id: null, jumlah: null })
const bahanOptions = ref([])

onMounted(async () => {
  await transaksiStore.listTransaksi()
  await bahanStore.fetchBahan()
  bahanOptions.value = bahanStore.data
})

const openDialog = () => {
  showDialog.value = true
}

const handleAdd = async () => {
  await transaksiStore.createManualTransaksi(form.value)
  form.value = { tipe_transaksi: null, bahan_id: null, jumlah: null }
  showDialog.value = false
}

</script>

<style>
th.p-datatable-column-sorted {
    color: black;
}
.p-datatable-column-sorted .p-datatable-sort-icon{
    color: black !important;
}
</style>

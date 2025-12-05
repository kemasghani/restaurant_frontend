<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const isCollapsed = ref(false)
const showLogout = ref(false)
const authStore = useAuthStore()

// Role user (contoh: 'cabang' atau 'supplier')
const role = computed(() => authStore.user?.role || 'guest')

// Menu dinamis berdasarkan role
const menuItems = computed(() => {
  const base = [{ path: '/', icon: '🧪', label: 'Bahan Baku' }]

  if (role.value === 'cabang') {
    base.push(
      { path: '/bahan-masuk', icon: '📦', label: 'Bahan Masuk' },
      { path: '/order', icon: '📦', label: 'Order' },
      { path: '/bahan-keluar', icon: '📤', label: 'Bahan Keluar' },
    )
  } else if (role.value === 'supplier') {
    base.push(
      { path: '/order', icon: '📦', label: 'Order' }
    )
  }
  else {
    base.push(
      { path: '/dashboard', icon: '�', label: 'Dashboard' },
      { path: '/kategori', icon: '🗂️', label: 'Kategori' },
      { path: '/satuan', icon: '⚖️', label: 'Satuan' },
      { path: '/user-management', icon: '👥', label: 'User Management' },
    )
  }

  return base
})

// Logout handler
const handleLogout = async () => {
  authStore.logout() // Pastikan store punya fungsi logout
  await router.push('/login')
}
</script>

<template>
  <nav
    :class="[
      'h-screen bg-white transition-all duration-300 ease-in-out border-r border-gray-200 flex flex-col',
      isCollapsed ? 'w-20' : 'w-64',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <img
        v-show="!isCollapsed"
        src="/logo.jpeg"
        alt="Logo MyApp"
        class="h-[100px] w-[100px] transition-opacity duration-300"
      />
      <button
        @click="isCollapsed = !isCollapsed"
        class="p-2 rounded-lg hover:bg-gray-100 text-black transition-all duration-200"
      >
        <svg
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': isCollapsed }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <div class="p-4 space-y-1 flex-1 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        v-slot="{ isActive }"
        custom
      >
        <a
          :href="item.path"
          @click.prevent="router.push(item.path)"
          :class="[
            'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group',
            isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100',
          ]"
        >
          <span class="text-xl transition-transform duration-200 group-hover:scale-105">
            {{ item.icon }}
          </span>

          <span v-show="!isCollapsed" class="font-normal transition-opacity duration-300">
            {{ item.label }}
          </span>
        </a>
      </RouterLink>
    </div>

    <!-- Footer -->
    <div class="relative p-4 border-t border-gray-200">
      <div
        :class="[
          'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer',
          isCollapsed ? 'justify-center' : '',
        ]"
        @click="showLogout = !showLogout"
      >
        <div
          class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-medium text-sm"
        >
          {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div v-show="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-black truncate">
            {{ authStore.user?.name || 'User Name' }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ authStore.user?.email || 'user@email.com' }}
          </p>
        </div>
      </div>

      <!-- Logout dropdown -->
      <transition name="fade">
        <div
          v-if="showLogout"
          class="absolute bottom-16 left-4 right-4 bg-white border rounded-lg shadow-md p-3 z-10"
        >
          <button
            @click="handleLogout"
            class="w-full text-left text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded-md"
          >
            🔒 Logout
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

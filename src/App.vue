<template>
  <div class="flex w-[100vw]">
    <!-- Sidebar: show only if not on login page -->
    <aside v-if="!isLoginPage" class="w-64">
      <Sidebar />
    </aside>

    <!-- Main content -->
    <main class="bg-white h-[100vh] w-full text-black p-5">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Sidebar from './layout/Sidebar.vue'

// access current route
const route = useRoute()

// hide sidebar on login page
const isLoginPage = computed(() => route.name === 'login')
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
auth.init()
</script>
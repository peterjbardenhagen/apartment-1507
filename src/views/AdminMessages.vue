<script setup lang="ts">
import MessagesPanel from '@/components/MessagesPanel.vue'
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Messages</h1>
      <p class="text-sm text-slate-500 mt-1.5">Message individual tenants, or everyone at once.</p>
    </div>
    <MessagesPanel />
  </div>
</template>

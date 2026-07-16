<script setup lang="ts">
import ContactsPanel from '@/components/ContactsPanel.vue'
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Contacts</h1>
      <p class="text-sm text-slate-500 mt-1.5">Everyone's contact details in one place.</p>
    </div>
    <ContactsPanel />
  </div>
</template>

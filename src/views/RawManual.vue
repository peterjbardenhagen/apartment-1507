<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ html: string; title: string }>()

const iframeRef = ref<HTMLIFrameElement | null>(null)

const resize = () => {
  const iframe = iframeRef.value
  if (!iframe) return
  try {
    const doc = iframe.contentWindow?.document
    if (doc?.body) {
      iframe.style.height = Math.max(doc.body.scrollHeight, 600) + 'px'
    }
  } catch {
    /* cross-origin safety */
  }
}

onMounted(() => {
  const iframe = iframeRef.value
  if (!iframe) return
  iframe.addEventListener('load', () => {
    resize()
    setTimeout(resize, 200)
    setTimeout(resize, 600)
    setTimeout(resize, 1200)
  })
})
</script>

<template>
  <iframe
    ref="iframeRef"
    :srcdoc="html"
    :title="title"
    class="w-full border-0 bg-white rounded-xl"
  ></iframe>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Rive } from '@rive-app/canvas'

// Props
const props = defineProps<{
  src: string
  width?: number
  height?: number
}>()

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvas.value) {
    const rive = new Rive({
      src: props.src.startsWith('/') ? props.src : `/${props.src}`, // Ensure leading slash
      canvas: canvas.value,
      autoplay: true,
    })

    // Optional: Cleanup on unmount
    // onUnmounted(() => rive.cleanup())
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    :width="width || 300"
    :height="height || 300"
    class="riv-canvas"
  />
</template>

<style scoped>
.riv-canvas {
  width: 100%;
  height: auto;
  background-color: #f4f4f4;
  border-radius: 8px;
}
</style>

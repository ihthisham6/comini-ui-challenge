<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Rive } from '@rive-app/canvas'

// Props
const props = defineProps<{
  src: string
  width?: number
  height?: number
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let riveInstance: any = null

const loadRiveAnimation = () => {
  if (canvas.value) {
    // Clean up previous instance if it exists
    if (riveInstance) {
      riveInstance.cleanup()
    }

    try {
      // Use import.meta.url to properly resolve the path
      const absolutePath = new URL(props.src, import.meta.url).href
      
      riveInstance = new Rive({
        src: absolutePath,
        canvas: canvas.value,
        autoplay: true
      })
    } catch (error) {
      console.error('Error loading Rive animation:', error)
    }
  }
}

onMounted(() => {
  loadRiveAnimation()
})

// Watch for changes in the src prop to reload animation if it changes
watch(() => props.src, () => {
  loadRiveAnimation()
})

// Cleanup on unmount
onUnmounted(() => {
  if (riveInstance) {
    riveInstance.cleanup()
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
  background-color: transparent;
  border-radius: 8px;
  display: block;
}
</style>

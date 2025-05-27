<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'

// Props
const props = defineProps<{
  src: string
  width?: number
  height?: number
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let riveInstance: any = null
const isLoading = ref(true)
const hasError = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const loadRiveAnimation = async () => {
  if (!canvas.value) return
  
  // Clean up previous instance if it exists
  if (riveInstance) {
    riveInstance.cleanup()
    riveInstance = null
  }

  isLoading.value = true
  hasError.value = false

  try {
    // Wait for next tick to ensure canvas is ready
    await nextTick()
    
    // Ensure canvas dimensions are set properly
    const canvasElement = canvas.value
    if (canvasElement) {
      canvasElement.width = props.width || 300
      canvasElement.height = props.height || 300    }
    
    // For files in public folder, use the path directly
    // Try with minimal configuration first
    riveInstance = new Rive({
      src: props.src,
      canvas: canvas.value,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center
      }),
      onLoad: () => {
        console.log('Rive animation loaded successfully')
        isLoading.value = false
        hasError.value = false
        
        // Force a play call to ensure animation starts
        if (riveInstance) {
          try {
            riveInstance.play()
          } catch (playError) {
            console.warn('Could not auto-play animation:', playError)
          }        }
      },
      onLoadError: (error) => {
        console.error('Failed to load Rive animation:', error)
        
        // Try to retry loading if we haven't exceeded max retries
        if (retryCount.value < maxRetries) {
          retryCount.value++
          console.log(`Retrying animation load (attempt ${retryCount.value}/${maxRetries})`)
          setTimeout(() => {
            loadRiveAnimation()
          }, 1000 * retryCount.value) // Exponential backoff
        } else {
          isLoading.value = false
          hasError.value = true
        }
      },
      onPlay: () => {
        console.log('Rive animation started playing')
      },
      onPause: () => {
        console.log('Rive animation paused')
      },
      onStop: () => {
        console.log('Rive animation stopped')
      }
    })
  } catch (error) {
    console.error('Error loading Rive animation:', error)
    isLoading.value = false
    hasError.value = true
  }
}

onMounted(() => {
  // Add a small delay to ensure the canvas is properly mounted
  setTimeout(() => {
    loadRiveAnimation()
  }, 100)
})

// Watch for changes in the src prop to reload animation if it changes
watch(() => props.src, () => {
  retryCount.value = 0 // Reset retry count for new src
  loadRiveAnimation()
})

// Force reload function for manual retry
const forceReload = () => {
  retryCount.value = 0
  loadRiveAnimation()
}

// Cleanup on unmount
onUnmounted(() => {
  if (riveInstance) {
    riveInstance.cleanup()
    riveInstance = null
  }
})
</script>

<template>
  <div class="rive-player-container">
    <canvas
      ref="canvas"
      :width="props.width || 300"
      :height="props.height || 300"
      class="riv-canvas"
      :class="{ 'loading': isLoading, 'error': hasError }"
    />
    <div v-if="isLoading" class="loading-indicator">
      Loading animation...
    </div>    <div v-if="hasError" class="error-indicator">
      Failed to load animation
      <button @click="forceReload" class="retry-button">Retry</button>
    </div>
  </div>
</template>

<style scoped>
.rive-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.riv-canvas {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  background-color: transparent;
  border-radius: 8px;
  display: block;
  object-fit: contain;
  /* Force hardware acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

.riv-canvas.loading {
  opacity: 0.5;
}

.riv-canvas.error {
  opacity: 0.3;
  filter: grayscale(100%);
}

.loading-indicator,
.error-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Gabarito', sans-serif;
  font-size: 14px;
  color: #666;
  text-align: center;
  z-index: 2;
}

.error-indicator {
  color: #dc3545;
}

.retry-button {
  margin-top: 8px;
  padding: 4px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.retry-button:hover {
  background: #0056b3;
}
</style>

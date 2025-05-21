<template>
  <div class="octopus-container" :style="{ width: `${width}px`, height: `${height}px` }">
    <img 
      src="../assets/icons/Union (Stroke).png" 
      class="octopus-icon"
      alt="octopus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OctopusIcon',
  props: {
    width: {
      type: Number,
      default: 40.19
    },
    height: {
      type: Number,
      default: 37.64
    }
  }
});
</script>

<style scoped>
.octopus-container {
  background-color: white;
  border-radius: 50%;
  border: 1px solid #0DA49F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.octopus-icon {
  width: 80%;
  height: 80%;
  object-fit: contain;
  background-color: #0DA49F;
  -webkit-mask-image: url('../assets/icons/Union (Stroke).png');
  mask-image: url('../assets/icons/Union (Stroke).png');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
</style> 
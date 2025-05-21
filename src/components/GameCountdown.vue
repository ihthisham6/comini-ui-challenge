<template>
  <div>
    <div class="countdown-overlay" v-if="isVisible && !showGame">
      <template v-if="showObjective">
        <div class="objective-container">
          <div class="top-left-icon">
            <OctopusIcon :width="40.19" :height="37.64" />
          </div>
          <div class="objective-text">
            Order the giraffes based on their Height
          </div>
        </div>
      </template>
      <div v-else class="countdown-number" :key="currentText">
        {{ currentText }}
      </div>
    </div>
    <GiraffeGameUI v-if="showGame" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import OctopusIcon from './OctopusIcon.vue';
import GiraffeGameUI from './GiraffeGameUI.vue';

export default defineComponent({
  name: 'GameCountdown',
  components: {
    OctopusIcon,
    GiraffeGameUI
  },
  props: {
    isVisible: Boolean
  },
  emits: ['countdown-complete'],
  setup(props, { emit }) {
    const currentText = ref('Ready?');
    const showObjective = ref(false);
    const showGame = ref(false);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const startCountdown = async () => {
      showObjective.value = false;
      showGame.value = false;
      
      // Show Ready? first
      currentText.value = 'Ready?';
      await sleep(800);

      // Start countdown
      currentText.value = '3';
      await sleep(800);

      currentText.value = '2';
      await sleep(800);

      currentText.value = '1';
      await sleep(800);

      // Show objective
      showObjective.value = true;
      await sleep(2000); // Show objective for 2 seconds

      // Show game
      showGame.value = true;

      // Complete
      emit('countdown-complete');
    };

    watch(() => props.isVisible, (newVal) => {
      if (newVal) {
        startCountdown();
      }
    });

    return { currentText, showObjective, showGame };
  }
});
</script>

<style scoped>
.countdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.objective-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-left-icon {
  position: absolute;
  top: 20px;
  left: 18.21px;
  z-index: 2001;
}

.countdown-number {
  font-family: 'Gabarito', sans-serif;
  font-weight: 700;
  font-size: 56px;
  color: #6BADD7;
  width: 181px;
  height: 67px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: numberAnimation 800ms ease-in-out;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.objective-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #6BADD7;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.85);
  padding: 15px 30px;
  border-radius: 8px;
}

@keyframes numberAnimation {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 1;
    transform: scale(1.1);
  }
  40%, 80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 
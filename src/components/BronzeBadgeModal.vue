<template>
  <div class="badge-modal">
    <div class="modal-content">
      <div class="close-button" @click="$emit('close')">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      
      <div class="badge-icon">
        <img src="/src/assets/icons/Bronze league.png" alt="Bronze Badge" class="badge-image" />
      </div>

      <h2 class="badge-title">Bronze Badge</h2>
      <p class="badge-subtitle">Keep going to unlock the silver badge!</p>

      <div class="badge-buttons">
        <button class="play-again-btn" @click="handlePlayAgain">
          Play again
        </button>
        <button class="continue-home-btn" @click="handleContinueHome">
          Continue to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import OctopusIcon from './OctopusIcon.vue';

export default defineComponent({
  name: 'BronzeBadgeModal',
  components: {
    OctopusIcon
  },
  props: {
    hasFeedback: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const handlePlayAgain = () => {
      router.push('/giraffe-gameplay-level2');
    };

    const handleContinueHome = () => {
      if (!props.hasFeedback) {
        router.push('/game-feedback-emoji');
      } else {
        router.push('/home');
      }
    };

    return {
      handlePlayAgain,
      handleContinueHome
    };
  }
});
</script>

<style scoped>
.badge-modal {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
  position: relative;
}

.close-button {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.octopus-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
  position: static;
}

.badge-icon {
  margin: 40px 0;
  animation: scaleIn 0.5s ease forwards;
}

.badge-image {
  width: 100px;
  height: auto;
  object-fit: contain;
}

.badge-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 28px;
  color: #222;
  margin: 0 0 8px 0;
  font-weight: 700;
  text-align: center;
}

.badge-subtitle {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0 0 32px 0;
}

.badge-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.play-again-btn, .continue-home-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.play-again-btn {
  background: white;
  border: 1px solid #E4E4E4;
  color: #222;
}

.continue-home-btn {
  background: #4AC1BD;
  border: none;
  color: white;
}

.play-again-btn:hover {
  background: #f8f9fa;
}

.continue-home-btn:hover {
  background: #3AABA7;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 
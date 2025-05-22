<template>
  <div>
    <div class="modal-overlay" v-if="isOpen && !showCountdown" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">Compare the numbers and find out who is taller!</span>
          <button class="close-button" @click="closeModal">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="preview-container">
          <RivePlayer
            src="src/assets/rive/giraffes.riv"
            :width="312"
            :height="200"
          />
        </div>
        <button class="lets-go-button" @click="handleStartGame">
          Let's go!
        </button>
      </div>
    </div>
    <GameCountdown 
      :is-visible="showCountdown"
      @countdown-complete="onCountdownComplete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RivePlayer from './RivePlayer.vue';
import GameCountdown from './GameCountdown.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'GamePreviewModal',
  components: {
    RivePlayer,
    GameCountdown
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'start-game'],
  setup(props, { emit }) {
    const showCountdown = ref(false);
    const router = useRouter();

    const closeModal = () => {
      emit('close');
    };

    const handleStartGame = () => {
      showCountdown.value = true;
    };

    const onCountdownComplete = () => {
      showCountdown.value = false;
      router.push('/giraffe-gameplay');
    };

    return {
      showCountdown,
      closeModal,
      handleStartGame,
      onCountdownComplete
    };
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  width: 90%;
  max-width: 312px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  flex: 1;
  padding-right: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
}

.preview-container {
  width: 100%;
  height: 200px;
  background: #FFFFFF;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lets-go-button {
  width: 100%;
  height: 38px;
  background: #4AC1BD;
  border: 1px solid #25A49F;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lets-go-button:hover {
  background: #3DB1AD;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .modal-content {
    max-width: 400px;
  }

  .modal-title {
    font-size: 18px;
  }

  .preview-container {
    height: 250px;
  }

  .lets-go-button {
    height: 42px;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .modal-content {
    max-width: 480px;
  }

  .preview-container {
    height: 300px;
  }

  .lets-go-button {
    height: 44px;
    font-size: 16px;
  }
}
</style> 
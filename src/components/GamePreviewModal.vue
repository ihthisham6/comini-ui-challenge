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
            src="/rive/giraffes.riv"
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
import { defineComponent, ref, watch } from 'vue';
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
      // Restore original overflow styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      emit('close');
    };

    const handleStartGame = () => {
      showCountdown.value = true;
    };

    const onCountdownComplete = () => {
      showCountdown.value = false;
      // Restore original overflow styles before navigating
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      router.push('/giraffe-gameplay');
    };

    // Watch for modal open/close to manage body overflow
    watch(() => props.isOpen, (isOpen: boolean) => {
      if (isOpen) {
        // Allow scrolling when modal is open
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
      } else {
        // Restore original styles when modal is closed
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
      }
    });

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
/* Force scrolling for the modal overlay with highest specificity */
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 1000 !important;
  animation: fadeIn 0.3s ease-out;
  overflow-y: scroll !important; /* Force scrolling with !important */
  -webkit-overflow-scrolling: touch !important;
  padding: 40px 0 !important; /* Add generous padding for all screens */
}

.modal-content {
  width: 90%;
  max-width: 312px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  animation: slideIn 0.3s ease-out;
  margin: 20px auto; /* Add margin to ensure spacing */
  flex-shrink: 0; /* Prevent shrinking */
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
  .modal-overlay {
    padding: 80px 20px 200px !important; /* Increase bottom padding for more space */
    align-items: flex-start !important; /* Align to top for better scrollability */
    overflow-y: scroll !important; /* Force scroll for testing */
    -webkit-overflow-scrolling: touch !important;
    justify-content: center !important; /* Center horizontally */
    min-height: 100vh !important; /* Ensure full viewport height */
  }

  .modal-content {
    max-width: 600px !important;
    padding: 40px !important;
    margin: 60px auto 180px !important; /* Increase bottom margin for more space */
    position: relative !important;
    min-height: auto !important; /* Ensure content can determine height */
    flex-shrink: 0 !important; /* Prevent modal from shrinking */
  }

  .modal-title {
    font-size: 20px !important;
    margin-bottom: 30px !important;
  }

  .preview-container {
    height: 380px !important;
    margin-bottom: 50px !important; /* Increase gap between preview and button */
  }

  .lets-go-button {
    height: 50px !important;
    font-size: 18px !important;
    margin-bottom: 80px !important; /* Even more bottom margin for testing */
  }

  /* Add debug styling to see modal bounds */
  .modal-content::after {
    content: '' !important;
    display: block !important;
    height: 80px !important; /* Extra space for testing */
    width: 100% !important;
  }
}
</style> 
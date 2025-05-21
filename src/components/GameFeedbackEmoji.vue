<template>
  <div class="feedback-container">
    <div class="modal-content">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      
      <h2 class="feedback-title">How did you feel about this activity?</h2>
      
      <div class="emoji-row">
        <button 
          class="emoji-button" 
          :class="{ selected: selectedEmoji === 'sad' }"
          @click="selectEmoji('sad')">
          <font-awesome-icon :icon="['fas', 'face-sad-tear']" />
        </button>
        <button 
          class="emoji-button" 
          :class="{ selected: selectedEmoji === 'neutral' }"
          @click="selectEmoji('neutral')">
          <font-awesome-icon :icon="['fas', 'face-meh']" />
        </button>
        <button 
          class="emoji-button" 
          :class="{ selected: selectedEmoji === 'happy' }"
          @click="selectEmoji('happy')">
          <font-awesome-icon :icon="['fas', 'face-smile']" />
        </button>
      </div>

      <button 
        class="continue-button" 
        :disabled="!selectedEmoji"
        @click="handleContinue">
        Continue
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import OctopusIcon from './OctopusIcon.vue';

export default defineComponent({
  name: 'GameFeedbackEmoji',
  components: {
    OctopusIcon
  },
  setup() {
    const router = useRouter();
    const selectedEmoji = ref<string | null>(null);

    const selectEmoji = (emoji: string) => {
      selectedEmoji.value = emoji;
      // Log the selection
      switch(emoji) {
        case 'sad':
          console.log('disappointing');
          break;
        case 'neutral':
          console.log('neutral');
          break;
        case 'happy':
          console.log('happy');
          break;
      }
    };

    const handleContinue = () => {
      if (selectedEmoji.value) {
        // Store the selection in localStorage for the next page
        localStorage.setItem('selectedEmoji', selectedEmoji.value);
        router.push('/game-feedback-detail');
      }
    };

    return {
      selectedEmoji,
      selectEmoji,
      handleContinue
    };
  }
});
</script>

<style scoped>
.feedback-container {
  position: fixed;
  inset: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px;
  cursor: pointer;
  color: #666;
}

.octopus-icon {
  margin-bottom: 24px;
}

.feedback-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.emoji-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.emoji-button {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 50%;
  padding: 8px;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #666;
}

.emoji-button.selected {
  border-color: #4AC1BD;
  background: rgba(74, 193, 189, 0.1);
  color: #4AC1BD;
}

.continue-button {
  width: 100%;
  padding: 12px;
  background: #4AC1BD;
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.continue-button:disabled {
  background: #E0E0E0;
  cursor: not-allowed;
}

.continue-button:not(:disabled):hover {
  background: #3AABA7;
}
</style> 
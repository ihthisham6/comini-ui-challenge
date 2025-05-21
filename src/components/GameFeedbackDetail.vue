<template>
  <div class="feedback-container">
    <div class="modal-content">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>

      <div class="emoji-row">
        <font-awesome-icon 
          :icon="['fas', getSelectedEmojiIcon]" 
          class="selected-emoji"
          :class="selectedEmoji" />
      </div>
      
      <h2 class="feedback-title">{{ feedbackTitle }}</h2>
      
      <div class="feedback-form">
        <h3 class="form-subtitle">What did you like about this activity?</h3>
        <textarea 
          v-model="feedbackText"
          class="feedback-input"
          placeholder="Share your thoughts"
        ></textarea>
      </div>

      <div class="button-group">
        <button 
          class="submit-button"
          :disabled="!feedbackText.trim()"
          @click="handleSubmit">
          Submit Feedback
        </button>
        <button class="skip-button" @click="handleSkip">
          Skip
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OctopusIcon from './OctopusIcon.vue';

export default defineComponent({
  name: 'GameFeedbackDetail',
  components: {
    OctopusIcon
  },
  setup() {
    const router = useRouter();
    const selectedEmoji = ref<string>('happy');
    const feedbackText = ref('');

    onMounted(() => {
      const storedEmoji = localStorage.getItem('selectedEmoji');
      if (storedEmoji) {
        selectedEmoji.value = storedEmoji;
      }
    });

    const getSelectedEmojiIcon = computed(() => {
      switch(selectedEmoji.value) {
        case 'sad':
          return 'face-sad-tear';
        case 'neutral':
          return 'face-meh';
        case 'happy':
          return 'face-smile';
        default:
          return 'face-smile';
      }
    });

    const feedbackTitle = computed(() => {
      switch(selectedEmoji.value) {
        case 'sad':
          return 'You did not like this story!';
        case 'neutral':
          return 'You thought this story was okay!';
        case 'happy':
          return 'You loved this story!';
        default:
          return '';
      }
    });

    const handleSubmit = () => {
      console.log('Feedback:', feedbackText.value);
      document.cookie = 'giraffe_game_feedback=true; path=/; max-age=31536000';
      router.push('/home');
    };

    const handleSkip = () => {
      document.cookie = 'giraffe_game_feedback=true; path=/; max-age=31536000';
      router.push('/home');
    };

    return {
      selectedEmoji,
      feedbackText,
      feedbackTitle,
      getSelectedEmojiIcon,
      handleSubmit,
      handleSkip
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

.emoji-row {
  margin-bottom: 16px;
}

.selected-emoji {
  font-size: 40px;
  color: #666;
}

.selected-emoji.sad {
  color: #DC3545;
}

.selected-emoji.neutral {
  color: #FFC107;
}

.selected-emoji.happy {
  color: #4AC1BD;
}

.feedback-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.feedback-form {
  width: 100%;
  margin-bottom: 24px;
}

.form-subtitle {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #222;
  margin-bottom: 12px;
}

.feedback-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 14px;
  resize: none;
}

.feedback-input::placeholder {
  color: #999;
}

.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-button, .skip-button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button {
  background: #9E9E9E;
  border: none;
  color: white;
}

.submit-button:not(:disabled) {
  background: #4AC1BD;
}

.submit-button:not(:disabled):hover {
  background: #3AABA7;
}

.skip-button {
  background: none;
  border: none;
  color: #666;
}

.skip-button:hover {
  color: #333;
}
</style> 
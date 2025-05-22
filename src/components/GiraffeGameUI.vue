<template>
  <div class="game-container">
    <!-- Top bar with icons -->
    <div class="top-bar" :class="{ 'fade-in': showControls }">
      <div class="ripples-icon">
        <OctopusIcon :width="40" :height="40" />
      </div>
      <div class="control-buttons">
        <button class="pause-button">
          <font-awesome-icon icon="pause" />
        </button>
        <button class="options-button">
          <font-awesome-icon icon="ellipsis-v" />
        </button>
      </div>
    </div>

    <!-- Game content -->
    <div class="game-content">
      <!-- Objective text -->
      <div class="objective-text" :class="{ 'slide-up': showControls }">
        Order the giraffes based on their Height
      </div>

      <!-- Giraffes container -->
      <div class="giraffes-container">
        <div v-for="(giraffe, index) in shuffledGiraffes" 
             :key="giraffe.id"
             class="giraffe"
             :class="{ 'slide-in': showGiraffes }"
             :style="{ 
               'animation-delay': `${300 * index}ms`,
               height: `${giraffe.height}px`
             }">
          <img :src="`/src/assets/icons/giraffe${giraffe.id}.png`" :alt="`Giraffe ${giraffe.id}`" />
          <div class="number-drop-zone" 
               @dragover.prevent
               @drop="handleDrop($event, index)">
            {{ giraffe.currentNumber || '' }}
          </div>
        </div>
      </div>

      <!-- Grass background -->
      <div class="grass" :class="{ 'fade-in': showControls }">
        <img src="/src/assets/icons/grass.png" alt="Grass" class="grass-image" />
      </div>

      <!-- Answer options -->
      <div class="answer-options" :class="{ 'fade-in': showAnswers }">
        <div class="number-buttons">
          <div v-for="number in [1, 4, 2]" 
               :key="number" 
               class="number-button"
               draggable="true"
               @dragstart="handleDragStart($event, number)"
               :class="{ 'used': usedNumbers.includes(number) }">
            {{ number }}
          </div>
        </div>
        <button class="check-button" @click="checkAnswer" :disabled="!isComplete">
          Let's Check!
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import OctopusIcon from './OctopusIcon.vue';

export default defineComponent({
  name: 'GiraffeGameUI',
  components: {
    OctopusIcon
  },
  setup() {
    const showControls = ref(false);
    const showGiraffes = ref(false);
    const showAnswers = ref(false);
    const usedNumbers = ref<number[]>([]);
    const draggedNumber = ref<number | null>(null);

    // Original giraffe data with correct order
    const giraffes = [
      { id: 1, height: 120, correctNumber: 1 }, // Shortest
      { id: 2, height: 180, correctNumber: 4 }, // Tallest
      { id: 3, height: 150, correctNumber: 2 }, // Medium
    ];

    // Shuffle giraffes for initial display
    const shuffledGiraffes = ref(shuffleArray([...giraffes]));

    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const handleDragStart = (event: DragEvent, number: number) => {
      if (!usedNumbers.value.includes(number)) {
        draggedNumber.value = number;
      }
    };

    const handleDrop = (event: DragEvent, index: number) => {
      event.preventDefault();
      if (draggedNumber.value !== null) {
        // Remove number if it was previously assigned
        const oldIndex = shuffledGiraffes.value.findIndex(g => g.currentNumber === draggedNumber.value);
        if (oldIndex !== -1) {
          shuffledGiraffes.value[oldIndex].currentNumber = undefined;
        }

        // Remove old number from this position if it exists
        const oldNumber = shuffledGiraffes.value[index].currentNumber;
        if (oldNumber) {
          usedNumbers.value = usedNumbers.value.filter(n => n !== oldNumber);
        }

        // Assign new number
        shuffledGiraffes.value[index].currentNumber = draggedNumber.value;
        if (!usedNumbers.value.includes(draggedNumber.value)) {
          usedNumbers.value.push(draggedNumber.value);
        }
        draggedNumber.value = null;
      }
    };

    const isComplete = computed(() => {
      return shuffledGiraffes.value.every(giraffe => giraffe.currentNumber !== undefined);
    });

    const checkAnswer = () => {
      // Check if numbers match correct order
      const isCorrect = shuffledGiraffes.value.every(giraffe => 
        giraffe.currentNumber === giraffe.correctNumber
      );
      // Emit result or handle feedback
      console.log('Answer is:', isCorrect ? 'Correct!' : 'Try again!');
    };

    // Start animations
    setTimeout(() => {
      showControls.value = true;
    }, 1500);

    setTimeout(() => {
      showGiraffes.value = true;
    }, 2500);

    setTimeout(() => {
      showAnswers.value = true;
    }, 3700);

    return {
      showControls,
      showGiraffes,
      showAnswers,
      shuffledGiraffes,
      usedNumbers,
      handleDragStart,
      handleDrop,
      checkAnswer,
      isComplete
    };
  }
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #FFFFFF;
  overflow: hidden;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  opacity: 0;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.pause-button,
.options-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 20px;
}

.objective-text {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #000000;
  text-align: center;
  transition: transform 0.5s ease;
  width: 316px;
}

.giraffes-container {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  width: 316px;
  padding: 0 20px;
  z-index: 1;
}

.giraffe {
  opacity: 0;
  transform: translateY(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 90px;
}

.giraffe img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.number-drop-zone {
  width: 98px;
  height: 92px;
  border: 1.5px dashed #3A8737;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #FFFFFF;
  margin-top: 10px;
  background: rgba(143, 209, 79, 0.3);
}

.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  opacity: 0;
  overflow: hidden;
}

.grass-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.answer-options {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 316px;
  opacity: 0;
}

.number-buttons {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 44px;
  position: relative;
  height: 92px;
}

.number-button {
  width: 98px;
  height: 92px;
  border-radius: 8px;
  border: 1.5px solid #3A8737;
  background: #8FD14F;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: bold;
  cursor: grab;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.number-button.used {
  opacity: 0.5;
  cursor: not-allowed;
}

.number-button:nth-child(1) {
  left: 25px;
}

.number-button:nth-child(2) {
  left: 131px;
}

.number-button:nth-child(3) {
  left: 237px;
}

.check-button {
  width: 316px;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #E4E4E4;
  background: #FFFFFF;
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  left: 22px;
}

.check-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animation classes */
.slide-up {
  transform: translate(-50%, 20px);
}

.fade-in {
  opacity: 1;
  transition: opacity 0.5s ease;
}

.slide-in {
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
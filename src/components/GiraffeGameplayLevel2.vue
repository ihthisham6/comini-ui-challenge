<template>
  <div class="gameplay-container" :class="{ 'hide-gameplay': showGreatWorkModal || showSilverBadgeUnlock || showSilverBadgeScreen || showEmojiScreen || showFeedbackForm }">
    <!-- Game title -->
    <div class="game-title" :class="{ 'fade-out': showGameContent }">
      Order the giraffes based on their Height
    </div>

    <!-- Objective Screen -->
    <div v-if="showObjective" class="objective-screen" :class="{ 'fade-in': showObjective }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">New giraffe has joined the line!</p>
    </div>

    <!-- Initial Game content -->
    <div v-show="showGameContent && !showObjective && !showSecondaryPhase" class="game-content" :class="{ 'fade-in': showGameContent }">
      <!-- Top bar -->
      <div class="top-bar">
        <div class="octopus-icon">
          <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        </div>
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>

      <!-- Giraffes area -->
      <div class="giraffes-area">
        <div v-for="(position, index) in positions" 
             :key="index"
             class="giraffe-slot"
             :class="{ 'slide-in': showGiraffes }"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <!-- Speech bubble -->
          <div v-if="showFeedback" 
               class="speech-bubble"
               :class="{ 'fade-in': showFeedback }">
            {{ getSpeechText(position) }}
          </div>
          
          <template v-if="position.giraffe">
            <div class="giraffe-container">
              <img :src="getGiraffeHead(position)" 
                   :alt="`Giraffe ${position.giraffe.id}`"
                   class="giraffe-image" />
            </div>
          </template>
        </div>
      </div>

      <!-- Answer section with grass background -->
      <div class="answer-section">
        <div class="grass-outline"></div>
        <img src="/assets/icons/grass.png" class="grass-bg" alt="Grass" />
        
        <!-- Number buttons -->
        <div class="number-slots">
          <div v-for="(position, index) in positions" 
               :key="index"
               class="number-slot"
               @dragover.prevent
               @drop="handleDrop($event, index)">
            <div v-if="position.number !== null"
                 class="number-button"
                 draggable="true"
                 @dragstart="handleDragStart($event, index)">
              {{ position.number }}
            </div>
          </div>
        </div>

        <!-- Check button -->
        <button class="check-button" @click="checkAnswer">
          Let's Check!
        </button>
      </div>
    </div>

    <!-- Warning Feedback -->
    <div v-if="showWarning" class="warning-feedback" :class="{ 'slide-in': showWarning }">
      <h2 class="warning-title">Oh no!</h2>
      <p class="warning-text">The Giraffes are still mixed up!</p>
      <button class="try-again-button" @click="resetGame">Try Again</button>
    </div>

    <!-- Success Feedback -->
    <div v-if="showSuccess" class="success-feedback" :class="{ 'slide-in': showSuccess }">
      <h2 class="success-title">Awesome!</h2>
      <p class="success-text">The Giraffes are now in order.</p>
      <button class="continue-button" @click="handleContinue">Continue</button>
    </div>

    <!-- Secondary Gameplay Phase -->
    <div v-if="showSecondaryPhase" class="secondary-phase">
      <!-- Top bar -->
      <div class="top-bar">
        <div class="octopus-icon">
          <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        </div>
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>

      <!-- Title below navbar -->
      <p class="secondary-title">Find the missing number for the new giraffe</p>

      <!-- Giraffes container -->
      <div class="secondary-giraffes-container">
        <div v-for="(giraffe, index) in secondaryGiraffes" 
             :key="index"
             class="secondary-giraffe"
             :class="{ 'slide-in': showSecondaryGiraffes }"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <div class="speech-bubble" 
               :class="{ 
                 'fade-in': showSecondaryGiraffes || showSuccessSpeech,
                 'success-speech': showSuccessSpeech 
               }">
            {{ showSuccessSpeech ? giraffe.successSpeech : giraffe.speech }}
          </div>
          <img :src="`@/assets/icons/${giraffe.image}`" 
               :alt="`Giraffe ${index + 1}`"
               class="giraffe-image" />
        </div>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showGrassArea }">
        <div class="grass-outline"></div>
        <img src="@/assets/icons/grass.png" class="grass-bg" alt="Grass" />
      </div>

      <!-- Question Modal -->
      <div v-if="showQuestionModal" 
           class="question-modal" 
           :class="{ 'slide-in': showQuestionModal }">
        <p class="question-text">What should be the number for the new giraffe?</p>
        <div class="options-container">
          <button v-for="option in [50, 30, 60]" 
                  :key="option"
                  class="option-button"
                  @click="handleOptionSelect(option)">
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Success Feedback -->
      <div v-if="showSecondarySuccess" 
           class="success-feedback" 
           :class="{ 'slide-in': showSecondarySuccess }">
        <h2 class="success-title">Awesome!</h2>
        <p class="success-text">The Giraffes are now in order.</p>
        <button class="continue-button" @click="handleSecondaryComplete">Continue</button>
      </div>
    </div>

    <!-- Warning Feedback -->
    <div v-if="showSecondaryWarning" 
         class="warning-feedback" 
         :class="{ 'slide-in': showSecondaryWarning }">
      <h2 class="warning-title">Oh no!</h2>
      <p class="warning-text">That was not the right number</p>
      <button class="try-again-button" @click="handleSecondaryTryAgain">Try Again</button>
    </div>

    <!-- Tertiary Objective Screen -->
    <div v-if="showTertiaryObjective" class="objective-screen" :class="{ 'fade-in': showTertiaryObjective }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">Let's compare more giraffes!</p>
    </div>

    <!-- Tertiary Gameplay Phase -->
    <div v-if="showTertiaryPhase && !showTertiarySuccess" class="tertiary-phase">
      <!-- Top bar -->
      <div class="top-bar" :class="{ 'fade-in': showTertiaryContent }">
        <div class="octopus-icon">
          <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        </div>
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showTertiaryContent }">
        <div class="grass-outline">
          <div class="giraffe-labels">
            <span v-for="label in ['A', 'B', 'C', 'D']" :key="label">{{ label }}</span>
          </div>
        </div>
        <img src="@/assets/icons/grass.png" class="grass-bg" alt="Grass" />
      </div>

      <!-- Giraffes with equal heights -->
      <div class="tertiary-giraffes-container">
        <div v-for="(giraffe, index) in tertiaryGiraffes" 
             :key="index"
             class="tertiary-giraffe"
             :class="{ 'slide-in': showTertiaryGiraffes }"
             :style="{ 'animation-delay': `${300 * index}ms` }"
             :data-label="giraffe.label">
          <div class="tertiary-bubble" :class="{ 'fade-in': showTertiaryGiraffes }">
            {{ giraffe.height }}
          </div>
          <div class="giraffe-wrapper">
            <img src="/src/assets/icons/giraffe2.png" 
                 :alt="`Giraffe ${giraffe.label}`"
                 class="giraffe-image" />
          </div>
        </div>
      </div>

      <!-- Question Modal -->
      <div v-if="showTertiaryQuestion" 
           class="question-modal tertiary-modal" 
           :class="{ 'slide-in': showTertiaryQuestion }">
        <p class="question-text">Who is the tallest Giraffe?</p>
        <div class="options-container">
          <button v-for="option in ['A', 'D', 'B']" 
                  :key="option"
                  class="option-button"
                  :class="{ 'selected': selectedOption === option }"
                  @click="handleTertiaryOptionSelect(option)">
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Screen -->
    <div v-if="showTertiarySuccess" class="secondary-phase">
      <!-- Top bar -->
      <div class="top-bar">
        <div class="octopus-icon">
          <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        </div>
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>

      <!-- Giraffes container -->
      <div class="secondary-giraffes-container">
        <div v-for="(giraffe, index) in successGiraffes" 
             :key="index"
             class="secondary-giraffe"
             :class="{ 'slide-in': showTertiarySuccess }"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <!-- Only show bubble for tallest giraffe (index 3) -->
          <div v-if="index === 3" 
               class="speech-bubble" 
               :class="{ 'fade-in': showTertiarySuccess }">
            I'm the tallest!
          </div>
          <img :src="`@/assets/icons/${giraffe.image}`" 
               :alt="`Giraffe ${giraffe.label}`"
               class="giraffe-image" />
        </div>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showTertiarySuccess }">
        <div class="grass-outline"></div>
        <img src="@/assets/icons/grass.png" class="grass-bg" alt="Grass" />
      </div>

      <!-- Success Modal -->
      <div class="success-feedback" :class="{ 'slide-in': showTertiarySuccess }">
        <h2 class="success-title">Awesome!</h2>
        <p class="success-text">Giraffe D was the tallest!</p>
        <button class="continue-button" @click="handleTertiaryContinue">Continue</button>
      </div>
    </div>

    <!-- Warning Feedback -->
    <div v-if="showTertiaryWarning" 
         class="warning-feedback" 
         :class="{ 'slide-in': showTertiaryWarning }">
      <h2 class="warning-title">Hmm..</h2>
      <p class="warning-text">Giraffe {{ wrongGiraffeLabel }} was not the tallest.</p>
      <button class="try-again-button" @click="handleTertiaryTryAgain">Try Again</button>
    </div>

    <!-- Level 3 Objective Screen -->
    <div v-if="showLevel3Objective" class="objective-screen fade-in">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">Welcome to Level 3! Get ready for a new challenge!</p>
    </div>
  </div>

  <!-- Modals and screens -->
  <div class="modals-container">
    <!-- Great Work Modal -->
    <div v-if="showGreatWorkModal && !showLevel3Objective" class="great-work-modal">
      <div class="modal-content">
        <div class="close-button">
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
        <div class="octopus-icon">
          <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        </div>
        <h2 class="great-work-title">Great Work!</h2>
        <div class="stars-row">
          <span class="star" :class="{ filled: filledStars >= 1 }">★</span>
          <span class="star" :class="{ filled: filledStars >= 2 }">★</span>
          <span class="star">★</span>
        </div>
        <div v-if="showButtons" class="great-work-buttons">
          <button class="play-again-btn" @click="handlePlayAgain">Play again</button>
          <button class="continue-home-btn" @click="handleContinueToHome">Continue to Home</button>
        </div>
      </div>
    </div>

    <!-- Silver Badge Unlock Screen -->
    <div v-if="showSilverBadgeUnlock" 
         class="silver-badge-unlock" 
         :class="{ 'fade-in': showSilverBadgeUnlock }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="silver-badge-unlock-text">You unlocked the Silver Badge!</h2>
      <img src="/src/assets/icons/Silver League.png" alt="Silver Badge" class="badge-icon-unlock" />
    </div>

    <!-- Silver Badge Screen -->
    <div v-if="showSilverBadgeScreen && !showLevel3Objective" 
         class="silver-badge-screen" 
         :class="{ 'fade-in': showSilverBadgeScreen }">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="silver-badge-title">You unlocked the Silver Badge!</h2>
      <img src="/src/assets/icons/Silver League.png" alt="Silver Badge" class="badge-icon" />
      <div class="progress-container">
        <div class="progress-bar"></div>
      </div>
      <p class="progress-text">Keep going to unlock the gold badge!</p>
      <button class="play-again-button" @click="() => { console.log('Button rendered and clicked'); handlePlayAgain(); }">Play again</button>
      <button class="continue-home-button" @click="handleContinueToHome">Continue to Home</button>
    </div>

    <!-- Emoji Screen -->
    <div v-if="showEmojiScreen && !showLevel3Objective" 
         class="emoji-screen" 
         :class="{ 'fade-in': showEmojiScreen }">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="emoji-title">How did you feel about this activity?</h2>
      <div class="emoji-container">
        <button class="emoji-button sad" @click="handleEmojiSelect('sad')">😟</button>
        <button class="emoji-button neutral" @click="handleEmojiSelect('neutral')">😐</button>
        <button class="emoji-button happy" @click="handleEmojiSelect('happy')">😊</button>
      </div>
      <button class="continue-button" @click="handleContinueToHome">Continue</button>
    </div>

    <!-- Feedback Form -->
    <div v-if="showFeedbackForm && !showLevel3Objective" 
         class="feedback-form" 
         :class="{ 'fade-in': showFeedbackForm }">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <div class="selected-emoji">
        <span v-if="selectedEmoji === 'sad'">😟</span>
        <span v-if="selectedEmoji === 'neutral'">😐</span>
        <span v-if="selectedEmoji === 'happy'">😊</span>
      </div>
      <h2 class="feedback-title">What did you like about this activity?</h2>
      <textarea v-model="feedbackText" placeholder="Share your thoughts" class="feedback-textarea"></textarea>
      <button class="submit-button" @click="handleFeedbackSubmit">Submit Feedback</button>
      <button class="skip-button" @click="handleFeedbackSkip">Skip</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import OctopusIcon from './OctopusIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import { getImageUrl } from '../utils/imageUtils';

interface Giraffe {
  id: number;
  height: number;
  correctNumber: number;
}

interface Position {
  giraffe: Giraffe | null;
  number: number | null;
  isCorrect?: boolean;
}

export default defineComponent({
  name: 'GiraffeGameplayLevel2',
  components: {
    OctopusIcon,
    FontAwesomeIcon
  },
  setup() {
    const router = useRouter();
    const showGameContent = ref(false);
    const showGiraffes = ref(false);
    const showFeedback = ref(false);
    const showWarning = ref(false);
    const showSuccess = ref(false);
    const dragStartIndex = ref<number | null>(null);
    const showObjective = ref(false);
    
    // New refs for secondary gameplay
    const showSecondaryPhase = ref(false);
    const showSecondaryGiraffes = ref(false);
    const showQuestionModal = ref(false);
    const showGrassArea = ref(false);
    const showTertiaryObjective = ref(false);

    // Secondary gameplay giraffes
    const secondaryGiraffes = ref([
      { height: 1, image: 'Giraffe1.png', speech: "I'm the shortest!", successSpeech: "I'm the shortest!" },
      { height: 2, image: 'giraffe3.png', speech: "I'm number 2!", successSpeech: "I'm number 2!" },
      { height: 3, image: 'giraffe3.png', speech: "What's my number?", successSpeech: "I'm number 3!" },
      { height: 4, image: 'giraffe2.png', speech: "I'm the tallest!", successSpeech: "I'm the tallest!" }
    ]);

    const showSuccessSpeech = ref(false);
    const showSecondarySuccess = ref(false);
    const showSecondaryWarning = ref(false);

    // Add to existing refs
    const showTertiaryPhase = ref(false);
    const showTertiaryContent = ref(false);
    const showTertiaryGiraffes = ref(false);
    const showTertiaryQuestion = ref(false);
    const selectedOption = ref<string | null>(null);
    const showTertiaryWarning = ref(false);
    const wrongGiraffeLabel = ref('');
    const showTertiarySuccess = ref(false);

    // Update tertiaryGiraffes data
    const tertiaryGiraffes = ref([
      { height: 10, label: 'A', successText: "I'm the shortest!", scale: 0.7, image: 'giraffe1.png' },
      { height: 25, label: 'B', successText: "I'm taller than A!", scale: 0.85, image: 'giraffe3.png' },
      { height: 27, label: 'C', successText: "I'm almost the tallest!", scale: 0.9, image: '2HeightGiraffe.png' },
      { height: 40, label: 'D', successText: "I'm the tallest!", scale: 1, image: 'giraffe2.png' }
    ]);

    const successGiraffes = [
      { label: 'A', scale: 0.7, image: 'giraffe1.png' },
      { label: 'B', scale: 0.85, image: 'giraffe3.png' },
      { label: 'C', scale: 0.9, image: 'giraffe3.png' },
      { label: 'D', scale: 1, image: 'giraffe2.png' }
    ];

    const showGreatWorkModal = ref(false);
    const showSilverBadgeScreen = ref(false);
    const showEmojiScreen = ref(false);
    const showFeedbackForm = ref(false);
    const isFirstTimePlayer = ref(false);
    const selectedEmoji = ref<string | null>(null);
    const feedbackText = ref('');
    const performanceScore = ref(0);
    const filledStars = ref(0);
    const showButtons = ref(true);
    const showSilverBadgeUnlock = ref(false);

    // Add new ref for Level 3 objective
    const showLevel3Objective = ref(false);

    onMounted(() => {
      setTimeout(() => {
        showGameContent.value = true;
        showGiraffes.value = true;
      }, 1500);
    });

    // Define giraffes with correct order (using numbers similar to Level 1)
    const giraffes: Giraffe[] = [
      { id: 1, height: 30, correctNumber: 30 }, // Shortest
      { id: 2, height: 41, correctNumber: 41 }, // Tallest
      { id: 3, height: 38, correctNumber: 38 }, // Medium
    ];

    // Initialize positions with mixed up order
    const positions = ref<Position[]>([
      { giraffe: giraffes[0], number: 30 },
      { giraffe: giraffes[1], number: 41 },
      { giraffe: giraffes[2], number: 38 },
    ]);

    const handleDragStart = (event: DragEvent, index: number) => {
      dragStartIndex.value = index;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
      }
    };

    const handleDrop = (event: DragEvent, dropIndex: number) => {
      event.preventDefault();
      if (dragStartIndex.value === null) return;

      const startIndex = dragStartIndex.value;
      
      // Swap both numbers and giraffes
      const tempNumber = positions.value[startIndex].number;
      const tempGiraffe = positions.value[startIndex].giraffe;
      
      positions.value[startIndex].number = positions.value[dropIndex].number;
      positions.value[startIndex].giraffe = positions.value[dropIndex].giraffe;
      
      positions.value[dropIndex].number = tempNumber;
      positions.value[dropIndex].giraffe = tempGiraffe;

      showFeedback.value = false;
      dragStartIndex.value = null;
    };

    const getSpeechText = (position: Position) => {
      if (!position.giraffe) return '';
      
      if (position.giraffe.correctNumber === 41) {
        return "I'm the tallest!";
      } else if (position.giraffe.correctNumber === 38) {
        return "I'm taller than 30";
      } else {
        return "I'm the shortest";
      }
    };

    const getGiraffeHead = (position: Position) => {
      if (!position.giraffe) return '';
      
      if (position.giraffe.id === 2) {
        return '/src/assets/icons/giraffe2.png';
      }
      
      if (showFeedback.value && !position.isCorrect) {
        if (position.giraffe.id === 1) {
          return '/src/assets/icons/shortgiraffeconfused.png';
        }
        if (position.giraffe.id === 3) {
          return '/src/assets/icons/midgiraffeconfused.png';
        }
      }
      
      return `/src/assets/icons/giraffe${position.giraffe.id}.png`;
    };

    const checkAnswer = () => {
      const currentSequence = positions.value.map(pos => pos.number).join(',');
      const isCorrectOrder = currentSequence === '30,38,41';

      positions.value.forEach(position => {
        position.isCorrect = isCorrectOrder;
      });

      showFeedback.value = true;
      showWarning.value = false;
      showSuccess.value = false;

      if (isCorrectOrder) {
        setTimeout(() => {
          showSuccess.value = true;
        }, 1500);
      } else {
        setTimeout(() => {
          showWarning.value = true;
        }, 1500);
      }
    };

    const handleTertiaryOptionSelect = (option: string) => {
      selectedOption.value = option;
      showTertiaryQuestion.value = false;
      
      if (option === 'D') {
        // Store completion in state
        localStorage.setItem('level2_tertiary_complete', 'true');
        // Show success screen
        showTertiaryPhase.value = false;
        showTertiarySuccess.value = true;
      } else {
        // Show warning for wrong answer
        wrongGiraffeLabel.value = option;
        showTertiaryWarning.value = true;
      }
    };

    const handleTertiaryTryAgain = () => {
      // Check if tertiary phase was completed
      const isComplete = localStorage.getItem('level2_tertiary_complete') === 'true';
      
      if (isComplete) {
        // Go directly to great work screen for first time players
        // or silver badge for repeat players
        showTertiaryWarning.value = false;
        showTertiaryPhase.value = false;
        
        // Check if first time player
        if (!document.cookie.includes('level2_completed=true')) {
          showGreatWorkModal.value = true;
        } else {
          showSilverBadgeScreen.value = true;
        }
      } else {
        // Not complete, allow retry
        showTertiaryWarning.value = false;
        wrongGiraffeLabel.value = '';
        selectedOption.value = null;
        showTertiaryQuestion.value = true;
      }
    };

    const handleTertiaryContinue = () => {
      showTertiarySuccess.value = false;
      showTertiaryPhase.value = false;
      showGreatWorkAfterTertiary();
      localStorage.removeItem('level2_tertiary_complete');
    };

    const handlePlayAgain = () => {
      try {
        // Reset all game states first
        showGreatWorkModal.value = false;
        showSilverBadgeScreen.value = false;
        showEmojiScreen.value = false;
        showFeedbackForm.value = false;
        
        // Navigate to Level 3
        router.push('/level3');
        
        // Reset other game states
        showTertiarySuccess.value = false;
        showTertiaryPhase.value = false;
        showTertiaryWarning.value = false;
        showSecondarySuccess.value = false;
        showSecondaryPhase.value = false;
        showSecondaryWarning.value = false;
        showSuccess.value = false;
        showWarning.value = false;
        showFeedback.value = false;
        
        // Reset any other necessary states
        selectedOption.value = null;
        wrongGiraffeLabel.value = '';
        filledStars.value = 0;
        
        console.log('Navigating to Level 3');
      } catch (error) {
        console.error('Error in handlePlayAgain:', error);
      }
    };

    const handleContinueToHome = () => {
      // Only show feedback if it hasn't been submitted yet
      if (!document.cookie.includes('level2_feedback=true')) {
        showGreatWorkModal.value = false;
        showSilverBadgeScreen.value = false;
        showEmojiScreen.value = true;
      } else {
        router.push('/');
      }
    };

    const resetGame = () => {
      // Reset all game states
      showWarning.value = false;
      showFeedback.value = false;
      showSuccess.value = false;
      showGameContent.value = true;
      showGiraffes.value = true;
      showObjective.value = false;
      showSecondaryPhase.value = false;
      showTertiaryPhase.value = false;
      showTertiarySuccess.value = false;
      showGreatWorkModal.value = false;
      showSilverBadgeScreen.value = false;

      // Reset positions to initial mixed state
      positions.value = [
        { giraffe: giraffes[0], number: 30 },
        { giraffe: giraffes[1], number: 41 },
        { giraffe: giraffes[2], number: 38 },
      ];
    };

    const handleOptionSelect = (option: number) => {
      // Hide question modal
      showQuestionModal.value = false;
      
      // Show success speech bubbles
      showSuccessSpeech.value = true;
      
      // Check if answer is correct (30 is the correct answer)
      if (option === 30) {
        // Show success modal after a delay
        setTimeout(() => {
          showSecondarySuccess.value = true;
        }, 1500);
      } else {
        // Show warning modal after a delay
        setTimeout(() => {
          showSecondaryWarning.value = true;
        }, 1500);
      }
    };

    const handleSecondaryTryAgain = () => {
      showSecondaryWarning.value = false;
      showSuccessSpeech.value = false;
      showQuestionModal.value = true;
    };

    const handleSecondaryComplete = () => {
      console.log('Starting tertiary phase transition'); // Debug log
      
      // Hide secondary phase content
      showSecondarySuccess.value = false;
      showSecondaryPhase.value = false;
      showSecondaryGiraffes.value = false;
      showSuccessSpeech.value = false;
      showQuestionModal.value = false;
      
      // Show objective screen
      showTertiaryObjective.value = true;

      // Start tertiary phase sequence
      setTimeout(() => {
        console.log('Fading out objective screen'); // Debug log
        showTertiaryObjective.value = false;
        showTertiaryPhase.value = true;
        
        // Show top bar and grass
        setTimeout(() => {
          console.log('Showing tertiary content'); // Debug log
          showTertiaryContent.value = true;
          
          // Show giraffes
          setTimeout(() => {
            console.log('Showing giraffes'); // Debug log
            showTertiaryGiraffes.value = true;
            
            // Show question modal
            setTimeout(() => {
              console.log('Showing question modal'); // Debug log
              showTertiaryQuestion.value = true;
            }, 1500);
          }, 1000);
        }, 500);
      }, 1500);
    };

    const handleEmojiSelect = (emoji: string) => {
      selectedEmoji.value = emoji;
      showEmojiScreen.value = false;
      showFeedbackForm.value = true;
    };

    const handleFeedbackSubmit = () => {
      document.cookie = 'level2_feedback=true; path=/; max-age=31536000';
      document.cookie = 'level2_completed=true; path=/; max-age=31536000';
      router.push('/');
    };

    const handleFeedbackSkip = () => {
      document.cookie = 'level2_feedback=true; path=/; max-age=31536000';
      document.cookie = 'level2_completed=true; path=/; max-age=31536000';
      router.push('/');
    };

    const handleContinue = () => {
      showSuccess.value = false;
      showObjective.value = true;

      // Start secondary phase sequence
      setTimeout(() => {
        showObjective.value = false;
        showSecondaryPhase.value = true;
        showGrassArea.value = true;

        // Show giraffes after grass
        setTimeout(() => {
          showSecondaryGiraffes.value = true;

          // Show question modal after giraffes are visible
          setTimeout(() => {
            showQuestionModal.value = true;
          }, 1500);
        }, 1000);
      }, 1500);
    };

    function showGreatWorkAfterTertiary() {
      // Hide all screens initially
      showSilverBadgeUnlock.value = false;
      showSilverBadgeScreen.value = false;
      showEmojiScreen.value = false;
      showFeedbackForm.value = false;
      
      // Check if first time player based on cookie
      isFirstTimePlayer.value = !document.cookie.includes('level2_completed=true');
      
      if (isFirstTimePlayer.value) {
        // For first-time players, show great work modal with buttons
        showGreatWorkModal.value = true;
        filledStars.value = 0;
        showButtons.value = true; // Show buttons for first-time players
        
        // Animate stars
        setTimeout(() => {
          const starInterval = setInterval(() => {
            if (filledStars.value < 2) {
              filledStars.value++;
            } else {
              clearInterval(starInterval);
            }
          }, 500);
        }, 500);
      } else {
        // For repeat players
        // 1. First show great work modal WITHOUT buttons
        showGreatWorkModal.value = true;
        filledStars.value = 0;
        showButtons.value = false; // Hide buttons initially
        
        // 2. Animate stars
        setTimeout(() => {
          const starInterval = setInterval(() => {
            if (filledStars.value < 2) {
              filledStars.value++;
            } else {
              clearInterval(starInterval);
              
              // 3. After stars are filled, transition to badge unlock screen
              setTimeout(() => {
                // Hide great work modal
                showGreatWorkModal.value = false;
                
                // Show badge unlock screen
                setTimeout(() => {
                  showSilverBadgeUnlock.value = true;
                  
                  // After delay, show badge screen with buttons
                  setTimeout(() => {
                    // Enable buttons for final badge screen
                    showButtons.value = true;
                    showSilverBadgeScreen.value = true;
                    
                    // Hide unlock screen once badge screen is visible
                    setTimeout(() => {
                      showSilverBadgeUnlock.value = false;
                    }, 100);
                  }, 3000);
                }, 100);
              }, 1500);
            }
          }, 500);
        }, 500);
      }
      
      // Set cookie to mark level as completed
      document.cookie = 'level2_completed=true; path=/; max-age=31536000';
    }

    return {
      showGameContent,
      showGiraffes,
      showFeedback,
      showWarning,
      showSuccess,
      positions,
      handleDragStart,
      handleDrop,
      checkAnswer,
      getSpeechText,
      getGiraffeHead,
      resetGame,
      handleContinue,
      showObjective,
      showSecondaryPhase,
      showSecondaryGiraffes,
      showQuestionModal,
      showGrassArea,
      secondaryGiraffes,
      handleOptionSelect,
      showSuccessSpeech,
      showSecondarySuccess,
      showSecondaryWarning,
      handleSecondaryTryAgain,
      handleSecondaryComplete,
      showTertiaryObjective,
      showTertiaryPhase,
      showTertiaryContent,
      showTertiaryGiraffes,
      showTertiaryQuestion,
      selectedOption,
      tertiaryGiraffes,
      successGiraffes,
      handleTertiaryOptionSelect,
      showTertiarySuccess,
      handleTertiaryContinue,
      showTertiaryWarning,
      wrongGiraffeLabel,
      handleTertiaryTryAgain,
      showGreatWorkModal,
      showSilverBadgeScreen,
      showEmojiScreen,
      showFeedbackForm,
      isFirstTimePlayer,
      selectedEmoji,
      feedbackText,
      performanceScore,
      handleContinueToHome,
      handleEmojiSelect,
      handleFeedbackSubmit,
      handleFeedbackSkip,
      filledStars,
      showButtons,
      showLevel3Objective,
      handlePlayAgain,
      showSilverBadgeUnlock,
      getImageUrl
    };
  }
});
</script>

<style scoped>
/* Keep only the necessary styles */
.gameplay-container {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  touch-action: none;
  z-index: 1;
}

.hide-gameplay {
  display: none;
}

.modals-container {
  position: fixed;
  inset: 0;
  z-index: 2000;
  pointer-events: none;
}

.modals-container > div {
  pointer-events: auto;
}

.top-bar {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  z-index: 100;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.game-title {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.game-title.fade-out {
  opacity: 0;
}

.game-content {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.game-content.fade-in {
  opacity: 1;
}

.giraffes-area {
  position: absolute;
  bottom: 220px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 80px;
  height: calc(100vh - 400px);
  min-height: 200px;
  padding-bottom: 24px;
  z-index: 3;
}

.giraffe-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45px;
  transition: transform 0.3s ease;
  position: relative;
  opacity: 0;
}

.giraffe-slot.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.giraffe-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 45px;
  position: relative;
  z-index: 2;
}

.giraffe-image {
  width: 45px;
  height: 140px;
  object-fit: contain;
  object-position: bottom;
  margin-bottom: 0;
  transform: translateY(2px);
}

/* Remove giraffe scaling */
.giraffe-slot:nth-child(1) .giraffe-image,
.giraffe-slot:nth-child(2) .giraffe-image,
.giraffe-slot:nth-child(3) .giraffe-image {
  transform: translateY(2px);
}

.speech-bubble {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #4FAB4C;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Gabarito', sans-serif;
  white-space: nowrap;
  z-index: 3;
  min-width: 25px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.speech-bubble.success-speech {
  min-width: auto;
  white-space: nowrap;
}

.speech-bubble.fade-in {
  opacity: 1;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #4FAB4C;
}

.answer-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 220px;
  background: transparent;
  z-index: 2;
}

.grass-outline {
  width: 100%;
  height: 24px;
  background: #4FAB4C;
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  z-index: 3;
}

.grass-bg {
  width: 100%;
  height: 100%;
  background: #8FD14F;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.number-slots {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  padding: 20px;
  gap: 80px;
  margin-bottom: 20px;
}

.number-slot {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-button {
  width: 50px;
  height: 50px;
  background: #8FD14F;
  border: 1.5px solid #3A8737;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #FFFFFF;
  cursor: grab;
  user-select: none;
  transition: transform 0.3s ease;
}

.check-button {
  position: relative;
  z-index: 3;
  background: white;
  color: #333333;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

@media (min-width: 768px) {
  .giraffe-slot {
    width: 55px;
  }

  .giraffe-container {
    width: 55px;
  }

  .giraffe-image {
    width: 55px;
    height: 170px;
  }
}

@media (min-width: 1024px) {
  .giraffe-slot {
    width: 65px;
  }

  .giraffe-container {
    width: 65px;
  }

  .giraffe-image {
    width: 65px;
    height: 200px;
  }
}

.control-buttons {
  display: flex;
  gap: 12px;
  z-index: 100;
}

.pause-button,
.options-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #E4E4E4;
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.pause-button svg,
.options-button svg {
  width: 18px !important;
  height: 18px !important;
  fill: #000000 !important;
  color: #000000 !important;
  opacity: 0.7 !important;
  display: block !important;
  font-weight: normal !important;
}

.objective-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

.objective-screen.fade-in {
  opacity: 1;
}

.objective-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
}

.octopus-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* Reduced from 60px */
}

/* Fix specifically for navbar octopus positioning */
.top-bar .octopus-icon {
  height: 40px;
  display: flex;
  align-items: center;
  margin-top: 10px; /* Reduced further to move icon up even more */
  margin-bottom: 0; /* Override the default margin-bottom */
  padding-bottom: 0; /* Ensure no additional spacing */
}

.success-feedback {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  background: #3A8737;
  color: white;
  padding: 24px 20px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  border-radius: 24px 24px 0 0;
  box-sizing: border-box;
}

.success-feedback.slide-in {
  transform: translateY(0);
}

.success-feedback .continue-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin: 0 auto;
  display: block;
}

.success-feedback .success-title {
  color: #FFFFFF;
  font-size: 24px;
  margin-bottom: 12px;
  font-family: 'Gabarito', sans-serif;
}

.success-feedback .success-text {
  color: #FFFFFF;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-family: 'Gabarito', sans-serif;
}

.warning-feedback {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #DC3545;
  color: white;
  padding: 24px 20px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  border-radius: 24px 24px 0 0;
  height: 25vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.warning-feedback.slide-in {
  transform: translateY(0);
}

.warning-feedback .warning-title {
  color: #FFFFFF;
  font-size: 24px;
  margin-bottom: 12px;
  font-family: 'Gabarito', sans-serif;
}

.warning-feedback .warning-text {
  color: #FFFFFF;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-family: 'Gabarito', sans-serif;
}

.warning-feedback .try-again-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin: 0 auto;
  display: block;
  font-family: 'Gabarito', sans-serif;
}

.secondary-phase {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.secondary-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}

.secondary-giraffes-container {
  position: absolute;
  bottom: 220px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 50px;
  padding: 0 20px;
  z-index: 5;
}

.secondary-giraffe {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  position: relative;
  width: 45px;
}

.secondary-giraffe.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.secondary-giraffe .giraffe-image {
  width: 45px;
  height: 140px;
  object-fit: contain;
  object-position: bottom;
  display: block;
  margin: 0;
  padding: 0;
  vertical-align: bottom;
}

/* Dynamic clipping for second giraffe in phase 2 */
.secondary-giraffe:nth-child(2) .giraffe-image {
  clip-path: inset(0 0 30% 0);
  margin-bottom: -42px;
}

.grass-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  opacity: 0;
  transition: opacity 0.5s ease;
  background: transparent;
  z-index: 2;
}

.grass-area.fade-in {
  opacity: 1;
}

.grass-area .grass-outline {
  width: 100%;
  height: 24px;
  background: #4FAB4C;
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  z-index: 3;
}

.grass-area .grass-bg {
  width: 100%;
  height: 100%;
  background: #8FD14F;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.question-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  background: #8FD14F;
  padding: 16px;
  border-radius: 16px;
  width: 260px;
  z-index: 100;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.question-text {
  color: white;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.options-container {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.option-button {
  width: 50px;
  height: 50px;
  background: white;
  border: none;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #4FAB4C;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .secondary-giraffe {
    width: 55px;
  }

  .secondary-giraffe .giraffe-image {
    width: 55px;
    height: 170px;
  }

  /* Adjust clipping for tablet */
  .secondary-giraffe:nth-child(2) .giraffe-image {
    clip-path: inset(0 0 30% 0);
    margin-bottom: -51px;
  }

  .question-modal {
    bottom: 30px;
    width: 280px;
    padding: 18px;
  }
}

@media (min-width: 1024px) {
  .secondary-giraffe {
    width: 65px;
  }

  .secondary-giraffe .giraffe-image {
    width: 65px;
    height: 200px;
  }

  /* Adjust clipping for desktop */
  .secondary-giraffe:nth-child(2) .giraffe-image {
    clip-path: inset(0 0 30% 0);
    margin-bottom: -60px;
  }

  .question-modal {
    bottom: 20px;
    width: 300px;
    padding: 20px;
  }
}

@media (min-width: 1440px) {
  .secondary-giraffe {
    width: 75px;
  }

  .secondary-giraffe .giraffe-image {
    width: 75px;
    height: 230px;
  }

  /* Adjust clipping for large desktop */
  .secondary-giraffe:nth-child(2) .giraffe-image {
    clip-path: inset(0 0 30% 0);
    margin-bottom: -69px;
  }

  .question-modal {
    bottom: 15px;
    width: 320px;
  }
}

.tertiary-phase {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grass-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.grass-area.fade-in {
  opacity: 1;
}

.grass-area .grass-outline {
  width: 100%;
  height: 24px;
  background: #4FAB4C;
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  z-index: 3;
}

.grass-area .grass-bg {
  width: 100%;
  height: 100%;
  background: #8FD14F;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.giraffe-labels {
  display: none;  /* Hide the duplicate labels */
}

.tertiary-giraffes-container {
  position: absolute;
  bottom: 200px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 60px;
  padding: 0 20px;
  z-index: 5;
}

.giraffe-wrapper {
  width: 65px;
  height: 85px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0;
}

.giraffe-wrapper .giraffe-image {
  width: 100%;
  position: absolute;
  top: -10px;
  left: 0;
  clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
}

.tertiary-giraffe {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  position: relative;
  padding-bottom: 24px;
  z-index: 6;
}

.tertiary-giraffe::after {
  content: attr(data-label);
  color: #2D7A2A;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
}

.tertiary-modal .option-button {
  background: #8FD14F;
  color: #FFFFFF;
  width: 60px;
  height: 50px;
  border-radius: 8px;
  border: none;
  font-size: 24px;
  font-family: 'Gabarito', sans-serif;
}

.tertiary-modal .option-button.selected {
  background: #FFFFFF;
  color: #4FAB4C;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.slide-in {
  animation: slideIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.success-giraffes-container {
  position: absolute;
  bottom: 220px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 50px;
  padding: 0 20px;
  z-index: 5;
  height: calc(100vh - 400px);
  max-height: 400px;
}

.success-giraffe {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideIn 0.5s ease forwards;
  width: 45px;
  margin-bottom: 0;
  transform-origin: bottom;
}

.success-giraffe:first-child {
  align-self: flex-end;
  margin-bottom: 0;
}

.success-giraffe-image {
  width: 45px;
  height: 140px;
  object-fit: contain;
  object-position: bottom;
  margin: 0;
  padding: 0;
  display: block;
}

@media (min-width: 768px) {
  .success-giraffes-container {
    gap: 70px;
    bottom: 240px;
  }
  .success-giraffe {
    width: 55px;
  }
  .success-giraffe-image {
    width: 55px;
    height: 170px;
  }
}

@media (min-width: 1024px) {
  .success-giraffes-container {
    gap: 90px;
    bottom: 260px;
  }
  .success-giraffe {
    width: 65px;
  }
  .success-giraffe-image {
    width: 65px;
    height: 200px;
  }
}

@media (min-width: 1440px) {
  .success-giraffes-container {
    bottom: 280px;
  }
  .success-giraffe {
    width: 75px;
  }
  .success-giraffe-image {
    width: 75px;
    height: 230px;
  }
}

.success-bubble {
  position: absolute;
  top: -40px;
  background: #3A8737;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Gabarito', sans-serif;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.success-bubble.fade-in {
  opacity: 1;
}

.tertiary-success {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #3A8737;
  color: white;
  padding: 24px 20px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  border-radius: 24px 24px 0 0;
  z-index: 1000;
  margin-top: 24px;
  height: auto;
  max-height: 25vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tertiary-success.slide-in {
  transform: translateY(0);
}

.tertiary-success .success-title {
  color: #FFFFFF;
  font-size: 24px;
  margin-bottom: 12px;
  font-family: 'Gabarito', sans-serif;
}

.tertiary-success .success-text {
  color: #FFFFFF;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-family: 'Gabarito', sans-serif;
}

.tertiary-success .continue-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin: 0 auto;
  display: block;
}

.great-work-modal {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.great-work-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 28px;
  color: #222;
  margin: 32px 0 24px 0;
  font-weight: 700;
  text-align: center;
}

.stars-row {
  display: flex;
  gap: 8px;
  font-size: 40px;
  margin-bottom: 32px;
  justify-content: center;
}

.star {
  color: #E0E0E0;
}

.star.filled {
  color: #FFC107;
}

.great-work-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
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

.silver-badge-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

.silver-badge-screen.fade-in {
  opacity: 1;
}

.silver-badge-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.silver-badge-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  text-align: center;
  margin: 0 0 20px 0;
}

.emoji-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

/* Specific styling for emoji screen continue button */
.emoji-screen .continue-button {
  background: #0DA49F;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #FFFFFF;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin-top: 40px;
  display: block;
}

.emoji-screen.fade-in {
  opacity: 1;
}

.emoji-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.emoji-container {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.emoji-button {
  width: 50px;
  height: 50px;
  background: white;
  border: none;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #4FAB4C;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feedback-form {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

.feedback-form.fade-in {
  opacity: 1;
}

.feedback-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.feedback-textarea {
  width: 300px;
  height: 100px;
  padding: 10px;
  border: 1px solid #3A8737;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #333333;
}

.submit-button,
.skip-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: 316px;
  margin: 0 auto;
  display: block;
  margin-top: 20px;
}

.great-work-screen,
.silver-badge-screen,
.emoji-screen,
.feedback-form {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

.fade-in {
  opacity: 1;
}

.close-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid #E4E4E4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2001;
}

.octopus-icon {
  margin-top: 40px; /* Reduced from 60px to move up */
  margin-bottom: 30px; /* Reduced from 40px to tighten spacing */
}

.great-work-title,
.silver-badge-title,
.emoji-title,
.feedback-title {
  color: #333333;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
}

.stars-container {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
}

.star {
  font-size: 40px;
  color: #E4E4E4;
}

.star.filled {
  color: #FFD700;
}

.badge-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.progress-container {
  width: 80%;
  max-width: 300px;
  height: 8px;
  background: #E4E4E4;
  border-radius: 4px;
  margin: 20px 0;
}

.progress-bar {
  width: 66%;
  height: 100%;
  background: #0DA49F;
  border-radius: 4px;
}

.progress-text {
  color: #666666;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin-bottom: 40px;
}

.play-again-button,
.continue-home-button {
  width: calc(100% - 40px);
  max-width: 316px;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
}

.play-again-button {
  background: #FFFFFF;
  border: 1px solid #E4E4E4;
  color: #333333;
}

.continue-home-button {
  background: #0DA49F;
  border: none;
  color: #FFFFFF;
}

.emoji-container {
  display: flex;
  gap: 40px;
  margin: 40px 0;
}

.emoji-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: #F5F5F5;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-textarea {
  width: calc(100% - 40px);
  max-width: 316px;
  height: 120px;
  padding: 12px;
  border: 1px solid #E4E4E4;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 20px 0;
  resize: none;
}

.selected-emoji {
  font-size: 32px;
  margin: 20px 0;
}

.submit-button {
  background: #666666;
  color: #FFFFFF;
}

.skip-button {
  background: #FFFFFF;
  color: #333333;
  border: 1px solid #E4E4E4;
}

.tertiary-bubble {
  position: absolute;
  top: -55px;
  left: 50%;
  transform: translateX(-50%);
  background: #4FAB4C;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 18px;
  font-family: 'Gabarito', sans-serif;
  white-space: nowrap;
  z-index: 10;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.tertiary-bubble.fade-in {
  opacity: 1;
}

.tertiary-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #4FAB4C;
}

.clipped-giraffe {
  clip-path: inset(0 0 30% 0);
  margin-bottom: -42px;
}

@media (min-width: 768px) {
  .clipped-giraffe {
    margin-bottom: -51px;
  }
}

@media (min-width: 1024px) {
  .clipped-giraffe {
    margin-bottom: -60px;
  }
}

@media (min-width: 1440px) {
  .clipped-giraffe {
    margin-bottom: -69px;
  }
}

.silver-badge-unlock {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2000;
}

.silver-badge-unlock.fade-in {
  opacity: 1;
}

.silver-badge-unlock-text {
  color: #333333;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
}

.badge-icon-unlock {
  width: 80px;
  height: 80px;
  margin-top: 20px;
}
</style> 
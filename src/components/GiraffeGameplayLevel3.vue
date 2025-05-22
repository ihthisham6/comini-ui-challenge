<template>
  <div class="gameplay-container">
    <!-- Top bar -->
    <div v-if="!showSecondaryPhase" class="top-bar">
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

    <!-- Game title -->
    <div v-if="!showSecondaryPhase" class="instruction-text">
      Order the giraffes based on their Height
    </div>

    <!-- Game content -->
    <div v-if="!showSecondaryPhase && !showTertiaryPhase" class="game-content">
      <!-- Giraffes area -->
      <div class="giraffes-area">
        <div v-for="(position, index) in positions" 
             :key="index"
             class="giraffe-slot"
             :class="{ 'slide-in': showGiraffes }">
          <div v-if="showFeedback" 
               class="speech-bubble"
               :class="{ 'fade-in': showFeedback }">
            {{ getSpeechText(position) }}
          </div>
          <template v-if="position.giraffe">
            <div class="giraffe-container giraffe-fixed-bottom"
                 :class="{
                   'tallest-giraffe': position.giraffe.id === 2,
                   'medium-giraffe': position.giraffe.id === 3,
                   'shortest-giraffe': position.giraffe.id === 1
                 }">
              <img :src="getGiraffeHead(position)" 
                   :alt="`Giraffe ${position.giraffe.id}`"
                   :class="[
                     'giraffe-image',
                     'giraffe-fixed-bottom',
                     {
                       'tallest-giraffe-image': position.giraffe.id === 2,
                       'medium-giraffe-image': position.giraffe.id === 3,
                       'shortest-giraffe-image': position.giraffe.id === 1
                     }
                   ]" />
            </div>
          </template>
        </div>
      </div>

      <!-- Answer section with grass background -->
      <div class="answer-section">
        <div class="grass-outline"></div>
        <img src="../assets/icons/Grass.png" class="grass-bg" alt="Grass" />
        
        <!-- Number slots -->
        <div class="number-slots">
          <div v-for="(position, index) in positions" 
               :key="index"
               class="number-slot-group">
            <div class="number-slot"
                 @dragover.prevent
                 @drop="handleDrop($event, index)">
              <div v-if="position.number !== null"
                   class="number-button"
                   draggable="true"
                   @dragstart="handleDragStart($event, index)"
                   @dragend="handleDragEnd($event)"
                   @touchstart.passive="handleTouchStart($event, index)"
                   @touchmove.prevent="handleTouchMove($event)"
                   @touchend="handleTouchEnd($event)">
                {{ position.number }}
              </div>
            </div>
            <div class="arrow-symbol">
              ↔
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
    <div v-if="showWarning && !showSecondaryPhase" class="warning-feedback" :class="{ 'slide-in': showWarning }">
      <h2 class="warning-title">Oh no!</h2>
      <p class="warning-text">The Giraffes are still mixed up!</p>
      <button class="try-again-button" @click="resetGame">Try Again</button>
    </div>

    <!-- Success Feedback -->
    <div v-if="showSuccess && !showSecondaryPhase" class="success-feedback" :class="{ 'slide-in': showSuccess }">
      <h2 class="success-title">Awesome!</h2>
      <p class="success-text">The Giraffes are now in order.</p>
      <button class="continue-button" @click="handleContinue">Continue</button>
    </div>

    <!-- Secondary Objective Screen -->
    <div v-if="showSecondaryObjective && !showSecondaryPhase" 
         class="objective-screen" 
         :class="{ 'fade-in': showSecondaryObjective }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">New giraffe has joined the line!</p>
    </div>

    <!-- Secondary Phase -->
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

      <!-- Title -->
      <div class="secondary-title">
        Find the missing number for the new giraffe
      </div>

      <!-- Giraffes container -->
      <div class="secondary-giraffes-container">
        <div v-for="(giraffe, index) in secondaryGiraffes" 
             :key="index"
             :class="[
               'secondary-giraffe',
               { 'slide-in': showSecondaryGiraffes },
               { 'align-by-strip': giraffe.height === 380 },
               { 'align-by-tip': giraffe.height === '?' }
             ]"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <div class="speech-bubble" 
               :class="{ 
                 'fade-in': showSecondaryFeedback || showSuccessSpeech,
                 'fade-out': !showSecondaryFeedback && !showSuccessSpeech
               }">
            {{ showSuccessSpeech ? giraffe.successSpeech : giraffe.speech }}
          </div>
          <img :src="`../assets/icons/${giraffe.image}`" 
               :alt="`Giraffe ${index + 1}`"
               class="giraffe-image" />
        </div>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showGrassArea }">
        <div class="grass-outline"></div>
        <img src="../assets/icons/Grass.png" class="grass-bg" alt="Grass" />
      </div>

      <!-- Secondary Phase Question Modal -->
      <div v-if="showQuestionModal" 
           class="question-modal" 
           :class="{ 'slide-in': showQuestionModal }">
        <p class="question-text">What should be the number for the new giraffe?</p>
        <div class="options-container">
          <button v-for="option in [500, 390, 370]" 
                  :key="option"
                  class="option-button"
                  @click="handleOptionSelect(option)">
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Feedback -->
    <div v-if="showSecondarySuccess" 
         class="success-feedback secondary-success" 
         :class="{ 'slide-in': showSecondarySuccess }">
      <h2 class="success-title">Awesome!</h2>
      <p class="success-text">The Giraffes are now in order.</p>
      <button class="continue-button" @click="handleSecondaryComplete">Continue</button>
    </div>

    <!-- Warning Feedback -->
    <div v-if="showSecondaryWarning" 
         class="warning-feedback secondary-warning" 
         :class="{ 'slide-in': showSecondaryWarning }">
      <h2 class="warning-title">Oh no!</h2>
      <p class="warning-text">That was not the right number.</p>
      <button class="try-again-button" @click="handleSecondaryTryAgain">Try Again</button>
    </div>

    <!-- Tertiary Objective Screen -->
    <div v-if="showTertiaryObjective" 
         class="objective-screen tertiary-objective" 
         :class="{ 'fade-in': showTertiaryObjective }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">Let's compare more giraffes!</p>
    </div>

    <!-- Tertiary Phase -->
    <div v-if="showTertiaryPhase" class="tertiary-phase">
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

      <!-- Giraffes container -->
      <div class="tertiary-giraffes-container">
        <div v-for="(giraffe, index) in tertiaryGiraffes" 
             :key="index"
             class="tertiary-giraffe"
             :class="{ 
               'slide-in': showTertiaryGiraffes,
               'shorter-giraffe': showTertiaryError && index === 0,
               'taller-giraffe': showTertiaryError && index === 1
             }"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <div class="speech-bubble" 
               :class="{ 
                 'fade-in': showTertiaryGiraffes && !showTertiaryError,
                 'fade-out': showTertiaryError,
                 'error-bubble-in': showTertiaryError 
               }">
            {{ showTertiaryError ? 
               (index === 0 ? "I'm shorter" : "I'm taller") : 
               giraffe.speech }}
          </div>
          <img :src="showTertiaryError && index === 0 ? 
                     '../assets/icons/Giraffe3.png' : 
                     `../assets/icons/${giraffe.image}`"
               :alt="`Giraffe ${giraffe.label}`"
               :class="{ 
                 'giraffe-image': true,
                 'shorter-image': showTertiaryError && index === 0
               }" />
          <div class="giraffe-label">{{ giraffe.label }}</div>
        </div>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showTertiaryContent }">
        <div class="grass-outline"></div>
        <img src="../assets/icons/Grass.png" class="grass-bg" alt="Grass" />
      </div>

      <!-- Question Modal -->
      <div v-if="showTertiaryQuestion" 
           class="question-modal tertiary-question" 
           :class="{ 'slide-in': showTertiaryQuestion }">
        <p class="question-text">How does the giraffe A compare to the giraffe B?</p>
        <div class="options-container">
          <button v-for="option in ['<', '=', '>']" 
                  :key="option"
                  class="option-button"
                  @click="handleTertiaryOptionSelect(option)">
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Success Feedback -->
      <div v-if="showTertiarySuccess" 
           class="success-feedback tertiary-success" 
           :class="{ 'slide-in': showTertiarySuccess }">
        <h2 class="success-title">Awesome!</h2>
        <p class="success-text">Giraffe A was shorter than giraffe B</p>
        <button class="continue-button" @click="handleTertiaryComplete">Continue</button>
      </div>

      <!-- Error Feedback -->
      <div v-if="showTertiaryError" 
           class="warning-feedback tertiary-warning" 
           :class="{ 'slide-in': showTertiaryError }">
        <h2 class="warning-title">Hmm..</h2>
        <p class="warning-text">Giraffe A was not the tallest.</p>
        <button class="try-again-button" @click="handleTertiaryTryAgain">Try Again</button>
      </div>
    </div>

    <!-- Great Work Modal -->
    <div v-if="showGreatWorkModal && !showNextLevelObjective" class="great-work-modal">
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

    <!-- Gold Badge Screen -->
    <div v-if="showGoldBadgeScreen && !showNextLevelObjective" 
         class="gold-badge-screen" 
         :class="{ 'fade-in': showGoldBadgeScreen }">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="great-work-title">Gold Badge</h2>
      <img src="../assets/icons/GoldLeague.png" alt="Gold Badge" class="badge-icon" />
      <p class="progress-text">Keep going to unlock the diamond badge!</p>
      <button class="play-again-button" @click="handlePlayAgain">Play again</button>
      <button class="continue-home-button" @click="handleContinueToHome">Continue to Home</button>
    </div>

    <!-- Gold Badge Unlock Screen -->
    <div v-if="showGoldBadgeUnlock && !showNextLevelObjective" 
         class="gold-badge-unlock" 
         :class="{ 'fade-in': showGoldBadgeUnlock }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="gold-badge-unlock-text">You've unlocked the Gold Badge!</h2>
      <img src="../assets/icons/GoldLeague.png" alt="Gold Badge" class="badge-icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OctopusIcon from './OctopusIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

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
  name: 'GiraffeGameplayLevel3',
  components: {
    OctopusIcon,
    FontAwesomeIcon
  },
  setup() {
    const showGameContent = ref(false);
    const showGiraffes = ref(false);
    const showFeedback = ref(false);
    const showWarning = ref(false);
    const showSuccess = ref(false);
    const dragStartIndex = ref<number | null>(null);
    const isDragging = ref(false);
    const showSecondaryObjective = ref(false);
    const showSecondaryPhase = ref(false);
    const showSecondaryGiraffes = ref(false);
    const showSecondaryFeedback = ref(false);
    const showQuestionModal = ref(false);
    const showGrassArea = ref(false);
    const showSuccessSpeech = ref(false);
    const showSecondarySuccess = ref(false);
    const showSecondaryWarning = ref(false);
    const showTertiaryObjective = ref(false);
    const showTertiaryPhase = ref(false);
    const showTertiaryContent = ref(false);
    const showTertiaryGiraffes = ref(false);
    const showTertiaryQuestion = ref(false);
    const showTertiaryError = ref(false);
    const showTertiarySuccess = ref(false);
    const showGreatWorkModal = ref(false);
    const showGoldBadgeScreen = ref(false);
    const showNextLevelObjective = ref(false);
    const showGoldBadgeUnlock = ref(false);
    const filledStars = ref(0);
    const showButtons = ref(true);
    const isFirstTimePlayer = ref(true);
    
    // Initialize with larger numbers for Level 3
    const giraffes: Giraffe[] = [
      { id: 1, height: 300, correctNumber: 300 },
      { id: 2, height: 410, correctNumber: 410 },
      { id: 3, height: 380, correctNumber: 380 },
    ];

    const positions = ref<Position[]>([
      { giraffe: giraffes[0], number: 300 },
      { giraffe: giraffes[1], number: 410 },
      { giraffe: giraffes[2], number: 380 },
    ]);

    // Secondary gameplay giraffes
    const secondaryGiraffes = ref([
      { height: 300, image: 'Giraffe1.png', speech: '300', successSpeech: "I'm the shortest!" },
      { height: 380, image: 'Giraffe3.png', speech: '380', successSpeech: "I'm taller than 1" },
      { height: '?', image: 'Giraffe3.png', speech: '?', successSpeech: "I'm between 2 & 4" },
      { height: 410, image: 'Giraffe2.png', speech: '410', successSpeech: "I'm the tallest!" }
    ]);

    // Tertiary gameplay giraffes
    const tertiaryGiraffes = ref([
      { label: 'A', height: 10, image: 'Giraffe3.png', speech: '10' },
      { label: 'B', height: 40, image: 'Giraffe3.png', speech: '40' }
    ]);

    const router = useRouter();

    // Add these variables for touch support
    const touchStartX = ref(0);
    const touchStartY = ref(0);
    const currentTouchElement = ref<HTMLElement | null>(null);
    const lastTouchedSlot = ref<number | null>(null);
    const touchOffsetX = ref(0);
    const touchOffsetY = ref(0);
    const touchActive = ref(false);
    const touchTarget = ref<number | null>(null);

    onMounted(() => {
      // Show game content after 1.5s delay
      setTimeout(() => {
        showGameContent.value = true;
      }, 1500);

      // Show giraffes after additional 1s delay
      setTimeout(() => {
        showGiraffes.value = true;
      }, 2500);
      
      // Improve touch handling across iOS and Android
      const numberButtons = document.querySelectorAll('.number-button');
      numberButtons.forEach(button => {
        // Mark element as draggable for iOS
        if ((button as HTMLElement).style) {
          // Use type assertion for webkit-specific property
          ((button as HTMLElement).style as any).webkitUserDrag = 'element';
        }
      });
    });

    const handleDragStart = (event: DragEvent, index: number) => {
      dragStartIndex.value = index;
      isDragging.value = true;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
      }
      // Add dragging class to the dragged element
      const button = event.target as HTMLElement;
      button.classList.add('dragging');
    };

    const handleDragEnd = (event: DragEvent) => {
      isDragging.value = false;
      // Remove dragging class
      const button = event.target as HTMLElement;
      button.classList.remove('dragging');
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
      isDragging.value = false;
    };

    const getSpeechText = (position: Position) => {
      if (!position.giraffe) return '';
      
      if (position.giraffe.id === 2) {
        return "I'm the tallest!";
      } else if (position.giraffe.id === 3) {
        return "I'm taller than 1";
      } else {
        return "I'm the shortest";
      }
    };

    const getGiraffeHead = (position: Position) => {
      if (!position.giraffe) return '';
      
      // For the tallest giraffe (always happy)
      if (position.giraffe.id === 2) {
        return '../assets/icons/Giraffe2.png';
      }
      
      // Show confused images when feedback is shown and sequence is wrong
      if (showFeedback.value && !position.isCorrect) {
        if (position.giraffe.id === 1) {
          return '../assets/icons/ShortGiraffeConfused.png';
        }
        if (position.giraffe.id === 3) {
          return '../assets/icons/MidGiraffeConfused.png';
        }
      }
      
      // Default idle states
      return `../assets/icons/Giraffe${position.giraffe.id}.png`;
    };

    const checkAnswer = () => {
      const numbers = positions.value.map(pos => pos.number);
      // Check if numbers are in ascending order (300, 380, 410)
      const isCorrectOrder = numbers[0] !== null && numbers[1] !== null && numbers[2] !== null &&
                             numbers[0] < numbers[1] && numbers[1] < numbers[2];

      positions.value.forEach(position => {
        position.isCorrect = isCorrectOrder;
      });

      // Show feedback immediately
      showFeedback.value = true;
      showWarning.value = false;
      showSuccess.value = false;

      // Show appropriate feedback after 1.5s
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

    const resetGame = () => {
      showWarning.value = false;
      showFeedback.value = false;
      showSuccess.value = false;
      showGameContent.value = true;
      showGiraffes.value = true;

      positions.value = [
        { giraffe: giraffes[0], number: 300 },
        { giraffe: giraffes[1], number: 410 },
        { giraffe: giraffes[2], number: 380 },
      ];
    };

    const handleContinue = () => {
      // Hide initial game content
      showSuccess.value = false;
      showGameContent.value = false;
      showGiraffes.value = false;
      showFeedback.value = false;
      
      // Show objective screen
      showSecondaryObjective.value = true;

      // After 1.5s, fade out objective screen and start secondary phase
      setTimeout(() => {
        showSecondaryObjective.value = false;
        showSecondaryPhase.value = true;
        showGrassArea.value = true;

        // Show giraffes after 1s with 300ms delay each
        setTimeout(() => {
          showSecondaryGiraffes.value = true;
          showSecondaryFeedback.value = true;

          // Show question modal after 1.5s
          setTimeout(() => {
            showQuestionModal.value = true;
          }, 1500);
        }, 1000);
      }, 1500);
    };

    const handleOptionSelect = (option: number) => {
      // Hide question modal and feedback
      showQuestionModal.value = false;
      showSecondaryFeedback.value = false;
      
      if (option === 390) {
        // Show success speech bubbles after a short delay
        setTimeout(() => {
          showSuccessSpeech.value = true;
          
          // Show success modal after 1.5s
          setTimeout(() => {
            showSecondarySuccess.value = true;
          }, 1500);
        }, 300);
      } else {
        // Show warning modal for wrong answer
        showSecondaryWarning.value = true;
      }
    };

    const handleSecondaryTryAgain = () => {
      showSecondaryWarning.value = false;
      showQuestionModal.value = true;
      showSecondaryFeedback.value = true;
    };

    const handleSecondaryComplete = () => {
      // Hide secondary phase content
      showSecondarySuccess.value = false;
      showSecondaryPhase.value = false;
      showSecondaryGiraffes.value = false;
      showSuccessSpeech.value = false;
      showQuestionModal.value = false;
      
      // Show tertiary objective screen
      showTertiaryObjective.value = true;

      // Start tertiary phase sequence
      setTimeout(() => {
        // Fade out objective screen
        showTertiaryObjective.value = false;
        showTertiaryPhase.value = true;
        showTertiaryContent.value = true;

        // Show giraffes after 1s
        setTimeout(() => {
          showTertiaryGiraffes.value = true;

          // Show question modal after 1.5s
          setTimeout(() => {
            showTertiaryQuestion.value = true;
          }, 1500);
        }, 1000);
      }, 1500);
    };

    const handleTertiaryOptionSelect = (option: string) => {
      // Hide question modal
      showTertiaryQuestion.value = false;
      
      if (option === '<') {
        // Correct answer
        setTimeout(() => {
          showTertiarySuccess.value = true;
        }, 1500);
      } else {
        // Wrong answer
        showTertiaryError.value = true;
      }
    };

    const handleTertiaryTryAgain = () => {
      showTertiaryError.value = false;
      showTertiaryQuestion.value = true;
    };

    const handleTertiaryComplete = () => {
      showTertiarySuccess.value = false;
      showTertiaryPhase.value = false;
      showGreatWorkAfterTertiary();
    };

    function showGreatWorkAfterTertiary() {
      // Check if repeat player before showing screen
      isFirstTimePlayer.value = !document.cookie.includes('level3_completed=true');
      
      // Show Great Work screen
      showGreatWorkModal.value = true;
      filledStars.value = 0;
      
      // Only show buttons for first time players
      showButtons.value = isFirstTimePlayer.value;

      // Animate stars
      setTimeout(() => {
        const starInterval = setInterval(() => {
          if (filledStars.value < 2) {
            filledStars.value++;
          } else {
            clearInterval(starInterval);
            if (!isFirstTimePlayer.value) {
              // For repeat players, show unlock screen after stars
              setTimeout(() => {
                showGreatWorkModal.value = false;
                showGoldBadgeUnlock.value = true;
                
                // After 3s, fade to Gold Badge screen
                setTimeout(() => {
                  showGoldBadgeUnlock.value = false;
                  showGoldBadgeScreen.value = true;
                }, 3000);
              }, 1500);
            }
          }
        }, 500);
      }, 500);

      // Set cookie to mark level as completed
      document.cookie = 'level3_completed=true; path=/; max-age=31536000';
    }

    const handlePlayAgain = () => {
      // Navigate to Level 4
      router.push('/level4');
    };

    const handleContinueToHome = () => {
      // Only show feedback if it hasn't been submitted yet
      if (!document.cookie.includes('level3_feedback=true')) {
        showGreatWorkModal.value = false;
        showGoldBadgeScreen.value = false;
        router.push('/game-feedback-emoji');
      } else {
        router.push('/');
      }
    };

    const handleTouchStart = (event: TouchEvent, index: number) => {
      // Store the initial touch position
      touchStartX.value = event.touches[0].clientX;
      touchStartY.value = event.touches[0].clientY;
      lastTouchedSlot.value = index;
      currentTouchElement.value = event.currentTarget as HTMLElement;
      
      // Calculate offset within the element
      const rect = currentTouchElement.value.getBoundingClientRect();
      touchOffsetX.value = touchStartX.value - rect.left;
      touchOffsetY.value = touchStartY.value - rect.top;
      
      // Add visual feedback
      currentTouchElement.value.style.opacity = '0.8';
      currentTouchElement.value.style.zIndex = '1000';
      
      // Track that we're in a touch operation
      touchActive.value = true;
      
      // Add class to body to prevent scrolling
      document.body.classList.add('touch-dragging');
      
      // Create a visual clone for dragging
      const clone = currentTouchElement.value.cloneNode(true) as HTMLElement;
      clone.id = 'touch-clone';
      clone.style.position = 'absolute';
      clone.style.left = `${event.touches[0].clientX - touchOffsetX.value}px`;
      clone.style.top = `${event.touches[0].clientY - touchOffsetY.value}px`;
      clone.style.width = `${currentTouchElement.value.offsetWidth}px`;
      clone.style.height = `${currentTouchElement.value.offsetHeight}px`;
      clone.style.zIndex = '2000';
      clone.style.opacity = '0.9';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'none';
      document.body.appendChild(clone);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchActive.value || !currentTouchElement.value) return;
      
      const touch = event.touches[0];
      
      // Move the clone to follow the finger
      const clone = document.getElementById('touch-clone');
      if (clone) {
        clone.style.left = `${touch.clientX - touchOffsetX.value}px`;
        clone.style.top = `${touch.clientY - touchOffsetY.value}px`;
      }
      
      // Detect which slot we're over
      const slots = document.querySelectorAll('.number-slot');
      let newTarget = null;
      
      slots.forEach((slot, idx) => {
        const rect = slot.getBoundingClientRect();
        if (
          touch.clientX >= rect.left && 
          touch.clientX <= rect.right && 
          touch.clientY >= rect.top && 
          touch.clientY <= rect.bottom
        ) {
          newTarget = idx;
        }
      });
      
      touchTarget.value = newTarget;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchActive.value || currentTouchElement.value === null || lastTouchedSlot.value === null) return;
      
      // Remove the clone
      const clone = document.getElementById('touch-clone');
      if (clone) {
        document.body.removeChild(clone);
      }
      
      // Reset the original element's styling
      currentTouchElement.value.style.opacity = '';
      currentTouchElement.value.style.zIndex = '';
      
      // Remove body class to allow scrolling again
      document.body.classList.remove('touch-dragging');
      
      // Check if we have a valid target to swap with
      if (touchTarget.value !== null && touchTarget.value !== lastTouchedSlot.value) {
        // Perform the swap just like in handleDrop
        const startIndex = lastTouchedSlot.value;
        const dropIndex = touchTarget.value;
        
        // Swap both numbers and giraffes
        const tempNumber = positions.value[startIndex].number;
        const tempGiraffe = positions.value[startIndex].giraffe;
        
        positions.value[startIndex].number = positions.value[dropIndex].number;
        positions.value[startIndex].giraffe = positions.value[dropIndex].giraffe;
        
        positions.value[dropIndex].number = tempNumber;
        positions.value[dropIndex].giraffe = tempGiraffe;
        
        showFeedback.value = false;
      }
      
      // Reset touch state
      touchActive.value = false;
      currentTouchElement.value = null;
      lastTouchedSlot.value = null;
      touchTarget.value = null;
    };

    return {
      showGameContent,
      showGiraffes,
      showFeedback,
      showWarning,
      showSuccess,
      positions,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      checkAnswer,
      getGiraffeHead,
      resetGame,
      handleContinue,
      isDragging,
      getSpeechText,
      showSecondaryObjective,
      showSecondaryPhase,
      showSecondaryGiraffes,
      showSecondaryFeedback,
      showQuestionModal,
      showGrassArea,
      secondaryGiraffes,
      showSuccessSpeech,
      showSecondarySuccess,
      showSecondaryWarning,
      handleOptionSelect,
      handleSecondaryTryAgain,
      showTertiaryObjective,
      showTertiaryPhase,
      showTertiaryContent,
      showTertiaryGiraffes,
      showTertiaryQuestion,
      tertiaryGiraffes,
      handleSecondaryComplete,
      handleTertiaryOptionSelect,
      showTertiaryError,
      showTertiarySuccess,
      handleTertiaryComplete,
      handleTertiaryTryAgain,
      showGreatWorkModal,
      showGoldBadgeScreen,
      showNextLevelObjective,
      showGoldBadgeUnlock,
      filledStars,
      showButtons,
      handlePlayAgain,
      handleContinueToHome,
      touchStartX,
      touchStartY,
      currentTouchElement,
      lastTouchedSlot,
      touchOffsetX,
      touchOffsetY,
      touchActive,
      touchTarget,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    };
  }
});
</script>

<style scoped>
.gameplay-container {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.instruction-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  padding: 0 20px;
  transform: translateX(10px);
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.giraffes-area {
  position: absolute;
  bottom: 224px; /* Base alignment with grass tip */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 80px;
  height: calc(100vh - 400px);
  min-height: 200px;
  padding-bottom: 0;
  z-index: 3;
  transform: translateX(10px);
}

.giraffe-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45px;
  transition: transform 0.3s ease;
  position: relative;
  opacity: 0;
  margin-bottom: 0; /* Reset margin */
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
  display: block;
  margin: 0;
  padding: 0;
  vertical-align: bottom;
  transform: translateY(0); /* Reset transform */
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .giraffe-slot {
    width: 55px;
    margin-bottom: 0;
  }

  .giraffe-container {
    width: 55px;
  }

  .giraffe-image {
    width: 55px;
    height: 170px;
  }

  .giraffes-area {
    bottom: 224px; /* Keep consistent base alignment */
    gap: 70px;
  }

  .tertiary-giraffe .giraffe-image {
    clip-path: inset(0 0 35% 0); /* Increased clipping */
    margin-bottom: -52px; /* Adjusted compensation */
  }

  .secondary-giraffe.align-by-strip .giraffe-image {
    clip-path: inset(0 0 35% 0); /* Increased clipping */
    margin-bottom: -52px; /* Adjusted compensation */
  }
}

/* Desktop adjustments */
@media (min-width: 1024px) {
  .giraffe-slot {
    width: 65px;
    margin-bottom: 0;
  }

  .giraffe-container {
    width: 65px;
  }

  .giraffe-image {
    width: 65px;
    height: 200px;
  }

  .giraffes-area {
    bottom: 224px; /* Keep consistent with base */
    gap: 90px;
  }
}

.answer-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  z-index: 1;
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
  z-index: 2;
  display: flex;
  justify-content: center;
  padding: 20px;
  gap: 80px;
  margin-bottom: 20px;
  width: 100%;
  max-width: calc(240px + 160px);
  margin-left: auto;
  margin-right: auto;
}

.number-slot-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.number-button {
  width: 80px;
  height: 50px;
  background: #8FD14F;
  border: 1.5px solid #3A8737;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  color: #FFFFFF;
  cursor: grab;
  user-select: none;
  transition: transform 0.3s ease;
}

.number-button.dragging {
  opacity: 0.5;
  transform: scale(1.05);
}

.arrow-symbol {
  color: #FFFFFF;
  background: #3A8737;
  width: 19.99px;
  height: 10.01px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: 4px;
  z-index: 3;
  position: relative;
}

.check-button {
  position: relative;
  z-index: 2;
  background: white;
  color: #333333;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  cursor: pointer;
  width: calc(100% - 40px);
  max-width: calc(240px + 160px);
  margin: 20px auto;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateX(10px);
}

.control-buttons {
  display: flex;
  gap: 12px;
  z-index: 100;
}

.pause-button,
.options-button {
  width: 44px;  /* Slightly larger to match Level 2 */
  height: 44px;
  border-radius: 50%;
  border: 1px solid #E4E4E4;
  background: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px; /* Slightly larger icons */
  z-index: 100;
}

.pause-button svg,
.options-button svg {
  width: 20px;  /* Explicit icon sizing */
  height: 20px;
  color: #333333;
  opacity: 0.8;
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
}

.warning-feedback.slide-in {
  transform: translateY(0);
}

.warning-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.warning-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
  opacity: 0.9;
}

.try-again-button {
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

.success-feedback {
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
  z-index: 1000;
  border-radius: 24px 24px 0 0;
}

.success-feedback.slide-in {
  transform: translateY(0);
}

.success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
}

.success-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.continue-button {
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

.speech-bubble {
  position: absolute;
  top: -40px;
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.speech-bubble.fade-in {
  opacity: 1;
}

.speech-bubble.fade-out {
  opacity: 0;
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

@media (max-width: 768px) {
  .number-button {
    width: 70px;
    font-size: 18px;
  }

  .giraffes-area {
    bottom: 224px; /* Keep consistent base alignment */
    gap: 60px;
    padding-bottom: 0;
    transform: translateX(5px);
  }

  .number-slots {
    gap: 60px;
    padding: 20px 10px;
    max-width: calc(210px + 120px);
    transform: translateX(5px);
  }

  .check-button {
    max-width: calc(210px + 120px);
    transform: translateX(5px);
  }

  .giraffe-container.short-giraffe {
    width: 50px;
    height: 150px;
  }

  .giraffe-container.mid-giraffe {
    width: 55px;
    height: 160px;
  }

  .giraffe-container.tallest-giraffe {
    width: 65px;
    height: 180px;
  }

  .giraffe-slot .tallest-giraffe {
    width: 65px;
  }

  .tertiary-giraffe .giraffe-image {
    clip-path: inset(0 0 35% 0); /* Increased clipping */
    margin-bottom: -52px; /* Adjusted compensation */
  }

  .secondary-giraffe.align-by-strip .giraffe-image {
    clip-path: inset(0 0 35% 0); /* Increased clipping */
    margin-bottom: -52px; /* Adjusted compensation */
  }
}

@media (min-width: 1024px) {
  .giraffe-container.short-giraffe {
    width: 65px;
    height: 180px;
  }

  .giraffe-container.mid-giraffe {
    width: 75px;
    height: 200px;
  }

  .giraffe-container.tallest-giraffe {
    width: 85px;
    height: 220px;
  }

  .giraffe-slot .tallest-giraffe {
    width: 85px;
  }

  .giraffes-area {
    transform: translateX(2px);
    gap: 80px;
    width: calc(240px + 160px);
    margin: 0 auto;
    justify-content: space-between;
  }

  .number-slots {
    gap: 80px;
  }

  .check-button {
    transform: translateX(2px);
  }

  .instruction-text {
    transform: translateX(2px);
  }
}

.objective-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.objective-screen.fade-in {
  opacity: 1;
}

.objective-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  padding: 0 20px;
}

.octopus-icon {
  display: flex;
  align-items: center;
  margin-top: 12px; /* Move octopus down more */
}

.secondary-phase {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.secondary-giraffes-container {
  position: absolute;
  bottom: 224px;  /* Position right above the grass outline */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 80px;
  z-index: 3;
}

.secondary-giraffe {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  position: relative;
}

.secondary-giraffe.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.secondary-giraffe .giraffe-image {
  width: 55px;
  height: 160px;
  object-fit: contain;
  object-position: bottom;
}

/* Special handling for 380 giraffe */
.secondary-giraffe.align-by-strip .giraffe-image {
  clip-path: inset(0 0 30% 0);
  margin-bottom: -48px;  /* Compensate for the clipped portion */
}

/* Make third giraffe start at grass tip */
.secondary-giraffe.align-by-tip {
  margin-top: auto;  /* Push to bottom of container */
}

.secondary-giraffe.align-by-tip .giraffe-image {
  margin-bottom: 0;  /* Align with grass tip */
}

@media (max-width: 768px) {
  .secondary-giraffe .giraffe-image {
    width: 50px;
    height: 150px;
  }
  
  .secondary-giraffes-container {
    gap: 60px;
  }

  .secondary-giraffe.align-by-strip .giraffe-image {
    clip-path: inset(0 0 25% 0);
    margin-bottom: -38px;
  }
}

@media (min-width: 1024px) {
  .secondary-giraffe .giraffe-image {
    width: 65px;
    height: 180px;
  }
  
  .secondary-giraffes-container {
    gap: 90px;
  }

  .secondary-giraffe.align-by-strip .giraffe-image {
    clip-path: inset(0 0 35% 0);
    margin-bottom: -63px;
  }
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
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  background: #8FD14F;
  padding: 20px;
  border-radius: 16px;
  width: 316px;
  z-index: 100;
  text-align: center;
  opacity: 0;
}

.question-modal.slide-in {
  animation: modalSlideIn 0.3s ease forwards;
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

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

.secondary-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  padding: 0 20px;
}

.success-feedback.secondary-success {
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
  z-index: 1000;
  border-radius: 24px 24px 0 0;
}

.success-feedback.secondary-success.slide-in {
  transform: translateY(0);
}

.success-feedback.secondary-success .success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
}

.success-feedback.secondary-success .success-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.success-feedback.secondary-success .continue-button {
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

.warning-feedback.secondary-warning {
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
}

.warning-feedback.secondary-warning.slide-in {
  transform: translateY(0);
}

.warning-feedback.secondary-warning .warning-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
}

.warning-feedback.secondary-warning .warning-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.warning-feedback.secondary-warning .try-again-button {
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

/* Special positioning for shortest giraffe */
.secondary-giraffe:first-child .speech-bubble {
  top: -25px; /* Move bubble closer to giraffe head */
}

.objective-screen.tertiary-objective {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.objective-screen.tertiary-objective.fade-in {
  opacity: 1;
}

.objective-screen.tertiary-objective .objective-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  padding: 0 20px;
}

.objective-screen.tertiary-objective .octopus-icon {
  margin-bottom: 20px;
}

.tertiary-phase {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tertiary-giraffes-container {
  position: absolute;
  bottom: 224px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 80px;
  z-index: 3;
}

.tertiary-giraffe {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  position: relative;
}

.tertiary-giraffe.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.tertiary-giraffe .giraffe-image {
  width: 55px;
  height: 160px;
  object-fit: contain;
  object-position: bottom;
  clip-path: inset(0 0 30% 0);
  margin-bottom: -48px;
}

.tertiary-giraffe .giraffe-label {
  position: absolute;
  top: calc(100% + 42px);
  left: 50%;
  transform: translateX(-50%);
  color: #4FAB4C;
  font-family: 'Gabarito', sans-serif;
  font-size: 28px;
  font-weight: bold;
  z-index: 4;
}

.tertiary-phase .question-modal {
  position: fixed;
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
  background: #8FD14F;
  padding: 20px;
  border-radius: 16px;
  width: 316px;
  z-index: 100;
  text-align: center;
}

.tertiary-phase .question-text {
  color: white;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.tertiary-phase .options-container {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.tertiary-phase .option-button {
  width: 60px;
  height: 50px;
  font-size: 32px;
  font-weight: bold;
  background: white;
  color: #4FAB4C;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

@media (max-width: 768px) {
  .tertiary-giraffe .giraffe-label {
    font-size: 24px;
    top: calc(100% + 38px);
  }
  
  .tertiary-giraffe .giraffe-image {
    margin-bottom: -38px;
  }
}

@media (min-width: 1024px) {
  .tertiary-giraffe .giraffe-image {
    width: 65px;
    height: 180px;
    margin-bottom: -52px;
  }
  
  .tertiary-giraffes-container {
    bottom: 224px;
  }

  .tertiary-giraffe .giraffe-label {
    top: calc(100% + 38px); /* Adjusted from 42px to 38px for larger screens */
  }
}

.tertiary-giraffe.shorter-giraffe .giraffe-image {
  clip-path: inset(0 0 30% 0);
  margin-bottom: -48px;
}

.tertiary-giraffe.taller-giraffe .giraffe-image {
  clip-path: none;
  margin-bottom: 0;
}

.speech-bubble.fade-out {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.speech-bubble.error-bubble-in {
  opacity: 1;
  transition: opacity 0.3s ease;
  transition-delay: 0.3s;
}

.success-feedback.tertiary-success,
.warning-feedback.tertiary-warning {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px 20px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  border-radius: 24px 24px 0 0;
}

.success-feedback.tertiary-success {
  background: #3A8737;
  color: white;
}

.warning-feedback.tertiary-warning {
  background: #DC3545;
  color: white;
}

.success-feedback.tertiary-success.slide-in,
.warning-feedback.tertiary-warning.slide-in {
  transform: translateY(0);
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

.gold-badge-screen {
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
  padding: 20px;
}

.gold-badge-screen.fade-in {
  opacity: 1;
}

.gold-badge-screen .close-button {
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

.gold-badge-screen .octopus-icon {
  margin-top: 60px;
  margin-bottom: 40px;
}

.badge-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease forwards;
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

.gold-badge-unlock {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.gold-badge-unlock.fade-in {
  opacity: 1;
}

.gold-badge-unlock .octopus-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.gold-badge-unlock-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #222;
  margin-bottom: 20px;
  text-align: center;
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

@media (max-width: 480px) {
  .question-modal.tertiary-question {
    width: 85%;
    max-width: 300px;
    padding: 16px;
  }
  
  .tertiary-question .options-container {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .tertiary-question .option-button {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .tertiary-giraffes-container {
    gap: 20px;
  }
  
  .tertiary-giraffe .giraffe-image {
    width: 45px;
    height: 130px;
  }
  
  .speech-bubble {
    font-size: 14px;
    padding: 8px;
    min-width: 80px;
    max-width: 100px;
    text-align: center;
    white-space: normal;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    position: absolute;
  }
  
  .tertiary-giraffe .speech-bubble,
  .secondary-giraffe .speech-bubble {
    transform: translateX(-50%) translateY(-5px);
    text-align: center;
    left: 50%;
    right: auto;
  }
  
  /* Fix for secondary phase giraffes */
  .secondary-giraffes-container {
    gap: 20px;
  }
  
  .secondary-giraffe {
    position: relative;
  }
  
  .secondary-giraffe .speech-bubble {
    top: -30px;
    width: auto;
  }
}

/* Fix for ensuring all giraffes stick to the grass */
.giraffe-fixed-bottom {
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  position: relative !important;
  bottom: 0 !important;
  margin-bottom: 0 !important;
  object-position: bottom !important;
  vertical-align: bottom !important;
}

/* Specific classes for giraffe images */
.tallest-giraffe-image {
  height: 200px !important;
  width: 65px !important;
  clip-path: none !important;
  object-fit: contain !important;
  object-position: bottom !important;
  margin-bottom: 0 !important;
}

.medium-giraffe-image {
  height: 170px !important;
  width: 65px !important;
  clip-path: none !important;
  object-fit: contain !important;
  object-position: bottom !important;
}

.shortest-giraffe-image {
  height: 140px !important;
  width: 65px !important;
  clip-path: none !important;
  object-fit: contain !important;
  object-position: bottom !important;
}

@media (min-width: 1024px) {
  /* When success modal shows, adjust bubble position to be closer to giraffe */
  .success-feedback.slide-in ~ .game-content .tallest-giraffe .speech-bubble {
    top: -180px !important;
  }
  
  /* Position speech bubbles properly */
  .giraffe-slot .speech-bubble {
    top: -60px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    white-space: nowrap !important;
  }
}
</style>
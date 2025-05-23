<template>
  <div class="gameplay-container">
    <!-- Countdown -->
    <div v-if="showCountdown" class="countdown-container">
      <div class="countdown-text" :class="{ 'fade-out': isCountdownFading }">
        {{ countdownText }}
      </div>
    </div>

    <!-- Secondary Objective Screen -->
    <div v-if="showObjective" class="objective-screen" :class="{ 'fade-in': showObjective }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <p class="objective-text">New giraffe has joined the line!</p>
    </div>

    <!-- Game content -->
    <div v-show="!showCountdown && !showObjective" class="game-content" :class="{ 'show-content': !showCountdown }">
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
      <div class="game-title" :class="{ 'fade-out': hideInitialContent }">
        Order the giraffes based on their Height
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
      <div class="answer-section" :class="{ 'fade-in': showAnswers }">
        <div class="grass-outline"></div>
        <img src="../assets/icons/Grass.png" class="grass-bg" alt="Grass" />
        
        <!-- Number buttons -->
        <div class="number-slots">
          <div v-for="(position, index) in positions" 
               :key="index"
               class="number-slot"
               @dragover.prevent
               @drop="handleDrop($event, index)">
            <div v-if="position.number !== null"
                 class="number-button draggable-item"
                 draggable="true"
                 @dragstart="handleDragStart($event, index)"
                 @touchstart="handleTouchStart($event, index)"
                 @touchmove.prevent="handleTouchMove($event)"
                 @touchend="handleTouchEnd($event)">
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

    <!-- Success Feedback for First Sub-level -->
    <div v-if="showSuccess" class="success-feedback" :class="{ 'slide-in': showSuccess }">
      <h2 class="success-title">Awesome!</h2>
      <p class="success-text">The Giraffes are now in order.</p>
      <button class="continue-button" @click="handleFirstLevelComplete">Continue</button>
    </div>

    <!-- Secondary Gameplay -->
    <div v-if="showSecondaryGame" class="secondary-gameplay">
      <!-- Top bar -->
      <div class="top-bar" :class="{ 'fade-out': hideInitialContent }">
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
      <div v-if="!showSecondaryWarning && !showSecondarySuccess" class="secondary-title" :class="{ 'fade-in': showSecondaryTitle }">
        Find the missing number for the new giraffe
      </div>

      <!-- Giraffes Container -->
      <div class="secondary-giraffes-container">
        <div v-for="(giraffe, index) in secondaryGiraffes" 
             :key="index"
             class="secondary-giraffe"
             :class="{ 'slide-in': showSecondaryGiraffes }"
             :data-new="giraffe.isNew"
             :style="{ 'animation-delay': `${300 * index}ms` }">
          <!-- Speech Bubble -->
          <div v-if="showSecondaryFeedback || showNewSpeechBubbles" 
               class="speech-bubble"
               :class="{ 
                 'fade-in': showSecondaryFeedback || showNewSpeechBubbles,
                 'fade-out': !showSecondaryFeedback && !showNewSpeechBubbles 
               }">
            {{ giraffe.speech }}
          </div>
          
          <img :src="`../assets/icons/${giraffe.image}`" 
               :alt="`Giraffe ${index + 1}`"
               class="giraffe-image" />
        </div>
      </div>

      <!-- Question Modal -->
      <div v-if="showQuestionModal" 
           class="question-modal"
           :class="{ 'slide-in': showQuestionModal }">
        <div class="question-text">
          What should be the number for the new giraffe?
        </div>
        <div class="options-container">
          <button v-for="option in [5, 3, 6]" 
                  :key="option"
                  class="option-button"
                  @click="checkSecondaryAnswer(option)">
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Success Feedback for Second Sub-level -->
      <div v-if="showSecondarySuccess" 
           class="secondary-success-feedback"
           :class="{ 'slide-in': showSecondarySuccess }">
        <h2 class="success-title">Awesome!</h2>
        <p class="success-text">The Giraffes are now in order.</p>
        <button class="continue-button" @click="handleSecondaryComplete">
          Continue
        </button>
      </div>

      <!-- Grass Area -->
      <div class="grass-area" :class="{ 'fade-in': showGrassArea }">
        <div class="grass-outline"></div>
        <div class="grass-bg"></div>
      </div>
    </div>

    <!-- Secondary Gameplay Negative Feedback -->
    <div v-if="showSecondaryWarning" 
         class="secondary-warning-feedback"
         :class="{ 'slide-in': showSecondaryWarning }">
      <h2 class="warning-title">Oh no!</h2>
      <p class="warning-text">That was not the right number</p>
      <button class="continue-button" @click="resetSecondaryGame">
        Continue
      </button>
    </div>

    <!-- Great Work Modal -->
    <div v-if="showGreatWork" class="great-work-modal">
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
          <button class="play-again-btn" @click="goToLevel2">Play again</button>
          <button class="continue-home-btn" @click="goToHome">Continue to Home</button>
        </div>
      </div>
    </div>

    <!-- Bronze Badge Unlock Screen -->
    <div v-if="showBronzeBadgeUnlock" 
         class="bronze-badge-unlock" 
         :class="{ 'fade-in': showBronzeBadgeUnlock }">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="bronze-badge-unlock-text">Bronze Badge</h2>
      <img src="../assets/icons/BronzeLeague.png" alt="Bronze Badge" class="badge-icon" />
      <p class="badge-subtitle">Keep going to unlock the silver badge!</p>
    </div>

    <!-- Bronze Badge Modal -->
    <BronzeBadgeModal 
      v-if="showBronzeBadge"
      :has-feedback="hasFeedback"
      @close="showBronzeBadge = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OctopusIcon from './OctopusIcon.vue';
import { useRouter } from 'vue-router';
import BronzeBadgeModal from './BronzeBadgeModal.vue';

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

interface SecondaryGiraffe {
  height: number;
  image: string;
  speech: string;
  isNew?: boolean;
}

export default defineComponent({
  name: 'GiraffeGameplay',
  components: {
    OctopusIcon,
    BronzeBadgeModal
  },
  setup() {
    const showCountdown = ref(false);
    const isCountdownFading = ref(false);
    const countdownText = ref('');
    const showTitle = ref(true);
    const showGiraffes = ref(true);
    const showAnswers = ref(true);
    const showFeedback = ref(false);
    const showWarning = ref(false);
    const showSuccess = ref(false);
    const dragStartIndex = ref<number | null>(null);
    const showObjective = ref(false);
    const level = ref(1);
    const showSecondaryGame = ref(false);
    const hideInitialContent = ref(false);
    const showSecondaryGiraffes = ref(false);
    const showSecondaryFeedback = ref(false);
    const showQuestionModal = ref(false);
    const showGrassArea = ref(false);
    const showSecondaryTitle = ref(false);
    const showNewSpeechBubbles = ref(false);
    const showSecondarySuccess = ref(false);
    const showSecondaryWarning = ref(false);
    const showGreatWork = ref(false);
    const isFirstTimeUser = ref(false);
    const bothAnswersCorrect = ref(false);
    const router = useRouter();
    const showBronzeBadge = ref(false);
    const filledStars = ref(0);
    const playCount = ref(0);
    const hasFeedback = ref(false);
    const showButtons = ref(true);
    const showBronzeBadgeUnlock = ref(false);
    const windowWidth = ref(0);

    // Define giraffes with correct order
    const giraffes: Giraffe[] = [
      { id: 1, height: 120, correctNumber: 1 }, // Shortest
      { id: 2, height: 180, correctNumber: 4 }, // Tallest
      { id: 3, height: 150, correctNumber: 2 }, // Medium
    ];

    // Initialize positions with tallest giraffe in center
    const positions = ref<Position[]>([
      { giraffe: giraffes[0], number: 1 }, // Left
      { giraffe: giraffes[1], number: 4 }, // Center (tallest)
      { giraffe: giraffes[2], number: 2 }, // Right
    ]);

    // Define secondary giraffes
    const secondaryGiraffes = ref<SecondaryGiraffe[]>([
      { height: 1, image: 'Giraffe1.png', speech: "I'm the shortest!" },
      { height: 2, image: 'Giraffe3.png', speech: "I'm number 2!" },
      { height: 3, image: 'Giraffe3.png', speech: "What's my number?", isNew: true },
      { height: 4, image: 'Giraffe2.png', speech: "I'm the tallest!" }
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

      // Hide feedback when positions change
      showFeedback.value = false;
      dragStartIndex.value = null;
    };

    // Touch event handling for mobile devices
    const touchStartX = ref(0);
    const touchStartY = ref(0);
    const currentTouchX = ref(0);
    const currentTouchY = ref(0);
    const activeTouchElement = ref<HTMLElement | null>(null);
    const touchTargetIndex = ref<number | null>(null);
    const isDraggingTouch = ref(false);
    
    const handleTouchStart = (event: TouchEvent, index: number) => {
      if (event.touches.length !== 1) return;
      
      // Store starting position
      touchStartX.value = event.touches[0].clientX;
      touchStartY.value = event.touches[0].clientY;
      currentTouchX.value = touchStartX.value;
      currentTouchY.value = touchStartY.value;
      
      // Store the element and index
      activeTouchElement.value = event.currentTarget as HTMLElement;
      touchTargetIndex.value = index;
      
      // Create a visual clone for dragging on iOS
      const rect = activeTouchElement.value.getBoundingClientRect();
      const clone = activeTouchElement.value.cloneNode(true) as HTMLElement;
      clone.id = 'touch-clone';
      clone.style.position = 'absolute';
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = '2000';
      clone.style.opacity = '0.8';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      
      // Visual feedback for the original element
      activeTouchElement.value.style.opacity = '0.4';
      
      // Prevent scrolling during drag
      document.body.style.overflow = 'hidden';
      
      // Mark as dragging
      isDraggingTouch.value = true;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingTouch.value || !activeTouchElement.value) return;
      
      event.preventDefault(); // Prevent scrolling
      
      // Update current position
      currentTouchX.value = event.touches[0].clientX;
      currentTouchY.value = event.touches[0].clientY;
      
      // Move the clone with the touch
      const clone = document.getElementById('touch-clone');
      if (clone) {
        clone.style.transform = `translate(${currentTouchX.value - touchStartX.value}px, ${currentTouchY.value - touchStartY.value}px)`;
      }
      
      // Detect if we're over a drop target
      const elements = document.elementsFromPoint(currentTouchX.value, currentTouchY.value);
      const dropTarget = elements.find(el => el.classList.contains('number-slot'));
      
      // Highlight potential drop target
      document.querySelectorAll('.number-slot').forEach(slot => {
        slot.classList.remove('touch-drop-target');
      });
      
      if (dropTarget && dropTarget.classList.contains('number-slot')) {
        dropTarget.classList.add('touch-drop-target');
      }
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      if (!isDraggingTouch.value || touchTargetIndex.value === null) {
        isDraggingTouch.value = false;
        if (activeTouchElement.value) {
          activeTouchElement.value.style.opacity = '';
        }
        activeTouchElement.value = null;
        return;
      }
      
      // Re-enable scrolling
      document.body.style.overflow = '';
      
      // Get all drop targets
      const slots = Array.from(document.querySelectorAll('.number-slot'));
      
      // Get target element under touch point
      const elements = document.elementsFromPoint(currentTouchX.value, currentTouchY.value);
      const dropTarget = elements.find(el => el.classList.contains('number-slot'));
      
      // Remove the clone
      const clone = document.getElementById('touch-clone');
      if (clone) {
        document.body.removeChild(clone);
      }
      
      // Reset visual appearance
      if (activeTouchElement.value) {
        activeTouchElement.value.style.opacity = '';
      }
      
      // Remove all highlights
      slots.forEach(slot => {
        slot.classList.remove('touch-drop-target');
      });
      
      // If we have a valid drop target, perform the swap
      if (dropTarget) {
        const dropIndex = slots.indexOf(dropTarget as HTMLElement);
        const startIndex = touchTargetIndex.value;
        
        if (dropIndex !== -1 && dropIndex !== startIndex) {
          // Swap both numbers and giraffes
          const tempNumber = positions.value[startIndex].number;
          const tempGiraffe = positions.value[startIndex].giraffe;
          
          positions.value[startIndex].number = positions.value[dropIndex].number;
          positions.value[startIndex].giraffe = positions.value[dropIndex].giraffe;
          
          positions.value[dropIndex].number = tempNumber;
          positions.value[dropIndex].giraffe = tempGiraffe;
          
          // Hide feedback when positions change
          showFeedback.value = false;
        }
      }
      
      // Reset touch state
      isDraggingTouch.value = false;
      activeTouchElement.value = null;
      touchTargetIndex.value = null;
    };

    const getSpeechText = (position: Position) => {
      if (!position.giraffe) return '';
      
      if (position.giraffe.correctNumber === 4) {
        return "I'm the tallest!";
      } else if (position.giraffe.correctNumber === 2) {
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
      if (position.giraffe.id === 1) {
        return '../assets/icons/Giraffe1.png';
      }
      if (position.giraffe.id === 3) {
        return '../assets/icons/Giraffe3.png';
      }
      
      return `../assets/icons/Giraffe${position.giraffe.id}.png`;
    };

    // Update window width on mount and resize
    onMounted(() => {
      showTitle.value = true;
      showGiraffes.value = true;
      showAnswers.value = true;
      
      // Get current play count
      playCount.value = getPlayCount();
      
      // Check if feedback was already given
      hasFeedback.value = document.cookie.includes('giraffe_game_feedback=true');
      
      // Initialize window width
      windowWidth.value = window.innerWidth;
      
      // Add resize listener
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
      });
      
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

    // Add inline styles for each giraffe based on its ID
    const getGiraffeStyle = (giraffeId: number) => {
      // Check for desktop/laptop screens
      if (windowWidth.value >= 1024) {
        // Tallest giraffe (ID 2)
        if (giraffeId === 2) {
          return {
            height: '300px',
            objectFit: 'contain',
            objectPosition: 'bottom',
            width: '65px',
            marginBottom: '0'
          };
        }
        // Medium giraffe (ID 3)
        else if (giraffeId === 3) {
          return {
            height: '170px',
            objectFit: 'contain',
            objectPosition: 'bottom',
            width: '65px',
            marginBottom: '0'
          };
        }
        // Shortest giraffe (ID 1)
        else {
          return {
            height: '120px',
            objectFit: 'contain',
            objectPosition: 'bottom',
            width: '65px',
            marginBottom: '0'
          };
        }
      }
      return {};
    };

    const checkAnswer = () => {
      // Get the current sequence of numbers
      const currentSequence = positions.value.map(pos => pos.number).join(',');
      const isCorrectOrder = currentSequence === '1,2,4';

      // Mark all positions as correct/incorrect based on overall sequence
      positions.value.forEach(position => {
        position.isCorrect = isCorrectOrder;
      });

      // Show feedback
      showFeedback.value = true;
      showWarning.value = false; // Reset warning first
      showSuccess.value = false; // Reset success first

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
      // Hide feedback elements
      showWarning.value = false;
      showFeedback.value = false;
      showSuccess.value = false;

      // Reset positions to initial state
      positions.value = [
        { giraffe: giraffes[0], number: 1 }, // Left
        { giraffe: giraffes[1], number: 4 }, // Center (tallest)
        { giraffe: giraffes[2], number: 2 }, // Right
      ];

      // Reset animations
      showTitle.value = true;
      showGiraffes.value = true;
      showAnswers.value = true;
    };

    const handleFirstLevelComplete = () => {
      showSuccess.value = false;
      showSecondaryGame.value = true;
      startSecondarySequence();
    };

    const startSecondarySequence = () => {
      // Hide initial content and show grass immediately
      hideInitialContent.value = true;
      showGrassArea.value = true;
      
      // Show new title after a short delay
      setTimeout(() => {
        showSecondaryTitle.value = true;
      }, 500);

      // Show giraffes after title appears
      setTimeout(() => {
        showSecondaryGiraffes.value = true;
        
        // Show speech bubbles after all giraffes appear
        setTimeout(() => {
          showSecondaryFeedback.value = true;
          
          // Show question modal after speech bubbles
          setTimeout(() => {
            showQuestionModal.value = true;
          }, 2000);
        }, 1200);
      }, 1500);
    };

    const getSecondaryGiraffeSpeech = (giraffe: SecondaryGiraffe) => {
      if (giraffe.height === 4) return "I'm the tallest!";
      if (giraffe.height === 3) return "What's my number?";
      if (giraffe.height === 2) return "I'm number 2!";
      return "I'm the shortest!";
    };

    const getSecondaryGiraffeImage = (giraffe: SecondaryGiraffe) => {
      return giraffe.image;
    };

    const checkSecondaryAnswer = (answer: number) => {
      if (answer === 3) {
        // Correct answer
        showQuestionModal.value = false;
        showSecondaryFeedback.value = false;
        
        setTimeout(() => {
          secondaryGiraffes.value = secondaryGiraffes.value.map(giraffe => ({
            ...giraffe,
            speech: getSpeechAfterAnswer(giraffe.height)
          }));
          
          showNewSpeechBubbles.value = true;
          bothAnswersCorrect.value = true;
          
          setTimeout(() => {
            showSecondarySuccess.value = true;
          }, 1500);
        }, 500);
      } else {
        // Wrong answer (5 or 6)
        showQuestionModal.value = false;
        showSecondaryWarning.value = true;
        bothAnswersCorrect.value = false;
      }
    };

    const getSpeechAfterAnswer = (height: number) => {
      switch(height) {
        case 1: return "I'm the shortest!";
        case 2: return "I'm number 2!";
        case 3: return "I'm between 2 & 4";
        case 4: return "I'm the tallest!";
        default: return "";
      }
    };

    const resetSecondaryGame = () => {
      showSecondaryWarning.value = false;
      showQuestionModal.value = true;
    };

    function checkFirstTimeUser() {
      if (document.cookie.includes('giraffe_game_first_played=true')) {
        isFirstTimeUser.value = false;
      } else {
        isFirstTimeUser.value = true;
        document.cookie = 'giraffe_game_first_played=true; path=/; max-age=31536000';
      }
    }

    function handleSecondaryComplete() {
      showSecondarySuccess.value = false;
      showGreatWorkModal();
    }

    function showGreatWorkModal() {
      checkFirstTimeUser();
      showGreatWork.value = true;
      
      // Increment play count
      playCount.value = incrementPlayCount();

      // Show different flow based on play count
      if (playCount.value > 1) {
        // Repeated play - hide buttons and show only stars
        showButtons.value = false;
        
        // Animate stars filling up
        setTimeout(() => {
          const starInterval = setInterval(() => {
            if (filledStars.value < 2) {
              filledStars.value++;
            } else {
              clearInterval(starInterval);
              
              // Show bronze badge unlock screen after stars fill
              setTimeout(() => {
                showGreatWork.value = false;
                showBronzeBadgeUnlock.value = true;
                
                // After 3s, show the bronze badge modal
                setTimeout(() => {
                  showBronzeBadgeUnlock.value = false;
                  showBronzeBadge.value = true;
                }, 3000);
              }, 1500);
            }
          }, 500);
        }, 500);
      } else {
        // First time play - show buttons and stars
        showButtons.value = true;
        
        // Animate stars filling up
        setTimeout(() => {
          const starInterval = setInterval(() => {
            if (filledStars.value < 2) {
              filledStars.value++;
            } else {
              clearInterval(starInterval);
            }
          }, 500);
        }, 500);
      }
    }

    function goToLevel2() {
      showGreatWork.value = false;
      showBronzeBadge.value = false;
      router.push('/giraffe-gameplay-level2');
    }
    
    function goToHome() {
      showGreatWork.value = false;
      showBronzeBadge.value = false;
      if (!hasFeedback.value) {
        router.push('/game-feedback-emoji');
      } else {
        router.push('/home');
      }
    }

    const getPlayCount = () => {
      const count = document.cookie.split('; ').find(row => row.startsWith('giraffe_game_play_count='));
      return count ? parseInt(count.split('=')[1]) : 0;
    };

    const incrementPlayCount = () => {
      const newCount = getPlayCount() + 1;
      document.cookie = `giraffe_game_play_count=${newCount}; path=/; max-age=31536000`;
      return newCount;
    };

    return {
      showCountdown,
      isCountdownFading,
      countdownText,
      showTitle,
      showGiraffes,
      showAnswers,
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
      showObjective,
      level,
      handleFirstLevelComplete,
      showSecondaryGame,
      hideInitialContent,
      showSecondaryGiraffes,
      showSecondaryFeedback,
      showQuestionModal,
      showGrassArea,
      secondaryGiraffes,
      getSecondaryGiraffeSpeech,
      getSecondaryGiraffeImage,
      checkSecondaryAnswer,
      showSecondaryTitle,
      showNewSpeechBubbles,
      showSecondarySuccess,
      showSecondaryWarning,
      resetSecondaryGame,
      showGreatWork,
      isFirstTimeUser,
      bothAnswersCorrect,
      showBronzeBadge,
      filledStars,
      hasFeedback,
      showButtons,
      goToLevel2,
      goToHome,
      showGreatWorkModal,
      handleSecondaryComplete,
      showBronzeBadgeUnlock,
      getGiraffeStyle,
      touchStartX,
      touchStartY,
      currentTouchY,
      currentTouchX,
      activeTouchElement,
      touchTargetIndex,
      isDraggingTouch,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
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
  touch-action: none;
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

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.game-content.show-content {
  opacity: 1;
}

.game-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  opacity: 1;
  transition: opacity 0.5s ease;
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}

.game-title.fade-out {
  opacity: 0;
  pointer-events: none;
}

.giraffes-area {
  position: absolute;
  bottom: 244px;
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
}

.giraffe-slot {
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45px;
  transition: transform 0.3s ease;
  position: relative;
  margin-bottom: 0;
}

.giraffe-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 45px;
  position: relative;
  z-index: 2;
  margin-bottom: 0;
}

.giraffe-image {
  width: 45px;
  height: 140px;
  object-fit: contain;
  object-position: bottom;
  margin-bottom: 0;
}

/* Base responsive classes for different giraffe sizes */
.tallest-giraffe .giraffe-image {
  height: 150px;
  clip-path: none;
  margin-bottom: 0;
}

.medium-giraffe .giraffe-image {
  height: 120px;
}

.shortest-giraffe .giraffe-image {
  height: 100px;
}

/* Laptop/desktop adjustments for phase 1 giraffes */
@media (min-width: 768px) {
  .giraffes-area {
    gap: 90px;
  }
  
  .giraffe-slot {
    width: 55px;
  }
  
  .giraffe-container {
    width: 55px;
  }
  
  .tallest-giraffe .giraffe-image,
  .medium-giraffe .giraffe-image,
  .shortest-giraffe .giraffe-image {
    width: 55px;
  }
  
  /* Make sure the tallest giraffe is rendered at FULL height */
  .tallest-giraffe .giraffe-image {
    height: 180px;
    clip-path: none;
    margin-bottom: 0;
  }
  
  /* Medium giraffe should be clearly smaller than tallest */
  .medium-giraffe .giraffe-image {
    height: 140px;
  }
  
  /* Shortest giraffe */
  .shortest-giraffe .giraffe-image {
    height: 120px;
  }
}

@media (min-width: 1024px) {
  /* Ensure the giraffe area has proper positioning relative to grass */
  .giraffes-area {
    height: auto !important; 
    min-height: 350px !important;
    bottom: 224px !important; /* Position right above grass line */
    overflow: visible !important;
    gap: 100px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    align-items: flex-end !important; /* Align items to bottom */
    position: absolute !important;
    z-index: 5 !important;
  }
  
  /* Position speech bubbles properly for phase 1 */
  .giraffe-slot .speech-bubble {
    top: -60px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    white-space: nowrap !important;
  }
  
  /* When success modal shows, adjust bubble position to be closer to giraffe */
  .success-feedback.slide-in ~ .game-content .tallest-giraffe .speech-bubble {
    top: -180px !important;
  }
  
  .giraffe-slot {
    width: 65px !important;
    margin-bottom: 0 !important; /* Ensure no margin below */
    display: flex !important;
    align-items: flex-end !important; /* Align to bottom */
    height: auto !important;
    position: relative !important;
    transition: transform 0.3s ease !important;
  }
  
  .giraffe-container {
    width: 65px !important;
    position: relative !important;
    margin-bottom: 0 !important; /* Ensure no margin below */
  }
  
  /* Speech bubble positioning for secondary phase */
  .secondary-giraffe:nth-child(1) .speech-bubble {
    transform: translateX(-45%) !important;
    top: 30px !important;
  }
  
  /* Restore the original phase 2 giraffe positioning with clipping */
  .secondary-giraffe:nth-child(2) .giraffe-image {
    clip-path: inset(0 0 30% 0) !important;
    margin-bottom: -70px !important; /* Adjusted to touch grass dark shade properly */
  }
  
  /* Container styles for different giraffe types */
  .tallest-giraffe, .medium-giraffe, .shortest-giraffe {
    display: flex !important;
    align-items: flex-end !important;
    overflow: visible !important;
    height: auto !important;
    position: relative !important;
    bottom: 0 !important;
  }
  
  /* Make sure all giraffe images align to the bottom */
  .giraffe-image {
    object-position: bottom !important;
    position: relative !important;
    bottom: 0 !important; 
    margin-bottom: 0 !important;
    vertical-align: bottom !important;
  }
  
  /* Specific giraffe image styles */
  .tallest-giraffe-image {
    height: 350px !important;
    width: 65px !important;
    object-fit: contain !important;
    object-position: bottom !important;
    margin-bottom: 0 !important;
    vertical-align: bottom !important;
    clip-path: none !important;
  }

  .medium-giraffe-image {
    height: 200px !important;
    width: 65px !important;
    object-fit: contain !important;
    object-position: bottom !important;
    margin-bottom: 0 !important;
    vertical-align: bottom !important;
    clip-path: none !important;
  }

  .shortest-giraffe-image {
    height: 150px !important;
    width: 65px !important;
    object-fit: contain !important;
    object-position: bottom !important;
    margin-bottom: 0 !important;
    vertical-align: bottom !important;
    clip-path: none !important;
  }
}

@media (min-width: 1440px) {
  .giraffes-area {
    gap: 120px;
    bottom: 244px;
    height: calc(100vh - 480px);
  }
  
  .giraffe-slot {
    width: 75px;
  }
  
  .giraffe-container {
    width: 75px;
  }
  
  .tallest-giraffe .giraffe-image,
  .medium-giraffe .giraffe-image,
  .shortest-giraffe .giraffe-image {
    width: 75px;
  }
  
  /* Make sure the tallest giraffe is rendered at FULL height */
  .tallest-giraffe .giraffe-image {
    height: 260px;
    clip-path: none;
    margin-bottom: 0;
  }
  
  /* Medium giraffe should be clearly smaller than tallest */
  .medium-giraffe .giraffe-image {
    height: 190px;
  }
  
  /* Shortest giraffe */
  .shortest-giraffe .giraffe-image {
    height: 160px;
  }
  
  .secondary-giraffe:nth-child(1) .speech-bubble {
    transform: translateX(-45%);
    top: 30px;
  }
}

/* Secondary phase styles */
.secondary-giraffes-container {
  position: absolute;
  bottom: 224px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 50px;
  padding: 0 20px;
  z-index: 5;
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

.grass-area .grass-outline {
  width: 100%;
  height: 24px;
  background: #4FAB4C;
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  z-index: 1;
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

.grass-area.fade-in {
  opacity: 1;
}

/* Question modal styling */
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
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.3;
}

.options-container {
  display: flex;
  justify-content: center;
  gap: 35px;
  margin: 0 auto;
}

.option-button {
  width: 50px;
  height: 42px;
  background: white;
  border: none;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  color: #4FAB4C;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

@media (min-width: 768px) {
  .speech-bubble {
    top: -45px;
    padding: 8px 12px;
    font-size: 15px;
  }

  .question-modal {
    bottom: 30px;
    width: 280px;
    padding: 18px;
  }

  .question-text {
    font-size: 18px;
    margin-bottom: 18px;
  }

  .options-container {
    gap: 40px;
  }

  .option-button {
    width: 55px;
    height: 45px;
    font-size: 22px;
  }
}

@media (min-width: 1024px) {
  .speech-bubble {
    top: -50px;
    padding: 8px 14px;
    font-size: 16px;
  }

  .question-modal {
    bottom: 20px;
    width: 300px;
    padding: 20px;
  }

  .question-text {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .options-container {
    gap: 45px;
  }

  .option-button {
    width: 60px;
    height: 48px;
    font-size: 24px;
  }
}

@media (min-width: 1440px) {
  .speech-bubble {
    top: -55px;
    padding: 10px 16px;
    font-size: 18px;
  }

  .question-modal {
    bottom: 15px;
    width: 320px;
  }

  .question-text {
    font-size: 22px;
    margin-bottom: 22px;
  }

  .options-container {
    gap: 50px;
  }

  .option-button {
    width: 65px;
    height: 52px;
    font-size: 26px;
  }
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
  z-index: 1;
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
  margin-top: 20px;
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
  position: relative;
  touch-action: none; /* Disable browser handling of touch events */
}

/* Mobile drag handle visual cue */
.drag-handle {
  display: none;
}

/* Touch drop target highlight */
.touch-drop-target {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

/* Ensure warning/success messages appear on top */
.warning-feedback, .success-feedback, .secondary-warning-feedback, .secondary-success-feedback {
  z-index: 2000 !important;
  position: fixed !important;
}

/* Fix speech bubble positions during warning display */
.warning-feedback.slide-in ~ .game-content .speech-bubble,
.success-feedback.slide-in ~ .game-content .speech-bubble {
  z-index: 1 !important; /* Keep behind feedback */
}

.speech-bubble {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #4FAB4C;
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Gabarito', sans-serif;
  white-space: nowrap;
  z-index: 10;
  min-width: 25px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  width: max-content;
}

/* Specific adjustments for each giraffe's speech bubble in phase 1 */
.giraffe-slot:nth-child(1) .speech-bubble {
  transform: translateX(-45%);
  top: 30px;
}

.giraffe-slot:nth-child(2) .speech-bubble {
  transform: translateX(-50%);
}

.giraffe-slot:nth-child(3) .speech-bubble {
  transform: translateX(-50%);
}

/* Specific adjustments for each giraffe's speech bubble in phase 2 */
.secondary-giraffe:nth-child(1) .speech-bubble {
  transform: translateX(-45%);
  top: 30px;
}

.secondary-giraffe:nth-child(2) .speech-bubble {
  transform: translateX(-50%);
}

.secondary-giraffe:nth-child(3) .speech-bubble {
  transform: translateX(-50%);
}

.secondary-giraffe:nth-child(4) .speech-bubble {
  transform: translateX(-55%);
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

.speech-bubble.fade-in {
  opacity: 1;
}

.check-button {
  position: relative;
  z-index: 3;
  width: 316px;
  height: 45px;
  margin: 0 auto 20px;
  display: block;
  background: #FFFFFF;
  border: 1px solid #E4E4E4;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
}

/* Animations */
.fade-in {
  opacity: 1 !important;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-in {
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries for larger screens */
@media (min-width: 768px) {
  .giraffes-area {
    bottom: 244px;
    gap: 70px;
  }

  .giraffe-container {
    width: 55px;
  }

  .giraffe-image {
    width: 55px;
    height: 170px;
  }

  /* Adjust clip-path for tablet */
  .giraffe-slot:nth-child(2) .giraffe-image {
    clip-path: inset(0 0 30% 0);
    margin-bottom: -51px;
  }

  .secondary-giraffe:nth-child(1) .speech-bubble {
    transform: translateX(-45%);
    top: 30px;
  }
}

@media (min-width: 1024px) {
  .giraffes-area {
    bottom: 244px;
    gap: 90px;
    padding-top: 30px;
  }

  .giraffe-container {
    width: 65px;
  }

  .giraffe-image {
    width: 65px;
    height: 200px;
  }

  .secondary-giraffe:nth-child(1) .speech-bubble {
    transform: translateX(-45%);
    top: 30px;
  }
}

@media (min-width: 1440px) {
  .giraffes-area {
    bottom: 244px;
    height: calc(100vh - 480px);
  }

  /* Giraffe height adjustments for large screens */
  .tallest-giraffe .giraffe-image {
    height: 230px;
  }
  
  .medium-giraffe .giraffe-image {
    height: 190px;
  }
  
  .shortest-giraffe .giraffe-image {
    height: 160px;
  }

  .secondary-giraffe:nth-child(1) .speech-bubble {
    transform: translateX(-45%);
    top: 30px;
  }
}

:global(body) {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
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
  background: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #DC3545;
  cursor: pointer;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.try-again-button:hover {
  background: #f8f9fa;
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

.continue-button:hover {
  background: #f8f9fa;
}

.countdown-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  z-index: 1000;
}

.countdown-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 56px;
  color: #6BADD7;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.countdown-text.fade-out {
  opacity: 0;
}

.objective-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
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
  font-weight: 500;
  text-align: center;
  margin-top: 40px;
}

@media (min-width: 768px) {
  .objective-text {
    font-size: 28px;
  }
}

@media (min-width: 1024px) {
  .objective-text {
    font-size: 32px;
  }
  
  /* Giraffe height adjustments for laptop/desktop */
  .tallest-giraffe .giraffe-image {
    height: 200px;
  }
  
  .medium-giraffe .giraffe-image {
    height: 170px;
  }
  
  .shortest-giraffe .giraffe-image {
    height: 140px;
  }
}

.secondary-gameplay {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  z-index: 2000;
}

.secondary-title {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
  margin: 20px auto;
  opacity: 0;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  transition: opacity 0.5s ease;
  max-width: 90%;
}

.secondary-title.fade-in {
  opacity: 1;
}

.secondary-giraffes-container {
  position: absolute;
  bottom: 224px;
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

/* Dynamic clipping only for second giraffe in phase 2 */
.secondary-giraffe:nth-child(2) .giraffe-image {
  clip-path: inset(0 0 30% 0);
  margin-bottom: -42px;
}

@media (min-width: 768px) {
  .secondary-giraffes-container {
    gap: 70px;
  }

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
}

@media (min-width: 1024px) {
  .secondary-giraffes-container {
    gap: 90px;
  }

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
}

/* Success modal styles */
.secondary-success-feedback {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2E7D32;
  color: white;
  padding: 24px 20px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  border-radius: 24px 24px 0 0;
}

.secondary-success-feedback.slide-in {
  transform: translateY(0);
}

.secondary-success-feedback .success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.secondary-success-feedback .success-text {
  color: #FFFFFF;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-family: 'Gabarito', sans-serif;
}

.secondary-success-feedback .continue-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: 100%;
}

.secondary-success-feedback .continue-button:hover {
  background: #f8f9fa;
}

/* Fade animations */
.fade-out {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.fade-in {
  opacity: 1;
  transition: opacity 0.5s ease;
}

/* Slide animations */
.slide-in {
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.secondary-warning-feedback {
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
  z-index: 9999;
  width: 100%;
  border-radius: 16px 16px 0 0;
}

.secondary-warning-feedback.slide-in {
  transform: translateY(0);
  border-radius: 16px 16px 0 0;
}

.warning-title {
  color: #FFFFFF;
  font-size: 24px;
  margin-bottom: 12px;
  font-family: 'Gabarito', sans-serif;
}

.warning-text {
  color: #FFFFFF;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-family: 'Gabarito', sans-serif;
}

.secondary-warning-feedback .continue-button {
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  width: 100%;
  max-width: none;
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

.bronze-badge-unlock {
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

.bronze-badge-unlock.fade-in {
  opacity: 1;
}

.bronze-badge-unlock .octopus-icon {
  position: absolute;
  top: 20px;
  /* Change from right alignment to center */
  left: 50%;
  transform: translateX(-50%);
}

.bronze-badge-unlock-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 28px;
  color: #222;
  margin: 0 0 8px 0;
  font-weight: 700;
  text-align: center;
}

.badge-icon {
  width: 100px;
  height: auto;
  margin: 40px 0;
  animation: scaleIn 0.5s ease forwards;
}

.badge-subtitle {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .secondary-title {
    font-size: 28px;
    top: 50px;
  }

  .speech-bubble {
    top: -38px;
    padding: 8px 12px;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .secondary-title {
    font-size: 32px;
    top: 40px;
  }

  .speech-bubble {
    top: -42px;
    padding: 8px 14px;
    font-size: 16px;
  }
}

@media (min-width: 1440px) {
  .secondary-title {
    font-size: 32px;
    top: 30px;
  }

  .speech-bubble {
    top: -45px;
    padding: 8px 14px;
    font-size: 16px;
  }
}

/* Styling for the explicit giraffe types - with higher specificity and !important */
@media (min-width: 1024px) {
  .tallest-giraffe {
    overflow: visible !important;
    height: auto !important;
    min-height: 300px !important;
    clip-path: none !important;
  }
  
  .tallest-giraffe-image {
    height: 300px !important;
    width: 65px !important;
    clip-path: none !important;
    object-fit: contain !important;
    object-position: bottom !important;
    margin-bottom: 0 !important;
    max-height: none !important;
    overflow: visible !important;
  }

  .medium-giraffe-image {
    height: 170px !important;
    width: 65px !important;
    clip-path: none !important;
    object-fit: contain !important;
    object-position: bottom !important;
  }

  .shortest-giraffe-image {
    height: 120px !important;
    width: 65px !important;
    clip-path: none !important;
    object-fit: contain !important;
    object-position: bottom !important;
  }
}

/* Fix for ensuring all giraffes stick to the grass regardless of swapping */
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

/* Add a class for the grass-area to assist with positioning */
.grass-area .grass-outline {
  z-index: 10 !important;
}

/* Ensure the giraffe images maintain their relative proportions */
@media (min-width: 1024px) {
  .tallest-giraffe-image {
    transform-origin: bottom center !important;
  }
  
  .medium-giraffe-image {
    transform-origin: bottom center !important;
  }
  
  .shortest-giraffe-image {
    transform-origin: bottom center !important;
  }
}

/* Fix for the positioning when success modal appears */
@media (min-width: 1024px) {
  /* When success modal shows, maintain proper giraffe positioning */
  .success-feedback.slide-in ~ .game-content .giraffes-area {
    bottom: 224px !important;
    position: absolute !important;
    z-index: 5 !important;
  }

  .success-feedback.slide-in ~ .game-content .giraffe-slot,
  .success-feedback.slide-in ~ .game-content .giraffe-container {
    margin-bottom: 0 !important;
    bottom: 0 !important;
  }

  /* Make sure the success feedback doesn't disrupt positioning */
  .success-feedback {
    z-index: 2000 !important;
    position: fixed !important;
    bottom: 0 !important;
  }
}

/* Additional speech bubble positioning for mobile */
@media (max-width: 767px) {
  .speech-bubble {
    font-size: 14px;
    padding: 8px;
    min-width: 80px;
    max-width: 90px;
    white-space: normal;
    text-align: center;
    top: -80px !important;
    z-index: 10;
  }
  
  /* Fix for shortest giraffe */
  .giraffe-slot:nth-child(1) .speech-bubble {
    top: -60px !important;
  }
  
  /* Fix for medium giraffe */
  .giraffe-slot:nth-child(3) .speech-bubble {
    top: -70px !important;
  }
  
  /* Fix for tallest giraffe */
  .giraffe-slot:nth-child(2) .speech-bubble {
    top: -90px !important;
  }
  
  /* Adjust speech bubbles in Phase 2 */
  .secondary-giraffes-container {
    gap: 30px;
  }
  
  /* Prevent speech bubbles from overlapping in secondary phase */
  .secondary-giraffes-container .secondary-giraffe:nth-child(1) .speech-bubble {
    top: -35px !important;
    left: 40%;
  }
  
  .secondary-giraffes-container .secondary-giraffe:nth-child(2) .speech-bubble {
    top: -65px !important;
    left: 60%;
  }
  
  .secondary-giraffes-container .secondary-giraffe:nth-child(3) .speech-bubble {
    top: -35px !important;
    left: 40%;
  }
  
  .secondary-giraffes-container .secondary-giraffe:nth-child(4) .speech-bubble {
    top: -65px !important;
    left: 60%;
  }
  
  /* When success modal shows, adjust bubble positions */
  .success-feedback.slide-in ~ .game-content .tallest-giraffe .speech-bubble {
    top: -120px !important;
  }
}
</style>
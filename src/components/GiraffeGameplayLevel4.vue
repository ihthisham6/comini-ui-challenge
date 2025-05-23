<template>
  <div class="gameplay-container">
    <!-- Game Start Transition Screen -->
    <div v-if="showStartTransition" class="start-transition-screen" :class="{ 'fade-out': isStartTransitionFading }">
      <div class="transition-content">
        <p class="objective-text" :class="{ 'move-up': showObjectiveAnimation }">
          Order the giraffe towns based on their population!
        </p>
      </div>
    </div>

    <!-- Main Gameplay Screen -->
    <div v-if="showGameContent" class="gameplay-screen">
      <!-- Top Bar -->
      <div class="top-bar" :class="{ 'fade-in': showTopBar }">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" :class="{ 'fade-out': hideOctopus }" />
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>

      <!-- Main Game Area -->
      <div class="game-content">
        <p class="instruction-text" :class="{ 'move-up': showObjectiveAnimation, 'fade-out': hideObjectiveText }">
          Order the giraffe towns based on their population
        </p>

        <!-- Grass Area -->
        <div v-if="showGrassArea" class="grass-area fade-in">
          <div class="grass-bg"></div>
        </div>

        <!-- Giraffe Towns Container -->
        <div v-if="showGiraffes" class="giraffe-towns-container">
          <div 
            v-for="(town, index) in giraffeTowns" 
            :key="index"
            class="giraffe-town" 
            :class="{ 'slide-in': showGiraffes }"
            :style="{ animationDelay: `${index * 300}ms` }"
          >
            <!-- Speech Bubble -->
            <div v-if="showSpeechBubbles" class="speech-bubble fade-in">
              {{ town.speechText }}
            </div>
            
            <!-- Giraffe Population -->
            <div class="giraffe-population">
              <div class="giraffe-group">
                <img :src="getGiraffeImage(3)" class="giraffe-img clipped-giraffe" />
                <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" />
                <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" />
              </div>
            </div>

            <!-- Population Platform -->
            <div class="population-platform"></div>
            
            <!-- Population Label -->
            <div class="population-label">
              {{ town.townLabel }} - {{ town.population }}
            </div>
          </div>
        </div>

        <!-- Answer Options Area -->
        <div v-if="showAnswerOptions" class="answer-options-container fade-in">
          <div class="sorting-row">
            <div 
              v-for="(option, index) in optionOrder" 
              :key="index" 
              class="option-slot"
              @dragover.prevent
              @drop="handleDrop($event, index)"
            >
              <div 
                class="option-button" 
                draggable="true"
                @dragstart="handleDragStart($event, option, index)"
                @touchstart.passive="handleTouchStart($event, option, index)"
                @touchmove.prevent="handleTouchMove($event)"
                @touchend="handleTouchEnd($event)"
              >
                {{ option }}
              </div>
            </div>
          </div>
          <button class="check-button" @click="checkAnswer">Let's Check!</button>
        </div>
      </div>
    </div>

    <!-- Feedback Screens -->
    <div v-if="showSuccess" class="success-feedback slide-in">
      <p class="success-text">Great! You correctly ordered the giraffe towns.</p>
      <button class="continue-button" @click="handleComplete">Continue</button>
    </div>

    <div v-if="showWarning" class="warning-feedback slide-in">
      <p class="warning-text">Oh no! The Giraffes are still mixed up!</p>
      <button class="try-again-button" @click="resetGame">Try Again</button>
    </div>

    <!-- Diamond Badge Screens -->
    <div v-if="showDiamondBadgeUnlock" class="badge-unlock-screen fade-in">
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="diamond-badge-unlock-text">You've unlocked the Diamond Badge!</h2>
      <img src="../assets/icons/DiamondLeague.png" alt="Diamond Badge" class="badge-icon-unlock" />
    </div>

    <div v-if="showDiamondBadgeScreen" class="diamond-badge-screen fade-in">
      <div class="close-button">
        <font-awesome-icon :icon="['fas', 'times']" />
      </div>
      <div class="octopus-icon">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <h2 class="diamond-badge-title">Diamond Badge</h2>
      <img src="../assets/icons/DiamondLeague.png" alt="Diamond Badge" class="badge-icon" />
      <p class="progress-text">Congratulations on completing all levels!</p>
      <button class="play-again-button" @click="handlePlayAgain">Play again</button>
      <button class="continue-home-button" @click="handleContinueToHome">Continue to Home</button>
    </div>

    <!-- Great Work Modal -->
    <div v-if="showGreatWorkModal" class="great-work-modal">
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
          <span class="star" :class="{ filled: filledStars >= 3 }">★</span>
        </div>
        <div v-if="showButtons" class="great-work-buttons">
          <button class="play-again-btn" @click="handlePlayAgain">Play again</button>
          <button class="continue-home-btn" @click="handleContinueToHome">Continue to Home</button>
        </div>
      </div>
    </div>

    <!-- Secondary Objective Screen -->
    <!-- We're using direct transitions instead of overlays -->
    
    <div v-if="showSecondaryObjective" class="secondary-objective-screen fade-in">
      <div class="octopus-header">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
      </div>
      <div class="secondary-message">
        <p>New town of giraffes have joined!</p>
      </div>
    </div>
    
    <!-- Secondary Gameplay Area -->
    <div v-if="showSecondaryGameplay" class="secondary-gameplay-screen">
      <!-- Top Bar (Reusing from main gameplay) -->
      <div class="top-bar fade-in">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" :class="{ 'fade-out': hideOctopus }" />
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>
      
      <!-- Secondary Game Content -->
      <div class="game-content">
        <!-- Solid grass background to prevent any gaps -->
        <div class="full-grass-bg"></div>
        
        <!-- Grass Area -->
        <div v-if="showSecondaryGrass" class="secondary-grass-area fade-in">
          <div class="grass-top"></div>
          <div class="grass-bottom"></div>
        </div>
        
        <!-- Secondary Giraffe Towns -->
        <div v-if="showSecondaryGiraffes" class="secondary-giraffe-container">
          <!-- Speech Bubbles Row -->
          <div class="speech-bubbles-row">
            <div v-if="showSpeechBubbles" class="speech-bubble-container">
              <div class="speech-bubble-new">Town A</div>
            </div>
            <div v-if="showSpeechBubbles" class="speech-bubble-container">
              <div class="speech-bubble-new">New Town</div>
            </div>
            <div v-if="showSpeechBubbles" class="speech-bubble-container">
              <div class="speech-bubble-new">Town D</div>
            </div>
          </div>
          
          <!-- Giraffe Towns Row -->
          <div class="giraffe-towns-row">
            <!-- Town A -->
            <div class="giraffe-town-section">
              <div class="giraffe-population">
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
                <img :src="getGiraffeImage(1)" class="giraffe-img" />
              </div>
              <div class="population-value">3600</div>
            </div>
            
            <!-- New Town -->
            <div class="giraffe-town-section">
              <div class="giraffe-population">
                <img :src="getGiraffeImage(1)" class="giraffe-img" />
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
              </div>
              <div class="population-value">{{ hasSelectedAnswer ? (selectedPopulationAnswer === 3900 ? '3900' : (selectedPopulationAnswer === 5000 ? '5100' : '3500')) : '?' }}</div>
            </div>
            
            <!-- Town D -->
            <div class="giraffe-town-section">
              <div class="giraffe-population">
                <img :src="getGiraffeImage(1)" class="giraffe-img" />
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
                <img :src="getGiraffeImage(2)" class="giraffe-img" />
              </div>
              <div class="population-value">4100</div>
            </div>
          </div>
        </div>
        
        <!-- Population Question Modal -->
        <div v-if="showPopulationQuestion && !hasSelectedAnswer" class="population-question-modal slide-in-bottom">
          <p class="question-text">What could be the population of the New town?</p>
          <div class="answer-options">
            <button 
              v-for="(option, index) in populationOptions" 
              :key="index"
              class="population-option"
              @click="selectPopulationAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
        
        <!-- Positive Feedback Modal -->
        <div v-if="showPositiveFeedback" class="success-feedback slide-in">
          <p class="success-text">Awesome!</p>
          <p class="success-text">The new town fit in perfectly.</p>
          <button class="continue-button" @click="handleContinueFromFeedback">Continue</button>
        </div>
        
        <!-- Negative Feedback Modal -->
        <div v-if="showNegativeFeedback" class="warning-feedback slide-in">
          <p class="warning-text">Oh no!</p>
          <p class="warning-text">That was not the right number</p>
          <button class="try-again-button" @click="handleTryAgain">Try again</button>
        </div>
      </div>
    </div>

    <!-- Tertiary Objective Screen -->
    <div v-if="showTertiaryObjective" class="tertiary-objective-screen fade-in">
      <div class="top-bar-tertiary">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>
      <div class="tertiary-message">
        <p>Let's compare more giraffes!</p>
      </div>
    </div>

    <!-- Tertiary Gameplay Screen -->
    <div v-if="showTertiaryGameplay" class="tertiary-gameplay-screen">
      <!-- Top Bar -->
      <div class="top-bar fade-in">
        <OctopusIcon :width="40" :height="40" color="#0DA49F" />
        <div class="control-buttons">
          <button class="pause-button">
            <font-awesome-icon :icon="['fas', 'pause']" />
          </button>
          <button class="options-button">
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="game-content">
        <p v-if="!hideTertiaryObjectiveText" class="instruction-text fade-in">
          Compare the giraffe towns
        </p>
        
        <!-- Grass Area -->
        <div v-if="showTertiaryGrass" class="tertiary-grass-area fade-in">
          <div class="grass-bg"></div>
        </div>
        
        <!-- Giraffe Towns Container -->
        <div class="tertiary-towns-container">
          <!-- Town A -->
          <div 
            v-if="showTertiaryGiraffes" 
            class="tertiary-town" 
            :class="{ 'slide-in': showTertiaryGiraffes }"
            :style="{ animationDelay: '0ms' }"
          >
            <!-- Speech Bubble -->
            <div v-if="showSpeechBubbles" class="speech-bubble fade-in">
              {{ tertiaryGiraffeTowns[0].speechText }}
            </div>
            
            <!-- Giraffes -->
            <div class="giraffe-population">
              <div class="giraffe-group">
                <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 10px;" />
                <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 55px;" />
                <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 100px;" />
              </div>
            </div>
            
            <!-- Population -->
            <div class="population-value">{{ tertiaryGiraffeTowns[0].population }}</div>
          </div>
          
          <!-- Town E -->
          <div 
            v-if="showTertiaryGiraffes" 
            class="tertiary-town" 
            :class="{ 'slide-in': showTertiaryGiraffes }"
            :style="{ animationDelay: '300ms' }"
          >
            <!-- Speech Bubble -->
            <div v-if="showSpeechBubbles" class="speech-bubble fade-in">
              {{ tertiaryGiraffeTowns[1].speechText }}
            </div>
            
            <!-- Giraffes -->
            <div class="giraffe-population">
              <div class="giraffe-group">
                <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 10px;" />
                <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 55px;" />
                <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 100px;" />
              </div>
            </div>
            
            <!-- Population -->
            <div class="population-value">{{ tertiaryGiraffeTowns[1].population }}</div>
          </div>
        </div>
        
        <!-- Comparison Question Modal -->
        <div v-if="showTertiaryQuestion && !selectedComparisonAnswer" class="comparison-question-modal slide-in-bottom">
          <p class="question-text">How does the left giraffe compare to the right?</p>
          <div class="comparison-options">
            <button 
              v-for="(option, index) in comparisonOptions" 
              :key="index"
              class="comparison-option"
              @click="selectComparisonAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
        
        <!-- Positive Tertiary Feedback Modal -->
        <div v-if="showPositiveTertiaryFeedback" class="success-feedback slide-in">
          <h2 class="success-title">Awesome!</h2>
          <p class="success-text">Town A has less giraffes than town E</p>
          <button class="continue-button" @click="handleTertiaryContinue">Continue</button>
        </div>
        
        <!-- Negative Tertiary Feedback Modal -->
        <div v-if="showNegativeTertiaryFeedback" class="warning-feedback slide-in">
          <p class="warning-text">Oh no!</p>
          <p class="warning-text">Town A did not have as much Giraffes!</p>
          <button class="try-again-button" @click="handleTertiaryTryAgain">Try again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import OctopusIcon from './OctopusIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

interface GiraffeTown {
  townLabel: string;
  population: number;
  correctOrder: number;
  speechText: string;
}

interface SecondaryTown {
  label: string;
  population: string | number;
  giraffeCount: number;
  speechText?: string;
}

export default defineComponent({
  name: 'GiraffeGameplayLevel4',
  components: {
    OctopusIcon,
    FontAwesomeIcon
  },
  setup() {
    const router = useRouter();
    
    // Start transition states
    const showStartTransition = ref(true);
    const isStartTransitionFading = ref(false);
    const showObjectiveAnimation = ref(false);
    
    // Main gameplay states
    const showGameContent = ref(false);
    const showTopBar = ref(false);
    const showGrassArea = ref(false);
    const showGiraffes = ref(false);
    const showSpeechBubbles = ref(false);
    const showAnswerOptions = ref(false);
    
    // Feedback states
    const showSuccess = ref(false);
    const showWarning = ref(false);
    
    // Badge states
    const showGreatWorkModal = ref(false);
    const showDiamondBadgeUnlock = ref(false);
    const showDiamondBadgeScreen = ref(false);
    const filledStars = ref(0);
    const showButtons = ref(true);
    const isFirstTimePlayer = ref(true);
    
    // Transition overlay
    const showTransitionOverlay = ref(false);
    
    // Game data
    const draggingOption = ref<string | null>(null);
    const draggingIndex = ref<number | null>(null);
    
    // Options in their current order
    const optionOrder = ref<string[]>(['A', 'B', 'C', 'D']);
    
    // Add secondary gameplay states
    const showSecondaryObjective = ref(false);
    const showSecondaryPhase = ref(false);
    const showSecondaryGameplay = ref(false);
    const showSecondaryGrass = ref(false);
    const showSecondaryGiraffes = ref(false);
    const showPopulationQuestion = ref(false);
    const selectedPopulationAnswer = ref<number | null>(null);
    
    // Secondary gameplay animation states
    const hideOctopus = ref(false);
    const hideObjectiveText = ref(false);
    
    // Define population options for question
    const populationOptions = ref<number[]>([5000, 3900, 3500]);
    
    // Define giraffe towns with their populations
    const giraffeTowns: GiraffeTown[] = [
      { 
        townLabel: 'A', 
        population: 3600, 
        correctOrder: 3, 
        speechText: "We're not the highest"
      },
      { 
        townLabel: 'B', 
        population: 2600, 
        correctOrder: 1,
        speechText: "We're least!"
      },
      { 
        townLabel: 'C', 
        population: 3400, 
        correctOrder: 2,
        speechText: "We're third!"
      },
      { 
        townLabel: 'D', 
        population: 4100, 
        correctOrder: 4,
        speechText: "We're the highest"
      }
    ];
    
    // Define secondary phase towns
    const secondaryGiraffeTowns: SecondaryTown[] = [
      {
        label: "Town A",
        population: 3600,
        giraffeCount: 3,
        speechText: "We're Town A"
      },
      {
        label: "New Town",
        population: "?",
        giraffeCount: 3,
        speechText: "How many are we?"
      },
      {
        label: "Town D",
        population: 4100,
        giraffeCount: 3,
        speechText: "We're Town D"
      }
    ];

    // Add these refs for new functionalities
    const showPositiveFeedback = ref(false);
    const showNegativeFeedback = ref(false);
    const hasSelectedAnswer = ref(false);
    
    // Add tertiary feedback states
    const showPositiveTertiaryFeedback = ref(false);
    const showNegativeTertiaryFeedback = ref(false);
    
    // Add state for tertiary gameplay
    const showTertiaryObjective = ref(false);
    const showTertiaryGameplay = ref(false);
    const showTertiaryGrass = ref(false);
    const showTertiaryGiraffes = ref(false);
    const showTertiaryQuestion = ref(false);
    const hideTertiaryObjectiveText = ref(false);
    const selectedComparisonAnswer = ref<string | null>(null);
    
    // Define tertiary towns
    const tertiaryGiraffeTowns = [
      {
        label: "Town A",
        population: 3600,
        speechText: "Town A"
      },
      {
        label: "Town E",
        population: 3900,
        speechText: "Town E"
      }
    ];
    
    // Comparison options
    const comparisonOptions = [">", "<", "="];

    // Add variables for touch support
    const touchStartX = ref(0);
    const touchStartY = ref(0);
    const currentTouchElement = ref<HTMLElement | null>(null);
    const touchDragOption = ref<string | null>(null);
    const touchDragIndex = ref<number | null>(null);
    const touchOffsetX = ref(0);
    const touchOffsetY = ref(0);
    const touchActive = ref(false);
    const touchTarget = ref<number | null>(null);

    onMounted(() => {
      startGameSequence();
      
      // Improve touch handling across iOS and Android
      setTimeout(() => {
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
          // Mark element as draggable for iOS
          if ((button as HTMLElement).style) {
            // Use type assertion for webkit-specific property
            ((button as HTMLElement).style as any).webkitUserDrag = 'element';
          }
        });
      }, 2000); // Wait a bit for the elements to be in the DOM
    });

    const startGameSequence = () => {
      // Start transition sequence - using the same approach as in levels 1-3
      setTimeout(() => {
        // Animate objective text moving up
        showObjectiveAnimation.value = true;
        
        setTimeout(() => {
          // Fade out start transition
          isStartTransitionFading.value = true;
          
          // Wait for transition to complete before removing from DOM
          setTimeout(() => {
            // Hide transition screen first
            showStartTransition.value = false;
            
            // Then show game content in next render cycle
            setTimeout(() => {
              showGameContent.value = true;
              showTopBar.value = true;
              showGrassArea.value = true;
              
              // Show giraffes after 1 second delay
              setTimeout(() => {
                showGiraffes.value = true;
                
                // Show answer options after giraffes are visible
                setTimeout(() => {
                  showAnswerOptions.value = true;
                }, 1200);
              }, 1000);
            }, 10); // Short delay to ensure clean render cycle
          }, 600); // Match the transition duration in CSS (0.6s)
        }, 1500);
      }, 1000);
    };
    
    // Secondary gameplay sequence - this is a placeholder function
    // since we handle everything directly in handleComplete now
    const startSecondaryGameplaySequence = () => {
      console.log("This function is no longer used");
    };

    const getGiraffeImage = (position: number) => {
      if (position === 3) {
        return '../assets/icons/Giraffe3.png'; // Clipped giraffe
      } else if (position === 2) {
        return '../assets/icons/Giraffe2.png'; // Tall giraffe
      } else {
        return '../assets/icons/Giraffe1.png'; // Short giraffe
      }
    };
    
    const handleDragStart = (event: DragEvent, option: string, index: number) => {
      if (!event.dataTransfer) return;
      
      draggingOption.value = option;
      draggingIndex.value = index;
      
      // Set data transfer data for dragging
      event.dataTransfer.setData('text/plain', option);
      event.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDrop = (event: DragEvent, targetIndex: number) => {
      if (draggingIndex.value === null) return;
      
      // Get the current order
      const newOrder = [...optionOrder.value];
      
      // Remove the dragged option from its original position
      const [draggedOption] = newOrder.splice(draggingIndex.value, 1);
      
      // Insert it at the new position
      newOrder.splice(targetIndex, 0, draggedOption);
      
      // Update the order
      optionOrder.value = newOrder;
      
      // Reset dragging refs
      draggingOption.value = null;
      draggingIndex.value = null;
    };

    const checkAnswer = () => {
      // First show speech bubbles
      showSpeechBubbles.value = true;
      
      // After 1.5s, check answer and show feedback
      setTimeout(() => {
        // The correct order should be: B, C, A, D
        const correctOrder = ['B', 'C', 'A', 'D'];
        
        const isCorrect = JSON.stringify(optionOrder.value) === JSON.stringify(correctOrder);
        
        if (isCorrect) {
          showSuccess.value = true;
        } else {
          showWarning.value = true;
        }
      }, 1500);
    };

    const resetGame = () => {
      showWarning.value = false;
      showSpeechBubbles.value = false;
      // Reset to original order
      optionOrder.value = ['A', 'B', 'C', 'D'];
    };

    const handleComplete = () => {
      // Hide success message immediately
      showSuccess.value = false;
      
      // Force browser to reload the page to completely reset everything
      // This is a drastic but reliable solution
      setTimeout(() => {
        // Show secondary objective immediately, hiding everything else
        showGameContent.value = false;
        showSecondaryObjective.value = true;
        
        // After showing objective for 2 seconds
        setTimeout(() => {
          // Hide objective
          showSecondaryObjective.value = false;
          
          // Show secondary gameplay with a clean start
          showSecondaryGameplay.value = true;
          
          // Wait a very brief moment for rendering
          setTimeout(() => {
            // Show grass first
            showSecondaryGrass.value = true;
            
            // Then add giraffes after a delay
            setTimeout(() => {
              showSecondaryGiraffes.value = true;
              
              // Wait 1 second, then show speech bubbles (reduced from 2s to 1s)
              setTimeout(() => {
                showSpeechBubbles.value = true;
                
                // After 1s more, show the population question (reduced from 2s to 1s)
                setTimeout(() => {
                  showPopulationQuestion.value = true;
                }, 1000);
              }, 1000);
            }, 1000);
          }, 100);
        }, 2000);
      }, 100);
      
      // Set cookie to mark level as completed
      document.cookie = 'level4_completed=true; path=/; max-age=31536000';
    };
    
    const selectPopulationAnswer = (option: number) => {
      // Store the selected answer and update state
      selectedPopulationAnswer.value = option;
      hasSelectedAnswer.value = true;
      
      // Immediately hide population question to avoid conflict
      showPopulationQuestion.value = false;
      
      // First add a solid green background to prevent any gaps
      const grassBg = document.querySelector('.full-grass-bg');
      if (grassBg) {
        (grassBg as HTMLElement).style.opacity = '1';
        (grassBg as HTMLElement).style.zIndex = '2';
      }
      
      // Fade out speech bubbles
      showSpeechBubbles.value = false;
      
      // After 500ms, show updated speech bubbles
      setTimeout(() => {
        showSpeechBubbles.value = true;
        
        // After speech bubbles are visible, check answer
        setTimeout(() => {
          // This extra timeout helps ensure proper render sequence
          if (option === 3900) {
            // Hide any existing feedback just in case
            showNegativeFeedback.value = false;
            
            // Now show positive feedback
            console.log("Showing positive feedback");
            showPositiveFeedback.value = true;
          } else {
            // Hide any existing feedback just in case
            showPositiveFeedback.value = false;
            
            // Now show negative feedback
            console.log("Showing negative feedback");
            showNegativeFeedback.value = true;
          }
        }, 500);
      }, 500);
    };

    // Continue after positive feedback
    const handleContinueFromFeedback = () => {
      // Hide all Phase 2 elements first
      showPositiveFeedback.value = false;
      showSecondaryGameplay.value = false;
      showSecondaryGiraffes.value = false;
      showSecondaryGrass.value = false;
      showSpeechBubbles.value = false;
      
      // Then show tertiary objective screen
      showTertiaryObjective.value = true;
      
      // Start tertiary gameplay sequence after 2 seconds
      setTimeout(() => {
        showTertiaryObjective.value = false;
        startTertiaryGameplaySequence();
      }, 2000);
    };

    // Try again after negative feedback
    const handleTryAgain = () => {
      showNegativeFeedback.value = false;
      hasSelectedAnswer.value = false;
      selectedPopulationAnswer.value = null;
      showPopulationQuestion.value = true;
    };

    function showGreatWorkAfterComplete() {
      isFirstTimePlayer.value = !document.cookie.includes('level4_completed=true');
      
      if (isFirstTimePlayer.value) {
        // Show secondary phase for first-time players
        showSecondaryObjective.value = true;
        
        setTimeout(() => {
          showSecondaryObjective.value = false;
          // Here you would start the secondary phase gameplay
          showSecondaryPhase.value = true;
          // For now, we'll just show the great work modal
          showGreatWorkModal.value = true;
          
          // Animate stars
          setTimeout(() => {
            const starInterval = setInterval(() => {
              if (filledStars.value < 3) {
                filledStars.value++;
              } else {
                clearInterval(starInterval);
              }
            }, 500);
          }, 500);
        }, 3000);
      } else {
        // For repeat players, first show great work modal WITHOUT buttons
        showGreatWorkModal.value = true;
        filledStars.value = 0;
        showButtons.value = false; // Hide buttons initially
        
        // Animate stars
        setTimeout(() => {
          const starInterval = setInterval(() => {
            if (filledStars.value < 3) {
              filledStars.value++;
            } else {
              clearInterval(starInterval);
              
              // After stars are filled, transition to badge unlock screen
              setTimeout(() => {
                // Hide great work modal first
                showGreatWorkModal.value = false;
                
                // Then show badge unlock screen
                setTimeout(() => {
                  showDiamondBadgeUnlock.value = true;
                  
                  // After 3s, transition to badge screen with buttons
                  setTimeout(() => {
                    // Enable buttons for the final diamond badge screen
                    showButtons.value = true;
                    showDiamondBadgeScreen.value = true;
                    
                    // Hide unlock screen only after badge screen is visible
                    setTimeout(() => {
                      showDiamondBadgeUnlock.value = false;
                    }, 100);
                  }, 3000);
                }, 100);
              }, 1500);
            }
          }, 500);
        }, 500);
      }
      
      // Set cookie to mark level as completed
      document.cookie = 'level4_completed=true; path=/; max-age=31536000';
    }

    const handlePlayAgain = () => {
      // Reset all screens and restart level
      showGreatWorkModal.value = false;
      showDiamondBadgeScreen.value = false;
      showSuccess.value = false;
      showWarning.value = false;
      optionOrder.value = ['A', 'B', 'C', 'D'];
      filledStars.value = 0;
      
      // Restart game sequence
      showStartTransition.value = true;
      isStartTransitionFading.value = false;
      showGameContent.value = false;
      showTopBar.value = false;
      showGrassArea.value = false;
      showGiraffes.value = false;
      showAnswerOptions.value = false;
      showObjectiveAnimation.value = false;
      
      // Reset secondary gameplay values
      showSecondaryGameplay.value = false;
      showSecondaryGrass.value = false;
      showSecondaryGiraffes.value = false;
      showPopulationQuestion.value = false;
      hideOctopus.value = false;
      hideObjectiveText.value = false;
      
      startGameSequence();
    };

    const handleContinueToHome = () => {
      // Only show feedback if it hasn't been submitted yet
      if (!document.cookie.includes('level4_feedback=true')) {
        showGreatWorkModal.value = false;
        showDiamondBadgeScreen.value = false;
        router.push('/game-feedback-emoji');
        document.cookie = 'level4_feedback=true; path=/; max-age=31536000';
      } else {
        router.push('/');
      }
    };

    // Tertiary gameplay sequence
    const startTertiaryGameplaySequence = () => {
      // Completely hide all Phase 2 elements
      showSecondaryGameplay.value = false;
      showSecondaryGiraffes.value = false;
      showSecondaryGrass.value = false;
      showPopulationQuestion.value = false;
      showPositiveFeedback.value = false;
      showNegativeFeedback.value = false;
      
      // Then show Phase 3 content
      showTertiaryGameplay.value = true;
      
      // After 1.5s delay, fade out objective text and show grass
      setTimeout(() => {
        hideTertiaryObjectiveText.value = true;
        showTertiaryGrass.value = true;
        
        // After 1s delay, show giraffe groups WITH speech bubbles
        setTimeout(() => {
          showTertiaryGiraffes.value = true;
          showSpeechBubbles.value = true;
          
          // After exactly 1.5s delay, show the comparison question
          setTimeout(() => {
            showTertiaryQuestion.value = true;
          }, 1500);
        }, 1000);
      }, 1500);
    };
    
    // Handle comparison answer selection
    const selectComparisonAnswer = (option: string) => {
      selectedComparisonAnswer.value = option;
      
      // Fade out current speech bubbles
      showSpeechBubbles.value = false;
      
      // After 500ms, show updated speech bubbles and giraffes
      setTimeout(() => {
        // Update speech bubbles with new text
        tertiaryGiraffeTowns[0].speechText = "Town A";
        tertiaryGiraffeTowns[1].speechText = "Town E";
        
        // Show updated speech bubbles
        showSpeechBubbles.value = true;
        
        // Check if answer is correct (< is the correct answer)
        if (option === "<") {
          // Show positive feedback after 1.5s
          setTimeout(() => {
            showPositiveTertiaryFeedback.value = true;
          }, 1500);
        } else {
          // Show negative feedback after 1.5s
          setTimeout(() => {
            showNegativeTertiaryFeedback.value = true;
          }, 1500);
        }
      }, 500);
    };
    
    // Continue after positive tertiary feedback
    const handleTertiaryContinue = () => {
      // Hide all tertiary gameplay elements first
      showPositiveTertiaryFeedback.value = false;
      showTertiaryGameplay.value = false;
      showTertiaryGiraffes.value = false;
      
      // Show diamond badge unlock screen
      showDiamondBadgeUnlock.value = true;
      
      // After 2 seconds, transition to diamond badge screen with buttons
      setTimeout(() => {
        showDiamondBadgeUnlock.value = false;
        showDiamondBadgeScreen.value = true;
      }, 2000);
    };
    
    // Try again after negative tertiary feedback
    const handleTertiaryTryAgain = () => {
      showNegativeTertiaryFeedback.value = false;
      selectedComparisonAnswer.value = null;
      showTertiaryQuestion.value = true;
    };

    const handleTouchStart = (event: TouchEvent, option: string, index: number) => {
      // Store the initial touch position
      touchStartX.value = event.touches[0].clientX;
      touchStartY.value = event.touches[0].clientY;
      touchDragOption.value = option;
      touchDragIndex.value = index;
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
      const slots = document.querySelectorAll('.option-slot');
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
      if (!touchActive.value || currentTouchElement.value === null || touchDragIndex.value === null) return;
      
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
      if (touchTarget.value !== null && touchTarget.value !== touchDragIndex.value) {
        // Get the current order
        const newOrder = [...optionOrder.value];
        
        // Remove the dragged option from its original position
        const [draggedOption] = newOrder.splice(touchDragIndex.value, 1);
        
        // Insert it at the new position
        newOrder.splice(touchTarget.value, 0, draggedOption);
        
        // Update the order
        optionOrder.value = newOrder;
      }
      
      // Reset touch state
      touchActive.value = false;
      currentTouchElement.value = null;
      touchDragOption.value = null;
      touchDragIndex.value = null;
      touchTarget.value = null;
    };

    return {
      showStartTransition,
      isStartTransitionFading,
      showObjectiveAnimation,
      showGameContent,
      showTopBar,
      showGrassArea,
      showGiraffes,
      showSpeechBubbles,
      showAnswerOptions,
      giraffeTowns,
      getGiraffeImage,
      handleDragStart,
      handleDrop,
      optionOrder,
      checkAnswer,
      showSuccess,
      showWarning,
      resetGame,
      handleComplete,
      showGreatWorkModal,
      showDiamondBadgeUnlock,
      showDiamondBadgeScreen,
      filledStars,
      showButtons,
      showTransitionOverlay,
      handlePlayAgain,
      handleContinueToHome,
      showSecondaryObjective,
      showSecondaryPhase,
      // Secondary gameplay states
      showSecondaryGameplay,
      showSecondaryGrass,
      showSecondaryGiraffes,
      showPopulationQuestion,
      secondaryGiraffeTowns,
      populationOptions,
      selectPopulationAnswer,
      hideOctopus,
      hideObjectiveText,
      showPositiveFeedback,
      showNegativeFeedback,
      hasSelectedAnswer,
      handleContinueFromFeedback,
      handleTryAgain,
      selectedPopulationAnswer,
      showTertiaryObjective,
      showTertiaryGameplay,
      showTertiaryGrass,
      showTertiaryGiraffes,
      showTertiaryQuestion,
      hideTertiaryObjectiveText,
      tertiaryGiraffeTowns,
      comparisonOptions,
      selectComparisonAnswer,
      selectedComparisonAnswer,
      showPositiveTertiaryFeedback,
      showNegativeTertiaryFeedback,
      handleTertiaryContinue,
      handleTertiaryTryAgain,
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

/* Start Transition Screen */
.start-transition-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 1;
  transition: opacity 0.6s ease;
}

.start-transition-screen.fade-out {
  opacity: 0;
}

.transition-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
}

.transition-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  width: 100%;
  max-width: 320px;
}

.objective-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  color: #6BADD7;
  text-align: center;
  transition: transform 0.5s ease;
}

.objective-text.move-up {
  transform: translateY(-50px);
}

/* Main Gameplay Screen */
.gameplay-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.top-bar {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.5s ease;
  position: relative;
  z-index: 10;
}

.top-bar.fade-in {
  opacity: 1;
}

.control-buttons {
  display: flex;
  gap: 12px;
  z-index: 100;
}

.pause-button,
.options-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #E4E4E4;
  background: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 100;
}

.pause-button svg,
.options-button svg {
  width: 20px;
  height: 20px;
  color: #333333;
  opacity: 0.8;
}

/* Instruction text - make it larger */
.instruction-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px; /* Increased from 20px to 24px */
  text-align: center;
  margin: 20px 0 20px 0;
  padding: 0 20px;
  transition: transform 0.5s ease;
  font-weight: 400; /* Added for better visibility */
}

.instruction-text.move-up {
  transform: translateY(-20px);
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 0;
  padding-bottom: 180px; /* Space at bottom to prevent overlap */
}

/* Grass Area - reduce height to leave room for buttons */
.grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%; /* Reduced from 60% to 50% */
  z-index: 1;
  opacity: 0;
}

.grass-area.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.grass-bg {
  width: 100%;
  height: 100%;
  background: #83CA54;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

/* Remove the two-tone effect */
/* .grass-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: #83CA54;
  z-index: 1;
} */

/* Giraffe Towns */
.giraffe-towns-container {
  position: absolute;
  top: 70px; /* Slightly higher to avoid overlap with buttons */
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr; 
  row-gap: 15px;
  column-gap: 20px;
  padding: 0 15px;
  z-index: 5;
  height: 50%; /* Reduced from 65% to 50% to leave space for buttons */
  margin-top: 0; /* Remove additional margin */
}

.giraffe-town {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  padding-bottom: 20px;
}

.giraffe-town.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.giraffe-population {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 180px; /* Increased from 140px */
  width: 100%;
  margin-bottom: -10px;
  z-index: 2;
  transform-origin: bottom center;
}

.giraffe-group {
  position: relative;
  width: 180px; /* Increased from 160px */
  height: 180px; /* Increased from 160px */
  display: flex;
  justify-content: space-between; /* Even spacing between giraffes */
  align-items: flex-end;
  margin: 0 auto; /* Center the giraffe group */
}

.giraffe-img {
  position: relative !important;
  bottom: 0 !important;
  height: 140px; /* Increased from 120px */
  width: 45px; /* Slightly wider */
  object-fit: contain !important;
  object-position: bottom !important;
  margin: 0 7px !important; /* Increased margin for spacing */
}

.clipped-giraffe {
  left: auto !important;
  z-index: 1;
  height: 130px !important; /* Increased from 110px */
}

.tallest-giraffe {
  left: auto !important;
  z-index: 3;
  height: 150px !important; /* Increased from 130px */
}

.shortest-giraffe {
  left: auto !important;
  z-index: 2;
  height: 120px !important; /* Increased from 100px */
}

/* Make the population platform wider */
.population-platform {
  width: 200px; /* Increased from 160px */
  height: 10px; /* Increased from 7px */
  background: #4FAB4C;
  margin-bottom: 2px;
  border-radius: 5px; /* Add rounded corners */
}

.population-label {
  color: #2D7A2A;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px; /* Increased from 16px */
  font-weight: bold;
  margin-top: 8px; /* Increased from 5px */
  text-align: center;
  z-index: 6;
  width: 100%;
}

/* Answer Options */
.answer-options-container {
  padding-bottom: 10px; /* Increased padding */
  margin-bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-top: 20px;
}

.answer-options-container.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.sorting-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
}

.option-slot {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fix for option positioning */
.option-button {
  width: 65px; /* Increased from 65px */
  height: 55px; /* Increased from 55px */
  background: #8FD14F;
  color: #FFFFFF;
  border: none;
  border-radius: 8px; /* Increased from 8px */
  font-family: 'Gabarito', sans-serif;
  font-size: 24px; /* Increased from 24px */
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: all 0.2s;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
  user-select: none;
  margin-bottom: 5px; /* Increased from 5px */
}

.option-button:active {
  cursor: grabbing;
}

/* Additional media query to fix check button on smaller screens */
@media (max-height: 700px) {
  .check-button {
    margin-bottom: 70px !important; /* Even more margin on very small screens */
    transform: scale(1); /* Slightly larger for better visibility */
  }
  
  .answer-options-container {
    padding-bottom: 80px; /* More padding on very small screens */
  }
}

.check-button {
  width: 100%;
  max-width: 320px; /* Increased from 320px */
  height: 50px; /* Increased from 50px */
  background: #FFFFFF;
  border: none;
  border-radius: 12px; /* Increased from 10px */
  font-family: 'Gabarito', sans-serif;
  font-size: 20px; /* Increased from 20px */
  color: #333333;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  margin-bottom: 20px; /* Increased from 20px */
  position: relative;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.check-button:hover {
  background: #f5f5f5;
  transform: scale(1.03); /* Slightly larger hover effect */
}

/* Feedback Screens */
.success-feedback {
  position: fixed; /* Changed from absolute to fixed */
  left: 0;
  right: 0;
  bottom: 0; /* Ensure it sticks to the bottom */
  padding: 20px;
  background: #3A8737;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3000;
  opacity: 0;
  transform: translateY(100%);
}

.warning-feedback {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background: #F44336;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3000;
  opacity: 0;
  transform: translateY(100%);
}

.success-feedback.slide-in,
.warning-feedback.slide-in {
  animation: slideInFromBottom 0.5s ease forwards;
}

.success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 28px; /* Increased from 24px */
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

.success-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 22px; /* Increased from 18px */
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

.warning-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

.continue-button,
.try-again-button {
  width: 200px;
  height: 50px;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  cursor: pointer;
  background: #FFFFFF;
  border: none;
  color: #333333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.2s;
}

.continue-button:hover,
.try-again-button:hover {
  background: #f5f5f5;
}

/* Badge Screens */
.badge-unlock-screen {
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
  pointer-events: auto; /* Ensure it captures clicks */
}

.badge-unlock-screen.fade-in {
  opacity: 1;
}

.octopus-icon {
  margin-bottom: 24px;
}

.diamond-badge-unlock-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  padding: 0 20px;
}

.badge-icon-unlock {
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: scaleIn 0.5s ease forwards;
}

.diamond-badge-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 3000; /* Increased z-index to ensure it appears on top */
  padding: 20px;
}

.diamond-badge-screen.fade-in {
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

.diamond-badge-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 28px;
  color: #333;
  margin: 0 0 24px 0;
  font-weight: 700;
  text-align: center;
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
  text-align: center;
  padding: 0 20px;
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

/* Great Work Modal */
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

.play-again-btn, 
.continue-home-btn {
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

/* Animations */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
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

/* Add new slide-in animation from bottom */
@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .giraffe-towns-container {
    padding: 0 30px;
    max-width: 500px;
    margin: 0 auto;
    top: 60px; /* Moved down from 30px to 60px */
  }
  
  .giraffe-population {
    height: 150px;
  }
  
  /* Make giraffes bigger in desktop */
  .giraffe-img.clipped-giraffe {
    height: 130px;
    width: 48px;
  }
  
  .giraffe-img.tallest-giraffe {
    height: 140px;
    width: 53px;
  }
  
  .giraffe-img.shortest-giraffe {
    height: 105px;
    width: 48px;
  }
  
  /* Secondary phase giraffes */
  .secondary-giraffe-container .giraffe-img {
    transform: scale(1.15);
  }
  
  .sorting-row {
    max-width: 400px;
  }
}

/* Add these styles for speech bubbles */
.speech-bubble {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #4FAB4C;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Gabarito', sans-serif;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.speech-bubble.fade-in {
  opacity: 1;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4FAB4C;
}

/* Make the speech bubble disappear when success modal is shown */
.success-feedback.slide-in ~ .game-content .speech-bubble {
  opacity: 0 !important;
  z-index: 0 !important;
}

/* Fix for giraffe populations to make them distinct */
.giraffe-population {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 140px;
  width: 100%;
  margin-bottom: -10px;
  z-index: 2;
  transform-origin: bottom center;
}

.giraffe-group {
  position: relative;
  width: 160px; /* Increased from 100px to match platform width */
  height: 160px;
  display: flex;
  justify-content: space-between; /* Even spacing between giraffes */
  align-items: flex-end;
  margin: 0 auto; /* Center the giraffe group */
}

.giraffe-img {
  position: relative !important; /* Override absolute positioning */
  bottom: 0 !important;
  height: 120px;
  width: 40px;
  object-fit: contain !important;
  object-position: bottom !important;
  margin: 0 5px !important; /* Consistent margin for all giraffes */
}

.clipped-giraffe {
  left: auto !important; /* Remove left positioning to allow flex to work */
  z-index: 1;
  height: 110px !important;
  transform: translateX(0) !important; /* Remove transform to allow flex to work */
}

.tallest-giraffe {
  left: auto !important; /* Remove left positioning to allow flex to work */
  z-index: 3;
  height: 130px !important;
  transform: translateX(0) !important; /* Remove transform to allow flex to work */
}

.shortest-giraffe {
  left: auto !important; /* Remove left positioning to allow flex to work */
  z-index: 2;
  height: 100px !important;
  height: 100px;
}

.clipped-giraffe {
  left: calc(50% + 35px); /* Increased separation from 30px to 35px */
  z-index: 1;
  height: 110px;
}

/* Mobile styles for responsive layout */
@media (max-width: 767px) {
  .giraffe-towns-container {
    gap: 20px; /* Increased from 15px */
    padding: 0 10px;
    justify-content: space-around;
}

  .giraffe-town {
    min-width: 100px; /* Increased from 90px */
    margin: 0 5px; /* Add horizontal margin */
  }

  /* Make the population label fit on mobile */
  .population-label {
    font-size: 13px;
    padding: 4px;
    white-space: normal;
}

  /* Adjust speech bubble positioning on mobile */
  .speech-bubble {
    font-size: 14px;
    padding: 6px 8px;
    white-space: normal;
    max-width: 80px;
    text-align: center;
    top: -50px; /* Raised from -40px */
    left: 50%;
    transform: translateX(-50%);
}

  /* Better giraffe spacing within each town */
  .giraffe-img.shortest-giraffe {
    left: calc(50% - 35px); /* Increased separation */
  }
  
  .giraffe-img.clipped-giraffe {
    left: calc(50% + 35px); /* Increased separation */
}

  /* Make sure town D doesn't overflow */
  .secondary-giraffe-container {
    gap: 45px; /* Increased from 40px */
    padding: 0 15px;
    justify-content: space-around;
  }
  
  .secondary-town-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px; /* Increased from 15px */
  }
  
  .secondary-town {
    min-width: 100px; /* Increased from 80px */
    margin: 0 10px;
}

  /* Hide title instructions when showing success modal */
  .success-feedback.slide-in ~ .game-content .main-title,
  .secondary-success-feedback.slide-in ~ .secondary-gameplay-screen .secondary-title,
  .tertiary-success-feedback.slide-in ~ .tertiary-gameplay-screen .tertiary-title {
    display: none !important;
  }
}

/* Position giraffes for the secondary gameplay phase */
.giraffe-town-section .giraffe-group {
  width: 160px; /* Match the width of platforms */
  height: 160px;
  display: flex;
  justify-content: space-between; /* Even spacing */
  align-items: flex-end;
  margin: 0 auto; /* Center the group */
}

.giraffe-town-section .giraffe-img {
  position: relative !important;
  bottom: 0 !important;
  left: auto !important;
  margin: 0 5px !important;
  width: 40px;
}

/* Remove inline style overrides by using !important */
.giraffe-town-section .giraffe-img[style*="left:"] {
  left: auto !important; /* Override inline styles completely */
}

/* Restore essential styling that was removed */
.secondary-giraffe-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  z-index: 5;
  gap: 30px;
  overflow-x: hidden; /* Prevent horizontal overflow */
}

.giraffe-towns-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 220px;
  padding: 0 10px;
  max-width: 100%; /* Ensure container doesn't overflow */
}

.giraffe-town-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px; /* Wider to fit larger giraffes */
}

.giraffe-town-section .giraffe-population {
  height: 180px; /* Taller */
}

.giraffe-town-section .giraffe-group {
  width: 180px; /* Wider */
  height: 180px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.giraffe-town-section .giraffe-img {
  height: 140px; /* Taller giraffes */
  width: 45px; /* Slightly wider */
  position: relative !important;
  bottom: 0 !important;
  margin: 0 5px !important;
}

/* Population values for Phase 2 */
.population-value {
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #2D7A2A;
  margin-top: 30px;
  text-align: center;
  position: relative;
  top: 10px; /* Reset the top value that was pushing it down */
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
  border-radius: 8px;
}

.speech-bubbles-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 5px; /* Reduced from 15px to bring bubbles closer */
}

.speech-bubble-container {
  display: flex;
  justify-content: center;
  margin-bottom: 5px; /* Reduced from 15px */
}

.speech-bubble-new {
  background: #4FAB4C;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Gabarito', sans-serif;
  position: relative;
  margin-bottom: 10px; /* Reduced from 20px */
  text-align: center;
  max-width: 120px;
  white-space: normal;
}

@media (max-width: 767px) {
  .giraffe-town-section {
    width: 110px;
    margin: 0 2px;
    position: relative; /* Ensure relative positioning */
    padding-bottom: 30px; /* Add space for the population value */
  }

  .population-value {
    font-size: 16px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    margin-top: 10px;
    padding: 2px 5px;
  }

  .speech-bubbles-row {
    margin-bottom: 0;
  }

  .speech-bubble-container {
    margin-bottom: 0;
  }

  .speech-bubble-new {
    font-size: 14px;
    padding: 6px 10px;
    margin-bottom: 5px;
  }
}

/* Positive Feedback Modal */
.positive-feedback-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background: #3A8737;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3000;
  opacity: 0;
  transform: translateY(100%);
}

/* Positive Feedback Slide-in Animation */
.positive-feedback-modal.slide-in {
  animation: slideInFromBottom 0.5s ease forwards;
}

/* Make "Awesome!" text larger in positive feedback */
.positive-feedback-modal .success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 32px; /* Increased from 28px for more emphasis */
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

/* Clean up tertiary phase (Phase 3) layout and styling */
.tertiary-gameplay-screen {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Remove background from population values */
.population-value {
  position: relative;
  top: 90px;
  font-size: 22px;
  font-weight: bold;
  color: #2D7A2A;
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
  border-radius: 8px;
}

/* Options styling for green background */
.answer-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.population-option:hover {
  transform: scale(1.05);
  background: #f0f0f0;
}

/* Improve giraffe population styling in Phase 2 */
.giraffe-town-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 200px;
  width: 180px;
  margin: 0 10px;
}
  
.giraffe-town-section .giraffe-img {
  position: absolute !important;
  bottom: 0 !important;
  width: 45px;
  height: 140px;
  object-fit: contain;
}
  
.giraffe-town-section .giraffe-img:nth-child(1) {
  left: 10px !important;
  z-index: 2;
}
  
.giraffe-town-section .giraffe-img:nth-child(2) {
  left: 55px !important;
  z-index: 3;
}
  
.giraffe-town-section .giraffe-img:nth-child(3) {
  left: 100px !important;
  z-index: 1;
}

/* Fix Phase 3 grass to start lower */
.tertiary-grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%; /* Reduced from default to start lower */
  z-index: 1;
  background-color: #83CA54; /* Ensure consistent background color */
}

.tertiary-grass-area .grass-bg {
  width: 100%;
  height: 100%;
  background: #83CA54;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* Make question modals smaller */
.population-question-modal, .comparison-question-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #3A8737;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

.question-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
  color: #ffffff;
  font-weight: 500;
  width: 100%;
}

/* Make success and warning modals smaller */
.success-feedback, .warning-feedback, .positive-feedback-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3000;
}

.success-title, .positive-feedback-modal .success-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  padding: 0 20px;
  color: white;
}

.success-text, .warning-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

/* Make option buttons smaller */
.population-option, .comparison-option {
  width: 90px;
  height: 45px;
  background: #ffffff;
  border: none;
  border-radius: 10px;
  color: #3A8737;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin: 4px;
}

/* Continue and try again buttons */
.continue-button, .try-again-button {
  width: 200px;
  height: 45px;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  background: #FFFFFF;
  border: none;
  color: #3A8737;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  margin-top: 8px;
}

/* Adjust giraffe populations for Phase 2 */
.giraffe-town-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 180px;
  width: 160px;
  margin: 0 8px;
}

.giraffe-town-section .giraffe-population {
  height: 160px;
}

.giraffe-town-section .giraffe-group {
  width: 160px;
  height: 160px;
}

.giraffe-town-section .giraffe-img {
  height: 120px;
  width: 40px;
}

/* Population values for Phase 2 */
.population-value {
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #2D7A2A;
  margin-top: 8px;
  text-align: center;
}

/* Adjust Phase 3 giraffe sizes */
.tertiary-towns-container {
  gap: 150px;
  margin-top: 150px;
}

.tertiary-town {
  transform: scale(1);
}

.tertiary-town .giraffe-img {
  height: 140px !important;
  width: 45px;
}

.tertiary-town .shortest-giraffe {
  height: 120px !important;
}

.tertiary-town .tallest-giraffe {
  height: 160px !important;
}

@media (max-width: 767px) {
  .giraffe-town-section {
    height: 160px;
    width: 140px;
  }

  .giraffe-town-section .giraffe-population {
    height: 140px;
  }

  .giraffe-town-section .giraffe-group {
    width: 140px;
    height: 140px;
  }

  .giraffe-town-section .giraffe-img {
    height: 110px;
    width: 35px;
  }

  .population-value {
    font-size: 16px;
  }

  .tertiary-towns-container {
    gap: 120px;
    margin-top: 120px;
  }

  .tertiary-town .giraffe-img {
    height: 120px !important;
    width: 40px;
  }

  .tertiary-town .shortest-giraffe {
    height: 100px !important;
  }

  .tertiary-town .tallest-giraffe {
    height: 140px !important;
  }
}

/* Mobile adjustments for Phase 2 */
@media (max-width: 767px) {
  .giraffe-towns-row {
    padding: 0 5px;
    gap: 5px;
  }

  .giraffe-town-section {
    width: 110px; /* Reduce width on mobile */
    margin: 0 2px; /* Reduce margins */
  }

  .giraffe-town-section .giraffe-group {
    width: 110px; /* Match container width */
    transform: scale(0.9); /* Slightly scale down giraffes */
  }

  .giraffe-town-section .giraffe-img {
    width: 35px; /* Make giraffes slightly narrower */
  }

  .giraffe-town-section .giraffe-img:nth-child(1) {
    left: 5px !important;
  }

  .giraffe-town-section .giraffe-img:nth-child(2) {
    left: 40px !important;
  }

  .giraffe-town-section .giraffe-img:nth-child(3) {
    left: 75px !important;
  }

  .population-value {
    font-size: 14px; /* Smaller font size for population values */
    margin-top: 5px;
  }

  .speech-bubbles-row {
    padding: 0 5px;
  }

  .speech-bubble-new {
    font-size: 14px;
    padding: 8px 12px;
    max-width: 100px;
  }
}

/* Secondary gameplay styles */
.giraffe-town-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 180px;
  width: 160px;
  margin: 0 8px;
}

/* Make the selector more specific and add !important to prevent overrides */
.secondary-giraffe-container .giraffe-town-section .population-value {
  position: absolute !important;
  bottom: -25px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #2D7A2A;
  width: 100%;
  text-align: center;
  background: transparent;
  z-index: 5;
}

@media (max-width: 767px) {
  .giraffe-town-section {
    width: 110px;
    margin: 0 2px;
    position: relative;
    height: 200px !important; /* Increase height to accommodate lower population value */
  }

  /* Make selector even more specific */
  .secondary-gameplay-screen .secondary-giraffe-container .giraffe-town-section .population-value {
    font-size: 16px;
    bottom: -75px !important;
    margin-top: 20px;
    padding: 2px 5px;
    position: absolute !important;
  }

  .speech-bubbles-row {
    top: 15px;
  }

  .speech-bubble-new {
    font-size: 14px;
    padding: 6px 10px;
    margin-bottom: 5px;
  }
}

/* Restore other necessary styles */
.tertiary-towns-container {
  display: flex;
  justify-content: center;
  gap: 180px;
  width: 100%;
  padding: 0 15px;
  margin-top: 180px;
  z-index: 5;
}

.tertiary-town {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 10px;
  transform: scale(1.2);
}

/* Question modals */
.population-question-modal, .comparison-question-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #3A8737;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

/* Success and warning modals */
.success-feedback, .warning-feedback, .positive-feedback-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3000;
}

/* Grass area */
.secondary-grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  z-index: 1;
  opacity: 1 !important;
  background-color: #83CA54;
}

.full-grass-bg {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65%;
  background-color: #83CA54;
  z-index: 1;
  opacity: 1 !important;
}

/* Remove the general population-value style that's causing conflicts */
/* Population values specific to Phase 2 */
.secondary-gameplay-screen .giraffe-town-section .population-value {
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #2D7A2A;
  text-align: center;
  position: absolute;
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
}

/* Mobile styles for Phase 2 */
@media (max-width: 767px) {
  .giraffe-town-section {
    width: 110px;
    margin: 0 2px;
    position: relative;
    height: 200px !important;
  }

  .secondary-gameplay-screen .giraffe-town-section .population-value {
    font-size: 16px;
    position: absolute !important;
    bottom: -185px ;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 100%;
    padding: 2px 5px;
  }

  .speech-bubbles-row {
    top: 15px;
  }

  .speech-bubble-new {
    font-size: 14px;
    padding: 6px 10px;
    margin-bottom: 5px;
  }
}

/* Phase 3 population values */
.tertiary-gameplay-screen .population-value {
  position: relative;
  top: 60px;
  font-size: 22px;
  font-weight: bold;
  color: #2D7A2A;
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
  border-radius: 8px;
}

/* Secondary gameplay styles */
.secondary-gameplay-screen .giraffe-towns-row .giraffe-town-section {
  position: relative;
  height: 200px;
}

.secondary-gameplay-screen .giraffe-towns-row .giraffe-town-section .population-value {
  position: absolute;
  bottom: -95px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #2D7A2A;
  width: 100%;
  text-align: center;
  z-index: 5;
}

@media (max-width: 767px) {
  .secondary-gameplay-screen .giraffe-towns-row .giraffe-town-section {
    width: 110px;
    margin: 0 2px;
    height: 200px;
  }

  .secondary-gameplay-screen .giraffe-towns-row .giraffe-town-section .population-value {
    position: absolute !important;
    bottom: -250px !important; /* Adjusted from -185px to push it further lower */
    left: 50% !important;
    transform: translateX(-50%) !important;
    font-size: 16px !important;
    width: 100% !important;
    padding: 2px 5px !important;
  }
}

/* Phase 3 population values - keep these separate */
.tertiary-gameplay-screen .population-value {
  position: relative;
  top: 90px;
  font-size: 22px;
  font-weight: bold;
  color: #2D7A2A;
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
  border-radius: 8px;
}

/* Secondary gameplay styles - Phase 2 */
.secondary-gameplay-screen .giraffe-towns-row {
  position: relative;
  padding-bottom: 100px; /* Make space for population values */
}

.secondary-gameplay-screen .giraffe-town-section {
  position: relative;
  width: 110px;
  margin: 0 2px;
}

.secondary-gameplay-screen .giraffe-town-section .giraffe-population {
  height: 110px;
  margin-bottom: 0;
}

/* Override all other population value styles for phase 2 */
.secondary-gameplay-screen .giraffe-town-section .population-value {
  position: absolute !important;
  bottom: -155px !important;
  left: 20% !important;
  transform: translateX(-50%) !important;
  font-family: 'Gabarito', sans-serif !important;
  font-size: 16px !important;
  font-weight: bold !important;
  color: #2D7A2A !important;
  width: 100% !important;
  text-align: center !important;
  margin: 15px!important;
  padding: 5px !important;
  z-index: 5 !important;
}

@media (max-width: 767px) {
  .secondary-gameplay-screen .giraffe-towns-row {
    padding-bottom: 180px; /* More space for population values on mobile */
  }

  .secondary-gameplay-screen .giraffe-town-section {
    width: 110px;
    margin: 0 2px;
  }

  .secondary-gameplay-screen .giraffe-town-section .population-value {
    bottom: 45px !important; /* Push values even lower on mobile */
  }
}

/* Keep phase 3 styles separate */
.tertiary-gameplay-screen .population-value {
  position: relative;
  top: 90px;
  font-size: 22px;
  font-weight: bold;
  color: #2D7A2A;
  z-index: 5;
  background: transparent;
  padding: 5px 10px;
  border-radius: 8px;
}

/* Mobile adjustments for Phase 3 */
@media (max-width: 767px) {
  .tertiary-towns-container {
    gap: 100px; /* Adjusted gap for smaller elements */
    margin-top: 198px; 
/* Increased from 100px to push towns lower */
  }

  .tertiary-town {
    transform: scale(1.0); /* Slightly reduce overall town scale */
    padding-bottom: 0 !important; /* Ensure no extra space below population label */
  }

  .tertiary-town .giraffe-population { /* Control height for giraffe positioning */
    height: 125px !important; /* Tallest giraffe is 120px, give a little room */
    margin-bottom: 0 !important; /* Remove any margin affecting label spacing */
  }

  .tertiary-town .giraffe-img {
    height: 100px !important; /* Reduced height */
    width: 35px !important;   /* Reduced width */
  }

  .tertiary-town .shortest-giraffe {
    height: 80px !important;  /* Reduced height */
  }

  .tertiary-town .tallest-giraffe {
    height: 120px !important; /* Reduced height */
  }

  .tertiary-gameplay-screen .population-value {
    font-size: 18px !important; /* Reduced font size */
    top: 20px !important;       /* Adjusted from 70px to move label lower */
  }
}

/* Adjust horizontal spacing of giraffes within a town for phase 3 mobile */
.tertiary-town .giraffe-group .giraffe-img:nth-child(1) {
  left: 15px !important; 
}
.tertiary-town .giraffe-group .giraffe-img:nth-child(2) {
  left: -5px !important; /* Brings it closer to the first giraffe */
}
.tertiary-town .giraffe-group .giraffe-img:nth-child(3) {
  left: -20px !important; /* Brings it closer to the second giraffe */
}

.tertiary-gameplay-screen .population-value {
  font-size: 18px !important; /* Reduced font size */
  top: 20px !important;       /* Adjusted from 70px to move label lower */
}

@media (max-width: 767px) {
  .game-title {
    font-weight: 400; /* Make title lighter on mobile */
    font-size: 18px;
    margin-top: 60px;
  }

  .population-question-modal {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #3A8737;
    padding: 20px;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: translateY(0);
    margin-top: auto;
  }

  .population-question-modal.slide-in-bottom {
    animation: slideInFromBottom 0.3s ease forwards;
  }

  .answer-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }

  .population-option {
    width: 80px;
    height: 40px;
    font-size: 14px;
  }
}

</style> 
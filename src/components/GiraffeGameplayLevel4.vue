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
                <div class="giraffe-group">
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 10px;" />
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 55px;" />
                  <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 100px;" />
                </div>
              </div>
              <div class="population-value">3600</div>
            </div>
            
            <!-- New Town -->
            <div class="giraffe-town-section">
              <div class="giraffe-population">
                <div class="giraffe-group">
                  <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 10px;" />
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 55px;" />
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 100px;" />
                </div>
              </div>
              <div class="population-value">{{ hasSelectedAnswer ? (selectedPopulationAnswer === 3900 ? '3900' : (selectedPopulationAnswer === 5000 ? '5100' : '3500')) : '?' }}</div>
            </div>
            
            <!-- Town D -->
            <div class="giraffe-town-section">
              <div class="giraffe-population">
                <div class="giraffe-group">
                  <img :src="getGiraffeImage(1)" class="giraffe-img shortest-giraffe" style="left: 10px;" />
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 55px;" />
                  <img :src="getGiraffeImage(2)" class="giraffe-img tallest-giraffe" style="left: 100px;" />
                </div>
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
      showPositiveFeedback.value = false;
      // Show tertiary objective screen
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

.instruction-text {
  color: #6BADD7;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  text-align: center;
  margin: 20px 0 20px 0;
  padding: 0 20px;
  transition: transform 0.5s ease;
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
}

/* Grass Area */
.grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
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
  top: 50px; /* Moved down from 15px to 50px */
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr; 
  row-gap: 10px;
  column-gap: 10px;
  padding: 0 10px;
  z-index: 5;
  height: 70%; /* Reduced from 75% to 70% to fit in view */
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
  height: 130px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 5px;
}

.giraffe-group {
  display: flex;
  position: relative;
  width: 140px;
  height: 130px;
  overflow: visible;
}

.giraffe-img {
  object-fit: contain;
  object-position: bottom;
  position: absolute;
  bottom: 0;
}

.clipped-giraffe {
  left: 10px;
  z-index: 1;
  height: 110px;
  width: 40px;
}

.tallest-giraffe {
  left: 50px;
  z-index: 3;
  height: 120px;
  width: 45px;
}

.shortest-giraffe {
  left: 90px;
  z-index: 2;
  height: 90px;
  width: 40px;
}

.population-platform {
  width: 104px;
  height: 7px;
  background: #4FAB4C;
  margin-bottom: 2px;
}

.population-label {
  color: #2D7A2A;
  font-family: 'Gabarito', sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-top: 0;
  text-align: center;
  z-index: 6;
}

/* Answer Options */
.answer-options-container {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  z-index: 10;
  opacity: 0;
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

.option-button {
  width: 60px;
  height: 50px;
  background: #8FD14F;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
}

.option-button:active {
  cursor: grabbing;
}

.check-button {
  width: 100%;
  max-width: 320px;
  height: 50px;
  background: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  color: #333333;
  cursor: pointer;
  transition: background 0.2s;
}

.check-button:hover {
  background: #f8f9fa;
}

/* Feedback Screens */
.success-feedback {
  position: absolute;
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
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
}

.success-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
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
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.giraffe-img {
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 120px;
  object-fit: contain;
  object-position: bottom;
}

/* Add spacing for distinct giraffe populations */
.tallest-giraffe {
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.shortest-giraffe {
  left: calc(50% - 25px);
  z-index: 2;
  height: 100px;
}

.clipped-giraffe {
  left: calc(50% + 25px);
  z-index: 1;
  height: 110px;
}

/* Mobile styles for responsive layout */
@media (max-width: 767px) {
  .giraffe-towns-container {
    gap: 15px;
    padding: 0 10px;
    justify-content: space-around;
  }

  .giraffe-town {
    min-width: 90px;
  }

  /* Make the population label fit on mobile */
  .population-label {
    font-size: 13px;
    padding: 4px;
    white-space: normal;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Adjust speech bubble positioning on mobile */
  .speech-bubble {
    font-size: 14px;
    padding: 6px 8px;
    white-space: normal;
    max-width: 80px;
    text-align: center;
    top: -40px;
  }
  
  /* Make sure town D doesn't overflow */
  .secondary-giraffe-container {
    gap: 10px;
    padding: 0 10px;
  }
  
  .secondary-town-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .secondary-town {
    min-width: 80px;
    margin-bottom: 20px;
  }
}

/* Secondary Objective Screen */
/* We're using direct transitions instead of overlays */

.secondary-objective-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  z-index: 3000;
  opacity: 0;
}

.secondary-objective-screen.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.octopus-header {
  padding: 20px;
}

.secondary-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.secondary-message p {
  color: #0DA49F;
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  text-align: center;
}

/* Secondary Gameplay Styles */
.secondary-gameplay-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  z-index: 2000;
}

.secondary-gameplay-screen .top-bar {
  opacity: 1; /* Make sure the top bar is visible */
}

/* Full grass background to prevent any gaps */
.full-grass-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: #83CA54;
  z-index: 0;
}

/* Solid grass background that appears during feedback modals */
.solid-grass-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: #83CA54;
  z-index: 100; /* Higher z-index to appear above any gaps */
  pointer-events: none; /* Allow clicks through */
}

.fade-out {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.secondary-giraffe-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  z-index: 5;
}

/* Speech Bubbles Row */
.speech-bubbles-row {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 15px;
  margin-bottom: 5px;
}

.speech-bubble-container {
  width: 30%;
  display: flex;
  justify-content: center;
}

.speech-bubble-new {
  background: #4FAB4C;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-family: 'Gabarito', sans-serif;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
}

/* Giraffe Towns Row */
.giraffe-towns-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 200px;
}

.giraffe-town-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.population-value {
  background: #83CA54;
  color: white;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
  width: 100%;
}

/* Remove background for specific populations in tertiary gameplay */
.tertiary-town .population-value {
  background: transparent;
  color: white;
}

.population-question-modal {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #4FAB4C;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  padding-bottom: 30px;
}

.question-text {
  color: white;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  text-align: center;
  margin-bottom: 24px;
}

.answer-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  gap: 12px;
}

.population-option {
  flex: 1;
  padding: 15px 0;
  background: #FFFFFF;
  border-radius: 16px;
  border: none;
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  color: #4FAB4C;
  cursor: pointer;
  min-width: 80px;
  font-weight: 500;
}

/* Animation for sliding in from bottom */
.slide-in-bottom {
  animation: slideInFromBottom 0.5s ease forwards;
}

/* Secondary grass area */
.secondary-grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  z-index: 1;
  opacity: 0;
  background: #83CA54; /* Add background to entire area */
}

.secondary-grass-area.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* Top and bottom parts of grass for visual effect, both same color */
.grass-top {
  width: 100%;
  height: 50%;
  background: #83CA54;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.grass-bottom {
  width: 100%;
  height: 50%;
  background: #83CA54;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

/* Styles for positive feedback modal - made consistent with phase 1 */
.positive-feedback-modal {
  position: absolute;
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

.positive-feedback-modal.slide-in-bottom {
  animation: slideInFromBottom 0.5s ease forwards;
}

.feedback-title {
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.feedback-text {
  font-family: 'Gabarito', sans-serif;
  font-size: 18px;
  margin-bottom: 16px;
  padding: 0 20px;
  color: white;
  text-align: center;
}

.continue-button, .try-again-button {
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
}

/* Styles for negative feedback modal - made consistent with phase 1 */
.negative-feedback-modal {
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

.negative-feedback-modal.slide-in-bottom {
  animation: slideInFromBottom 0.5s ease forwards;
}

/* Tertiary Objective Screen */
.tertiary-objective-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  z-index: 3000;
  opacity: 0;
}

.tertiary-objective-screen.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.top-bar-tertiary {
  height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tertiary-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.tertiary-message p {
  color: #6BADD7; /* Light blue color for the message */
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  text-align: center;
}

/* Tertiary Gameplay Screen Styles */
.tertiary-gameplay-screen {
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  z-index: 2000;
}

.tertiary-towns-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 15px;
  margin-top: 120px; /* Push down to avoid overlapping with top bar */
  z-index: 5;
}

.tertiary-town {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  width: 45%;
  padding-bottom: 0;
}

.tertiary-town.slide-in {
  animation: slideIn 0.5s ease forwards;
}

.tertiary-town .speech-bubble {
  position: absolute;
  top: -25px; /* Position bubble closer to giraffes, changed from -40px */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: #4FAB4C;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Gabarito', sans-serif;
  font-weight: 500;
  text-align: center;
}

/* Restore the speech bubble arrow */
.tertiary-town .speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4FAB4C;
}

/* Make giraffes consistent on desktop */
@media (min-width: 768px) {
  .tertiary-town .giraffe-population {
    height: 180px;
  }
  
  .tertiary-town .giraffe-group {
    width: 170px;
    height: 180px;
  }
  
  .tertiary-town .giraffe-img {
    height: 140px;
    width: 50px;
  }
  
  .tertiary-town .tallest-giraffe {
    height: 160px;
    width: 60px;
  }
  
  .tertiary-town .shortest-giraffe {
    height: 120px;
    width: 50px;
  }
}

.tertiary-grass-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  z-index: 1;
  opacity: 0;
  background: #83CA54;
}

.tertiary-grass-area.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* Comparison Question Modal Styles */
.comparison-question-modal {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #4FAB4C;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  padding-bottom: 30px;
}

.comparison-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  gap: 12px;
}

.comparison-option {
  flex: 1;
  padding: 20px 0;
  background: #FFFFFF;
  border-radius: 16px;
  border: none;
  font-family: 'Gabarito', sans-serif;
  font-size: 24px;
  color: #4FAB4C;
  cursor: pointer;
  font-weight: 500;
}

/* Add this CSS at the end of the style section */
@media (max-width: 480px) {
  .question-modal {
    width: 85%;
    max-width: 300px;
    padding: 16px;
  }
  
  .options-container {
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .option-button {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .target-containers {
    gap: 15px;
  }
  
  .target-container {
    width: 70px;
    height: 70px;
  }
  
  .option-buttons {
    gap: 10px;
    padding: 0 10px;
  }
  
  .number-groups {
    gap: 15px;
  }
  
  .giraffe-image {
    width: 45px;
    height: 130px;
  }
  
  .speech-bubble {
    max-width: 110px;
    font-size: 14px;
    padding: 8px;
  }
}

/* Fix for success feedback speech bubble positioning */
.success-feedback.slide-in ~ .game-content .speech-bubble {
  top: -180px !important;
  position: fixed !important;
  z-index: 2000 !important;
}

/* Fix for ensuring giraffe images display at proper heights */
.giraffe-img {
  object-fit: contain !important;
  object-position: bottom !important;
  position: absolute !important;
  bottom: 0 !important;
}

/* Ensure touch targets are large enough on mobile */
.option-button {
  touch-action: none !important;
}

/* Prevent z-index issues when interacting with warning messages */
.warning-feedback, .success-feedback {
  z-index: 2000 !important;
}

/* Center octopus icon in the diamond badge unlock screen */
.badge-unlock-screen .octopus-icon {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style> 
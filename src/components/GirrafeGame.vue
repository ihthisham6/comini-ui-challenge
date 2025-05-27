<template>
  <div class="game-container">
    <!-- Back button in top left -->
    <router-link to="/" class="back-button">
      <font-awesome-icon icon="arrow-left" class="back-icon" />
    </router-link>

    <div class="content-wrapper">
      <!-- Title -->
      <h1 class="page-title">The Tall Giraffe</h1>

      <!-- Rive animation container -->
      <div class="rive-container">
        <RivePlayer 
          src="/rive/giraffes.riv"
          :width="riveProps.width"
          :height="riveProps.height"
        />
      </div>

      <!-- Action buttons -->
      <div class="action-buttons">
        <button class="play-button" @click="openPreviewModal">
          <font-awesome-icon icon="play" class="button-icon" />
          <span class="button-text">Play Game</span>
        </button>
        <button class="assign-button">
          <span class="button-text">Assign to Child</span>
        </button>
        <button class="save-button">
          <font-awesome-icon icon="bookmark" class="button-icon" />
        </button>
      </div>

      <!-- Description section -->
      <div class="description-section">
        <h2 class="section-title">Description</h2>
        <p class="description-text">
          Help the giraffe collect all the leaves while avoiding obstacles. This game helps improve reaction time and decision making.
        </p>
      </div>

      <!-- Topics section -->
      <div class="topics-section">
        <h2 class="section-title">Topics Covered</h2>
      </div>
    </div>

    <!-- Bottom navbar -->
    <div class="bottom-navbar">
      <div class="navbar-buttons">
        <router-link to="/" class="nav-button">
          <font-awesome-icon icon="home" class="nav-icon" />
        </router-link>
        <div class="nav-button">
          <font-awesome-icon icon="search" class="nav-icon" />
        </div>
        <div class="nav-button">
          <font-awesome-icon icon="bell" class="nav-icon" />
        </div>
        <div class="nav-button">
          <font-awesome-icon icon="user" class="nav-icon user-nav-icon" />
        </div>
      </div>
      <div class="avatar-container">
        <OctopusIcon :width="43" :height="43" color="#4AC1BD" />
      </div>
    </div>

    <!-- Preview Modal -->
    <GamePreviewModal
      :is-open="showPreviewModal"
      @close="closePreviewModal"
      @start-game="startGame"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import RivePlayer from './RivePlayer.vue';
import GamePreviewModal from './GamePreviewModal.vue';
import OctopusIcon from './OctopusIcon.vue';

export default defineComponent({
  name: 'GiraffeGameView',
  components: {
    RivePlayer,
    GamePreviewModal,
    OctopusIcon
  },
  setup() {
    const showPreviewModal = ref(false);
    const windowWidth = ref(window.innerWidth);

    // Dynamically calculate dimensions based on screen size
    const riveProps = computed(() => {
      if (windowWidth.value >= 1920) {
        // Nest Hub size
        return { width: 320, height: 200 };
      } else if (windowWidth.value >= 1440) {
        return { width: 450, height: 280 };
      } else if (windowWidth.value >= 1024) {
        return { width: 650, height: 500 };
      } else if (windowWidth.value >= 768) {
        return { width: 600, height: 480 };
      } else {
        // Mobile default
        return { width: 340, height: 350 };
      }
    });

    // Listen for window resize
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
      });
    });

    const openPreviewModal = () => {
      showPreviewModal.value = true;
    };

    const closePreviewModal = () => {
      showPreviewModal.value = false;
    };

    const startGame = () => {
      closePreviewModal();
      // Add game start logic here
    };

    return {
      showPreviewModal,
      openPreviewModal,
      closePreviewModal,
      startGame,
      riveProps,
      windowWidth
    };
  }
});
</script>

<style scoped>

/* Container styles */
.game-container {
  width: 100%;
  min-height: 100vh;
  background: #FFFFFF;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  scroll-behavior: smooth;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 120px;
  overflow-x: hidden;
}

/* Title styling */
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin-top: 20px;
  margin-left: 70px;
  align-self: flex-start;
  width: 100%;
}

/* Back button styling */
.back-button {
  position: absolute;
  width: 45px;
  height: 45px;
  top: 20px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E4E4E4;
  border-radius: 50%;
  background-color: #FFFFFF;
  box-shadow: 0px 4px 0px 0px #E4E4E4;
  cursor: pointer;
  z-index: 10;
  text-decoration: none;
}

.back-icon {
  font-size: 20px;
  color: #000000;
}

/* Rive container styling */
.rive-container {
  width: min(340px, 100%);
  height: 400px;
  margin-top: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: #FFFFFF;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Action buttons styling */
.action-buttons {
  width: min(340px, 95%);
  height: 38px;
  margin-top: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.play-button {
  flex: 1;
  max-width: 108px;
  height: 38px;
  border: 1px solid #E4E4E4;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-button:hover {
  background-color: #F8F9FA;
  transform: translateY(-1px);
}

.assign-button {
  flex: 1;
  max-width: 128px;
  height: 38px;
  border: 1px solid #25A49F;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #4AC1BD;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.assign-button:hover {
  background-color: #3BA8A4;
  transform: translateY(-1px);
}

.save-button {
  width: 56px;
  height: 38px;
  border: 1px solid #E4E4E4;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover {
  background-color: #F8F9FA;
  transform: translateY(-1px);
}

.button-icon {
  font-size: 16px;
  color: #000000;
}

.button-text {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  white-space: nowrap;
}

/* For the assign button, white text */
.assign-button .button-text,
.assign-button .button-icon {
  color: #FFFFFF;
}

/* Description section styling */
.description-section {
  width: min(312px, 90%);
  margin-top: 12px; /* Reduced from 20px to 12px for mobile */
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #000000;
}

.description-text {
  font-size: 14px;
  line-height: 1.5;
  color: #000000;
}

/* Topics section styling */
.topics-section {
  width: min(312px, 90%);
  margin-top: 20px;
  margin-bottom: 100px;
}

/* Bottom navbar styling */
.bottom-navbar {
  position: fixed;
  width: min(327px, calc(100% - 40px));
  height: 72px;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  z-index: 100;
}

.navbar-buttons {
  display: flex;
  gap: 36px;
  height: 26px;
  align-items: center;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.nav-icon {
  font-size: 20px;
  color: #999999;
}

.nav-icon.user-nav-icon {
  color: #74C0FC;
}

.avatar-container {
  display: flex;
  align-items: center;
}

/* Media queries for responsive design */
@media (min-width: 768px) {
  .game-container {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 28px;
    margin-left: 80px;
    width: calc(100% - 80px);
  }

  .rive-container {
    width: min(600px, 90%);
    height: 480px;
  }

  .action-buttons {
    width: min(600px, 90%);
    margin-top: 20px;
    height: 45px;
  }

  .play-button {
    max-width: 130px;
    height: 45px;
  }

  .assign-button {
    max-width: 150px;
    height: 45px;
  }

  .save-button {
    width: 65px;
    height: 45px;
  }

  .button-text {
    font-size: 15px;
  }

  .button-icon {
    font-size: 16px;
  }

  .description-section,
  .topics-section {
    width: min(500px, 90%);
  }

  .section-title {
    font-size: 20px;
  }

  .description-text {
    font-size: 16px;
  }

  .bottom-navbar {
    width: min(500px, calc(100% - 80px));
  }

  .nav-icon {
    font-size: 22px;
  }
}

@media (min-width: 1024px) {
  .game-container {
    padding: 40px;
  }

  .content-wrapper {
    padding: 0 40px 160px;
    margin-bottom: 50px;
  }

  .page-title {
    font-size: 42px;
    margin: 40px 0 60px;
    text-align: center;
    align-self: center;
  }

  .rive-container {
    width: min(700px, 80%);
    height: 500px;
    margin: 0;
  }

  .action-buttons {
    width: min(600px, 80%);
    height: 60px;
    margin-top: 24px;
    margin-bottom: 60px;
  }

  .play-button {
    max-width: 160px;
    height: 60px;
  }

  .assign-button {
    max-width: 180px;
    height: 60px;
  }

  .save-button {
    width: 80px;
    height: 60px;
  }

  .button-text {
    font-size: 18px;
  }

  .button-icon {
    font-size: 18px;
  }

  .description-section {
    width: min(650px, 80%);
    margin-top: 40px;
  }

  .topics-section {
    width: min(650px, 80%);
    margin-top: 30px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .description-text {
    font-size: 18px;
    line-height: 1.6;
  }

  .bottom-navbar {
    width: min(800px, calc(100% - 120px));
    height: 80px;
    bottom: 30px;
  }
}

@media (min-width: 1440px) {
  .content-wrapper {
    padding: 0 20px 180px; /* Increase bottom padding for extra large screens */
    margin-bottom: 80px; /* Increase bottom margin */
  }

  .rive-container {
    width: min(450px, 90%);
    height: 280px;
  }

  .action-buttons {
    width: min(450px, 90%);
    height: 50px;
    margin-top: 16px; /* Consistent small gap between animation and buttons */
    margin-bottom: 40px; /* Add bottom margin to action buttons */
  }

  .description-section,
  .topics-section {
    width: min(450px, 90%);
    margin-top: 40px;
  }
}

/* For very large screens like Nest Hub */
@media (min-width: 1920px) {
  .rive-container {
    width: min(320px, 50%);
    height: 200px;
    margin-top: 30px;
  }

  .action-buttons {
    width: min(320px, 50%);
    height: 50px;
    margin-top: 16px;
    margin-bottom: 20px;
  }

  .description-section,
  .topics-section {
    width: min(350px, 60%);
    margin-top: 20px;
  }
}

/* Fallback image styling */
.fallback-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.fallback-giraffe {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

/* Remove problematic modal overlay styles - let individual modal components handle their own overlay */
</style>
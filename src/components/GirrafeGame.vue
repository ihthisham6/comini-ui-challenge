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
        <div class="fallback-image">
          <img src="../assets/icons/Giraffe2.png" alt="Giraffe" class="fallback-giraffe" />
        </div>
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
import { defineComponent, ref } from 'vue';
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
      startGame
    };
  }
});
</script>

<style>
/* Remove all global style overrides */
:global(body) {
  margin: 0;
  padding: 0;
  background-color: #E4E4E4;
  position: static;
  height: auto;
  overflow: visible;
}

:global(html) {
  height: auto;
  overflow: visible;
}

:global(#app),
:global(#app-container),
:global(.main-content) {
  height: auto;
  overflow: visible;
}

/* Container styles */
.game-container {
  width: 100%;
  min-height: 100%;
  background: #FFFFFF;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 120px;
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
  width: min(312px, 90%);
  height: 342px;
  margin-top: 93px;
  border-radius: 10px;
  overflow: hidden;
  background: #FFFFFF;
}

/* Action buttons styling */
.action-buttons {
  width: min(312px, 90%);
  height: 38px;
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.play-button {
  width: 108px;
  height: 38px;
  border: 1px solid #E4E4E4;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}

.assign-button {
  width: 128px;
  height: 38px;
  border: 1px solid #25A49F;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #4AC1BD;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
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
  margin-top: 20px;
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

.user-nav-icon {
  color: #74C0FC !important;
}

.avatar-container {
  display: flex;
  align-items: center;
}

/* Media queries for responsive design */
@media (min-width: 768px) {
  .game-container {
    padding: 40px;
  }

  .page-title {
    font-size: 28px;
    margin-left: 80px;
  }

  .rive-container {
    width: min(400px, 90%);
    height: 400px;
  }

  .action-buttons {
    width: min(400px, 90%);
  }

  .play-button {
    width: 120px;
  }

  .assign-button {
    width: 140px;
  }

  .save-button {
    width: 60px;
  }

  .description-section,
  .topics-section {
    width: min(400px, 90%);
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
    padding: 20px;
    min-height: 100%;
  }

  .content-wrapper {
    padding: 0 20px 140px;
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 32px;
    margin: 20px 0 40px;
    text-align: center;
    align-self: center;
  }

  .rive-container {
    width: min(350px, 90%);
    height: 250px;
    margin: 0;
  }

  .action-buttons {
    width: min(350px, 90%);
    height: 44px;
    margin-top: 20px;
  }

  .description-section {
    width: min(350px, 90%);
    margin-top: 20px;
  }

  .topics-section {
    width: min(350px, 90%);
    margin-top: 20px;
  }

  .bottom-navbar {
    position: fixed;
    width: min(800px, calc(100% - 120px));
    height: 80px;
    bottom: 20px;
    z-index: 100;
  }
}

@media (min-width: 1440px) {
  .content-wrapper {
    padding: 0 20px 160px;
    margin-bottom: 60px;
  }

  .rive-container {
    width: min(450px, 90%);
    height: 280px;
  }

  .action-buttons {
    width: min(450px, 90%);
    height: 50px;
    margin-top: 24px;
  }

  .description-section,
  .topics-section {
    width: min(450px, 90%);
    margin-top: 24px;
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
</style>
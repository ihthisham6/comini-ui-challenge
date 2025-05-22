<template>
  <div class="game-card" @click="navigateToGameDetails">
    <div class="game-card-image-container" :style="{ backgroundColor: background || '#F5FBFF' }">
      <img
        :src="image"
        :alt="title"
        class="game-card-image"
      />
    </div>
    <div class="game-card-title">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: {
    image: String,
    title: String,
    background: {
      type: String,
      default: '#F5FBFF'
    }
  },
  methods: {
    navigateToGameDetails() {
      if (this.title === "The Tall Giraffe") {
        this.$router.push('/giraffe-game');
      } else {
        // Default navigation for other games
        this.$router.push({
          name: 'GameDetails',
          params: { title: this.title }
        });
      }
    }
  }
}
</script>

<style scoped>
.game-card {
  width: 100%;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
}

.game-card-image-container {
  width: 100%;
  aspect-ratio: 1/0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
  padding: 12px;
}

.game-card-image {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
}

.game-card-title {
  height: 36px;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #FFFFFF;
}

/* Responsive styles */
@media (min-width: 768px) {
  /* Laptop */
  .game-card-title {
    height: 38px;
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .game-card-image-container {
    aspect-ratio: 1/0.65;
  }
  
  .game-card-title {
    height: 40px;
    font-size: 16px;
  }
}
</style>
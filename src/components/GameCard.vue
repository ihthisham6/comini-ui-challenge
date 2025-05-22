<template>
  <div class="game-card" @click="navigateToGameDetails">
    <img
      :src="image"
      :alt="title"
      class="game-card-image"
    />
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
    title: String
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
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.game-card-image {
  width: 100%;
  aspect-ratio: 1/0.7;
  object-fit: cover;
  background: #F5FBFF;
  border-radius: 6px 6px 0 0;
}

.game-card-title {
  height: 26px;
  padding: 3px;
  font-size: 11px;
  font-weight: 500;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Responsive styles */
@media (min-width: 768px) {
  /* Laptop */
  .game-card-title {
    height: 28px;
    padding: 4px;
    font-size: 12px;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .game-card-image {
    aspect-ratio: 1/0.65;
  }
  
  .game-card-title {
    height: 28px;
    padding: 4px;
    font-size: 12px;
  }
}
</style>
<template>
  <div style="min-height: 100vh; background: #FFFFFF;">
    <Navbar />
    <div class="grid-wrapper">
      <div class="grid-container">
        <GameCard title="Meerkat Picnic" image="/src/assets/icons/MeerkatGame.png" />
        <GameCard title="Fishy Business" image="/src/assets/icons/FishyBusiness.png" />
        <GameCard title="The Tall Giraffe" image="/src/assets/icons/TheTallGiraffe.png" />
        <GameCard title="Arctic Adventure" image="/src/assets/icons/ArcticAdventure.png" />
        <GameCard title="Nuts & Nutkins" image="/src/assets/icons/NutsandNutkins.png" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import GameCard from '../components/GameCard.vue'

export default {
  name: 'HomePage',
  components: {
    Navbar,
    GameCard
  }
}
</script>

<style scoped>
.grid-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
  min-height: calc(100vh - 60px);
  margin-top: 30px;
  padding-bottom: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  width: 100%;
  max-width: 380px;
}

/* Responsive styles - keeping 2 cards per row but adjusting size */
@media (min-width: 480px) {
  .grid-container {
    gap: 16px;
    max-width: 400px;
  }
}

@media (min-width: 768px) {
  /* Laptop */
  .grid-wrapper {
    padding: 12px;
    margin-top: 25px;
  }
  
  .grid-container {
    gap: 18px;
    max-width: 440px;
  }
}

@media (min-width: 1024px) {
  /* iPad Pro/Desktop */
  .grid-wrapper {
    margin-top: 60px; /* Changed from 0 to 60px to move cards lower */
    padding-top: 0;
    transform: none; /* Removed negative transform */
  }
  
  .grid-container {
    gap: 20px;
    max-width: 480px;
  }
}
</style>
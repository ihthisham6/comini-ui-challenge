<template>
  <div class="game-details">
    <!-- Back navigation header -->
    <div class="header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="game-title">{{ game.title }}</h1>
    </div>
    
    <!-- Game preview animation area -->
    <div class="game-preview">
      <div class="animation-placeholder">
        Animated game preview lottie animation goes here
      </div>
    </div>
    
    <!-- Action buttons -->
    <div class="action-buttons">
      <button class="play-button">Play Game</button>
      <button class="assign-button">Assign to Child</button>
      <button class="bookmark-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Game description -->
    <div class="description-section">
      <h2>Description</h2>
      <p>{{ game.description }}</p>
    </div>
    
    <!-- Topics covered -->
    <div class="topics-section">
      <h2>Topics Covered</h2>
      <div class="topic-tags">
        <span class="topic-tag" v-for="(topic, index) in game.topics" :key="index">
          {{ topic.name }}
        </span>
        <span class="topic-tag stage">{{ game.stage }}</span>
      </div>
    </div>
    
    <!-- Bottom navigation -->
    <div class="bottom-nav">
      <button class="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="black" stroke-width="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="black" stroke-width="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="black" stroke-width="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="black" stroke-width="1.5"/>
        </svg>
      </button>
      <button class="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="2" rx="1" fill="black"/>
          <rect x="3" y="11" width="18" height="2" rx="1" fill="black"/>
          <rect x="3" y="17" width="18" height="2" rx="1" fill="black"/>
        </svg>
      </button>
      <button class="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="nav-button">
        <img src="" alt="User profile" class="avatar-img" />
      </button>
      <button class="nav-button active">
        <div class="circle-icon">
          <span>+</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameDetailsPage',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      games: {
        'Arctic Adventure': {
          title: 'Arctic Adventure',
          description: 'Kids help animals stay on the block by including weights to balance the weight of animals using addition.',
          topics: [
            { name: 'Addition' }
          ],
          stage: 'Stage 3'
        },
        'Meerkat Picnic': {
          title: 'Meerkat Picnic',
          description: 'Kids help meerkats prepare for a picnic by solving addition problems.',
          topics: [
            { name: 'Addition' }
          ],
          stage: 'Stage 2'
        },
        'Fishy Business': {
          title: 'Fishy Business',
          description: 'Kids help count and sort fish by solving addition and subtraction problems.',
          topics: [
            { name: 'Addition' },
            { name: 'Subtraction' }
          ],
          stage: 'Stage 2'
        },
        'The Tall Giraffe': {
          title: 'The Tall Giraffe',
          description: 'Kids help a giraffe reach for food by solving height measurement problems.',
          topics: [
            { name: 'Measurement' }
          ],
          stage: 'Stage 3'
        },
        'Nuts & Nutkins': {
          title: 'Nuts & Nutkins',
          description: 'Kids help squirrels collect and count nuts by solving counting and addition problems.',
          topics: [
            { name: 'Counting' },
            { name: 'Addition' }
          ],
          stage: 'Stage 1'
        }
      }
    }
  },
  computed: {
    game() {
      return this.games[this.title] || {
        title: this.title,
        description: 'Game description not available.',
        topics: [],
        stage: 'Stage not specified'
      };
    }
  },
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.game-details {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  min-height: 100vh;
  padding-bottom: 60px; /* Space for bottom nav */
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
}

.game-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.game-preview {
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.animation-placeholder {
  height: 240px;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  padding: 0 16px;
  gap: 8px;
  margin-bottom: 24px;
}

.play-button {
  flex: 1;
  height: 40px;
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
}

.assign-button {
  flex: 1.5;
  height: 40px;
  background-color: #4ECDC4;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
}

.bookmark-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.description-section, .topics-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.description-section h2, .topics-section h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.description-section p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  background-color: #F5F5F5;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
}

.topic-tag.stage {
  margin-left: 8px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.05);
}

.nav-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.circle-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4ECDC4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.nav-button.active .circle-icon {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsive styles */
@media (min-width: 768px) {
  .game-preview {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .action-buttons {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .description-section, .topics-section {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
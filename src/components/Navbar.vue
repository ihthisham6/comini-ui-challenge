Navbar.vue : <!-- Fixed Navbar.vue -->
<script setup>
// No local FontAwesome setup needed - using global setup
</script>

<template>
  <header class="navbar-header">
    <div class="navbar-left">
      <button class="navbar-btn">
        <FontAwesomeIcon icon="bars" class="navbar-icon" />
      </button>
      <h1 class="navbar-title">Games</h1>
    </div>
    
    <div class="navbar-right">
      <button class="navbar-btn">
        <FontAwesomeIcon icon="search" class="navbar-icon" />
      </button>
      <button class="navbar-btn">
        <FontAwesomeIcon icon="filter" class="navbar-icon" />
      </button>
    </div>
  </header>
</template>

<style>
/* Reset specific global styles that are causing issues */
.navbar-header h1 {
  /* font-size: 1.4rem !important; */
  line-height: normal !important;
}

.navbar-header button {
  border-radius: 50% !important;
  padding: 0 !important;
}


</style>

<style scoped>
/* Navbar header */
.navbar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  padding-top: 3rem;
  background-color: #FFFFFF;
  height: 60px;
  border-bottom: 1px solid #FFFFFF;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 3.5rem;
}

/* Left section with hamburger and title */
.navbar-left {
  display: flex;
  align-items: center;
}

/* Right section with action buttons */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Title styling */
.navbar-title {
  font-size: 1.5rem;;
  font-weight: 600;
  color: #000000;
  margin-left: 32px;
}

/* Navbar button styles */
.navbar-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: none;
}

/* Icon styles */
.navbar-icon {
  width: 24px;
  height: 24px;
  color: #000000;
}

/* Responsive styles */
@media (min-width: 768px) {
  .navbar-header {
    height: 70px;
    padding: 0.75rem 2rem;
  }
  
  .navbar-btn {
    width: 44px;
    height: 44px;
  }
  
  .navbar-icon {
    width: 26px;
    height: 26px;
  }
  
  .navbar-title {
    font-size: 2.8rem;
    margin-left: 64px;
  }
  
  .navbar-right {
    gap: 16px;
  }
}

@media (min-width: 480px) {
  .navbar-title {
    font-size: 2rem; /* Medium screens like tablets */
  }
}

</style> 
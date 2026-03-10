<template>
  <div class="app-container">
    <header v-if="isLoggedIn">
      <h1>Zpěvník Kapely</h1>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <button @click="logout" class="logout-btn">Odhlásit se</button>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLoggedIn = computed(() => {
  return route.name !== 'Login' && localStorage.getItem('kapela_loggedIn') === 'true'
})

const logout = () => {
  localStorage.removeItem('kapela_loggedIn')
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.5rem;
  margin: 0;
  background: -webkit-linear-gradient(45deg, #42d392, #647eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover, nav a.router-link-active {
  color: #42d392;
}

.logout-btn {
  background: transparent;
  border: 1px solid #ff5a5f;
  color: #ff5a5f;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #ff5a5f;
  color: #fff;
}

main {
  flex: 1;
}
</style>

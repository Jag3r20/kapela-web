<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-placeholder">🎸</div>
      <h2>Vstup do kapelního zpěvníku</h2>
      <p class="subtitle">Zadejte heslo pro pokračování</p>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Heslo..." 
            :class="{ 'error-border': error }"
            autofocus
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="primary-btn" :disabled="!password">Vstoupit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref('')

const handleLogin = () => {
  // Hardcoded password for simplicity "kapela123"
  if (password.value === 'kapela123') {
    localStorage.setItem('kapela_loggedIn', 'true')
    router.push('/')
  } else {
    error.value = 'Špatné heslo. Zkuste to znovu.'
    password.value = ''
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 4rem);
}

.login-card {
  background-color: #1f1f23;
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.logo-placeholder {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.subtitle {
  color: #888;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.input-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #2a2a30;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #42d392;
}

input.error-border {
  border-color: #ff5a5f;
}

.error-msg {
  color: #ff5a5f;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

.primary-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #42d392;
  color: #1a1a1a;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.primary-btn:hover:not(:disabled) {
  background-color: #3bb27e;
  transform: translateY(-2px);
}

.primary-btn:disabled {
  background-color: #333;
  color: #666;
  cursor: not-allowed;
}
</style>

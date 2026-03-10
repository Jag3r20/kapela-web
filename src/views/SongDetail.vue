<template>
  <div class="song-detail" v-if="song">
    <div class="header-nav">
      <router-link to="/" class="back-link">← Zpět na seznam</router-link>
      <div class="delete-actions" v-if="!showDeleteConfirm">
        <button @click="showDeleteConfirm = true" class="delete-btn">Odstranit písničku</button>
      </div>
      <div class="delete-actions confirm" v-else>
        <span class="warning-text">Opravdu smazat?</span>
        <button @click="handleDeleteConfirm" class="danger-btn">Smazat</button>
        <button @click="showDeleteConfirm = false" class="cancel-btn">Zrušit</button>
      </div>
    </div>

    <div class="detail-card">
      <div class="title-section">
        <h2>{{ song.title }}</h2>
        <p class="artist">{{ song.artist }}</p>
      </div>

      <div class="status-section">
        <h3>Progres kapely</h3>
        <div class="progress-options">
          <label 
            class="progress-radio" 
            :class="{ active: song.progress === 'to-learn' }"
          >
            <input 
              type="radio" 
              name="progress" 
              value="to-learn" 
              :checked="song.progress === 'to-learn'"
              @change="updateProgress('to-learn')"
            />
            <span class="icon">📝</span> K naučení
          </label>
          
          <label 
            class="progress-radio"
            :class="{ active: song.progress === 'in-progress' }"
          >
            <input 
              type="radio" 
              name="progress" 
              value="in-progress" 
              :checked="song.progress === 'in-progress'"
              @change="updateProgress('in-progress')"
            />
            <span class="icon">🎸</span> Rozpracované
          </label>
          
          <label 
            class="progress-radio"
            :class="{ active: song.progress === 'mastered' }"
          >
            <input 
              type="radio" 
              name="progress" 
              value="mastered" 
              :checked="song.progress === 'mastered'"
              @change="updateProgress('mastered')"
            />
            <span class="icon">⭐</span> Umíme
          </label>
        </div>
      </div>

      <div class="notes-section">
        <h3>Poznámky pro kapelu (akordy, struktura, tónina...)</h3>
        <textarea 
          v-model="notesContent" 
          @blur="saveNotes"
          placeholder="Např: Hrajeme o tón níž. Struktura: Sloka, Refrén, Sloka, Solo, Refrén x2"
          rows="10"
        ></textarea>
        <div class="save-status" :class="{ visible: showSaved }">
          Uloženo ✓
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Písnička nenalezena</h2>
    <router-link to="/">Zpět na hlavní stránku</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongbookStore } from '../store/songbook'

const route = useRoute()
const router = useRouter()
const store = useSongbookStore()

const songId = computed(() => route.params.id)
const song = computed(() => store.getSongById(songId.value))

const notesContent = ref('')
const showSaved = ref(false)
const showDeleteConfirm = ref(false)

onMounted(async () => {
  // If navigating directly to this URL without going through Dashboard first
  if (store.songs.length === 0) {
    await store.fetchSongs()
  }
  if (song.value) {
    notesContent.value = song.value.notes || ''
  }
})

// Update local notes if route changes
watch(song, (newSong) => {
  if (newSong) {
    notesContent.value = newSong.notes || ''
  }
})

const updateProgress = (newProgress) => {
  store.updateSongProgress(Number(songId.value), newProgress)
}

const saveNotes = () => {
  if (song.value && song.value.notes !== notesContent.value) {
    store.updateSongNotes(Number(songId.value), notesContent.value)
    
    // Show saved indicator
    showSaved.value = true
    setTimeout(() => {
      showSaved.value = false
    }, 2000)
  }
}

const handleDeleteConfirm = async () => {
  await store.deleteSong(Number(songId.value))
  router.push('/')
}
</script>

<style scoped>
.song-detail {
  animation: fadeIn 0.3s ease;
  max-width: 800px;
  margin: 0 auto;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #fff;
}

.delete-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.warning-text {
  color: #ff5a5f;
  font-weight: bold;
  font-size: 0.9rem;
}

.danger-btn {
  background: #ff5a5f;
  color: white;
  border: none;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.danger-btn:hover {
  background: #e0484d;
}

.cancel-btn {
  background: transparent;
  color: #bbb;
  border: 1px solid #555;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #333;
  color: #fff;
}

.delete-btn {
  background: transparent;
  color: #ff5a5f;
  border: 1px dashed #ff5a5f;
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn:hover {
  background: rgba(255, 90, 95, 0.1);
}

.detail-card {
  background: #1f1f23;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 1px solid #2a2a30;
}

.title-section {
  border-bottom: 1px solid #333;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.title-section h2 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  background: -webkit-linear-gradient(45deg, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-section .artist {
  font-size: 1.2rem;
  color: #42d392;
  margin: 0;
  font-weight: 500;
}

h3 {
  font-size: 1.1rem;
  color: #eee;
  margin-bottom: 1rem;
}

.status-section {
  margin-bottom: 2.5rem;
}

.progress-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.progress-radio {
  flex: 1;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #2a2a30;
  border: 2px solid #333;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.progress-radio input {
  display: none;
}

.progress-radio:hover {
  border-color: #555;
  background: #333;
}

.progress-radio.active {
  background: rgba(66, 211, 146, 0.1);
  border-color: #42d392;
  color: #42d392;
}

.progress-radio .icon {
  font-size: 1.2rem;
}

.notes-section {
  position: relative;
}

textarea {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  color: #eee;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 150px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #42d392;
}

.save-status {
  position: absolute;
  bottom: -25px;
  right: 0;
  color: #42d392;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.save-status.visible {
  opacity: 1;
}

.not-found {
  text-align: center;
  padding: 5rem 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .progress-options {
    flex-direction: column;
  }
}
</style>

<template>
  <div class="dashboard">
    <div class="header-actions">
      <h2>Seznam Písniček</h2>
      <button @click="showAddModal = true" class="primary-btn">+ Přidat Písničku</button>
    </div>

    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        @click="currentFilter = filter.value"
        :class="['filter-btn', { active: currentFilter === filter.value }]"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="song-list" v-if="filteredSongs.length > 0">
      <div 
        v-for="song in filteredSongs" 
        :key="song.id" 
        class="song-card"
        @click="goToSong(song.id)"
      >
        <div class="song-info">
          <h3>{{ song.title }}</h3>
          <p class="artist">{{ song.artist }}</p>
        </div>
        <div class="song-status">
          <span :class="['badge', song.progress]">
            {{ progressLabels[song.progress] }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <p>Zatím tu žádné písničky nejsou (nebo nevyhovují filtru).</p>
    </div>

    <!-- Add Song Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>Nová Písnička</h3>
        <form @submit.prevent="handleAddSong">
          <div class="input-group">
            <label>Název:</label>
            <input v-model="newSong.title" required placeholder="Např. Wonderwall" />
          </div>
          <div class="input-group">
            <label>Interpret:</label>
            <input v-model="newSong.artist" required placeholder="Např. Oasis" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="secondary-btn">Zrušit</button>
            <button type="submit" class="primary-btn">Přidat</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSongbookStore } from '../store/songbook'

const store = useSongbookStore()
const router = useRouter()

const showAddModal = ref(false)
const newSong = ref({ title: '', artist: '' })
const currentFilter = ref('all')

const filters = [
  { label: 'Vše', value: 'all' },
  { label: 'K naučení', value: 'to-learn' },
  { label: 'Rozpracované', value: 'in-progress' },
  { label: 'Umíme', value: 'mastered' }
]

const progressLabels = {
  'to-learn': 'K naučení',
  'in-progress': 'Rozpracované',
  'mastered': 'Umíme'
}

const filteredSongs = computed(() => {
  if (currentFilter.value === 'all') return store.songs
  return store.songs.filter(s => s.progress === currentFilter.value)
})

const handleAddSong = () => {
  if (newSong.value.title && newSong.value.artist) {
    store.addSong({ ...newSong.value })
    showAddModal.value = false
    newSong.value = { title: '', artist: '' }
  }
}

const goToSong = (id) => {
  router.push(`/song/${id}`)
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions h2 {
  margin: 0;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filter-btn {
  background: #2a2a30;
  border: 1px solid #333;
  color: #ccc;
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #333;
}

.filter-btn.active {
  background: #42d392;
  color: #1a1a1a;
  border-color: #42d392;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.song-card {
  background: #1f1f23;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #2a2a30;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.song-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  border-color: #42d392;
}

.song-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.song-info .artist {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.to-learn {
  background: rgba(255, 90, 95, 0.2);
  color: #ff5a5f;
}

.badge.in-progress {
  background: rgba(255, 170, 0, 0.2);
  color: #ffaa00;
}

.badge.mastered {
  background: rgba(66, 211, 146, 0.2);
  color: #42d392;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #666;
  background: #1f1f23;
  border-radius: 12px;
  border: 1px dashed #333;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #242424;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  border: 1px solid #333;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ccc;
  font-size: 0.9rem;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: white;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #42d392;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-btn {
  background: #42d392;
  color: #1a1a1a;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
}

.primary-btn:hover {
  background: #3bb27e;
}

.secondary-btn {
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 0.6rem 1.2rem;
}

.secondary-btn:hover {
  background: #333;
  color: white;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

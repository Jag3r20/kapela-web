import { defineStore } from 'pinia'

export const useSongbookStore = defineStore('songbook', {
    state: () => ({
        songs: JSON.parse(localStorage.getItem('kapela_songs')) || [
            { id: 1, title: 'Smells Like Teen Spirit', artist: 'Nirvana', progress: 'mastered', notes: "Standard tuning, don't rush the intro" },
            { id: 2, title: 'Creep', artist: 'Radiohead', progress: 'in-progress', notes: 'Need to work on the dynamics in the chorus' },
            { id: 3, title: 'Seven Nation Army', artist: 'The White Stripes', progress: 'to-learn', notes: 'Bass line is key here' }
        ]
    }),
    actions: {
        saveToStorage() {
            localStorage.setItem('kapela_songs', JSON.stringify(this.songs))
        },
        addSong(song) {
            this.songs.push({
                ...song,
                id: Date.now(),
                progress: 'to-learn'
            })
            this.saveToStorage()
        },
        updateSongProgress(id, progress) {
            const song = this.songs.find(s => s.id === id)
            if (song) {
                song.progress = progress
                this.saveToStorage()
            }
        },
        updateSongNotes(id, notes) {
            const song = this.songs.find(s => s.id === id)
            if (song) {
                song.notes = notes
                this.saveToStorage()
            }
        },
        deleteSong(id) {
            const index = this.songs.findIndex(s => s.id === id)
            if (index !== -1) {
                this.songs.splice(index, 1)
                this.saveToStorage()
            }
        }
    },
    getters: {
        getSongById: (state) => (id) => {
            return state.songs.find(song => song.id === Number(id)) || null
        }
    }
})

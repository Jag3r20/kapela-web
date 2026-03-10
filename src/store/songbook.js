import { defineStore } from 'pinia'

export const useSongbookStore = defineStore('songbook', {
    state: () => ({
        songs: [],
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchSongs() {
            this.isLoading = true
            this.error = null
            try {
                const res = await fetch('/api/songs')
                if (!res.ok) throw new Error('Failed to fetch songs')
                this.songs = await res.json()
            } catch (err) {
                this.error = err.message
                console.error('fetchSongs:', err)
            } finally {
                this.isLoading = false
            }
        },
        async addSong(song) {
            this.error = null
            try {
                const res = await fetch('/api/songs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: song.title, artist: song.artist, notes: song.notes || '' }),
                })
                if (!res.ok) throw new Error('Failed to add song')
                const newSong = await res.json()
                this.songs.push(newSong)
            } catch (err) {
                this.error = err.message
                console.error('addSong:', err)
            }
        },
        async updateSongProgress(id, progress) {
            this.error = null
            try {
                const res = await fetch(`/api/songs/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ progress }),
                })
                if (!res.ok) throw new Error('Failed to update progress')
                const updated = await res.json()
                const idx = this.songs.findIndex(s => s.id === updated.id)
                if (idx !== -1) this.songs[idx] = updated
            } catch (err) {
                this.error = err.message
                console.error('updateSongProgress:', err)
            }
        },
        async updateSongNotes(id, notes) {
            this.error = null
            try {
                const res = await fetch(`/api/songs/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notes }),
                })
                if (!res.ok) throw new Error('Failed to update notes')
                const updated = await res.json()
                const idx = this.songs.findIndex(s => s.id === updated.id)
                if (idx !== -1) this.songs[idx] = updated
            } catch (err) {
                this.error = err.message
                console.error('updateSongNotes:', err)
            }
        },
        async deleteSong(id) {
            this.error = null
            try {
                const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' })
                if (!res.ok) throw new Error('Failed to delete song')
                const idx = this.songs.findIndex(s => s.id === id)
                if (idx !== -1) this.songs.splice(idx, 1)
            } catch (err) {
                this.error = err.message
                console.error('deleteSong:', err)
            }
        }
    },
    getters: {
        getSongById: (state) => (id) => {
            return state.songs.find(song => song.id === Number(id)) || null
        }
    }
})

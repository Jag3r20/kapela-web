// Local Express dev server simulating Vercel Serverless Functions
// Usage: node api-server.js
import 'dotenv/config'
import express from 'express'
import { readFileSync } from 'fs'

const app = express()
app.use(express.json())

// Dynamically load handler modules
async function loadHandler(path) {
    const mod = await import(path)
    return mod.default
}

// GET/POST /api/songs
app.all('/api/songs', async (req, res) => {
    const handler = await loadHandler('./api/songs.js')
    return handler(req, res)
})

// PATCH/DELETE /api/songs/:id
app.all('/api/songs/:id', async (req, res) => {
    req.query.id = req.params.id
    const handler = await loadHandler('./api/songs/[id].js')
    return handler(req, res)
})

// GET /api/init-db
app.get('/api/init-db', async (req, res) => {
    const handler = await loadHandler('./api/init-db.js')
    return handler(req, res)
})

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
    console.log(`🎸 API dev server running at http://localhost:${PORT}`)
    console.log(`   Init DB: http://localhost:${PORT}/api/init-db`)
})

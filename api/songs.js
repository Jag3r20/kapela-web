import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL)

    if (req.method === 'GET') {
        try {
            const songs = await sql`SELECT * FROM songs ORDER BY id ASC`
            return res.json(songs)
        } catch (err) {
            console.error('GET /api/songs error:', err)
            return res.status(500).json({ error: 'Failed to fetch songs' })
        }
    }

    if (req.method === 'POST') {
        const { title, artist, notes } = req.body
        if (!title || !artist) {
            return res.status(400).json({ error: 'title and artist are required' })
        }
        try {
            const [song] = await sql`
        INSERT INTO songs (title, artist, progress, notes)
        VALUES (${title}, ${artist}, 'to-learn', ${notes || ''})
        RETURNING *
      `
            return res.status(201).json(song)
        } catch (err) {
            console.error('POST /api/songs error:', err)
            return res.status(500).json({ error: 'Failed to add song' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}

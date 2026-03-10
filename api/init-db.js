import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const sql = neon(process.env.DATABASE_URL)

    try {
        // Create table if not exists
        await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id        SERIAL PRIMARY KEY,
        title     TEXT NOT NULL,
        artist    TEXT NOT NULL,
        progress  TEXT NOT NULL DEFAULT 'to-learn',
        notes     TEXT DEFAULT ''
      )
    `

        // Seed only if table is empty
        const [{ count }] = await sql`SELECT COUNT(*) AS count FROM songs`
        if (Number(count) === 0) {
            await sql`
        INSERT INTO songs (title, artist, progress, notes) VALUES
        ('Smells Like Teen Spirit', 'Nirvana',         'mastered',     'Standard tuning, don''t rush the intro'),
        ('Creep',                   'Radiohead',        'in-progress',  'Need to work on the dynamics in the chorus'),
        ('Seven Nation Army',       'The White Stripes','to-learn',     'Bass line is key here')
      `
        }

        return res.json({ ok: true, message: 'Database initialized successfully' })
    } catch (err) {
        console.error('init-db error:', err)
        return res.status(500).json({ error: err.message })
    }
}

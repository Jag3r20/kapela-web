import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL)
    const { id } = req.query

    if (!id) {
        return res.status(400).json({ error: 'Missing song id' })
    }

    if (req.method === 'PATCH') {
        const { progress, notes } = req.body
        const fields = []
        const values = []

        if (progress !== undefined) {
            fields.push(`progress = $${fields.length + 1}`)
            values.push(progress)
        }
        if (notes !== undefined) {
            fields.push(`notes = $${fields.length + 1}`)
            values.push(notes)
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' })
        }

        try {
            values.push(id)
            const query = `UPDATE songs SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`
            const result = await sql.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Song not found' })
            }
            return res.json(result.rows[0])
        } catch (err) {
            console.error('PATCH /api/songs/:id error:', err)
            return res.status(500).json({ error: 'Failed to update song' })
        }
    }

    if (req.method === 'DELETE') {
        try {
            const result = await sql.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id])
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Song not found' })
            }
            return res.json({ deleted: true, id: result.rows[0].id })
        } catch (err) {
            console.error('DELETE /api/songs/:id error:', err)
            return res.status(500).json({ error: 'Failed to delete song' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}

import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Minimal stub for transcription endpoint.
 * Accepts multipart/form-data with 'file' and returns a mock transcript.
 */

export const config = {
  api: {
    bodyParser: false
  }
}

import formidable from 'formidable'
import fs from 'fs'

const parseForm = (req: NextApiRequest) =>
  new Promise<{ filepath: string; originalFilename: string }>((resolve, reject) => {
    const form = formidable({ multiples: false })
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)
      // @ts-ignore
      const file = files.file
      if (!file) return reject(new Error('No file'))
      resolve({ filepath: file.filepath || file.path, originalFilename: file.originalFilename || file.name })
    })
  })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { filepath } = await parseForm(req)
    // NOTE: In production, you'd upload the file to S3 or send bytes to a speech-to-text provider.
    // For this starter, we'll return a placeholder transcript and delete the temporary file.
    const stats = fs.statSync(filepath)
    // Clean up file
    try { fs.unlinkSync(filepath) } catch (e) {}
    const mockTranscript = "This is a placeholder transcription of your recording. Replace this with your speech-to-text provider's result."
    return res.status(200).json({
      transcript: mockTranscript,
      duration_ms: 0,
      size_bytes: stats.size
    })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err?.message || 'Transcription failed' })
  }
}

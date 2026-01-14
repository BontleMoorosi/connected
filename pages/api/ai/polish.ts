// AI polishing endpoint (OpenAI stub + prompt templates).
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Body = {
  text: string
  mode?: 'grammar' | 'alluring' | 'tone' | 'concise'
  tone?: 'romantic' | 'trendy' | 'chic' | string
  max_tokens?: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const body = req.body as Body
  if (!body?.text) return res.status(400).json({ error: 'Missing text' })

  const mode = body.mode || 'alluring'
  const tone = body.tone || 'romantic'
  const promptBase = {
    grammar: `Correct grammar, punctuation, and fix typos while preserving the author's voice. Output only the corrected text.`,
    alluring: `Edit the text to make it more alluring, evocative, and romantic while preserving the author's voice. Keep length roughly similar unless a concise option is requested. Provide only the edited text.`,
    tone: `Adjust tone to be ${tone}. Keep the author's original meaning and key details. Output edited text only.`,
    concise: `Make the text more concise and clear while preserving meaning. Output edited text only.`
  } as Record<string, string>

  try {
    const systemPrompt = `You are an expert editor who helps authors refine romantic, trendy, and chic prose. Be mindful of preserving voice.`
    const userPrompt = `${promptBase[mode]} \n\nOriginal text:\n${body.text}`

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: body.max_tokens ?? 800,
      temperature: 0.8
    })

    const edited = resp.choices?.[0]?.message?.content || ''
    return res.status(200).json({ edited })
  } catch (err: any) {
    console.error('AI polish error', err)
    return res.status(500).json({ error: err?.message || 'AI request failed' })
  }
}

import { ALTCHA_API_KEY } from 'astro:env/server'
import { createChallenge } from 'altcha-lib'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    // Create a new challenge
    const challenge = await createChallenge({
      hmacKey: ALTCHA_API_KEY,
    })

    return new Response(JSON.stringify(challenge), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error creating Altcha challenge:', error)
    return new Response(JSON.stringify({ error: 'Failed to create challenge' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

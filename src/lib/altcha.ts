import { ALTCHA_API_KEY } from 'astro:env/server'
import { verifySolution } from 'altcha-lib'

interface AltchaVerificationResult {
  isValid: boolean
  error?: string
}

/**
 * Verifies Altcha challenge solution
 */
async function verifyAltcha(altchaPayload: string): Promise<AltchaVerificationResult> {
  if (!altchaPayload) {
    return {
      isValid: false,
      error: 'Please complete the security challenge.',
    }
  }

  try {
    // Verify the solution with the HMAC key
    // Note: verifySolution accepts either Base64-encoded string or object
    const isValid = await verifySolution(altchaPayload, ALTCHA_API_KEY)

    console.log('Altcha verification result:', isValid)

    if (!isValid) {
      return {
        isValid: false,
        error: 'Security challenge verification failed. Please try again.',
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Altcha verification error:', error)
    return {
      isValid: false,
      error: 'Security challenge verification failed. Please try again.',
    }
  }
}

/**
 * Checks message content for spam patterns
 */
function checkMessageContent(message: string): { isSpam: boolean; reason?: string } {
  if (!message) return { isSpam: false }

  const lowerMessage = message.toLowerCase()

  // 1. Check for common spam keywords
  const spamKeywords = [
    'crypto',
    'investment',
    'seo ranking',
    'google ranking',
    'casino',
    'forex',
    'bitcoin',
    'passive income',
    'financial freedom',
    'marketing service',
    'web design service',
    'work from home',
    'make money fast',
    'click here',
    'free gift',
    'limited time offer',
    'act now',
    'winner',
    'risk-free',
    'no obligation',
    'special promotion',
    'double your income',
    'easy money',
    '100% satisfied',
    'buy direct',
    'call now',
    'order today',
    'money back guarantee',
    'as seen on',
    'this is not a scam',
    'get paid to',
  ]

  if (spamKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    console.log('Spam detected: Keyword match')
    return { isSpam: true, reason: 'Spam content detected.' }
  }

  // 2. Check for excessive links (more than 3)
  const linkCount = (lowerMessage.match(/http/g) || []).length
  if (linkCount > 3) {
    console.log('Spam detected: Excessive links')
    return { isSpam: true, reason: 'Too many links detected.' }
  }

  // 3. Check for random alphanumeric strings (gibberish)
  // Catches spam like: "ZhKsTXNjhonNRLmJHtqfEN"
  // Checks for strings > 15 chars with no spaces or punctuation
  if (/^[a-zA-Z0-9]{15,}$/.test(message)) {
    console.log('Spam detected: Random alphanumeric string')
    return { isSpam: true, reason: 'Spam content detected.' }
  }

  return { isSpam: false }
}

/**
 * Checks name fields for spam patterns (gibberish)
 */
function checkNameContent(
  firstName: string,
  lastName: string,
): { isSpam: boolean; reason?: string } {
  // Check first name for gibberish (e.g. "PgTiKTEVJkUicgMmEQHtl")
  // Checks for strings > 15 chars with no spaces or punctuation
  if (firstName && /^[a-zA-Z0-9]{15,}$/.test(firstName)) {
    console.log('Spam detected: Gibberish first name')
    return { isSpam: true, reason: 'Spam content detected.' }
  }

  // Check last name for gibberish (e.g. "RxKGzrJKYlHmlbQo")
  if (lastName && /^[a-zA-Z0-9]{15,}$/.test(lastName)) {
    console.log('Spam detected: Gibberish last name')
    return { isSpam: true, reason: 'Spam content detected.' }
  }

  return { isSpam: false }
}

/**
 * Combined spam protection check including Altcha
 */
export async function checkSpamProtectionWithAltcha(
  formData: FormData,
): Promise<{ isSpam: boolean; reason?: string }> {
  // First verify Altcha
  const altchaPayload = formData.get('altcha') as string
  const altchaResult = await verifyAltcha(altchaPayload)

  if (!altchaResult.isValid) {
    return {
      isSpam: true,
      reason: altchaResult.error || 'Please complete the security challenge.',
    }
  }

  // Name field spam detection (Gibberish)
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  const nameCheck = checkNameContent(firstName, lastName)

  if (nameCheck.isSpam) {
    return nameCheck
  }

  // Content-based spam detection (Keywords, Links, Language)
  const message = formData.get('message') as string
  const messageCheck = checkMessageContent(message)

  if (messageCheck.isSpam) {
    return messageCheck
  }

  return { isSpam: false }
}

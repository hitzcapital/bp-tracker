const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export interface OCRResult {
  systolic: number
  diastolic: number
  pulse: number | null
  error?: string
}

export async function extractBPFromPhoto(file: File): Promise<OCRResult> {
  const base64 = await fileToBase64(file)

  const response = await fetch(`${SUPABASE_URL}/functions/v1/ocr-bp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ image: base64 }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `OCR request failed (${response.status})`)
  }

  const result = await response.json() as OCRResult
  if (result.error) {
    throw new Error(result.error)
  }

  return result
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      // Remove data URL prefix to get pure base64
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

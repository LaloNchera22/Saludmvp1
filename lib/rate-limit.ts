import { NextRequest, NextResponse } from 'next/server'

// Almacenamiento en memoria para rate limiting (funciona en desarrollo y entornos con estado)
// En producción serverless (Vercel Edge), considera usar Upstash Redis para persistencia
const ipRequestMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000 // 1 minuto
const MAX_REQUESTS = 20  // máximo 20 peticiones por IP por ventana

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const now = Date.now()
  const record = ipRequestMap.get(ip)

  if (!record || now > record.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return null
  }

  record.count++

  if (record.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((record.resetAt - now) / 1000)),
        },
      },
    )
  }

  return null
}

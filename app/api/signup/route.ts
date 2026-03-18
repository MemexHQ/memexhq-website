import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, company } = await request.json()

    if (!email || !company) {
      return NextResponse.json({ success: false, error: 'Email and company are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }

    if (!process.env.POSTGRES_URL) {
      console.log('Signup (dev mode):', { email, company })
      return NextResponse.json({ success: true })
    }

    const { sql } = await import('@vercel/postgres')

    await sql`
      CREATE TABLE IF NOT EXISTS signups (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        company VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    try {
      await sql`
        INSERT INTO signups (email, company)
        VALUES (${email}, ${company})
      `
    } catch (dbError: unknown) {
      if (dbError && typeof dbError === 'object' && 'code' in dbError && (dbError as { code: string }).code === '23505') {
        return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
      }
      throw dbError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save signup' }, { status: 500 })
  }
}

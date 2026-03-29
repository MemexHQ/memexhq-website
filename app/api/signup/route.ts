import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase env vars not configured — signup not persisted')
      return NextResponse.json({ success: true })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabase.from('signups').insert([{ email, company }])

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
      }
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Failed to save signup' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save signup' }, { status: 500 })
  }
}

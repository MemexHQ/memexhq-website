import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase BEFORE importing the route
const mockInsert = vi.fn()
const mockFrom = vi.fn(() => ({ insert: mockInsert }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')

// Dynamic import to allow mocks to be set up first
const getRoute = async () => {
  const module = await import('@/app/api/signup/route')
  return module.POST
}

// Helper to create mock request
const createRequest = (body: object) => {
  return new NextRequest('http://localhost/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/signup', () => {
  let POST: typeof import('@/app/api/signup/route').POST

  beforeEach(async () => {
    vi.clearAllMocks()
    mockFrom.mockReturnValue({ insert: mockInsert })
    POST = await getRoute()
  })

  describe('Input Validation', () => {
    it('should return 400 when email is missing', async () => {
      const request = createRequest({ company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('required')
    })

    it('should return 400 when company is missing', async () => {
      const request = createRequest({ email: 'test@example.com' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('required')
    })

    it('should return 400 when both email and company are missing', async () => {
      const request = createRequest({})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 when email is empty string', async () => {
      const request = createRequest({ email: '', company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 when company is empty string', async () => {
      const request = createRequest({ email: 'test@example.com', company: '' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('Email Validation', () => {
    it('should return 400 for email without @ symbol', async () => {
      const request = createRequest({ email: 'invalid-email', company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid email')
    })

    it('should return 400 for email without domain', async () => {
      const request = createRequest({ email: 'user@', company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid email')
    })

    it('should return 400 for email without TLD', async () => {
      const request = createRequest({ email: 'user@domain', company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid email')
    })

    it('should return 400 for email with spaces', async () => {
      const request = createRequest({ email: 'user @example.com', company: 'Test Corp' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid email')
    })

    it('should accept valid email format (user@domain.com)', async () => {
      mockInsert.mockResolvedValue({ error: null })
      const request = createRequest({ email: 'user@domain.com', company: 'Test Corp' })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should accept emails with subdomains', async () => {
      mockInsert.mockResolvedValue({ error: null })
      const request = createRequest({ email: 'user@sub.domain.com', company: 'Test Corp' })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should accept emails with + sign', async () => {
      mockInsert.mockResolvedValue({ error: null })
      const request = createRequest({ email: 'user+tag@domain.com', company: 'Test Corp' })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Successful Signup', () => {
    it('should return 200 with success:true for valid data', async () => {
      mockInsert.mockResolvedValue({ error: null })
      const request = createRequest({
        email: 'test@example.com',
        company: 'Test Corp',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should call supabase.from("signups").insert() with correct data', async () => {
      mockInsert.mockResolvedValue({ error: null })
      const request = createRequest({
        email: 'test@example.com',
        company: 'Test Corp',
      })
      await POST(request)

      expect(mockFrom).toHaveBeenCalledWith('signups')
      expect(mockInsert).toHaveBeenCalledWith([
        { email: 'test@example.com', company: 'Test Corp' }
      ])
    })
  })

  describe('Duplicate Handling', () => {
    it('should return 409 when email already exists', async () => {
      mockInsert.mockResolvedValue({
        error: { code: '23505', message: 'duplicate key' }
      })
      const request = createRequest({
        email: 'existing@example.com',
        company: 'Test Corp',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
    })

    it('should return "Email already registered" message for duplicates', async () => {
      mockInsert.mockResolvedValue({
        error: { code: '23505', message: 'duplicate key' }
      })
      const request = createRequest({
        email: 'existing@example.com',
        company: 'Test Corp',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(data.error).toBe('Email already registered')
    })
  })

  describe('No Supabase configuration', () => {
    it('should return 200 without calling Supabase when env vars are missing', async () => {
      vi.unstubAllEnvs()
      vi.resetModules()
      const { createClient } = await import('@supabase/supabase-js')
      const { POST: POSTNoEnv } = await import('@/app/api/signup/route')
      const request = createRequest({ email: 'test@example.com', company: 'Test Corp' })
      const response = await POSTNoEnv(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(createClient).not.toHaveBeenCalled()

      // Restore env vars for subsequent tests
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
      vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')
    })
  })

  describe('Error Handling', () => {
    it('should return 500 on Supabase connection failure', async () => {
      mockInsert.mockResolvedValue({
        error: { code: 'CONNECTION_ERROR', message: 'Connection failed' }
      })
      const request = createRequest({
        email: 'test@example.com',
        company: 'Test Corp',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to save signup')
    })

    it('should return 500 for unknown Supabase errors', async () => {
      mockInsert.mockResolvedValue({
        error: { code: 'UNKNOWN', message: 'Something went wrong' }
      })
      const request = createRequest({
        email: 'test@example.com',
        company: 'Test Corp',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should return 500 on malformed JSON request', async () => {
      const request = new NextRequest('http://localhost/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

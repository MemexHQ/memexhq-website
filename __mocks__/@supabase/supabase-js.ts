import { vi } from 'vitest'

export const mockSupabaseInsert = vi.fn()
export const mockSupabaseFrom = vi.fn(() => ({
  insert: mockSupabaseInsert,
}))

export const createClient = vi.fn(() => ({
  from: mockSupabaseFrom,
}))

// Helper to reset mocks between tests
export const resetSupabaseMocks = () => {
  mockSupabaseInsert.mockReset()
  mockSupabaseFrom.mockReset()
  mockSupabaseFrom.mockReturnValue({ insert: mockSupabaseInsert })
}

// Helper to simulate successful insert
export const mockSuccessfulInsert = () => {
  mockSupabaseInsert.mockResolvedValue({ error: null })
}

// Helper to simulate duplicate error
export const mockDuplicateError = () => {
  mockSupabaseInsert.mockResolvedValue({
    error: { code: '23505', message: 'duplicate key' }
  })
}

// Helper to simulate generic error
export const mockGenericError = () => {
  mockSupabaseInsert.mockResolvedValue({
    error: { code: 'UNKNOWN', message: 'Unknown error' }
  })
}

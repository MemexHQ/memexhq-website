import { vi } from 'vitest'

export const saveAs = vi.fn()

export const resetFileSaverMocks = () => {
  saveAs.mockReset()
}

import { vi } from 'vitest'

const mockFile = vi.fn()
const mockGenerateAsync = vi.fn(() =>
  Promise.resolve(new Blob(['mock-zip'], { type: 'application/zip' }))
)

// Create a mock JSZip class
class MockJSZip {
  file = mockFile
  generateAsync = mockGenerateAsync
}

export default MockJSZip
export { mockFile, mockGenerateAsync }

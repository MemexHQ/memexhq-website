import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true })

// Mock Canvas 2D Context
const mockContext2D = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  scale: vi.fn(),
  drawImage: vi.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
}

HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
  if (type === '2d') return mockContext2D
  return null
}) as unknown as typeof HTMLCanvasElement.prototype.getContext

HTMLCanvasElement.prototype.toBlob = vi.fn(function(callback: BlobCallback) {
  callback(new Blob(['mock-png-data'], { type: 'image/png' }))
})

// Mock Image class
class MockImage {
  onload: (() => void) | null = null
  onerror: ((e: Error) => void) | null = null
  src = ''
  width = 100
  height = 100

  constructor() {
    setTimeout(() => this.onload?.(), 0)
  }
}
vi.stubGlobal('Image', MockImage)

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    // Store callback for potential testing
  }
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// Mock URL methods - keep the original URL constructor but add static methods
const OriginalURL = globalThis.URL
vi.spyOn(OriginalURL, 'createObjectURL').mockReturnValue('blob:mock-url')
vi.spyOn(OriginalURL, 'revokeObjectURL').mockImplementation(() => {})

// Mock requestAnimationFrame
let rafId = 0
vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
  rafId++
  return rafId
}))
vi.stubGlobal('cancelAnimationFrame', vi.fn())

// Mock fetch
vi.stubGlobal('fetch', vi.fn())

// Reset mocks before each test
beforeEach(() => {
  rafId = 0
  vi.mocked(fetch).mockReset()
})

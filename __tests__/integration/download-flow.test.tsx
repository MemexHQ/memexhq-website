import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Use vi.hoisted to ensure mocks are defined before vi.mock runs
const { mockFile, mockGenerateAsync, mockSaveAs } = vi.hoisted(() => ({
  mockFile: vi.fn(),
  mockGenerateAsync: vi.fn(() =>
    Promise.resolve(new Blob(['mock-zip'], { type: 'application/zip' }))
  ),
  mockSaveAs: vi.fn(),
}))

vi.mock('jszip', () => ({
  default: class MockJSZip {
    file = mockFile
    generateAsync = mockGenerateAsync
  },
}))

vi.mock('file-saver', () => ({
  saveAs: mockSaveAs,
}))

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Import after mocks
import BrandPage from '@/app/brand/page'

describe('Download Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFile.mockClear()
    mockGenerateAsync.mockClear()
    mockSaveAs.mockClear()
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'),
    })
  })

  describe('Download All Assets Flow', () => {
    it('should download all assets as ZIP', async () => {
      render(<BrandPage />)

      const downloadAllButton = screen.getByText('Download all assets')
      await userEvent.click(downloadAllButton)

      await waitFor(() => {
        // Should fetch SVG files
        expect(mockFetch).toHaveBeenCalled()
      }, { timeout: 3000 })

      await waitFor(() => {
        // Should save the ZIP file
        expect(mockSaveAs).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('should create ZIP with correct filename', async () => {
      render(<BrandPage />)

      const downloadAllButton = screen.getByText('Download all assets')
      await userEvent.click(downloadAllButton)

      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalledWith(
          expect.any(Blob),
          'memexhq-brand.zip'
        )
      }, { timeout: 3000 })
    })
  })

  describe('Individual SVG Download Flow', () => {
    it('should download individual SVG file', async () => {
      const mockClick = vi.fn()
      const originalCreateElement = document.createElement.bind(document)
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName)
        if (tagName === 'a') {
          element.click = mockClick
        }
        return element
      })

      render(<BrandPage />)

      const svgButtons = screen.getAllByRole('button', { name: 'SVG' })
      await userEvent.click(svgButtons[0])

      expect(mockClick).toHaveBeenCalled()

      vi.restoreAllMocks()
    })
  })

  describe('Individual PNG Download Flow', () => {
    it('should convert SVG to PNG and download', async () => {
      render(<BrandPage />)

      const pngButtons = screen.getAllByRole('button', { name: 'PNG' })
      await userEvent.click(pngButtons[0])

      await waitFor(() => {
        // Should fetch the SVG
        expect(mockFetch).toHaveBeenCalled()
      })

      await waitFor(() => {
        // Should save the PNG
        expect(mockSaveAs).toHaveBeenCalled()
      }, { timeout: 3000 })
    })
  })

  describe('Multiple Downloads', () => {
    it('should allow multiple sequential downloads', async () => {
      render(<BrandPage />)

      const svgButtons = screen.getAllByRole('button', { name: 'SVG' })

      // First download
      const mockClick = vi.fn()
      const originalCreateElement = document.createElement.bind(document)
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName)
        if (tagName === 'a') {
          element.click = mockClick
        }
        return element
      })

      await userEvent.click(svgButtons[0])
      expect(mockClick).toHaveBeenCalledTimes(1)

      // Second download
      await userEvent.click(svgButtons[1])
      expect(mockClick).toHaveBeenCalledTimes(2)

      vi.restoreAllMocks()
    })
  })
})

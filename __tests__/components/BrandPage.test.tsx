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

// Mock fetch for SVG fetching
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Import after mocks
import BrandPage from '@/app/brand/page'

describe('BrandPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFile.mockClear()
    mockGenerateAsync.mockClear()
    mockSaveAs.mockClear()
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve('<svg></svg>'),
    })
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<BrandPage />)
      expect(document.body).toBeTruthy()
    })

    it('should render brand page title', () => {
      render(<BrandPage />)
      expect(screen.getByText('Brand guidelines')).toBeInTheDocument()
    })

    it('should render brand subtitle', () => {
      render(<BrandPage />)
      expect(screen.getByText(/Resources and assets/)).toBeInTheDocument()
    })

    it('should render download all button', () => {
      render(<BrandPage />)
      expect(screen.getByText('Download all assets')).toBeInTheDocument()
    })

    it('should render dark background logo section', () => {
      render(<BrandPage />)
      expect(screen.getByText('Logo — Dark background')).toBeInTheDocument()
    })

    it('should render light background logo section', () => {
      render(<BrandPage />)
      expect(screen.getByText('Logo — Light background')).toBeInTheDocument()
    })

    it('should render colors section', () => {
      render(<BrandPage />)
      expect(screen.getByText('Colors')).toBeInTheDocument()
    })

    it('should render typography section', () => {
      render(<BrandPage />)
      expect(screen.getByText('Typography')).toBeInTheDocument()
    })

    it('should render favicon section', () => {
      render(<BrandPage />)
      expect(screen.getByText('Favicon')).toBeInTheDocument()
    })

    it('should render all color swatches', () => {
      render(<BrandPage />)
      expect(screen.getByText('#00e5a0')).toBeInTheDocument()
      expect(screen.getByText('#00a86b')).toBeInTheDocument()
      expect(screen.getByText('#0066ff')).toBeInTheDocument()
      expect(screen.getByText('#ff6b35')).toBeInTheDocument()
      expect(screen.getByText('#07090c')).toBeInTheDocument()
    })

    it('should render typography samples', () => {
      render(<BrandPage />)
      expect(screen.getByText('Fraunces')).toBeInTheDocument()
      expect(screen.getByText('DM Mono')).toBeInTheDocument()
    })

    it('should render canvas element', () => {
      render(<BrandPage />)
      const canvas = document.getElementById('bg-canvas')
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Asset Cards', () => {
    it('should render logo + wordmark dark asset', () => {
      render(<BrandPage />)
      const assetNames = screen.getAllByText('Logo + wordmark')
      expect(assetNames.length).toBeGreaterThanOrEqual(2)
    })

    it('should render logo mark only assets', () => {
      render(<BrandPage />)
      const assetNames = screen.getAllByText('Logo mark only')
      expect(assetNames.length).toBeGreaterThanOrEqual(2)
    })

    it('should render favicon asset', () => {
      render(<BrandPage />)
      expect(screen.getByText('Favicon (32×32)')).toBeInTheDocument()
    })
  })

  describe('Download Buttons', () => {
    it('should render SVG download buttons', () => {
      render(<BrandPage />)
      const svgButtons = screen.getAllByRole('button', { name: 'SVG' })
      expect(svgButtons.length).toBeGreaterThanOrEqual(5)
    })

    it('should render PNG download buttons', () => {
      render(<BrandPage />)
      const pngButtons = screen.getAllByRole('button', { name: 'PNG' })
      expect(pngButtons.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Download All Function', () => {
    it('should call saveAs when download all clicked', async () => {
      render(<BrandPage />)
      const downloadAllButton = screen.getByText('Download all assets')

      await userEvent.click(downloadAllButton)

      await waitFor(() => {
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

    it('should fetch SVG files for download', async () => {
      render(<BrandPage />)
      const downloadAllButton = screen.getByText('Download all assets')

      await userEvent.click(downloadAllButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })
  })

  describe('SVG Download', () => {
    it('should trigger SVG download when SVG button clicked', async () => {
      // Mock createElement to capture anchor element
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

  describe('PNG Download', () => {
    it('should trigger PNG download when PNG button clicked', async () => {
      render(<BrandPage />)
      const pngButtons = screen.getAllByRole('button', { name: 'PNG' })

      await userEvent.click(pngButtons[0])

      // PNG download involves fetch and saveAs
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })
  })

  describe('Canvas Animation', () => {
    it('should initialize canvas on mount', () => {
      render(<BrandPage />)
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement

      expect(canvas.getContext).toHaveBeenCalledWith('2d')
    })

    it('should call requestAnimationFrame on mount', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

      render(<BrandPage />)

      expect(rafSpy).toHaveBeenCalled()
    })

    it('should set canvas dimensions based on window size', () => {
      render(<BrandPage />)
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement

      expect(canvas.width).toBe(1024)
      expect(canvas.height).toBe(768)
    })
  })

  describe('Color Information', () => {
    it('should display accent teal color information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Accent / Teal (dark)')).toBeInTheDocument()
      expect(screen.getByText('Accent / Teal (light)')).toBeInTheDocument()
    })

    it('should display accent blue color information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Accent / Blue')).toBeInTheDocument()
    })

    it('should display accent orange color information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Accent / Orange')).toBeInTheDocument()
    })

    it('should display background colors information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Background (dark)')).toBeInTheDocument()
      expect(screen.getByText('Background (light)')).toBeInTheDocument()
    })

    it('should display surface colors information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Surface (dark)')).toBeInTheDocument()
      expect(screen.getByText('Surface (light)')).toBeInTheDocument()
    })

    it('should display text colors information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Text (dark)')).toBeInTheDocument()
      expect(screen.getByText('Text (light)')).toBeInTheDocument()
    })
  })

  describe('Typography Information', () => {
    it('should display Fraunces font information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Display / Headings')).toBeInTheDocument()
    })

    it('should display DM Mono font information', () => {
      render(<BrandPage />)
      expect(screen.getByText('Body / Interface')).toBeInTheDocument()
    })

    it('should display Google Fonts source', () => {
      render(<BrandPage />)
      const fontMeta = screen.getAllByText(/Google Fonts/)
      expect(fontMeta.length).toBeGreaterThanOrEqual(2)
    })
  })
})

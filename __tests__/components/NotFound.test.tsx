import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

describe('NotFound', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<NotFound />)
      expect(document.body).toBeTruthy()
    })

    it('should render 404 heading', () => {
      render(<NotFound />)
      expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('should render "Page not found" message', () => {
      render(<NotFound />)
      expect(screen.getByText('Page not found')).toBeInTheDocument()
    })

    it('should render link back to home', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to home/i })
      expect(link).toBeInTheDocument()
    })

    it('should have correct href on home link', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to home/i })
      expect(link).toHaveAttribute('href', '/')
    })
  })

  describe('Styling', () => {
    it('should have centered layout', () => {
      render(<NotFound />)
      const container = screen.getByText('404').parentElement
      expect(container).toHaveStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center' })
    })

    it('should fill viewport height', () => {
      render(<NotFound />)
      const container = screen.getByText('404').parentElement
      expect(container).toHaveStyle({ minHeight: '100vh' })
    })

    it('should render 404 with large font size', () => {
      render(<NotFound />)
      const heading = screen.getByText('404')
      expect(heading).toHaveStyle({ fontSize: '48px' })
    })
  })
})

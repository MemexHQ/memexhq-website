import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RootLayout, { metadata } from '@/app/layout'

// Mock @vercel/analytics
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics">Analytics</div>,
}))

describe('RootLayout', () => {
  beforeEach(() => {
    // Reset env
    vi.unstubAllEnvs()
  })

  describe('Metadata', () => {
    it('should export correct title', () => {
      expect(metadata.title).toBe('MemexHQ — Your AI finally knows your business.')
    })

    it('should export correct description', () => {
      expect(metadata.description).toContain('Every meeting, commit, sales call')
    })

    it('should include "context layer" in description', () => {
      expect(metadata.description).toContain('context layer')
    })
  })

  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(
        <RootLayout>
          <div data-testid="child-content">Test Child</div>
        </RootLayout>
      )

      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <RootLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </RootLayout>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('HTML Structure', () => {
    it('should have body element', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      expect(document.body).toBeTruthy()
    })
  })

  describe('Analytics', () => {
    it('should not render Analytics when NEXT_PUBLIC_VERCEL_URL is not set', () => {
      vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', '')

      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument()
    })

    it('should render Analytics when NEXT_PUBLIC_VERCEL_URL is set', () => {
      vi.stubEnv('NEXT_PUBLIC_VERCEL_URL', 'https://example.vercel.app')

      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument()
    })
  })

  describe('Head Elements', () => {
    it('should include favicon link', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      const favicon = document.querySelector('link[rel="icon"]')
      expect(favicon).toBeTruthy()
      expect(favicon).toHaveAttribute('href', '/components/favicon.svg')
    })

    it('should include Google Fonts preconnect', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      const preconnect = document.querySelector('link[rel="preconnect"]')
      expect(preconnect).toBeTruthy()
      expect(preconnect).toHaveAttribute('href', 'https://fonts.googleapis.com')
    })

    it('should include Google Fonts stylesheet', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      )

      const stylesheet = document.querySelector('link[href*="fonts.googleapis.com/css2"]')
      expect(stylesheet).toBeTruthy()
    })
  })
})

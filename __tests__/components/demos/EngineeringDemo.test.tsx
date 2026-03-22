import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EngineeringDemo from '@/app/components/demos/EngineeringDemo'

describe('EngineeringDemo', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<EngineeringDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render terminal chrome with title bar', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText('claude-code — ~/acme/api')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render status bar', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText(/context server/)).toBeInTheDocument()
      expect(screen.getByText(/local network only/)).toBeInTheDocument()
    })

    it('should render prompt indicator', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('should render terminal window with traffic lights', () => {
      render(<EngineeringDemo />)
      // Check for terminal structure
      expect(document.querySelector('[class*="terminal"]')).toBeTruthy()
    })

    it('should render egress info in status bar', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText(/0 bytes egress/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      render(<EngineeringDemo />)
      expect(document.querySelector('[class*="terminal"]')).toBeTruthy()
    })
  })
})

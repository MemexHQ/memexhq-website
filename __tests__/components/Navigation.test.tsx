import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navigation from '@/app/components/Navigation'

describe('Navigation', () => {
  describe('Rendering', () => {
    it('should render the navigation element', () => {
      render(<Navigation />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render the MemexHQ logo link', () => {
      render(<Navigation />)
      const logoLink = screen.getByRole('link', { name: /memexhq/i })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should render the logo SVG', () => {
      render(<Navigation />)
      const svg = document.querySelector('.logo-mark svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render How it works link', () => {
      render(<Navigation />)
      const link = screen.getByRole('link', { name: /how it works/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/#how')
    })

    it('should render Demo link', () => {
      render(<Navigation />)
      const link = screen.getByRole('link', { name: /demo/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/#demo')
    })

    it('should render Integrations link', () => {
      render(<Navigation />)
      const link = screen.getByRole('link', { name: /integrations/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/#integrations')
    })

    it('should render Context nodes link', () => {
      render(<Navigation />)
      const link = screen.getByRole('link', { name: /context nodes/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/#nodes')
    })

    it('should render Blog link', () => {
      render(<Navigation />)
      const link = screen.getByRole('link', { name: /blog/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/blog')
    })

    it('should have 5 navigation links', () => {
      render(<Navigation />)
      const navLinks = document.querySelector('.nav-links')
      expect(navLinks).toBeInTheDocument()
      const links = navLinks?.querySelectorAll('li')
      expect(links).toHaveLength(5)
    })
  })

  describe('CTA Button', () => {
    it('should render Get Notified CTA', () => {
      render(<Navigation />)
      const cta = screen.getByRole('link', { name: /get notified/i })
      expect(cta).toBeInTheDocument()
      expect(cta).toHaveAttribute('href', '/#signup')
      expect(cta).toHaveClass('nav-cta')
    })
  })

  describe('CSS Classes', () => {
    it('should have nav-logo class on logo', () => {
      render(<Navigation />)
      const logo = screen.getByRole('link', { name: /memexhq/i })
      expect(logo).toHaveClass('nav-logo')
    })

    it('should have nav-links class on links container', () => {
      render(<Navigation />)
      const navLinks = document.querySelector('.nav-links')
      expect(navLinks).toBeInTheDocument()
    })

    it('should have nav-right class on right container', () => {
      render(<Navigation />)
      const navRight = document.querySelector('.nav-right')
      expect(navRight).toBeInTheDocument()
    })
  })
})

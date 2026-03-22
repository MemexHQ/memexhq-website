import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/app/components/Footer'

describe('Footer', () => {
  describe('Rendering', () => {
    it('should render the footer element', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should render the MemexHQ logo', () => {
      render(<Footer />)
      const logoLink = screen.getByRole('link', { name: /memexhq/i })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should render the tagline', () => {
      render(<Footer />)
      // Multiple elements contain this text, so use getAllByText
      const taglines = screen.getAllByText(/your ai finally knows your business/i)
      expect(taglines.length).toBeGreaterThan(0)
    })
  })

  describe('Product Links', () => {
    it('should render Product section heading', () => {
      render(<Footer />)
      expect(screen.getByRole('heading', { name: /product/i })).toBeInTheDocument()
    })

    it('should render How it works link', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link', { name: /how it works/i })
      const footerLink = links.find(link => link.getAttribute('href') === '/#how')
      expect(footerLink).toBeInTheDocument()
    })

    it('should render Demo link', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link', { name: /demo/i })
      const footerLink = links.find(link => link.getAttribute('href') === '/#demo')
      expect(footerLink).toBeInTheDocument()
    })

    it('should render Integrations link', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link', { name: /integrations/i })
      const footerLink = links.find(link => link.getAttribute('href') === '/#integrations')
      expect(footerLink).toBeInTheDocument()
    })
  })

  describe('Company Links', () => {
    it('should render Company section heading', () => {
      render(<Footer />)
      expect(screen.getByRole('heading', { name: /company/i })).toBeInTheDocument()
    })

    it('should render About link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    })

    it('should render Blog link pointing to /blog', () => {
      render(<Footer />)
      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      expect(blogLink).toBeInTheDocument()
      expect(blogLink).toHaveAttribute('href', '/blog')
    })

    it('should render Careers link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /careers/i })).toBeInTheDocument()
    })

    it('should render Contact link with mailto', () => {
      render(<Footer />)
      const contactLink = screen.getByRole('link', { name: /contact/i })
      expect(contactLink).toBeInTheDocument()
      expect(contactLink).toHaveAttribute('href', 'mailto:darius.singh@memexhq.dev')
    })
  })

  describe('Legal Links', () => {
    it('should render Legal section heading', () => {
      render(<Footer />)
      expect(screen.getByRole('heading', { name: /legal/i })).toBeInTheDocument()
    })

    it('should render Privacy Policy link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
    })

    it('should render Terms of Service link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument()
    })

    it('should render Security link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /security/i })).toBeInTheDocument()
    })

    it('should render GDPR link', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /gdpr/i })).toBeInTheDocument()
    })
  })

  describe('Footer Bottom', () => {
    it('should render copyright text', () => {
      render(<Footer />)
      expect(screen.getByText(/© 2026 memexhq/i)).toBeInTheDocument()
    })

    it('should render domain', () => {
      render(<Footer />)
      expect(screen.getByText(/memexhq\.dev/i)).toBeInTheDocument()
    })
  })

  describe('CSS Classes', () => {
    it('should have footer-top class', () => {
      render(<Footer />)
      expect(document.querySelector('.footer-top')).toBeInTheDocument()
    })

    it('should have footer-bottom class', () => {
      render(<Footer />)
      expect(document.querySelector('.footer-bottom')).toBeInTheDocument()
    })

    it('should have footer-brand class', () => {
      render(<Footer />)
      expect(document.querySelector('.footer-brand')).toBeInTheDocument()
    })

    it('should have footer-col classes', () => {
      render(<Footer />)
      const cols = document.querySelectorAll('.footer-col')
      expect(cols).toHaveLength(3)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('HomePage', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Home />)
      expect(document.body).toBeTruthy()
    })

    it('should render hero section with title', () => {
      render(<Home />)
      expect(screen.getByText('Your AI')).toBeInTheDocument()
      // Use getAllByText since "finally knows" appears in both hero and elsewhere
      const finallyKnowsElements = screen.getAllByText(/finally knows/)
      expect(finallyKnowsElements.length).toBeGreaterThan(0)
      expect(screen.getByText('your business.')).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      render(<Home />)
      // Use getAllByText since there might be multiple elements with same text
      const howLinks = screen.getAllByText('How it works')
      expect(howLinks.length).toBeGreaterThan(0)
    })

    it('should render canvas element', () => {
      render(<Home />)
      const canvas = document.getElementById('bg-canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas?.tagName).toBe('CANVAS')
    })

    it('should render footer sections', () => {
      render(<Home />)
      // Footer has Product, Company, Legal sections
      const productHeadings = screen.getAllByRole('heading', { level: 5 })
      expect(productHeadings.length).toBeGreaterThan(0)
    })

    it('should render hero subtitle', () => {
      render(<Home />)
      expect(screen.getByText(/Every meeting, commit, sales call/)).toBeInTheDocument()
    })

    it('should render call-to-action buttons', () => {
      render(<Home />)
      const ctaButtons = screen.getAllByText(/Get Notified/)
      expect(ctaButtons.length).toBeGreaterThan(0)
    })

    it('should render integration logos section', () => {
      render(<Home />)
      expect(screen.getByText('Works with your entire stack')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show email error when submitting empty email', async () => {
      render(<Home />)
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.click(submitButton)

      expect(screen.getByText('Please enter a valid email.')).toBeVisible()
    })

    it('should show email error for invalid email format', async () => {
      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'invalid-email')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      expect(screen.getByText('Please enter a valid email.')).toBeVisible()
    })

    it('should show company error when submitting empty company', async () => {
      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.click(submitButton)

      expect(screen.getByText('Please enter your company or project name.')).toBeVisible()
    })

    it('should show both errors when both fields are invalid', async () => {
      render(<Home />)
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.click(submitButton)

      expect(screen.getByText('Please enter a valid email.')).toBeVisible()
      expect(screen.getByText('Please enter your company or project name.')).toBeVisible()
    })
  })

  describe('Form Submission', () => {
    it('should show success message after successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      })

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText("You're on the list.")).toBeInTheDocument()
      })
    })

    it('should show "Sending..." during submission', async () => {
      // Create a promise that doesn't resolve immediately
      let resolvePromise: (value: unknown) => void
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockFetch.mockReturnValueOnce(pendingPromise)

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      expect(screen.getByText('Sending…')).toBeInTheDocument()

      // Cleanup
      resolvePromise!({ json: () => Promise.resolve({ success: true }) })
    })

    it('should disable submit button while submitting', async () => {
      let resolvePromise: (value: unknown) => void
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockFetch.mockReturnValueOnce(pendingPromise)

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      expect(submitButton).toBeDisabled()

      // Cleanup
      resolvePromise!({ json: () => Promise.resolve({ success: true }) })
    })

    it('should call fetch with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      })

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      expect(mockFetch).toHaveBeenCalledWith('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          company: 'Test Company',
        }),
      })
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Server error' }),
      })

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      // Should not show success message
      await waitFor(() => {
        expect(screen.queryByText("You're on the list.")).not.toBeInTheDocument()
      })
    })

    it('should handle network failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Company')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Signup error:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Tab Switching (Demo Section)', () => {
    it('should show engineering tab by default', () => {
      render(<Home />)
      expect(screen.getByText(/implement rate limiting/)).toBeInTheDocument()
    })

    it('should switch to marketing demo when marketing tab clicked', async () => {
      render(<Home />)
      const marketingTab = screen.getByRole('button', { name: /Marketing/i })

      await userEvent.click(marketingTab)

      expect(screen.getByText(/LinkedIn post/)).toBeInTheDocument()
    })

    it('should switch to sales demo when sales tab clicked', async () => {
      render(<Home />)
      const salesTab = screen.getByRole('button', { name: /Sales/i })

      await userEvent.click(salesTab)

      // Sales demo has "Acme Corp" in the prompt
      expect(screen.getByText(/prep me for tomorrow/)).toBeInTheDocument()
    })

    it('should switch to product demo when product tab clicked', async () => {
      render(<Home />)
      const productTab = screen.getByRole('button', { name: /Product/i })

      await userEvent.click(productTab)

      expect(screen.getByText(/write the PRD/)).toBeInTheDocument()
    })

    it('should switch to devops demo when devops tab clicked', async () => {
      render(<Home />)
      const devopsTab = screen.getByRole('button', { name: /DevOps/i })

      await userEvent.click(devopsTab)

      expect(screen.getByText(/production go down/)).toBeInTheDocument()
    })

    it('should switch to onboarding demo when onboarding tab clicked', async () => {
      render(<Home />)
      const onboardingTab = screen.getByRole('button', { name: /HR \/ Onboarding/i })

      await userEvent.click(onboardingTab)

      expect(screen.getByText(/onboarding plan/)).toBeInTheDocument()
    })

    it('should apply active class to selected tab', async () => {
      render(<Home />)
      const marketingTab = screen.getByRole('button', { name: /Marketing/i })

      await userEvent.click(marketingTab)

      expect(marketingTab.classList.contains('active')).toBe(true)
    })
  })

  describe('Canvas Animation', () => {
    it('should initialize canvas with correct dimensions', () => {
      render(<Home />)
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement

      expect(canvas.width).toBe(1024) // window.innerWidth mock value
      expect(canvas.height).toBe(768) // window.innerHeight mock value
    })

    it('should call requestAnimationFrame on mount', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

      render(<Home />)

      expect(rafSpy).toHaveBeenCalled()
    })

    it('should get canvas 2D context', () => {
      render(<Home />)
      const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement

      expect(canvas.getContext).toHaveBeenCalledWith('2d')
    })
  })

  describe('IntersectionObserver', () => {
    it('should create IntersectionObserver on mount', () => {
      const ioSpy = vi.spyOn(window, 'IntersectionObserver' as never)

      render(<Home />)

      expect(ioSpy).toHaveBeenCalled()
    })
  })

  describe('Form Elements', () => {
    it('should have email input with correct attributes', () => {
      render(<Home />)
      const emailInput = screen.getByPlaceholderText('you@company.com')

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
    })

    it('should have company input with correct attributes', () => {
      render(<Home />)
      const companyInput = screen.getByPlaceholderText('Acme Corp')

      expect(companyInput).toHaveAttribute('type', 'text')
      expect(companyInput).toHaveAttribute('name', 'company')
    })

    it('should have proper labels for form inputs', () => {
      render(<Home />)

      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Company / Project')).toBeInTheDocument()
    })
  })

  describe('Problem Section', () => {
    it('should render problem section', () => {
      render(<Home />)
      expect(screen.getByText('The problem')).toBeInTheDocument()
    })

    it('should render problem cards', () => {
      render(<Home />)
      expect(screen.getByText('Zero institutional memory')).toBeInTheDocument()
      expect(screen.getByText('Constant re-explanation')).toBeInTheDocument()
      expect(screen.getByText('Expensive mistakes')).toBeInTheDocument()
      expect(screen.getByText('Siloed knowledge')).toBeInTheDocument()
    })
  })

  describe('Context Nodes Section', () => {
    it('should render GitHub context node', () => {
      render(<Home />)
      expect(screen.getByText('GitHub Repos & Changelogs')).toBeInTheDocument()
    })

    it('should render Jira/Linear context node', () => {
      render(<Home />)
      expect(screen.getByText('Jira / Linear / Project Boards')).toBeInTheDocument()
    })

    it('should render all major node cards', () => {
      render(<Home />)
      expect(screen.getByText('Meetings & Voice Transcripts')).toBeInTheDocument()
      expect(screen.getByText('AI Coding Sessions')).toBeInTheDocument()
      expect(screen.getByText('Sales & Client Calls')).toBeInTheDocument()
      expect(screen.getByText('Product Requirement Docs')).toBeInTheDocument()
    })
  })

  describe('Security Section', () => {
    it('should render security section', () => {
      render(<Home />)
      expect(screen.getByText('Security & Privacy')).toBeInTheDocument()
    })

    it('should render privacy features', () => {
      render(<Home />)
      expect(screen.getByText('Air-gapped by design')).toBeInTheDocument()
      expect(screen.getByText('Distributed vector store')).toBeInTheDocument()
      expect(screen.getByText('Permission-aware retrieval')).toBeInTheDocument()
    })
  })
})

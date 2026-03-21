import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('Signup Flow Integration', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('Complete Signup Flow', () => {
    it('should complete full signup flow from form to success', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      })

      render(<Home />)

      // Find form elements
      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      // Fill in the form
      await userEvent.type(emailInput, 'integration@test.com')
      await userEvent.type(companyInput, 'Integration Test Corp')

      // Submit the form
      await userEvent.click(submitButton)

      // Verify API was called correctly
      expect(mockFetch).toHaveBeenCalledWith('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'integration@test.com',
          company: 'Integration Test Corp',
        }),
      })

      // Verify success state
      await waitFor(() => {
        expect(screen.getByText("You're on the list.")).toBeInTheDocument()
      })

      // Verify form is no longer visible
      expect(screen.queryByPlaceholderText('you@company.com')).not.toBeInTheDocument()
    })

    it('should show validation errors before API call for invalid email', async () => {
      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      // Fill invalid email
      await userEvent.type(emailInput, 'not-an-email')
      await userEvent.type(companyInput, 'Test Corp')
      await userEvent.click(submitButton)

      // Verify error is shown
      expect(screen.getByText('Please enter a valid email.')).toBeVisible()

      // Verify API was NOT called
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should show validation error for empty company', async () => {
      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      // Fill only email
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.click(submitButton)

      // Verify error is shown
      expect(screen.getByText('Please enter your company or project name.')).toBeVisible()

      // Verify API was NOT called
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling Flow', () => {
    it('should handle duplicate email gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: false,
          error: 'Email already registered',
        }),
      })

      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'existing@test.com')
      await userEvent.type(companyInput, 'Test Corp')
      await userEvent.click(submitButton)

      // Form should not show success
      await waitFor(() => {
        expect(screen.queryByText("You're on the list.")).not.toBeInTheDocument()
      })

      // Form should still be visible
      expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument()
    })

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(companyInput, 'Test Corp')
      await userEvent.click(submitButton)

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Signup error:', expect.any(Error))
      })

      // Form should still be visible (not stuck in loading)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Get Notified/i })).not.toBeDisabled()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Loading State Flow', () => {
    it('should show loading state and then success', async () => {
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
      await userEvent.type(companyInput, 'Test Corp')
      await userEvent.click(submitButton)

      // Should show loading state
      expect(screen.getByText('Sending…')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()

      // Resolve the promise
      resolvePromise!({
        json: () => Promise.resolve({ success: true }),
      })

      // Should show success
      await waitFor(() => {
        expect(screen.getByText("You're on the list.")).toBeInTheDocument()
      })
    })
  })

  describe('Form Input Validation Flow', () => {
    it('should clear email error when valid email is entered', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
      })

      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      // First submit with invalid email
      await userEvent.type(emailInput, 'invalid')
      await userEvent.type(companyInput, 'Test Corp')
      await userEvent.click(submitButton)

      // Error should be visible
      expect(screen.getByText('Please enter a valid email.')).toBeVisible()

      // Clear and type valid email
      await userEvent.clear(emailInput)
      await userEvent.type(emailInput, 'valid@email.com')
      await userEvent.click(submitButton)

      // Error should be cleared and form submitted
      await waitFor(() => {
        expect(screen.getByText("You're on the list.")).toBeInTheDocument()
      })
    })

    it('should trim whitespace from email and company', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      })

      render(<Home />)

      const emailInput = screen.getByPlaceholderText('you@company.com')
      const companyInput = screen.getByPlaceholderText('Acme Corp')
      const submitButton = screen.getByRole('button', { name: /Get Notified/i })

      // Enter values with whitespace
      await userEvent.type(emailInput, '  test@example.com  ')
      await userEvent.type(companyInput, '  Test Corp  ')
      await userEvent.click(submitButton)

      // Verify API was called with trimmed values
      expect(mockFetch).toHaveBeenCalledWith('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          company: 'Test Corp',
        }),
      })
    })
  })
})

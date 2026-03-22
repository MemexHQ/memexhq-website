import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EngineeringDemo from '@/app/components/demos/EngineeringDemo'
import MarketingDemo from '@/app/components/demos/MarketingDemo'
import SalesDemo from '@/app/components/demos/SalesDemo'
import ProductDemo from '@/app/components/demos/ProductDemo'
import DevOpsDemo from '@/app/components/demos/DevOpsDemo'
import HRDemo from '@/app/components/demos/HRDemo'

describe('Demo Components - Rendering', () => {
  describe('EngineeringDemo', () => {
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

    it('should render status bar with context server info', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText(/context server/)).toBeInTheDocument()
      expect(screen.getByText(/local network only/)).toBeInTheDocument()
      expect(screen.getByText(/0 bytes egress/)).toBeInTheDocument()
    })

    it('should render command prompt indicator', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('should display nodes matched count', () => {
      render(<EngineeringDemo />)
      expect(screen.getByText('4 nodes matched')).toBeInTheDocument()
    })
  })

  describe('MarketingDemo', () => {
    it('should render without crashing', () => {
      render(<MarketingDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render browser chrome with Claude URL', () => {
      render(<MarketingDemo />)
      expect(screen.getByText('claude.ai/chat')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<MarketingDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render sidebar with Claude branding', () => {
      render(<MarketingDemo />)
      // Claude × Memex is split across elements, check for multiple occurrences
      const claudeElements = screen.getAllByText(/Claude/)
      expect(claudeElements.length).toBeGreaterThan(0)
      expect(screen.getByText(/Memex/)).toBeInTheDocument()
    })

    it('should render new chat button', () => {
      render(<MarketingDemo />)
      expect(screen.getByText('+ New chat')).toBeInTheDocument()
    })

    it('should render chat history items', () => {
      render(<MarketingDemo />)
      expect(screen.getByText('LinkedIn post — enterprise')).toBeInTheDocument()
      expect(screen.getByText('Q3 board update draft')).toBeInTheDocument()
    })

    it('should render context server status', () => {
      render(<MarketingDemo />)
      expect(screen.getByText('context server active')).toBeInTheDocument()
    })
  })

  describe('SalesDemo', () => {
    it('should render without crashing', () => {
      render(<SalesDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render browser chrome with ChatGPT URL', () => {
      render(<SalesDemo />)
      expect(screen.getByText('chatgpt.com')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<SalesDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render ChatGPT sidebar', () => {
      render(<SalesDemo />)
      expect(screen.getByText('ChatGPT')).toBeInTheDocument()
    })

    it('should render new chat button', () => {
      render(<SalesDemo />)
      expect(screen.getByText(/New chat/)).toBeInTheDocument()
    })

    it('should render chat history sections', () => {
      render(<SalesDemo />)
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Yesterday')).toBeInTheDocument()
    })

    it('should render chat history items', () => {
      render(<SalesDemo />)
      expect(screen.getByText('Acme Corp follow-up email')).toBeInTheDocument()
      expect(screen.getByText('Q3 pipeline review')).toBeInTheDocument()
    })

    it('should render model selector', () => {
      render(<SalesDemo />)
      expect(screen.getByText(/GPT-4o/)).toBeInTheDocument()
    })

    it('should render sales context badge', () => {
      render(<SalesDemo />)
      expect(screen.getByText(/sales context/)).toBeInTheDocument()
    })
  })

  describe('ProductDemo', () => {
    it('should render without crashing', () => {
      render(<ProductDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render browser chrome with Codex URL', () => {
      render(<ProductDemo />)
      expect(screen.getByText('platform.openai.com/codex')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<ProductDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render Codex sidebar', () => {
      render(<ProductDemo />)
      expect(screen.getByText('Codex')).toBeInTheDocument()
    })

    it('should render agents section', () => {
      render(<ProductDemo />)
      expect(screen.getByText('Agents')).toBeInTheDocument()
    })

    it('should render agent items', () => {
      render(<ProductDemo />)
      expect(screen.getByText('notification spec')).toBeInTheDocument()
      expect(screen.getByText('auth refactor')).toBeInTheDocument()
      expect(screen.getByText('billing webhooks')).toBeInTheDocument()
    })

    it('should render history section', () => {
      render(<ProductDemo />)
      expect(screen.getByText('History')).toBeInTheDocument()
    })

    it('should render task input area', () => {
      render(<ProductDemo />)
      expect(screen.getByText('Task')).toBeInTheDocument()
    })

    it('should render product context badge', () => {
      render(<ProductDemo />)
      expect(screen.getByText(/product context/)).toBeInTheDocument()
    })
  })

  describe('DevOpsDemo', () => {
    it('should render without crashing', () => {
      render(<DevOpsDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render browser chrome with GitHub URL', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('github.com/acme/api/pull/447')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render GitHub repo header', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('acme')).toBeInTheDocument()
      expect(screen.getByText('api')).toBeInTheDocument()
    })

    it('should render repo tabs', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('Code')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('should render PR list', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('Open PRs')).toBeInTheDocument()
      expect(screen.getByText('CI pipeline timeout fix')).toBeInTheDocument()
    })

    it('should render PR detail', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText(/Fix: CI pipeline timeouts/)).toBeInTheDocument()
      expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('should render diff block', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('.github/workflows/ci.yml')).toBeInTheDocument()
    })

    it('should render Copilot panel', () => {
      render(<DevOpsDemo />)
      expect(screen.getByText('Copilot + memexhq')).toBeInTheDocument()
    })
  })

  describe('HRDemo', () => {
    it('should render without crashing', () => {
      render(<HRDemo />)
      expect(document.body).toBeTruthy()
    })

    it('should render browser chrome with CoWork URL', () => {
      render(<HRDemo />)
      expect(screen.getByText('cowork.anthropic.com')).toBeInTheDocument()
    })

    it('should render memexhq active pill', () => {
      render(<HRDemo />)
      expect(screen.getByText('memexhq active')).toBeInTheDocument()
    })

    it('should render CoWork sidebar', () => {
      render(<HRDemo />)
      expect(screen.getByText('CoWork')).toBeInTheDocument()
    })

    it('should render workspace section', () => {
      render(<HRDemo />)
      expect(screen.getByText('Workspace')).toBeInTheDocument()
    })

    it('should render workspace items', () => {
      render(<HRDemo />)
      expect(screen.getByText('HR tasks')).toBeInTheDocument()
      expect(screen.getByText('Recruiting')).toBeInTheDocument()
      expect(screen.getByText('Onboarding')).toBeInTheDocument()
    })

    it('should render recent section', () => {
      render(<HRDemo />)
      expect(screen.getByText('Recent')).toBeInTheDocument()
    })

    it('should render recent items', () => {
      render(<HRDemo />)
      expect(screen.getByText('Offer letter — Priya')).toBeInTheDocument()
      expect(screen.getByText('Performance cycle')).toBeInTheDocument()
    })

    it('should render task input area', () => {
      render(<HRDemo />)
      expect(screen.getByText('Task')).toBeInTheDocument()
    })

    it('should render HR context badge', () => {
      render(<HRDemo />)
      expect(screen.getByText(/hr context/)).toBeInTheDocument()
    })
  })
})

describe('Demo Components - Accessibility', () => {
  it('EngineeringDemo should have accessible structure', () => {
    render(<EngineeringDemo />)
    // Check for presence of key UI elements
    expect(document.querySelector('[class*="terminal"]')).toBeTruthy()
  })

  it('MarketingDemo should have accessible structure', () => {
    render(<MarketingDemo />)
    expect(document.querySelector('[class*="browser"]')).toBeTruthy()
  })

  it('SalesDemo should have accessible structure', () => {
    render(<SalesDemo />)
    expect(document.querySelector('[class*="browser"]')).toBeTruthy()
  })

  it('ProductDemo should have accessible structure', () => {
    render(<ProductDemo />)
    expect(document.querySelector('[class*="browser"]')).toBeTruthy()
  })

  it('DevOpsDemo should have accessible structure', () => {
    render(<DevOpsDemo />)
    expect(document.querySelector('[class*="browser"]')).toBeTruthy()
  })

  it('HRDemo should have accessible structure', () => {
    render(<HRDemo />)
    expect(document.querySelector('[class*="browser"]')).toBeTruthy()
  })
})

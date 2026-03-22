import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPage, { metadata } from '@/app/blog/page'

// Mock the posts module
vi.mock('@/lib/posts', () => ({
  getAllPosts: vi.fn(),
}))

// Mock Navigation and Footer
vi.mock('@/app/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}))

vi.mock('@/app/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

import { getAllPosts } from '@/lib/posts'

const mockPosts = [
  {
    slug: 'first-post',
    title: 'First Post Title',
    date: '2026-03-22',
    excerpt: 'This is the first post excerpt',
    author: 'Test Author',
    tags: ['tag1', 'tag2'],
    readingTime: '3 min read',
  },
  {
    slug: 'second-post',
    title: 'Second Post Title',
    date: '2026-03-21',
    excerpt: 'This is the second post excerpt',
    author: 'Another Author',
    tags: ['tag3'],
    readingTime: '5 min read',
  },
]

describe('BlogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Metadata', () => {
    it('should export correct title', () => {
      expect(metadata.title).toBe('Blog')
    })

    it('should export correct description', () => {
      expect(metadata.description).toContain('AI context')
    })

    it('should have openGraph configuration', () => {
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe('MemexHQ Blog')
    })
  })

  describe('Rendering with posts', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue(mockPosts)
    })

    it('should render Navigation component', () => {
      render(<BlogPage />)
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('should render Footer component', () => {
      render(<BlogPage />)
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should render blog header with section label', () => {
      render(<BlogPage />)
      expect(screen.getByText('Blog')).toBeInTheDocument()
    })

    it('should render main heading', () => {
      render(<BlogPage />)
      expect(screen.getByRole('heading', { name: /insights & updates/i })).toBeInTheDocument()
    })

    it('should render blog description', () => {
      render(<BlogPage />)
      expect(screen.getByText(/thoughts on ai context/i)).toBeInTheDocument()
    })

    it('should render all posts', () => {
      render(<BlogPage />)
      expect(screen.getByText('First Post Title')).toBeInTheDocument()
      expect(screen.getByText('Second Post Title')).toBeInTheDocument()
    })

    it('should render post excerpts', () => {
      render(<BlogPage />)
      expect(screen.getByText('This is the first post excerpt')).toBeInTheDocument()
      expect(screen.getByText('This is the second post excerpt')).toBeInTheDocument()
    })

    it('should render post dates', () => {
      render(<BlogPage />)
      expect(screen.getByText('March 22, 2026')).toBeInTheDocument()
      expect(screen.getByText('March 21, 2026')).toBeInTheDocument()
    })

    it('should render reading times', () => {
      render(<BlogPage />)
      expect(screen.getByText('3 min read')).toBeInTheDocument()
      expect(screen.getByText('5 min read')).toBeInTheDocument()
    })

    it('should render tags', () => {
      render(<BlogPage />)
      expect(screen.getByText('tag1')).toBeInTheDocument()
      expect(screen.getByText('tag2')).toBeInTheDocument()
      expect(screen.getByText('tag3')).toBeInTheDocument()
    })

    it('should link to individual posts', () => {
      render(<BlogPage />)
      const firstPostLink = screen.getByRole('link', { name: /first post title/i })
      expect(firstPostLink).toHaveAttribute('href', '/blog/first-post')
    })

    it('should render articles for each post', () => {
      render(<BlogPage />)
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(2)
    })
  })

  describe('Rendering with no posts', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue([])
    })

    it('should render empty state message', () => {
      render(<BlogPage />)
      expect(screen.getByText(/no posts yet/i)).toBeInTheDocument()
    })

    it('should not render any articles', () => {
      render(<BlogPage />)
      expect(screen.queryAllByRole('article')).toHaveLength(0)
    })
  })

  describe('CSS Classes', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue(mockPosts)
    })

    it('should have blog-main class on main element', () => {
      render(<BlogPage />)
      expect(document.querySelector('.blog-main')).toBeInTheDocument()
    })

    it('should have blog-grid class', () => {
      render(<BlogPage />)
      expect(document.querySelector('.blog-grid')).toBeInTheDocument()
    })

    it('should have blog-card class on articles', () => {
      render(<BlogPage />)
      expect(document.querySelectorAll('.blog-card')).toHaveLength(2)
    })
  })
})

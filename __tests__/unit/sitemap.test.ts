import { describe, it, expect, vi, beforeEach } from 'vitest'
import sitemap from '@/app/sitemap'

// Mock the posts module
vi.mock('@/lib/posts', () => ({
  getAllPosts: vi.fn(),
}))

import { getAllPosts } from '@/lib/posts'

const mockPosts = [
  {
    slug: 'first-post',
    title: 'First Post',
    date: '2026-03-22',
    excerpt: 'First excerpt',
    author: 'Author',
    tags: [],
    readingTime: '3 min read',
  },
  {
    slug: 'second-post',
    title: 'Second Post',
    date: '2026-03-21',
    excerpt: 'Second excerpt',
    author: 'Author',
    tags: [],
    readingTime: '5 min read',
  },
]

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Static Pages', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue([])
    })

    it('should include homepage', () => {
      const result = sitemap()

      const homepage = result.find((page) => page.url === 'https://memexhq.dev')
      expect(homepage).toBeDefined()
      expect(homepage?.priority).toBe(1)
      expect(homepage?.changeFrequency).toBe('weekly')
    })

    it('should include brand page', () => {
      const result = sitemap()

      const brandPage = result.find((page) => page.url === 'https://memexhq.dev/brand')
      expect(brandPage).toBeDefined()
      expect(brandPage?.priority).toBe(0.5)
      expect(brandPage?.changeFrequency).toBe('monthly')
    })

    it('should include blog listing page', () => {
      const result = sitemap()

      const blogPage = result.find((page) => page.url === 'https://memexhq.dev/blog')
      expect(blogPage).toBeDefined()
      expect(blogPage?.priority).toBe(0.8)
      expect(blogPage?.changeFrequency).toBe('daily')
    })

    it('should have lastModified dates', () => {
      const result = sitemap()

      result.forEach((page) => {
        expect(page.lastModified).toBeInstanceOf(Date)
      })
    })
  })

  describe('Blog Posts', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue(mockPosts)
    })

    it('should include all blog posts', () => {
      const result = sitemap()

      const firstPost = result.find((page) => page.url === 'https://memexhq.dev/blog/first-post')
      const secondPost = result.find((page) => page.url === 'https://memexhq.dev/blog/second-post')

      expect(firstPost).toBeDefined()
      expect(secondPost).toBeDefined()
    })

    it('should use post date as lastModified', () => {
      const result = sitemap()

      const firstPost = result.find((page) => page.url === 'https://memexhq.dev/blog/first-post')

      expect(firstPost?.lastModified).toEqual(new Date('2026-03-22'))
    })

    it('should set correct priority for blog posts', () => {
      const result = sitemap()

      const blogPosts = result.filter((page) => page.url.includes('/blog/') && !page.url.endsWith('/blog'))

      blogPosts.forEach((post) => {
        expect(post.priority).toBe(0.6)
      })
    })

    it('should set monthly changeFrequency for blog posts', () => {
      const result = sitemap()

      const blogPosts = result.filter((page) => page.url.includes('/blog/') && !page.url.endsWith('/blog'))

      blogPosts.forEach((post) => {
        expect(post.changeFrequency).toBe('monthly')
      })
    })
  })

  describe('Combined Output', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue(mockPosts)
    })

    it('should return correct total number of pages', () => {
      const result = sitemap()

      // 3 static pages + 2 blog posts
      expect(result).toHaveLength(5)
    })

    it('should return valid sitemap structure', () => {
      const result = sitemap()

      result.forEach((page) => {
        expect(page.url).toBeDefined()
        expect(page.url).toMatch(/^https:\/\/memexhq\.dev/)
        expect(page.lastModified).toBeDefined()
        expect(page.changeFrequency).toBeDefined()
        expect(page.priority).toBeDefined()
        expect(page.priority).toBeGreaterThanOrEqual(0)
        expect(page.priority).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('No Blog Posts', () => {
    beforeEach(() => {
      vi.mocked(getAllPosts).mockReturnValue([])
    })

    it('should return only static pages when no posts exist', () => {
      const result = sitemap()

      // 3 static pages (/, /brand, /blog)
      expect(result).toHaveLength(3)

      // Should include blog listing page but no individual blog posts
      const blogListing = result.find((page) => page.url === 'https://memexhq.dev/blog')
      expect(blogListing).toBeDefined()

      // Should not have any individual blog post pages
      const blogPosts = result.filter((page) => page.url.match(/\/blog\/[^/]+$/))
      expect(blogPosts).toHaveLength(0)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock the posts module
vi.mock('@/lib/posts', () => ({
  getPostBySlug: vi.fn(),
  getAllSlugs: vi.fn(),
}))

// Mock Navigation and Footer
vi.mock('@/app/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}))

vi.mock('@/app/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

import { getPostBySlug, getAllSlugs } from '@/lib/posts'
import { notFound } from 'next/navigation'
import BlogPostPage, { generateStaticParams, generateMetadata } from '@/app/blog/[slug]/page'

const mockPost = {
  slug: 'test-post',
  title: 'Test Post Title',
  date: '2026-03-22',
  excerpt: 'This is the test post excerpt',
  author: 'Test Author',
  tags: ['tag1', 'tag2'],
  readingTime: '5 min read',
  content: '# Hello World\n\nThis is the **content** of the post.',
  coverImage: '/images/test.png',
}

describe('BlogPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateStaticParams', () => {
    it('should return all slugs for static generation', async () => {
      vi.mocked(getAllSlugs).mockReturnValue(['post-one', 'post-two', 'post-three'])

      const params = await generateStaticParams()

      expect(params).toEqual([
        { slug: 'post-one' },
        { slug: 'post-two' },
        { slug: 'post-three' },
      ])
    })

    it('should return empty array when no posts', async () => {
      vi.mocked(getAllSlugs).mockReturnValue([])

      const params = await generateStaticParams()

      expect(params).toEqual([])
    })
  })

  describe('generateMetadata', () => {
    it('should return post metadata when post exists', async () => {
      vi.mocked(getPostBySlug).mockReturnValue(mockPost)

      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) })

      expect(metadata.title).toBe('Test Post Title')
      expect(metadata.description).toBe('This is the test post excerpt')
      expect(metadata.authors).toEqual([{ name: 'Test Author' }])
    })

    it('should include openGraph metadata', async () => {
      vi.mocked(getPostBySlug).mockReturnValue(mockPost)

      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) })

      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.title).toBe('Test Post Title')
      expect(metadata.openGraph?.publishedTime).toBe('2026-03-22')
    })

    it('should return "Post Not Found" title when post does not exist', async () => {
      vi.mocked(getPostBySlug).mockReturnValue(null)

      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'non-existent' }) })

      expect(metadata.title).toBe('Post Not Found')
    })
  })

  describe('Page Rendering', () => {
    beforeEach(() => {
      vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    })

    it('should render Navigation component', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('should render Footer component', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should render post title', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByRole('heading', { name: /test post title/i })).toBeInTheDocument()
    })

    it('should render post date', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByText('March 22, 2026')).toBeInTheDocument()
    })

    it('should render reading time', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByText('5 min read')).toBeInTheDocument()
    })

    it('should render author', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByText(/by test author/i)).toBeInTheDocument()
    })

    it('should render markdown content', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(screen.getByText(/hello world/i)).toBeInTheDocument()
    })

    it('should render JSON-LD script', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]')
      expect(jsonLdScript).toBeInTheDocument()

      const jsonLd = JSON.parse(jsonLdScript?.textContent || '{}')
      expect(jsonLd['@type']).toBe('BlogPosting')
      expect(jsonLd.headline).toBe('Test Post Title')
    })
  })

  describe('Post Not Found', () => {
    it('should call notFound when post does not exist', async () => {
      vi.mocked(getPostBySlug).mockReturnValue(null)
      // notFound() in Next.js throws a special error to trigger 404
      // Our mock just records that it was called
      vi.mocked(notFound).mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND')
      })

      await expect(
        BlogPostPage({ params: Promise.resolve({ slug: 'non-existent' }) })
      ).rejects.toThrow('NEXT_NOT_FOUND')

      expect(notFound).toHaveBeenCalled()
    })
  })

  describe('CSS Classes', () => {
    beforeEach(() => {
      vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    })

    it('should have blog-main class', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(document.querySelector('.blog-main')).toBeInTheDocument()
    })

    it('should have blog-article class', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(document.querySelector('.blog-article')).toBeInTheDocument()
    })

    it('should have blog-post-header class', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(document.querySelector('.blog-post-header')).toBeInTheDocument()
    })

    it('should have blog-content class', async () => {
      render(await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) }))
      expect(document.querySelector('.blog-content')).toBeInTheDocument()
    })
  })
})

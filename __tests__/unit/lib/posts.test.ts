import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug, getAllSlugs } from '@/lib/posts'

// These tests use the actual content/blog directory
// which contains introducing-memexhq.md

describe('posts utility functions', () => {
  describe('getAllPosts', () => {
    it('should return an array of posts', () => {
      const posts = getAllPosts()

      expect(Array.isArray(posts)).toBe(true)
    })

    it('should return posts with required fields', () => {
      const posts = getAllPosts()

      if (posts.length > 0) {
        const post = posts[0]
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('date')
        expect(post).toHaveProperty('excerpt')
        expect(post).toHaveProperty('author')
        expect(post).toHaveProperty('tags')
        expect(post).toHaveProperty('readingTime')
      }
    })

    it('should sort posts by date (newest first)', () => {
      const posts = getAllPosts()

      if (posts.length >= 2) {
        const dates = posts.map((p) => new Date(p.date).getTime())
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1])
        }
      }
    })

    it('should include the sample introducing-memexhq post', () => {
      const posts = getAllPosts()

      const samplePost = posts.find((p) => p.slug === 'introducing-memexhq')
      expect(samplePost).toBeDefined()
      expect(samplePost?.title).toBe('Introducing MemexHQ: The Context Layer for Enterprise AI')
    })

    it('should have correct reading time format', () => {
      const posts = getAllPosts()

      if (posts.length > 0) {
        expect(posts[0].readingTime).toMatch(/\d+ min read/)
      }
    })
  })

  describe('getPostBySlug', () => {
    it('should return null for non-existent post', () => {
      const post = getPostBySlug('non-existent-post-12345')

      expect(post).toBeNull()
    })

    it('should return post with content for existing post', () => {
      const post = getPostBySlug('introducing-memexhq')

      expect(post).not.toBeNull()
      expect(post?.slug).toBe('introducing-memexhq')
      expect(post?.title).toBe('Introducing MemexHQ: The Context Layer for Enterprise AI')
      expect(post?.content).toBeDefined()
      expect(post?.content.length).toBeGreaterThan(0)
    })

    it('should include all metadata fields', () => {
      const post = getPostBySlug('introducing-memexhq')

      expect(post).toMatchObject({
        slug: 'introducing-memexhq',
        author: 'MemexHQ Team',
        tags: ['announcement', 'AI', 'enterprise'],
      })
    })

    it('should include markdown content', () => {
      const post = getPostBySlug('introducing-memexhq')

      expect(post?.content).toContain('## The Problem')
      expect(post?.content).toContain('## Our Solution')
    })
  })

  describe('getAllSlugs', () => {
    it('should return an array of slugs', () => {
      const slugs = getAllSlugs()

      expect(Array.isArray(slugs)).toBe(true)
    })

    it('should include the sample post slug', () => {
      const slugs = getAllSlugs()

      expect(slugs).toContain('introducing-memexhq')
    })

    it('should return slugs without .md extension', () => {
      const slugs = getAllSlugs()

      slugs.forEach((slug) => {
        expect(slug).not.toMatch(/\.md$/)
      })
    })
  })
})

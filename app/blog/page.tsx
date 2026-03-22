import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import Navigation from '@/app/components/Navigation'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on AI context, enterprise LLMs, and building smarter AI agents.',
  openGraph: {
    title: 'MemexHQ Blog',
    description: 'Insights on AI context, enterprise LLMs, and building smarter AI agents.',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navigation />
      <main className="blog-main">
        <div className="section-inner">
          <div className="blog-header">
            <div className="section-label">Blog</div>
            <h1 className="section-h">Insights & Updates</h1>
            <p className="section-p">
              Thoughts on AI context, enterprise memory, and building smarter agents.
            </p>
          </div>

          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link href={`/blog/${post.slug}`}>
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="blog-reading-time">{post.readingTime}</span>
                    </div>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    {post.tags.length > 0 && (
                      <div className="blog-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="blog-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="blog-empty">
              <p>No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

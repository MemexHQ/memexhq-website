'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <div className="logo-mark">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="30" width="32" height="2.5" rx="1.25" fill="currentColor"/>
                <rect x="4" y="12" width="11" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="6.5" y="15" width="6" height="1.2" rx="0.6" fill="currentColor" opacity="0.4"/>
                <rect x="6.5" y="17.5" width="4" height="1.2" rx="0.6" fill="currentColor" opacity="0.25"/>
                <rect x="25" y="12" width="11" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="27.5" y="15" width="6" height="1.2" rx="0.6" fill="currentColor" opacity="0.4"/>
                <rect x="27.5" y="17.5" width="3.5" height="1.2" rx="0.6" fill="currentColor" opacity="0.25"/>
                <line x1="15" y1="19" x2="25" y2="19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" opacity="0.6"/>
                <circle cx="20" cy="19" r="2.2" fill="currentColor"/>
                <circle cx="20" cy="19" r="0.9" fill="var(--bg)"/>
                <line x1="9.5" y1="26" x2="9.5" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <line x1="30.5" y1="26" x2="30.5" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <circle cx="20" cy="6.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <circle cx="20" cy="6.5" r="1" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            MemexHQ
          </Link>
          <p>Your AI finally knows your business. All context local. All agents smarter. Zero setup after day one.</p>
        </div>
        <div className="footer-col">
          <h5>Product</h5>
          <a href="/#how">How it works</a>
          <a href="/#demo">Demo</a>
          <a href="/#integrations">Integrations</a>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <a href="#">About</a>
          <Link href="/blog">Blog</Link>
          <a href="#">Careers</a>
          <a href="mailto:darius.singh@memexhq.dev">Contact</a>
        </div>
        <div className="footer-col">
          <h5>Legal</h5>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
          <a href="#">GDPR</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 MemexHQ. Open source soon.</span>
        <span>Your AI finally knows your business.</span>
        <span>memexhq.dev</span>
      </div>
    </footer>
  )
}

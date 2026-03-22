'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/" className="nav-logo">
        <div className="logo-mark">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="29" width="32" height="2.4" rx="1.2" fill="currentColor"/>
            <rect x="4" y="12" width="11.5" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
            <rect x="6.8" y="15" width="5.8" height="1.1" rx=".55" fill="currentColor" opacity=".45"/>
            <rect x="6.8" y="17.5" width="3.8" height="1.1" rx=".55" fill="currentColor" opacity=".26"/>
            <rect x="6.8" y="20" width="4.8" height="1.1" rx=".55" fill="currentColor" opacity=".26"/>
            <rect x="24.5" y="12" width="11.5" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
            <rect x="27.3" y="15" width="5.8" height="1.1" rx=".55" fill="currentColor" opacity=".45"/>
            <rect x="27.3" y="17.5" width="3.5" height="1.1" rx=".55" fill="currentColor" opacity=".26"/>
            <rect x="27.3" y="20" width="4.8" height="1.1" rx=".55" fill="currentColor" opacity=".26"/>
            <line x1="15.5" y1="19" x2="24.5" y2="19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.6 2" opacity=".6"/>
            <circle cx="20" cy="19" r="2.4" fill="currentColor"/>
            <circle cx="20" cy="19" r="1" fill="var(--bg)"/>
            <line x1="10" y1="26" x2="10" y2="29" stroke="currentColor" strokeWidth="1.2" opacity=".45"/>
            <line x1="30" y1="26" x2="30" y2="29" stroke="currentColor" strokeWidth="1.2" opacity=".45"/>
            <circle cx="20" cy="6.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".45"/>
            <circle cx="20" cy="6.5" r="1" fill="currentColor" opacity=".5"/>
          </svg>
        </div>
        MemexHQ
      </Link>
      <ul className="nav-links">
        <li><a href="/#how">How it works</a></li>
        <li><a href="/#demo">Demo</a></li>
        <li><a href="/#integrations">Integrations</a></li>
        <li><a href="/#nodes">Context nodes</a></li>
        <li><Link href="/blog">Blog</Link></li>
      </ul>
      <div className="nav-right">
        <a href="/#signup" className="nav-cta">Get Notified</a>
      </div>
    </nav>
  )
}

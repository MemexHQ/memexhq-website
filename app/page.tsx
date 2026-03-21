'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('engineering')
  const [emailError, setEmailError] = useState(false)
  const [companyError, setCompanyError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let W = c.width = window.innerWidth
    let H = c.height = window.innerHeight
    interface Node { x: number; y: number; vx: number; vy: number; r: number; a: boolean }
    const nodes: Node[] = []

    function init() {
      for (let i = 0; i < 60; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 2 + 1,
          a: Math.random() > 0.5
        })
      }
    }

    let animationId: number

    function draw() {
      // ctx is guaranteed non-null here (checked at useEffect start)
      ctx!.clearRect(0, 0, W, H)
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      })
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            const al = (1 - d / 140) * 0.2
            ctx!.beginPath()
            ctx!.strokeStyle = nodes[i].a ? `rgba(0,229,160,${al})` : `rgba(0,102,255,${al})`
            ctx!.lineWidth = 0.5
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }
      nodes.forEach(n => {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fillStyle = n.a ? 'rgba(0,229,160,.65)' : 'rgba(0,102,255,.65)'
        ctx!.fill()
      })
      animationId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      W = c.width = window.innerWidth
      H = c.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    init()
    animationId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal,.step,.node-card,.pf,.problem-card').forEach(el => observer.observe(el))
    document.querySelectorAll('.node-card').forEach((c, i) => { (c as HTMLElement).style.transitionDelay = (i * 0.06) + 's' })
    document.querySelectorAll('.problem-card').forEach((c, i) => { (c as HTMLElement).style.transitionDelay = (i * 0.1) + 's' })
  }, [])

  useEffect(() => {
    const wrap = document.getElementById('ndCanvas')
    if (!wrap) return
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1'
    
    const icons = ['⌥', '◈', '◎', '⬡', '◆', '✦']
    const pos = [[50, 8], [85, 28], [88, 68], [50, 90], [12, 68], [12, 28]]
    
    pos.forEach((p) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '50%')
      line.setAttribute('y1', '50%')
      line.setAttribute('x2', p[0] + '%')
      line.setAttribute('y2', p[1] + '%')
      line.setAttribute('stroke', 'rgba(0,229,160,0.2)')
      line.setAttribute('stroke-width', '1')
      line.setAttribute('stroke-dasharray', '4 4')
      svg.appendChild(line)
    })
    
    wrap.appendChild(svg)
    
    pos.forEach((p, i) => {
      const nd = document.createElement('div')
      nd.style.cssText = `position:absolute;width:36px;height:36px;left:${p[0]}%;top:${p[1]}%;transform:translate(-50%,-50%);background:var(--surface2);border:1px solid var(--border2);border-radius:7px;display:grid;place-items:center;font-size:12px;transition:border-color .3s;z-index:2`
      nd.textContent = icons[i]
      nd.addEventListener('mouseenter', () => nd.style.borderColor = 'var(--accent)')
      nd.addEventListener('mouseleave', () => nd.style.borderColor = '')
      wrap.appendChild(nd)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const emailEl = form.elements.namedItem('email')
    const companyEl = form.elements.namedItem('company')
    if (!(emailEl instanceof HTMLInputElement) || !(companyEl instanceof HTMLInputElement)) return
    const email = emailEl.value
    const company = companyEl.value

    let valid = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(true)
      valid = false
    } else {
      setEmailError(false)
    }
    if (!company.trim()) {
      setCompanyError(true)
      valid = false
    } else {
      setCompanyError(false)
    }
    if (!valid) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), company: company.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Signup error:', err)
    }
    setIsSubmitting(false)
  }

  const demos = {
    engineering: {
      cmd: 'claude-code "implement rate limiting for the /auth endpoint"',
      ctx: [
        { source: 'GitHub · 3d ago', text: 'PR #412 reverted Redis-based rate limiter — latency spike under 500 rps. Root cause: connection pool misconfigured.' },
        { source: 'Jira · SPRINT-88', text: 'Auth hardening is P0 this sprint. Requirement: 100 req/min per user, sliding window.' },
        { source: 'Standup · Tue', text: 'Team agreed token bucket over leaky bucket after benchmarking.' },
        { source: 'Claude Code · 7d ago', text: 'Existing middleware pattern in src/middleware/throttle.ts.' }
      ],
      enriched: '"Implement rate limiting for /auth. Use token bucket (100 req/min/user, sliding window). Avoid Redis connection pool — prefer in-memory with periodic flush. Extend existing pattern at src/middleware/throttle.ts. Previous attempt PR #412 failed due to pool config."',
      result: 'Production-ready implementation on first attempt. No back-and-forth, no rediscovering past failures. The AI knew what failed and why.'
    },
    marketing: {
      cmd: 'chatgpt "write a LinkedIn post announcing our enterprise tier"',
      ctx: [
        { source: 'Salesforce · Stripe call · 2d ago', text: 'Main objection: SSO and audit logs missing. Enterprise tier resolves this.' },
        { source: 'PRD · v2.4', text: 'Enterprise includes SAML SSO, RBAC, 90-day audit log, SLA 99.9%.' },
        { source: 'Slack · #marketing', text: 'Positioning agreed: lead with security and compliance, not feature count.' },
        { source: 'Gong · Notion call', text: 'Competing against Glean — differentiate on local-only deployment.' }
      ],
      enriched: '"Announce enterprise tier on LinkedIn. Lead with security: SAML SSO, audit logs, local deployment. Target CTOs/security teams. Differentiator vs Glean: zero cloud egress. Tone: confident, technical, not salesy. Agreed positioning: compliance first."',
      result: 'Post hits exact positioning with real product detail. No hallucinated features, no generic copy. Drafted in one shot.'
    },
    sales: {
      cmd: 'chatgpt "prep me for tomorrow\'s call with Acme Corp"',
      ctx: [
        { source: 'Salesforce · 3w ago', text: 'Champion: VP Eng. Budget approved. Blocker: legal wants data residency guarantee.' },
        { source: 'Gmail thread', text: 'DPA sent 10 days ago — no reply, follow up critical.' },
        { source: 'Jira · SALES-44', text: 'Custom SLA doc in progress, ETA this Friday.' },
        { source: 'Slack · #deals', text: 'Glean pitched them last week. They liked our local-only story.' }
      ],
      enriched: '"Prep Acme Corp call. Primary blocker: DPA / data residency — follow up on unanswered email. SLA doc ready this week, mention ETA. Champion: VP Eng with budget approved. Lead with local-only deployment story to counter Glean. Ask about legal team timeline."',
      result: 'Sharp, context-loaded call brief assembled from Slack, Gmail, Jira, and Salesforce automatically. 30-second read instead of 45 minutes of manual research.'
    },
    product: {
      cmd: 'chatgpt "write the PRD for the notification system"',
      ctx: [
        { source: 'Gong · Stripe call', text: 'Client explicitly requested webhook support for notification events.' },
        { source: 'Linear · ENG-203', text: 'Real-time push out of scope Q3 due to infrastructure cost.' },
        { source: 'Gong · 3 recent calls', text: 'Competitor X shipped push notifications — mentioned as gap by multiple prospects.' },
        { source: 'Confluence · March', text: 'Previous RFC for notification system abandoned — infra cost estimate too high.' }
      ],
      enriched: '"PRD: notification system. Must-have: webhooks (client requirement, Stripe call). Out of scope Q3: real-time push (ENG-203). Competitive gap: push notifications — 3 recent sales mentions. Previous RFC failed on infra cost — avoid similar scope."',
      result: 'PRD with full business, technical, and competitive context. No assumptions. No rediscovering past decisions. First draft is already aligned with engineering, sales, and clients.'
    },
    devops: {
      cmd: 'chatgpt "why did production go down at 23:14 last night?"',
      ctx: [
        { source: 'GitHub · yesterday 23:14', text: 'Deploy by @ravi — payment service updated to v2.3.1.' },
        { source: 'Notion · 2w ago', text: 'Postmortem: v2.3.0 had connection pool exhaustion under load. Same service.' },
        { source: 'PagerDuty', text: 'Same failure pattern as November outage — payment service timeout cascade.' },
        { source: 'Confluence · runbook', text: 'Payment service recovery: restart pool, flush cache, confirm DB connections.' }
      ],
      enriched: '"Production incident 23:14. Deploy: payment-service v2.3.1 by @ravi. Known pattern: connection pool exhaustion (postmortem 2w ago, same service). Similar to November outage. Runbook: restart pool, flush cache, confirm DB. On-call: @priya."',
      result: 'Root cause identified in minutes, not hours. Runbook surfaced automatically. Team skips the 45-minute investigation and goes straight to the fix.'
    },
    onboarding: {
      cmd: 'chatgpt "draft onboarding plan for new backend engineer joining Monday"',
      ctx: [
        { source: 'GitHub', text: 'Stack: Node.js, Postgres, Redis, GCP. Current active repos: api-core, auth-service, payment-service.' },
        { source: 'Linear · SPRINT-88', text: 'Current sprint: auth hardening. New hire likely touching auth-service week 1.' },
        { source: 'Notion · onboarding feedback', text: 'Last 3 hires flagged: deployment process unclear, legacy payment service undocumented, RFC process unknown.' },
        { source: 'Slack · #engineering', text: 'Team norm: async-first, decisions in Linear not Slack, PRs reviewed within 24h.' }
      ],
      enriched: '"Onboarding plan: backend engineer. Stack: Node/Postgres/Redis/GCP. Week 1 context: auth hardening sprint. Known gaps from past hires: deployment docs, payment-service, RFC process. Team norms: async-first, Linear for decisions. Key contact: @rohan (backend architecture)."',
      result: 'Onboarding plan that addresses real gaps, references live sprint context, and reflects actual team norms. Not a generic checklist — a plan that reflects your company.'
    }
  }

  const currentDemo = demos[activeTab as keyof typeof demos]

  return (
    <>
      <canvas id="bg-canvas" ref={canvasRef} />

      <nav>
        <a href="#" className="nav-logo">
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
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#demo">Demo</a></li>
          <li><a href="#integrations">Integrations</a></li>
          <li><a href="#nodes">Context nodes</a></li>
        </ul>
        <div className="nav-right">
          <a href="#signup" className="nav-cta">Get Notified</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="dot"></span>
          Open source soon · Get notified when we launch
        </div>
        <h1>
          Your AI<br/>
          <em>finally knows</em><br/>
          <span>your business.</span>
        </h1>
        <p className="hero-sub">
          Every meeting, commit, sales call, and decision — unified into a single context layer that makes every AI agent in your stack dramatically smarter. Instantly. Locally. Privately.
        </p>
        <div className="hero-actions">
          <a href="#signup" className="btn-primary">Get Notified</a>
          <a href="#demo" className="btn-ghost">See it in action</a>
        </div>
        <div className="hero-integrations">
          <div className="hi-label">Works with your entire stack</div>
          <div className="hi-logos">
            <img src="/components/Claude.svg" alt="Claude Code" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/OpenClaw.svg" alt="OpenClaw" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/GitHub.svg" alt="GitHub" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/Linear.svg" alt="Linear" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/Jira.svg" alt="Jira" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/Notion.svg" alt="Notion" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <img src="/components/Gmail.svg" alt="Gmail" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span className="hi-logo">+ more</span>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line"></div>
          scroll
        </div>
      </section>

      <div className="problem-strip">
        <div className="ticker">
          {['Claude Code just suggested the same Redis architecture we reverted three weeks ago', 'ChatGPT wrote a campaign for a feature our biggest client hates', 'Copilot has no idea we deprecated that module last month', 'Every new AI tool needs a full company briefing from scratch', 'The AI doesn\'t know we already tried that. Again.', 'I spent 20 minutes explaining our stack to an AI that forgot it next session'].map((item, i) => (
            <span key={i}>
              <span className="ticker-item"><span>✗</span> {item}</span>
              <span className="ticker-item">·</span>
            </span>
          ))}
        </div>
      </div>

      <section className="problem-section">
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">The problem</div>
            <h2 className="section-h">AI is only as smart as<br/><em>the context</em> you give it.</h2>
            <p className="section-p">You're paying for Claude Code, Copilot, ChatGPT, Gemini. But every session starts from zero. No knowledge of your architecture. No memory of what failed last sprint. No idea what your biggest client asked for on Tuesday's call.</p>
          </div>
          <div className="problem-grid">
            <div className="problem-cards">
              <div className="problem-card">
                <div className="pc-icon">⚠️</div>
                <div className="pc-body">
                  <h5>Zero institutional memory</h5>
                  <p>Every AI session starts blank. Past decisions, failed experiments, and hard-won knowledge are invisible to the tools your team relies on daily.</p>
                </div>
              </div>
              <div className="problem-card">
                <div className="pc-icon">🔄</div>
                <div className="pc-body">
                  <h5>Constant re-explanation</h5>
                  <p>Engineers spend 20+ minutes per session re-briefing AI tools on stack, conventions, and context that should already be known.</p>
                </div>
              </div>
              <div className="problem-card">
                <div className="pc-icon">💸</div>
                <div className="pc-body">
                  <h5>Expensive mistakes</h5>
                  <p>AI confidently suggests approaches your team already tried and abandoned. Without context, it can't know — and your team pays the cost.</p>
                </div>
              </div>
              <div className="problem-card">
                <div className="pc-icon">🧩</div>
                <div className="pc-body">
                  <h5>Siloed knowledge</h5>
                  <p>Sales knows what clients want. Engineering knows what's possible. Product knows what's planned. Your AI knows none of it.</p>
                </div>
              </div>
            </div>
            <div className="problem-right">
              <div className="pr-title">// What your team is saying</div>
              <div className="pr-quote">"Claude Code just suggested the same Redis rate limiter we reverted three weeks ago after the latency spike."</div>
              <div className="pr-quote">"ChatGPT wrote an enterprise pitch that led with the exact feature our biggest client explicitly said they don't want."</div>
              <div className="pr-quote">"I spent 20 minutes explaining our microservices architecture to Copilot. It forgot everything next session."</div>
              <div className="pr-quote">"Our AI has no idea we're mid-pivot. It's still generating content for the old product direction."</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">How it works</div>
            <h2 className="section-h">One context layer.<br/><em>Every</em> AI agent.</h2>
            <p className="section-p">MemexHQ runs a lightweight context server on your local network. Nodes connect to your tools, distil what matters, and store it in a distributed vector database. Every AI query gets enriched automatically — no prompting required.</p>
          </div>
          <div className="how-grid">
            <div className="steps">
              <div className="step">
                <div className="step-num">01</div>
                <div className="step-body">
                  <h4>Nodes collect context silently</h4>
                  <p>Local agents attach to every tool your team uses. They listen, summarise, tag, and timestamp meaningful signals — architecture decisions, client objections, sprint priorities, code patterns, and team agreements.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div className="step-body">
                  <h4>Stored locally in a distributed vector DB</h4>
                  <p>Summaries are embedded and stored in your private vector database — entirely on your network. Semantic search retrieves the right context for any query, not keyword matching, actual meaning.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div className="step-body">
                  <h4>Collective memory compounds over time</h4>
                  <p>Every AI session output feeds back into the context store. MemexHQ gets smarter about your business with every interaction. The longer you run it, the more institutional knowledge it captures.</p>
                </div>
              </div>
            </div>
            <div className="arch-diagram">
              <div className="arch-label">// System architecture</div>
              <div className="arch-nodes">
                <div className="arch-node"><img src="/components/OpenClaw.svg" alt="OpenClaw" className="arch-logo"/></div>
                <div className="arch-node"><img src="/components/GitHub.svg" alt="GitHub" className="arch-logo"/></div>
                <div className="arch-node"><img src="/components/Jira.svg" alt="Jira" className="arch-logo"/></div>
                <div className="arch-node"><img src="/components/Claude.svg" alt="Claude Code" className="arch-logo"/></div>
                <div className="arch-node"><img src="/components/Notion.svg" alt="Notion" className="arch-logo"/></div>
                <div className="arch-node"><img src="/components/Linear.svg" alt="Linear" className="arch-logo"/></div>
              </div>
              <div className="arch-arrow">↓</div>
              <div className="arch-server">
                <strong>MemexHQ Context Server</strong>
                Distributed Vector DB · RAG · Local Network Only
              </div>
              <div className="arch-arrow2">↓</div>
              <div className="arch-query">
                <div className="q-label">Enriched query →</div>
                <div>"Build auth module" + full business context injected</div>
                <div className="q-ai">
                  <span className="q-tag">Claude Code</span>
                  <span className="q-tag">ChatGPT</span>
                  <span className="q-tag">Gemini</span>
                  <span className="q-tag">Copilot</span>
                  <span className="q-tag">Any LLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="demo-section">
        <div className="demo-inner">
          <div className="demo-header">
            <div>
              <div className="section-label reveal">Live examples</div>
              <h2 className="section-h reveal">Context in action</h2>
            </div>
            <div className="demo-tabs">
              {['engineering', 'marketing', 'sales', 'product', 'devops', 'onboarding'].map(tab => (
                <button
                  key={tab}
                  className={`demo-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'onboarding' ? 'HR / Onboarding' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="terminal-wrap">
            <div className="terminal-bar">
              <span className="t-dot r"></span><span className="t-dot y"></span><span className="t-dot g"></span>
              <span className="t-title">memexhq · context enrichment · live</span>
            </div>
            <div className="terminal-body">
              <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd">{currentDemo.cmd}</span></div>
              <div className="t-block ctx">
                <div className="t-tag ctx">// context retrieved — {currentDemo.ctx.length} nodes matched</div>
                <p>{currentDemo.ctx.map((c, i) => (
                  <span key={i}><strong>[{c.source}]</strong> {c.text}<br/></span>
                ))}</p>
              </div>
              <div className="t-block rag">
                <div className="t-tag rag">// enriched prompt sent to AI</div>
                <p>{currentDemo.enriched}</p>
              </div>
              <div className="t-block out">
                <div className="t-tag out">// result</div>
                <p>{currentDemo.result}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="integrations" className="integrations-section">
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Integrations</div>
            <h2 className="section-h">Plug into any tool<br/>you already <em>use.</em></h2>
            <p className="section-p">Connect your AI coding tools, dev workflow, and communication stack in minutes. Context flows automatically.</p>
          </div>

          <div className="popular-ints reveal">
            <img src="/components/Claude.svg" alt="Claude Code" className="pop-int-logo"/>
            <img src="/components/OpenClaw.svg" alt="OpenClaw" className="pop-int-logo"/>
            <img src="/components/GitHub.svg" alt="GitHub" className="pop-int-logo"/>
            <img src="/components/Linear.svg" alt="Linear" className="pop-int-logo"/>
            <img src="/components/Jira.svg" alt="Jira" className="pop-int-logo"/>
            <img src="/components/Notion.svg" alt="Notion" className="pop-int-logo"/>
            <img src="/components/Gmail.svg" alt="Gmail" className="pop-int-logo"/>
            <div className="int-more">+30 more</div>
          </div>

          <div className="ints-diagram reveal">
            <div className="id-header">// How context flows</div>
            <div className="id-flow">
              <div className="id-step">
                <div className="ids-icon">📊</div>
                <div className="ids-label">Connect</div>
                <div className="ids-desc">Attach nodes to your tools in minutes</div>
              </div>
              <div className="id-arrow">→</div>
              <div className="id-step">
                <div className="ids-icon">🧠</div>
                <div className="ids-label">Context</div>
                <div className="ids-desc">AI context stored locally, indexed automatically</div>
              </div>
              <div className="id-arrow">→</div>
              <div className="id-step">
                <div className="ids-icon">⚡</div>
                <div className="ids-label">Enrich</div>
                <div className="ids-desc">Every AI query gets smarter automatically</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="nodes" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Context nodes</div>
            <h2 className="section-h">Every signal,<br/><em>captured.</em></h2>
            <p className="section-p">Each node is a lightweight local agent that listens to a source, summarises what matters, and writes it to the shared context store. Plug in only what you need.</p>
          </div>
          <div className="nodes-grid">
            <div className="node-card">
              <span className="node-icon">⌥</span>
              <h4>GitHub Repos & Changelogs</h4>
              <p>Indexes PRs, commits, reviews, and changelogs. Captures architectural decisions, reverts, and code patterns your team has settled on.</p>
              <div className="node-status"><span className="ns-dot"></span>Streaming diffs</div>
            </div>
            <div className="node-card">
              <span className="node-icon">◈</span>
              <h4>Jira / Linear / Project Boards</h4>
              <p>Tracks sprint state, priorities, blockers, and acceptance criteria. Your AI always knows what's in-scope this cycle and what's been deprioritised.</p>
              <div className="node-status"><span className="ns-dot"></span>Live sync</div>
            </div>
            <div className="node-card">
              <span className="node-icon">◎</span>
              <h4>Meetings & Voice Transcripts</h4>
              <p>Joins Google Meet, Zoom, Teams, and offline recordings. Extracts decisions, action items, and sentiment signals from every conversation.</p>
              <div className="node-status"><span className="ns-dot"></span>Real-time transcription</div>
            </div>
            <div className="node-card">
              <span className="node-icon">⬡</span>
              <h4>AI Coding Sessions</h4>
              <p>Logs every Claude Code, Cursor, and Copilot session — what was tried, what failed, what shipped. Prevents teams from re-investigating dead ends.</p>
              <div className="node-status"><span className="ns-dot"></span>Session capture</div>
            </div>
            <div className="node-card">
              <span className="node-icon">◆</span>
              <h4>Sales & Client Calls</h4>
              <p>Extracts objections, commitments, competitor mentions, and deal blockers from every client conversation via Gong, Chorus, and direct recording.</p>
              <div className="node-status"><span className="ns-dot"></span>Call analysis</div>
            </div>
            <div className="node-card">
              <span className="node-icon">✦</span>
              <h4>Product Requirement Docs</h4>
              <p>Parses PRDs, RFCs, and design docs from Notion, Confluence, and Google Docs. Keeps AI agents aligned with what was agreed, not what was assumed.</p>
              <div className="node-status"><span className="ns-dot"></span>Doc indexing</div>
            </div>
            <div className="node-card">
              <span className="node-icon">⊕</span>
              <h4>Chat & Email</h4>
              <p>Monitors Slack, Teams, Discord, Gmail, and Outlook for informal decisions, escalations, and alignment moments that never make it into formal docs.</p>
              <div className="node-status"><span className="ns-dot"></span>Message monitoring</div>
            </div>
            <div className="node-card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
              <span className="node-icon" style={{ opacity: 0.4 }}>+</span>
              <h4 style={{ color: 'var(--muted)' }}>Custom nodes</h4>
              <p>Connect any internal tool via the MemexHQ Node SDK. If it has an API or produces logs, it can be a context source.</p>
              <div className="node-status" style={{ color: 'var(--dim)' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dim)', display: 'inline-block', marginRight: 4 }}></span>Coming soon</div>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stats-inner">
            <div className="stat-item reveal"><div className="stat-val">0</div><div className="stat-label">bytes leave your<br/>local network</div></div>
            <div className="stat-item reveal"><div className="stat-val">40<em>+</em></div><div className="stat-label">integrations<br/>at launch</div></div>
            <div className="stat-item reveal"><div className="stat-val">&lt;80<em>ms</em></div><div className="stat-label">context retrieval<br/>latency</div></div>
            <div className="stat-item reveal"><div className="stat-val">100<em>%</em></div><div className="stat-label">open source<br/>coming soon</div></div>
            <div className="stat-item reveal"><div className="stat-val">all</div><div className="stat-label">AI agents<br/>supported</div></div>
        </div>
      </div>

      <section>
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Security & Privacy</div>
            <h2 className="section-h">Your network.<br/><em>Your data.</em> Full stop.</h2>
            <p className="section-p">MemexHQ was designed from day one for enterprises with strict data requirements. Your institutional knowledge never touches our servers.</p>
          </div>
          <div className="privacy-grid">
            <div className="privacy-features">
              <div className="pf">
                <div className="pf-icon">🔒</div>
                <div className="pf-body">
                  <h4>Air-gapped by design</h4>
                  <p>The context server runs entirely on your local network. No data is sent to MemexHQ's servers. Ever. Air-gapped deployment available for maximum compliance.</p>
                </div>
              </div>
              <div className="pf">
                <div className="pf-icon">⚡</div>
                <div className="pf-body">
                  <h4>Distributed vector store</h4>
                  <p>Context is stored across nodes in your network. No single point of failure, no vendor lock-in on your company's institutional memory.</p>
                </div>
              </div>
              <div className="pf">
                <div className="pf-icon">🎯</div>
                <div className="pf-body">
                  <h4>Permission-aware retrieval</h4>
                  <p>Context is scoped to the querying user's access level. Engineers don't see sales data unless permitted. Fully configurable RBAC.</p>
                </div>
              </div>
              <div className="pf">
                <div className="pf-icon">📋</div>
                <div className="pf-body">
                  <h4>Full audit trail</h4>
                  <p>Every context retrieval is logged locally. Know exactly what business context was injected into any AI session, by who, and when.</p>
                </div>
              </div>
              <div className="pf">
                <div className="pf-icon">🛡️</div>
                <div className="pf-body">
                  <h4>SOC 2 Type II in progress</h4>
                  <p>GDPR compliant. SAML SSO supported. Enterprise SLA available. We meet your compliance requirements, not the other way around.</p>
                </div>
              </div>
            </div>
            <div className="network-diagram">
              <div className="arch-label" style={{ textAlign: 'left' }}>// Your local network boundary</div>
              <div className="nd-canvas" id="ndCanvas"><div className="nd-center">🖥️</div></div>
              <div className="nd-label">All nodes · vector DB · AI enrichment → local only · zero cloud egress</div>
            </div>
          </div>
        </div>
      </section>

      <section id="signup">
        <div className="signup-inner">
          <div className="signup-left">
            <div className="section-label reveal">Open source</div>
            <h2 className="section-h reveal">Be first to<br/><em>plug in.</em></h2>
            <p className="section-p reveal">We're building the context layer that makes every AI agent in your stack dramatically smarter. Drop your email to get notified when we open source — plus early contributor access.</p>
          </div>
          <div className="form-card reveal">
            {!submitted ? (
              <>
                <div className="form-card-header">
                  <p>Get notified</p>
                  <h3>Join the list</h3>
                </div>
                <form className="sform" onSubmit={handleSubmit} noValidate>
                  <div className={`sfield ${emailError ? 'err' : ''}`} id="sf-email">
                    <label htmlFor="memail">Email</label>
                    <input type="email" id="memail" name="email" placeholder="you@company.com" autoComplete="email"/>
                    <div className="serror">Please enter a valid email.</div>
                  </div>
                  <div className={`sfield ${companyError ? 'err' : ''}`} id="sf-company">
                    <label htmlFor="mcompany">Company / Project</label>
                    <input type="text" id="mcompany" name="company" placeholder="Acme Corp"/>
                    <div className="serror">Please enter your company or project name.</div>
                  </div>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Get Notified →'}
                  </button>
                  <div className="form-note">No spam. We'll email you when we open source and invite early contributors.</div>
                </form>
              </>
            ) : (
              <div className="signup-success show">
                <div className="s-icon">✓</div>
                <h4>You're on the list.</h4>
                <p>We'll email you when MemexHQ goes open source.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="nav-logo" style={{ textDecoration: 'none' }}>
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
            </a>
            <p>Your AI finally knows your business. All context local. All agents smarter. Zero setup after day one.</p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <a href="#how">How it works</a>
            <a href="#demo">Demo</a>
            <a href="#integrations">Integrations</a>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="mailto:hello@memexhq.dev">Contact</a>
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
          <span>© 2026 MemexHQ. Open source soon.</span>
          <span>Your AI finally knows your business.</span>
          <span>memexhq.dev</span>
        </div>
      </footer>
    </>
  )
}

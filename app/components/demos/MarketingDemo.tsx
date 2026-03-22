'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import styles from './demos.module.css'

interface ContextNode {
  tag: string
  tagClass: string
  text: string
}

const contextNodes: ContextNode[] = [
  { tag: 'Salesforce · Stripe call · 2d ago', tagClass: 'tsf', text: 'Main objection: <b>SSO and audit logs missing.</b> Enterprise tier resolves this.' },
  { tag: 'PRD · v2.4', tagClass: 'tprd', text: 'Enterprise includes <b>SAML SSO, RBAC, 90-day audit log, SLA 99.9%.</b>' },
  { tag: 'Slack · #marketing', tagClass: 'tslack', text: 'Positioning agreed: <b>lead with security and compliance,</b> not feature count.' },
  { tag: 'Gong · Notion call', tagClass: 'tgong', text: 'Competing against <b>Glean</b> — differentiate on <b>local-only deployment.</b>' },
]

const postLines = [
  { html: '<span class="' + styles.bold + '">We\'re launching MemexHQ Enterprise.</span>' },
  { html: '' },
  { html: 'For teams where AI touching company data isn\'t optional.' },
  { html: 'It\'s a requirement to audit it.' },
  { html: '' },
  { html: 'Enterprise includes:' },
  { html: '→ <span class="' + styles.bold + '">SAML SSO</span> + RBAC' },
  { html: '→ <span class="' + styles.bold + '">90-day audit log</span> of every context retrieval' },
  { html: '→ <span class="' + styles.bold + '">Zero cloud egress.</span> Your data never leaves your network.' },
  { html: '→ 99.9% SLA' },
  { html: '' },
  { html: 'Unlike cloud-based tools — every context query' },
  { html: 'runs on your infrastructure. Air-gapped available.' },
  { html: '' },
  { html: '<span class="' + styles.tagText + '">#EnterpriseAI</span> <span class="' + styles.tagText + '">#Security</span> <span class="' + styles.tagText + '">#Compliance</span>' },
]

const command = 'write a LinkedIn post announcing our enterprise tier'
const enrichedPrompt = '"Announce enterprise tier on LinkedIn. Lead with security: SAML SSO, audit logs, local deployment. Target CTOs/security teams. Differentiator vs Glean: zero cloud egress. Tone: confident, technical, not salesy. Agreed positioning: compliance first."'

export default function MarketingDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showCtxPanel, setShowCtxPanel] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showPostCard, setShowPostCard] = useState(false)
  const [visiblePostLines, setVisiblePostLines] = useState<number[]>([])
  const [showNote, setShowNote] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showPostCard, visiblePostLines, showNote])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setScanText('')
    setShowCtxPanel(false)
    setVisibleNodes([])
    setShowEnriched(false)
    setShowPostCard(false)
    setVisiblePostLines([])
    setShowNote(false)
    setShowReplay(false)
  }, [])

  const replay = useCallback(() => {
    reset()
    setTimeout(() => setStep(1), 100)
  }, [reset])

  useEffect(() => {
    const timeout = setTimeout(() => setStep(1), 600)
    return () => clearTimeout(timeout)
  }, [])

  // Step 1: Type command
  useEffect(() => {
    if (step !== 1) return
    let i = 0
    const interval = setInterval(() => {
      if (i <= command.length) {
        setCmdText(command.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(2), 450)
      }
    }, 52)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('memexhq · scanning context...')
    const timeout = setTimeout(() => {
      setScanText('memexhq · context retrieved — 4 nodes matched')
      setTimeout(() => setStep(3), 300)
    }, 800)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 3: Show context panel
  useEffect(() => {
    if (step !== 3) return
    setShowCtxPanel(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < contextNodes.length) {
        setVisibleNodes(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(4), 300)
      }
    }, 380)
    return () => clearInterval(interval)
  }, [step])

  // Step 4: Show enriched prompt
  useEffect(() => {
    if (step !== 4) return
    setShowEnriched(true)
    const timeout = setTimeout(() => setStep(5), 700)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 5: Show post card
  useEffect(() => {
    if (step !== 5) return
    setShowPostCard(true)
    setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < postLines.length) {
          setVisiblePostLines(prev => [...prev, i])
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setStep(6), 400)
        }
      }, 60)
    }, 200)
  }, [step])

  // Step 6: Show note and replay
  useEffect(() => {
    if (step !== 6) return
    setShowNote(true)
    setTimeout(() => setShowReplay(true), 300)
  }, [step])

  return (
    <div className={styles.demoWrap}>
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <div className={styles.urlBar}>claude.ai/chat</div>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.chatUi}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarLogo}>Claude <span>×</span> Memex</div>
            <button className={styles.newChat}>+ New chat</button>
            <div className={`${styles.chatItem} ${styles.active}`}>LinkedIn post — enterprise</div>
            <div className={styles.chatItem}>Q3 board update draft</div>
            <div className={styles.chatItem}>Onboarding email seq.</div>
            <div className={styles.chatItem}>Pitch deck outline</div>
          </div>
          <div className={styles.chatMain}>
            <div className={styles.chatHeader}>
              <span className={styles.chatModel}>Claude Sonnet · memexhq plugin</span>
              <div className={styles.memexStatus}>
                <div className={styles.sdot}></div> context server active
              </div>
            </div>
            <div className={styles.messages} ref={messagesRef}>
              {/* User message */}
              <div className={styles.msgUser}>
                <div className={styles.bubbleUser}>
                  {cmdText}{step === 1 && <span className={styles.cursorInline}></span>}
                </div>
              </div>

              {/* Scanning indicator */}
              {step >= 2 && (
                <div style={{ fontSize: '11px', color: 'rgba(62,207,142,0.5)', padding: '2px 0', opacity: scanText ? 1 : 0, transition: 'opacity 0.3s' }}>
                  {scanText}
                </div>
              )}

              {/* Context panel */}
              {showCtxPanel && (
                <div className={`${styles.ctxPanel} ${styles.show}`}>
                  <div className={styles.ctxHeader}>
                    <span className={styles.ctxIcon}>⬡</span>
                    <span>memexhq · business context injected</span>
                    <span className={styles.ctxCount}>4 nodes</span>
                  </div>
                  {contextNodes.map((node, i) => (
                    <div
                      key={i}
                      className={`${styles.ctxNode} ${visibleNodes.includes(i) ? styles.show : ''}`}
                    >
                      <span className={`${styles.ctag} ${styles[node.tagClass]}`}>{node.tag}</span>
                      <span className={styles.ctxText} dangerouslySetInnerHTML={{ __html: node.text }}></span>
                    </div>
                  ))}
                </div>
              )}

              {/* Enriched prompt */}
              {showEnriched && (
                <div className={`${styles.enriched} ${styles.show}`}>
                  <div className={styles.elabel}>enriched prompt sent to claude</div>
                  <span className={styles.qt}>{enrichedPrompt}</span>
                </div>
              )}

              {/* Assistant response - LinkedIn post */}
              {showPostCard && (
                <div className={styles.msgAssistant}>
                  <div className={styles.avatar} style={{ background: '#F4F3EE' }}><Image src="/components/Claude.svg" alt="Claude" width={16} height={16} className={styles.logoImg} /></div>
                  <div className={styles.bubbleAssistant}>
                    <div className={`${styles.postCard} ${styles.show}`}>
                      <div className={styles.postHeader}>
                        <div className={styles.liAvatar}>M</div>
                        <div>
                          <div className={styles.postAuthor}>MemexHQ</div>
                          <div className={styles.postTitleSm}>The AI that knows your business · Just now</div>
                        </div>
                        <div className={styles.liLogo}>in</div>
                      </div>
                      <div className={styles.postBody}>
                        {postLines.map((line, i) => (
                          <span
                            key={i}
                            className={`${styles.postLine} ${visiblePostLines.includes(i) ? styles.show : ''}`}
                            dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
                          ></span>
                        ))}
                      </div>
                      <div className={styles.postFooter}>
                        <span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assistant note */}
              {showNote && (
                <div className={`${styles.assistNote} ${styles.show}`}>
                  Drafted from your actual PRD, sales call objections, and marketing positioning. No hallucinated features. Hit the mark on the first shot.
                </div>
              )}
            </div>

            {showReplay && (
              <>
                <div className={styles.inputBar}>
                  <div className={styles.inputRow}>
                    <span className={styles.inputText}>Message Claude...</span>
                    <div className={styles.sendBtn}>↑</div>
                  </div>
                </div>
                <button className={styles.replay} onClick={replay}>↺ replay</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

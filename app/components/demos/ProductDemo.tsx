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
  { tag: 'PRD · v1.9 · Notion', tagClass: 'tprd', text: 'Notifications must support <b>in-app + email.</b> Digest mode required. Quiet hours 22:00–08:00 UTC. P1 for Q3.' },
  { tag: 'Jira · NOTIF-12', tagClass: 'tjira', text: 'Acceptance criteria: <b>per-user delivery prefs,</b> unsubscribe flow, <b>max 1 email/hr digest</b> for enterprise tier.' },
  { tag: 'Slack · #product · Mon', tagClass: 'tslack', text: 'Team decided: <b>event-driven via existing bus</b> (src/events/bus.ts). No polling. Approved in design review.' },
  { tag: 'Gong · Orbit Co. call', tagClass: 'tgong', text: 'Orbit (biggest client) explicitly needs <b>digest mode</b> and the ability to <b>whitelist notification types.</b>' },
]

const agentSteps = [
  { icon: '✓', cls: 'stepDone', text: '<b>Read</b> src/events/bus.ts — event schema confirmed' },
  { icon: '✓', cls: 'stepDone', text: '<b>Read</b> src/middleware/ — existing patterns found' },
  { icon: '✓', cls: 'stepDone', text: '<b>Created</b> src/notifications/types.ts — delivery prefs interface' },
  { icon: '✓', cls: 'stepDone', text: '<b>Created</b> src/notifications/dispatcher.ts — quiet hours + digest logic' },
  { icon: '✓', cls: 'stepDone', text: '<b>Created</b> src/notifications/digestQueue.ts — 1/hr flush, whitelist filter' },
  { icon: '~', cls: 'stepRun', text: '<b>Writing</b> tests/notifications.test.ts...' },
]

const codeLines = [
  { html: '<span class="' + styles.cm + '">// src/notifications/dispatcher.ts — extends existing pattern</span>' },
  { html: '<span class="' + styles.kw + '">import</span> { bus } <span class="' + styles.kw + '">from</span> <span class="' + styles.st + '">\'../events/bus\'</span>;  <span class="' + styles.cm + '">// per design review</span>' },
  { html: '<span class="' + styles.kw + '">import</span> { DigestQueue } <span class="' + styles.kw + '">from</span> <span class="' + styles.st + '">\'./digestQueue\'</span>;' },
  { html: '' },
  { html: '<span class="' + styles.kw + '">const</span> QUIET = { start:<span class="' + styles.nm + '">22</span>, end:<span class="' + styles.nm + '">8</span> }; <span class="' + styles.cm + '">// UTC, per PRD v1.9</span>' },
  { html: '' },
  { html: '<span class="' + styles.kw + '">export async function</span> <span class="' + styles.fn + '">dispatch</span>(userId, event) {' },
  { html: '  <span class="' + styles.kw + '">const</span> prefs = <span class="' + styles.kw + '">await</span> <span class="' + styles.fn + '">getUserPrefs</span>(userId);' },
  { html: '  <span class="' + styles.cm + '">// Orbit Co: whitelist filter</span>' },
  { html: '  <span class="' + styles.kw + '">if</span> (!prefs.whitelist.<span class="' + styles.fn + '">includes</span>(event.type)) <span class="' + styles.kw + '">return</span>;' },
  { html: '  <span class="' + styles.kw + '">if</span> (prefs.digestMode)' },
  { html: '    <span class="' + styles.kw + '">return</span> DigestQueue.<span class="' + styles.fn + '">enqueue</span>(userId, event);' },
  { html: '  <span class="' + styles.kw + '">if</span> (<span class="' + styles.fn + '">isQuietHours</span>(QUIET)) <span class="' + styles.kw + '">return</span> <span class="' + styles.fn + '">queue</span>(userId, event);' },
  { html: '  <span class="' + styles.kw + '">await</span> <span class="' + styles.fn + '">sendNow</span>(userId, event);' },
  { html: '}' },
]

const command = 'build a spec and scaffold for the user notifications feature'
const enrichedPrompt = '"Build notification feature scaffold. Event-driven via src/events/bus.ts. Support in-app + email, digest mode (max 1/hr), quiet hours 22–08 UTC. Per-user prefs with whitelist. Orbit Co. requires digest + type whitelist. Follow existing middleware patterns."'

export default function ProductDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showCtxPanel, setShowCtxPanel] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [showSpec, setShowSpec] = useState(false)
  const [visibleCodeLines, setVisibleCodeLines] = useState<number[]>([])
  const [showNote, setShowNote] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const [showRunBtn, setShowRunBtn] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showSteps, visibleSteps, showSpec, visibleCodeLines, showNote])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setScanText('')
    setShowCtxPanel(false)
    setVisibleNodes([])
    setShowEnriched(false)
    setShowSteps(false)
    setVisibleSteps([])
    setShowSpec(false)
    setVisibleCodeLines([])
    setShowNote(false)
    setShowReplay(false)
    setShowRunBtn(false)
  }, [])

  const replay = useCallback(() => {
    reset()
    setTimeout(() => setStep(1), 100)
  }, [reset])

  useEffect(() => {
    const timeout = setTimeout(() => setStep(1), 700)
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
        setShowRunBtn(true)
        setTimeout(() => setStep(2), 500)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('memexhq · scanning product context...')
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
    }, 350)
    return () => clearInterval(interval)
  }, [step])

  // Step 4: Show enriched prompt
  useEffect(() => {
    if (step !== 4) return
    setShowEnriched(true)
    const timeout = setTimeout(() => setStep(5), 700)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 5: Show agent steps
  useEffect(() => {
    if (step !== 5) return
    setShowSteps(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < agentSteps.length) {
        setVisibleSteps(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(6), 400)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [step])

  // Step 6: Show spec block
  useEffect(() => {
    if (step !== 6) return
    setShowSpec(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < codeLines.length) {
        setVisibleCodeLines(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(7), 300)
      }
    }, 85)
    return () => clearInterval(interval)
  }, [step])

  // Step 7: Show note and replay
  useEffect(() => {
    if (step !== 7) return
    setShowNote(true)
    setTimeout(() => setShowReplay(true), 300)
  }, [step])

  return (
    <div className={styles.demoWrap}>
      <div className={styles.browser} style={{ background: '#111' }}>
        <div className={styles.browserBar} style={{ background: '#1a1a1a' }}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <div className={styles.urlBar}>platform.openai.com/codex</div>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.codexUi}>
          <div className={styles.codexSidebar}>
            <div className={styles.cxLogo}>
              <div className={styles.cxIcon}><Image src="/components/OpenAI.svg" alt="OpenAI" width={14} height={14} className={styles.logoImg} /></div>
              Codex
            </div>
            <div className={styles.cxSection}>Agents</div>
            <div className={`${styles.cxItem} ${styles.active}`}>
              <div className={`${styles.cxDot} ${styles.run}`}></div>
              notification spec
            </div>
            <div className={styles.cxItem}>
              <div className={`${styles.cxDot} ${styles.done}`}></div>
              auth refactor
            </div>
            <div className={styles.cxItem}>
              <div className={`${styles.cxDot} ${styles.done}`}></div>
              billing webhooks
            </div>
            <div className={styles.cxSection}>History</div>
            <div className={styles.cxItem}>
              <div className={`${styles.cxDot} ${styles.done}`}></div>
              search indexer
            </div>
            <div className={styles.cxItem}>
              <div className={`${styles.cxDot} ${styles.done}`}></div>
              export pipeline
            </div>
          </div>
          <div className={styles.codexMain}>
            <div className={styles.cxHeader}>
              <span className={styles.cxTitle}>codex-1 · agent mode</span>
              <div className={styles.memexBadge}>
                <div className={styles.mbdot}></div> memexhq · product context
              </div>
            </div>
            <div className={styles.cxTaskArea}>
              <div className={styles.cxTaskLabel}>Task</div>
              <div className={styles.cxTaskBox}>
                {cmdText}{step === 1 && <span className={styles.cursor}></span>}
              </div>
              {showRunBtn && <button className={styles.cxRunBtn}>▶ Run agent</button>}
            </div>
            <div className={styles.cxOutput} ref={outputRef}>
              {/* Scanning */}
              {step >= 2 && (
                <div className={`${styles.scanLine} ${scanText ? styles.show : ''}`}>
                  {scanText}
                </div>
              )}

              {/* Context panel */}
              {showCtxPanel && (
                <div className={`${styles.ctxPanel} ${styles.show}`}>
                  <div className={styles.ctxHeader}>
                    ⬡ memexhq · product context injected <span className={styles.ctxCount}>4 nodes</span>
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
                  <div className={styles.elabel}>enriched task sent to codex</div>
                  <span className={styles.qt}>{enrichedPrompt}</span>
                </div>
              )}

              {/* Agent steps */}
              {showSteps && (
                <div className={`${styles.agentSteps} ${styles.show}`}>
                  <div className={styles.stepLabel}>// agent running</div>
                  {agentSteps.map((s, i) => (
                    <div
                      key={i}
                      className={`${styles.step} ${visibleSteps.includes(i) ? styles.show : ''}`}
                    >
                      <span className={`${styles.stepIcon} ${styles[s.cls]}`}>{s.icon}</span>
                      <span className={styles.stepText} dangerouslySetInnerHTML={{ __html: s.text }}></span>
                    </div>
                  ))}
                </div>
              )}

              {/* Spec block */}
              {showSpec && (
                <div className={`${styles.specBlock} ${styles.show}`}>
                  <div className={styles.specLabel}>// src/notifications/dispatcher.ts</div>
                  {codeLines.map((line, i) => (
                    <span
                      key={i}
                      className={`${styles.specLine} ${visibleCodeLines.includes(i) ? styles.show : ''}`}
                      dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
                    ></span>
                  ))}
                </div>
              )}

              {/* Note */}
              {showNote && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', padding: '4px 0', opacity: 1, transition: 'opacity 0.4s' }}>
                  Built to spec, client requirements baked in, no back-and-forth. Agent knew the constraints before writing a line.
                </div>
              )}

              {showReplay && (
                <button className={styles.replay} onClick={replay}>↺ replay</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import styles from './demos.module.css'

interface ContextNode {
  tag: string
  tagClass: string
  text: string
}

const contextNodes: ContextNode[] = [
  { tag: 'GitHub · 3d ago', tagClass: 'tgh', text: 'PR #412 reverted Redis-based rate limiter — <b>latency spike under 500 rps.</b> Root cause: connection pool misconfigured.' },
  { tag: 'Jira · SPRINT-88', tagClass: 'tjr', text: 'Auth hardening is <b>P0 this sprint.</b> Requirement: <b>100 req/min per user, sliding window.</b>' },
  { tag: 'Standup · Tue', tagClass: 'tsd', text: 'Team agreed <b>token bucket</b> over leaky bucket after benchmarking.' },
  { tag: 'Claude Code · 7d ago', tagClass: 'tcc', text: 'Existing middleware pattern in <b>src/middleware/throttle.ts.</b>' },
]

const codeLines = [
  { html: '<span class="cm">// src/middleware/throttle.ts — extends existing pattern</span>' },
  { html: '<span class="kw">import</span> { TokenBucket } <span class="kw">from</span> <span class="st">\'./tokenBucket\'</span>;' },
  { html: '<span class="cm">// in-memory only — Redis reverted PR #412</span>' },
  { html: '' },
  { html: '<span class="kw">const</span> buckets = <span class="kw">new</span> <span class="fn">Map</span>&lt;<span class="kw">string</span>, TokenBucket&gt;();' },
  { html: '' },
  { html: '<span class="kw">export const</span> <span class="fn">authRateLimit</span> = (req, res, next) => {' },
  { html: '  <span class="kw">const</span> uid = req.user?.id ?? req.ip;' },
  { html: '  <span class="kw">if</span> (!buckets.<span class="fn">has</span>(uid))' },
  { html: '    buckets.<span class="fn">set</span>(uid, <span class="kw">new</span> <span class="fn">TokenBucket</span>({' },
  { html: '      capacity: <span class="nm">100</span>,  <span class="cm">// req/min per SPRINT-88</span>' },
  { html: '      window:   <span class="st">\'sliding\'</span>,' },
  { html: '    }));' },
  { html: '  <span class="kw">if</span> (!buckets.<span class="fn">get</span>(uid).<span class="fn">consume</span>())' },
  { html: '    <span class="kw">return</span> res.<span class="fn">status</span>(<span class="nm">429</span>).<span class="fn">json</span>({ error: <span class="st">\'rate limit exceeded\'</span> });' },
  { html: '  <span class="fn">next</span>();' },
  { html: '};' },
]

const command = 'implement rate limiting for the /auth endpoint'
const enrichedPrompt = '"Implement rate limiting for /auth. Use token bucket (100 req/min/user, sliding window). Avoid Redis connection pool — prefer in-memory with periodic flush. Extend existing pattern at src/middleware/throttle.ts. Previous attempt PR #412 failed due to pool config."'

export default function EngineeringDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [visibleCodeLines, setVisibleCodeLines] = useState<number[]>([])
  const [showReplay, setShowReplay] = useState(false)
  const [scanText, setScanText] = useState('')
  const screenRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showResult, visibleCodeLines])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setVisibleNodes([])
    setShowEnriched(false)
    setShowResult(false)
    setVisibleCodeLines([])
    setShowReplay(false)
    setScanText('')
  }, [])

  const replay = useCallback(() => {
    reset()
    setTimeout(() => setStep(1), 100)
  }, [reset])

  // Start animation on mount
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
        setTimeout(() => setStep(2), 500)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('// scanning context...')
    const timeout = setTimeout(() => {
      setScanText('// context retrieved — 4 nodes matched')
      setTimeout(() => setStep(3), 300)
    }, 700)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 3: Show context nodes one by one
  useEffect(() => {
    if (step !== 3) return
    let i = 0
    const interval = setInterval(() => {
      if (i < contextNodes.length) {
        setVisibleNodes(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(4), 300)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [step])

  // Step 4: Show enriched prompt
  useEffect(() => {
    if (step !== 4) return
    setShowEnriched(true)
    const timeout = setTimeout(() => setStep(5), 700)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 5: Show code result
  useEffect(() => {
    if (step !== 5) return
    setShowResult(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < codeLines.length) {
        setVisibleCodeLines(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setShowReplay(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [step])

  return (
    <div className={styles.demoWrap}>
      <div className={styles.terminal}>
        <div className={styles.titlebar}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <span className={styles.titleCenter}>claude-code — ~/acme/api</span>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.screen} ref={screenRef}>
          <div className={styles.line}>
            <span className={styles.ps}>$</span>
            <span>{cmdText}{step === 1 && <span className={styles.cursor}></span>}</span>
          </div>

          {step >= 2 && (
            <>
              <div className={styles.spacer}></div>
              <div className={styles.comment}>{scanText}</div>
            </>
          )}

          {step >= 3 && (
            <>
              <div className={styles.spacerSm}></div>
              {contextNodes.map((node, i) => (
                <div
                  key={i}
                  className={`${styles.node} ${visibleNodes.includes(i) ? styles.show : ''}`}
                >
                  <span className={`${styles.tag} ${styles[node.tagClass]}`}>{node.tag}</span>
                  <span className={styles.nodeBody} dangerouslySetInnerHTML={{ __html: node.text }}></span>
                </div>
              ))}
            </>
          )}

          {showEnriched && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.comment}>// enriched prompt sent to AI</div>
              <div className={`${styles.enrichedBox} ${styles.show}`}>
                <span className={styles.hl}>{enrichedPrompt}</span>
              </div>
            </>
          )}

          {showResult && (
            <>
              <div className={styles.divider}></div>
              <div className={`${styles.resultBlock} ${styles.show}`}>
                <div className={styles.resultLabel}>// result — production-ready on first attempt</div>
                <div className={styles.code}>
                  {codeLines.map((line, i) => (
                    <span
                      key={i}
                      className={`${styles.cl} ${visibleCodeLines.includes(i) ? styles.show : ''}`}
                      dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
                    ></span>
                  ))}
                </div>
              </div>
            </>
          )}

          {showReplay && (
            <button className={styles.replay} onClick={replay}>↺ replay</button>
          )}
        </div>
        <div className={styles.statusbar}>
          <div className={styles.sdot}></div>
          <span>context server · local network only · 0 bytes egress</span>
          <span className={styles.ml}>4 nodes matched</span>
        </div>
      </div>
    </div>
  )
}

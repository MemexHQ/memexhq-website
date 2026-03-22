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
  { tag: 'Notion · Offer letter', tagClass: 'tnotion', text: 'Marcus joining as <b>Senior Backend Eng.</b> Salary: £90k. <b>Start: Monday.</b> Reports to Sarah Chen. Team: Platform.' },
  { tag: 'HR system · handbook', tagClass: 'thr', text: 'Standard onboarding: <b>30-60-90 day plan.</b> Security training mandatory day 1. Stack walkthrough week 1.' },
  { tag: 'Slack · #platform · Wed', tagClass: 'tslack', text: 'Team flagged: <b>auth service refactor in progress.</b> New joiners should avoid that codebase for 2 weeks.' },
  { tag: 'Standup · Fri', tagClass: 'tmeet', text: 'Sarah noted: Marcus has <b>Kafka experience.</b> Fast-track him to the <b>event bus project</b> after ramp-up.' },
]

const docLines = [
  { html: '<span class="' + styles.docSection + '">Day 1</span>' },
  { html: '<span class="' + styles.docCheck + '">✓</span><span class="' + styles.docBold + '">Security training</span> — mandatory, book before Monday' },
  { html: '<span class="' + styles.docCheck + '">✓</span>IT setup: laptop, GitHub, Slack, 1Password' },
  { html: '<span class="' + styles.docCheck + '">✓</span>Meet Sarah (1:1 intro) + Platform team standup' },
  { html: '<span class="' + styles.docSection + '">Week 1 — 30 days</span>' },
  { html: '<span class="' + styles.docCheck + '">✓</span>Architecture walkthrough — <span class="' + styles.docBold + '">avoid auth service</span> (refactor active)' },
  { html: '<span class="' + styles.docCheck + '">✓</span>First ticket: low-risk bug in notifications or billing' },
  { html: '<span class="' + styles.docCheck + '">✓</span>Read: API conventions doc, deployment runbook' },
  { html: '<span class="' + styles.docSection + '">Days 30–60</span>' },
  { html: '<span class="' + styles.docCheck + '">✓</span>Own a feature end-to-end with PR review' },
  { html: '<span class="' + styles.docCheck + '">✓</span><span class="' + styles.docBold + '">Event bus project intro</span> — Kafka background → fast-track' },
  { html: '<span class="' + styles.docSection + '">Days 60–90</span>' },
  { html: '<span class="' + styles.docCheck + '">✓</span>Lead design on an event bus component' },
  { html: '<span class="' + styles.docCheck + '">✓</span>30-day check-in with Sarah' },
]

const command = 'create an onboarding plan for Marcus — starting Monday as senior backend engineer'
const enrichedPrompt = '"Build 30-60-90 onboarding plan for Marcus. Senior Backend Eng, Platform team, reports to Sarah. Mandatory security training day 1. Avoid auth service codebase for 2 weeks (refactor in progress). Marcus has Kafka background. Fast-track to event bus project post-ramp."'

export default function HRDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showCtxPanel, setShowCtxPanel] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showDocCard, setShowDocCard] = useState(false)
  const [visibleDocLines, setVisibleDocLines] = useState<number[]>([])
  const [showNote, setShowNote] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const workspaceRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollTop = workspaceRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showDocCard, visibleDocLines, showNote])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setScanText('')
    setShowCtxPanel(false)
    setVisibleNodes([])
    setShowEnriched(false)
    setShowDocCard(false)
    setVisibleDocLines([])
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
        setTimeout(() => setStep(2), 500)
      }
    }, 48)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('memexhq · scanning HR context...')
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

  // Step 5: Show doc card
  useEffect(() => {
    if (step !== 5) return
    setShowDocCard(true)
    setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < docLines.length) {
          setVisibleDocLines(prev => [...prev, i])
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setStep(6), 400)
        }
      }, 100)
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
      <div className={styles.browser} style={{ background: '#1f1e1a' }}>
        <div className={styles.browserBar} style={{ background: '#262520' }}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <div className={styles.urlBar} style={{ color: 'rgba(255,255,255,0.28)' }}>cowork.anthropic.com</div>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.cwUi}>
          <div className={styles.cwSidebar}>
            <div className={styles.cwLogo}>
              <div className={styles.cwIcon}><Image src="/components/Claude.svg" alt="Claude" width={14} height={14} className={styles.logoImg} /></div>
              CoWork
            </div>
            <div className={styles.cwSection}>Workspace</div>
            <div className={`${styles.cwItem} ${styles.active}`}>
              <span className={styles.cwItemIcon}>◎</span>HR tasks
            </div>
            <div className={styles.cwItem}>
              <span className={styles.cwItemIcon}>✦</span>Recruiting
            </div>
            <div className={styles.cwItem}>
              <span className={styles.cwItemIcon}>⬡</span>Onboarding
            </div>
            <div className={styles.cwSection}>Recent</div>
            <div className={styles.cwItem}>
              <span className={styles.cwItemIcon}>◈</span>Offer letter — Priya
            </div>
            <div className={styles.cwItem}>
              <span className={styles.cwItemIcon}>◆</span>Performance cycle
            </div>
            <div className={styles.cwItem}>
              <span className={styles.cwItemIcon}>⌥</span>Benefits update
            </div>
          </div>
          <div className={styles.cwMain}>
            <div className={styles.cwHeader}>
              <span className={styles.cwTitle}>Claude CoWork · HR automation</span>
              <div className={styles.memexBadge}>
                <div className={styles.mbdot}></div> memexhq · hr context
              </div>
            </div>
            <div className={styles.cwWorkspace} ref={workspaceRef}>
              {/* Task card */}
              <div className={styles.taskCard}>
                <div className={styles.taskLabel}>Task</div>
                <div className={styles.taskText}>
                  {cmdText}{step === 1 && <span className={styles.cursor}></span>}
                </div>
              </div>

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
                    ⬡ memexhq · HR context injected <span className={styles.ctxCount}>4 nodes</span>
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
                  <div className={styles.elabel}>enriched task sent to claude cowork</div>
                  <span className={styles.qt}>{enrichedPrompt}</span>
                </div>
              )}

              {/* Document card */}
              {showDocCard && (
                <div className={`${styles.docCard} ${styles.show}`}>
                  <div className={styles.docHdr}>
                    <div className={styles.docIcon}>📋</div>
                    <div className={styles.docMeta}>
                      <div className={styles.docTitleSm}>Marcus — Onboarding Plan</div>
                      <div className={styles.docSubtitle}>Senior Backend Engineer · Platform · Start: Monday</div>
                    </div>
                    <div className={styles.docBadge}>Generated</div>
                  </div>
                  <div className={styles.docBody}>
                    {docLines.map((line, i) => (
                      <span
                        key={i}
                        className={`${styles.docLine} ${visibleDocLines.includes(i) ? styles.show : ''}`}
                        dangerouslySetInnerHTML={{ __html: line.html }}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {showNote && (
                <div className={`${styles.assistNoteHr} ${styles.show}`}>
                  Built from the actual offer letter, HR handbook, live team context, and manager notes. No generic template — tailored from day one.
                </div>
              )}
            </div>

            {showReplay && (
              <>
                <div className={styles.cwInputBar}>
                  <div className={styles.cwInputRow}>
                    <span className={styles.cwInputPh}>Describe a task for CoWork...</span>
                    <div className={styles.sendIcon}>↑</div>
                  </div>
                </div>
                <button className={styles.replay} onClick={replay} style={{ margin: '8px 16px 14px' }}>↺ replay</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

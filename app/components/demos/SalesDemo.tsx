'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import styles from './demos.module.css'

interface ContextNode {
  tag: string
  tagClass: string
  text: string
}

const contextNodes: ContextNode[] = [
  { tag: 'Gong · Tue demo', tagClass: 'tgong', text: 'Sarah (VP Eng) loved the <b>local deployment</b> story. CFO James raised <b>pricing concern</b> — wants annual commitment vs monthly.' },
  { tag: 'Salesforce · Acme', tagClass: 'tsf', text: 'Deal size <b>$48k ARR.</b> Last touch: demo Tuesday. Stage: <b>Evaluation.</b> Close target: end of month.' },
  { tag: 'Slack · #sales · Wed', tagClass: 'tslack', text: 'Team agreed: offer <b>10% discount for annual prepay.</b> Do not drop below $43k.' },
  { tag: 'Notion · Competitor intel', tagClass: 'tnotion', text: 'Acme currently trialling <b>Glean.</b> Key diff: MemexHQ is local-only, Glean is cloud. Security angle is our win.' },
]

const emailLines = [
  { html: 'Sarah, James —' },
  { html: '&nbsp;' },
  { html: 'Thanks again for the time on Tuesday. The questions your team asked were exactly the right ones.' },
  { html: '&nbsp;' },
  { html: 'James — on the pricing point: if an <span class="' + styles.emailBold + '">annual commitment</span> makes the conversation easier internally, we can do <span class="' + styles.emailBold + '">$43.2k prepaid</span> (vs $48k monthly). Same full enterprise tier.' },
  { html: '&nbsp;' },
  { html: 'On the Glean comparison — the one thing worth stress-testing: <span class="' + styles.emailBold + '">their data leaves your network. Ours never does.</span> For a team your size, that\'s an audit conversation you won\'t need to have.' },
  { html: '&nbsp;' },
  { html: 'Happy to get 20 mins on the calendar this week if useful.' },
  { html: '&nbsp;' },
  { html: 'Alex' },
]

const command = 'draft a follow-up email for the Acme Corp demo — they went quiet after Tuesday'
const enrichedPrompt = '"Draft follow-up to Acme Corp after Tuesday demo. Address CFO\'s pricing concern — offer annual prepay at 10% discount ($43.2k floor). Sarah loved local deployment. Acme trialling Glean — lean into security/local-only diff. Tone: warm, consultative. Goal: reopen conversation, not close in this email."'

export default function SalesDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showCtxPanel, setShowCtxPanel] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [subjectText, setSubjectText] = useState('')
  const [visibleEmailLines, setVisibleEmailLines] = useState<number[]>([])
  const [showNote, setShowNote] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showEmailCard, visibleEmailLines, showNote])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setScanText('')
    setShowCtxPanel(false)
    setVisibleNodes([])
    setShowEnriched(false)
    setShowEmailCard(false)
    setSubjectText('')
    setVisibleEmailLines([])
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
    }, 50)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('memexhq · scanning sales context...')
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
    }, 360)
    return () => clearInterval(interval)
  }, [step])

  // Step 4: Show enriched prompt
  useEffect(() => {
    if (step !== 4) return
    setShowEnriched(true)
    const timeout = setTimeout(() => setStep(5), 700)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 5: Show email card
  useEffect(() => {
    if (step !== 5) return
    setShowEmailCard(true)
    const subject = 'Quick thought after Tuesday — and a number for James'
    let i = 0
    const interval = setInterval(() => {
      if (i <= subject.length) {
        setSubjectText(subject.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(6), 300)
      }
    }, 38)
    return () => clearInterval(interval)
  }, [step])

  // Step 6: Show email lines
  useEffect(() => {
    if (step !== 6) return
    let i = 0
    const interval = setInterval(() => {
      if (i < emailLines.length) {
        setVisibleEmailLines(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setStep(7), 400)
      }
    }, 120)
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
      <div className={styles.browser} style={{ background: '#212121' }}>
        <div className={styles.browserBar} style={{ background: '#2f2f2f' }}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <div className={styles.urlBar}>chatgpt.com</div>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.chatUi}>
          <div className={styles.gptSidebar}>
            <div className={styles.sbLogo}>
              <div className={styles.gptIcon}>G</div>
              ChatGPT
            </div>
            <button className={styles.sbNew}>✏ New chat</button>
            <div className={styles.sbSection}>Today</div>
            <div className={`${styles.sbItem} ${styles.active}`}>Acme Corp follow-up email</div>
            <div className={styles.sbItem}>Q3 pipeline review</div>
            <div className={styles.sbSection}>Yesterday</div>
            <div className={styles.sbItem}>Stripe renewal objections</div>
            <div className={styles.sbItem}>Intro deck — fintech</div>
          </div>
          <div className={styles.gptMain}>
            <div className={styles.gptTop}>
              <span className={styles.modelSel}>GPT-4o ⌄</span>
              <div className={styles.memexBadge}>
                <div className={styles.mbdot}></div> memexhq · sales context
              </div>
            </div>
            <div className={styles.gptMessages} ref={messagesRef}>
              {/* User message */}
              <div className={styles.msgUserGpt}>
                <div className={styles.bubbleUGpt}>
                  {cmdText}{step === 1 && <span className={styles.cursorInline}></span>}
                </div>
              </div>

              {/* Scanning indicator */}
              {step >= 2 && (
                <div style={{ fontSize: '11px', color: 'rgba(16,163,127,0.55)', padding: '2px 0', opacity: scanText ? 1 : 0, transition: 'opacity 0.3s' }}>
                  {scanText}
                </div>
              )}

              {/* Context panel */}
              {showCtxPanel && (
                <div className={`${styles.ctxPanel} ${styles.show}`} style={{ background: 'rgba(16,163,127,0.06)', borderColor: 'rgba(16,163,127,0.22)' }}>
                  <div className={styles.ctxHeader} style={{ color: 'rgba(16,163,127,0.85)' }}>
                    ⬡ memexhq · sales context injected <span className={styles.ctxCount}>4 nodes</span>
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
                  <div className={styles.elabel}>enriched prompt sent to gpt-4o</div>
                  <span className={styles.qt}>{enrichedPrompt}</span>
                </div>
              )}

              {/* Assistant response - Email card */}
              {showEmailCard && (
                <div className={styles.msgAssistant}>
                  <div className={styles.avatar} style={{ background: '#10a37f', color: '#fff', fontWeight: 700 }}>G</div>
                  <div className={styles.bubbleAssistant}>
                    <div className={`${styles.emailCard} ${styles.show}`}>
                      <div className={styles.emailHdr}>
                        <div className={styles.emailField}>
                          <span className={styles.emailLabel}>To</span>
                          <span className={styles.emailVal}>sarah.chen@acmecorp.com, james.liu@acmecorp.com</span>
                        </div>
                        <div className={styles.emailField}>
                          <span className={styles.emailLabel}>From</span>
                          <span className={styles.emailVal}>alex@memexhq.dev</span>
                        </div>
                        <div className={styles.emailSubject}>
                          {subjectText}{step === 5 && <span className={styles.cursorInline}></span>}
                        </div>
                      </div>
                      <div className={styles.emailBodyWrap}>
                        {emailLines.map((line, i) => (
                          <span
                            key={i}
                            className={`${styles.emailLine} ${visibleEmailLines.includes(i) ? styles.show : ''}`}
                            dangerouslySetInnerHTML={{ __html: line.html }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              {showNote && (
                <div className={`${styles.assistNote} ${styles.show}`}>
                  Knows the deal stage, the objection, the competitor, and the floor price. First draft, no briefing required.
                </div>
              )}
            </div>

            {showReplay && (
              <div style={{ padding: '12px 16px' }}>
                <div className={styles.inputRow} style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <span className={styles.inputText}>Message ChatGPT...</span>
                  <div className={styles.sendBtn}>↑</div>
                </div>
                <button className={styles.replay} onClick={replay}>↺ replay</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

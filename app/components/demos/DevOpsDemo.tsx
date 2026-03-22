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
  { tag: 'GitHub · 1wk ago', tagClass: 'tGh', text: '<b>PR #431</b> increased timeout to 15 min — still flaky. Root cause was <b>DB fixture teardown</b> not timeout.' },
  { tag: 'Jira · OPS-22', tagClass: 'tjira', text: 'Incident: CI blocked deploys for <b>4 hrs last Tuesday.</b> Priority: fix root cause, not ceiling.' },
  { tag: 'Slack · #devops · Fri', tagClass: 'tslack', text: 'Team concluded: flakiness is <b>auth service DB pool</b> not releasing between shards. Parallelising makes it worse.' },
  { tag: 'Runbook · v3', tagClass: 'trunbook', text: 'CI timeout standard is <b>15 min max.</b> Shard count >2 requires sign-off from platform team.' },
]

const responseLines = [
  { html: '<span class="' + styles.respHl + '">⚠ Two risks flagged:</span>' },
  { html: '&nbsp;' },
  { html: '<b>1. Same fix, same failure.</b> PR #431 (1wk ago) tried increasing the timeout ceiling. Tests stayed flaky — root cause was DB pool not releasing between shards, not timeout length.' },
  { html: '&nbsp;' },
  { html: '<b>2. Shard count violation.</b> Adding 3 shards requires platform team sign-off per Runbook v3. This PR doesn\'t have it.' },
  { html: '&nbsp;' },
  { html: '<span class="' + styles.respHl + '">Suggested fix:</span> add pool teardown in afterAll() hooks. See auth service test setup.' },
]

const command = 'review this PR and flag any risks'
const enrichedPrompt = '"Review CI PR #447. Previous fix (PR #431) tried same timeout increase — didn\'t work. Root cause is DB pool, not timeout. Shard count >2 needs platform sign-off. Last incident blocked deploys 4hrs. Flag: this PR may repeat the same mistake."'

export default function DevOpsDemo() {
  const [step, setStep] = useState(0)
  const [cmdText, setCmdText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showCtxPanel, setShowCtxPanel] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number[]>([])
  const [showEnriched, setShowEnriched] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [visibleRespLines, setVisibleRespLines] = useState<number[]>([])
  const [showReplay, setShowReplay] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [step, visibleNodes, showEnriched, showResponse, visibleRespLines])

  const reset = useCallback(() => {
    setStep(0)
    setCmdText('')
    setScanText('')
    setShowCtxPanel(false)
    setVisibleNodes([])
    setShowEnriched(false)
    setShowResponse(false)
    setVisibleRespLines([])
    setShowReplay(false)
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
        setTimeout(() => setStep(2), 450)
      }
    }, 54)
    return () => clearInterval(interval)
  }, [step])

  // Step 2: Show scanning
  useEffect(() => {
    if (step !== 2) return
    setScanText('memexhq · scanning devops context...')
    const timeout = setTimeout(() => {
      setScanText('memexhq · 4 nodes matched')
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
    }, 340)
    return () => clearInterval(interval)
  }, [step])

  // Step 4: Show enriched prompt
  useEffect(() => {
    if (step !== 4) return
    setShowEnriched(true)
    const timeout = setTimeout(() => setStep(5), 600)
    return () => clearTimeout(timeout)
  }, [step])

  // Step 5: Show response
  useEffect(() => {
    if (step !== 5) return
    setShowResponse(true)
    let i = 0
    const interval = setInterval(() => {
      if (i < responseLines.length) {
        setVisibleRespLines(prev => [...prev, i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowReplay(true), 300)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [step])

  return (
    <div className={styles.demoWrap}>
      <div className={styles.browser} style={{ background: '#0d1117' }}>
        <div className={styles.browserBar} style={{ background: '#161b22' }}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dr}`}></div>
            <div className={`${styles.dot} ${styles.dy}`}></div>
            <div className={`${styles.dot} ${styles.dg}`}></div>
          </div>
          <div className={styles.urlBar}>github.com/acme/api/pull/447</div>
          <span className={styles.pluginPill}>memexhq active</span>
        </div>
        <div className={styles.ghUi}>
          <div className={styles.repoHeader}>
            <span className={styles.ghIcon}><Image src="/components/GitHub.svg" alt="GitHub" width={18} height={18} className={styles.logoImg} /></span>
            <span className={styles.repoPath}>
              <span className={styles.org}>acme</span>
              <span className={styles.sep}>/</span>
              api
            </span>
            <span className={styles.repoTab}>Code</span>
            <span className={`${styles.repoTab} ${styles.active}`}>Pull requests</span>
            <span className={styles.repoTab}>Actions</span>
            <div className={styles.memexBadge} style={{ marginLeft: 'auto' }}>
              <div className={styles.mbdot}></div> memexhq
            </div>
          </div>
          <div className={styles.prView}>
            <div className={styles.prList}>
              <div className={styles.prListHdr}><span>Open PRs</span><span>4</span></div>
              <div className={`${styles.prItem} ${styles.active}`}>
                <div className={styles.prItemTitle}>CI pipeline timeout fix</div>
                <div className={styles.prItemMeta}><div className={styles.prStatus}></div>#447 · devops</div>
              </div>
              <div className={styles.prItem}>
                <div className={styles.prItemTitle}>Auth rate limiter</div>
                <div className={styles.prItemMeta}><div className={`${styles.prStatus} ${styles.draft}`}></div>#446 · draft</div>
              </div>
              <div className={styles.prItem}>
                <div className={styles.prItemTitle}>Notification scaffold</div>
                <div className={styles.prItemMeta}><div className={styles.prStatus}></div>#445 · review</div>
              </div>
              <div className={styles.prItem}>
                <div className={styles.prItemTitle}>SES mailer v2</div>
                <div className={styles.prItemMeta}><div className={styles.prStatus}></div>#444 · ready</div>
              </div>
            </div>
            <div className={styles.prDetail}>
              <div className={styles.prTitleBig}>Fix: CI pipeline timeouts on integration tests (#447)</div>
              <div className={styles.prMetaRow}>
                <span className={`${styles.prBadge} ${styles.prOpen}`}>Open</span>
                <span className={styles.prAuthor}>@devops-eng opened 2 hours ago · base: main</span>
              </div>
              <div className={styles.prDesc}>Integration tests timing out at 8 min. Flaky on auth service. Increasing timeout ceiling and parallelising test shards. Needs review before merge.</div>
              <div className={styles.diffBlock}>
                <div className={styles.diffHdr}>.github/workflows/ci.yml</div>
                <div className={`${styles.diffLine} ${styles.diffDel}`}>- timeout-minutes: 10</div>
                <div className={`${styles.diffLine} ${styles.diffAdd}`}>+ timeout-minutes: 20</div>
                <div className={`${styles.diffLine} ${styles.diffCtx}`}>  strategy:</div>
                <div className={`${styles.diffLine} ${styles.diffAdd}`}>+   matrix:</div>
                <div className={`${styles.diffLine} ${styles.diffAdd}`}>+     shard: [1, 2, 3]</div>
                <div className={`${styles.diffLine} ${styles.diffCtx}`}>  runs-on: ubuntu-latest</div>
              </div>
            </div>
            <div className={styles.copilotPanel}>
              <div className={styles.copilotHdr}>
                <div className={styles.copilotLogo}><Image src="/components/GitHub.svg" alt="GitHub Copilot" width={12} height={12} className={styles.logoImg} /></div>
                <span className={styles.copilotTitle}>Copilot + memexhq</span>
              </div>
              <div className={styles.copilotMsgs} ref={messagesRef}>
                {/* User message */}
                <div className={styles.cpMsgU}>
                  <div className={styles.cpBubbleU}>
                    {cmdText}{step === 1 && <span className={styles.cursorInline}></span>}
                  </div>
                </div>

                {/* Scanning */}
                {step >= 2 && (
                  <div className={`${styles.cpScan} ${scanText ? styles.show : ''}`}>
                    {scanText}
                  </div>
                )}

                {/* Context panel */}
                {showCtxPanel && (
                  <div className={`${styles.ctxPanel} ${styles.show}`} style={{ padding: '9px 11px' }}>
                    <div className={styles.ctxHeader} style={{ fontSize: '10.5px' }}>
                      ⬡ memexhq context <span className={styles.ctxCount}>4 nodes</span>
                    </div>
                    {contextNodes.map((node, i) => (
                      <div
                        key={i}
                        className={`${styles.ctxNodeDevops} ${visibleNodes.includes(i) ? styles.show : ''}`}
                      >
                        <span className={`${styles.ntagDevops} ${styles[node.tagClass]}`}>{node.tag}</span>
                        <span className={styles.ctxText} style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: node.text }}></span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Enriched */}
                {showEnriched && (
                  <div className={`${styles.enriched} ${styles.show}`} style={{ padding: '8px 10px', fontSize: '11px' }}>
                    <div className={styles.elabel} style={{ fontSize: '9.5px' }}>enriched context sent to copilot</div>
                    <span className={styles.qt}>{enrichedPrompt}</span>
                  </div>
                )}

                {/* Response */}
                {showResponse && (
                  <div className={styles.cpMsgA}>
                    <div className={styles.cpAv}>✦</div>
                    <div className={styles.cpBubbleA}>
                      <div className={styles.respLines}>
                        {responseLines.map((line, i) => (
                          <span
                            key={i}
                            className={`${styles.respLine} ${visibleRespLines.includes(i) ? styles.show : ''}`}
                            dangerouslySetInnerHTML={{ __html: line.html }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showReplay && (
                <div className={styles.copilotInput}>
                  <div className={styles.cpInputRow}>Ask Copilot...</div>
                  <button className={styles.replay} onClick={replay}>↺ replay</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useRef } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import '../globals.css'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const ASSETS = [
  { svg: '/components/logo-dark.svg', png: '/components/logo-dark.svg', label: 'Logo + wordmark (dark)', hasText: true },
  { svg: '/components/logo-light.svg', png: '/components/logo-light.svg', label: 'Logo + wordmark (light)', hasText: true },
  { svg: '/components/logo-mark-dark.svg', png: '/components/logo-mark-dark.svg', label: 'Logo mark (dark)', hasText: false },
  { svg: '/components/logo-mark-light.svg', png: '/components/logo-mark-light.svg', label: 'Logo mark (light)', hasText: false },
  { svg: '/components/logo.svg', png: '/components/logo.svg', label: 'Logo (default)', hasText: false },
  { svg: '/components/favicon.svg', png: '/components/favicon.svg', label: 'Favicon', hasText: false },
]

async function svgToBlob(svgUrl: string, scale = 2): Promise<Blob> {
  const response = await fetch(svgUrl)
  const svgText = await response.text()
  const img = new Image()
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to convert SVG to PNG'))
      }, 'image/png')
    }
    img.onerror = reject
    img.src = url
  })
}

async function downloadPng(svgUrl: string, filename: string) {
  const blob = await svgToBlob(svgUrl)
  saveAs(blob, filename.replace('.svg', '.png'))
}

async function downloadAll() {
  const zip = new JSZip()
  for (const asset of ASSETS) {
    const svgResponse = await fetch(asset.svg)
    const svgText = await svgResponse.text()
    zip.file(asset.svg.replace('/components/', ''), svgText)
    try {
      const pngBlob = await svgToBlob(asset.png)
      zip.file(asset.png.replace('/components/', '').replace('.svg', '.png'), pngBlob)
    } catch (error) {
      console.warn(`PNG conversion failed for ${asset.label}:`, error)
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'memexhq-brand.zip')
}

export default function BrandPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let W: number, H: number
    interface Node { x: number; y: number; vx: number; vy: number; r: number; a: boolean }
    let nodes: Node[] = []

    function resize() {
      W = c!.width = window.innerWidth
      H = c!.height = window.innerHeight
    }

    function createNode(): Node {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 0.8,
        a: Math.random() > 0.5
      }
    }

    function init() {
      nodes = Array.from({ length: 55 }, createNode)
    }

    let animationId: number

    function draw() {
      // ctx is guaranteed non-null here (checked at useEffect start)
      ctx!.clearRect(0, 0, W, H)
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x += nodes[i].vx
        nodes[i].y += nodes[i].vy
        if (nodes[i].x < 0 || nodes[i].x > W) nodes[i].vx *= -1
        if (nodes[i].y < 0 || nodes[i].y > H) nodes[i].vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            const al = (1 - d / 130) * 0.18
            ctx!.beginPath()
            ctx!.strokeStyle = nodes[i].a ? `rgba(0,229,160,${al})` : `rgba(0,102,255,${al})`
            ctx!.lineWidth = 0.5
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        ctx!.beginPath()
        ctx!.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2)
        ctx!.fillStyle = nodes[i].a ? 'rgba(0,229,160,.6)' : 'rgba(0,102,255,.6)'
        ctx!.fill()
      }
      animationId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      resize()
      init()
    }

    window.addEventListener('resize', handleResize)
    resize()
    init()
    animationId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleSvgDownload = useCallback((svgUrl: string) => {
    const filename = svgUrl.split('/').pop()
    if (!filename) return
    const a = document.createElement('a')
    a.href = svgUrl
    a.download = filename
    a.click()
  }, [])

  const handlePngDownload = useCallback((svgUrl: string) => {
    const filename = svgUrl.split('/').pop()
    if (!filename) return
    downloadPng(svgUrl, filename)
  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="bg-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.2, pointerEvents: 'none' }} />
      <Navigation />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="section-inner">
          <div className="brand-hero">
            <div className="brand-logo-mark">
              <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="29" width="32" height="2.4" rx="1.2" fill="#00e5a0"/>
                <rect x="4" y="12" width="11.5" height="14" rx="2" fill="none" stroke="#00e5a0" strokeWidth="1.6"/>
                <rect x="6.8" y="15" width="5.8" height="1.1" rx=".55" fill="#00e5a0" opacity=".45"/>
                <rect x="6.8" y="17.5" width="3.8" height="1.1" rx=".55" fill="#00e5a0" opacity=".26"/>
                <rect x="6.8" y="20" width="4.8" height="1.1" rx=".55" fill="#00e5a0" opacity=".26"/>
                <rect x="24.5" y="12" width="11.5" height="14" rx="2" fill="none" stroke="#00e5a0" strokeWidth="1.6"/>
                <rect x="27.3" y="15" width="5.8" height="1.1" rx=".55" fill="#00e5a0" opacity=".45"/>
                <rect x="27.3" y="17.5" width="3.5" height="1.1" rx=".55" fill="#00e5a0" opacity=".26"/>
                <rect x="27.3" y="20" width="4.8" height="1.1" rx=".55" fill="#00e5a0" opacity=".26"/>
                <line x1="15.5" y1="19" x2="24.5" y2="19" stroke="#00e5a0" strokeWidth="1.2" strokeDasharray="1.6 2" opacity=".6"/>
                <circle cx="20" cy="19" r="2.4" fill="#00e5a0"/>
                <circle cx="20" cy="19" r="1" fill="#07090c"/>
                <line x1="10" y1="26" x2="10" y2="29" stroke="#00e5a0" strokeWidth="1.2" opacity=".45"/>
                <line x1="30" y1="26" x2="30" y2="29" stroke="#00e5a0" strokeWidth="1.2" opacity=".45"/>
                <circle cx="20" cy="6.5" r="2.8" fill="none" stroke="#00e5a0" strokeWidth="1.2" opacity=".45"/>
                <circle cx="20" cy="6.5" r="1" fill="#00e5a0" opacity=".5"/>
              </svg>
            </div>
            <h1 className="brand-title">Brand guidelines</h1>
            <p className="brand-sub">
              Resources and assets to help you work with the MemexHQ brand.
            </p>
            <button onClick={downloadAll} className="btn-primary" style={{ marginTop: '40px', border: 'none', cursor: 'pointer' }}>
              Download all assets
            </button>
          </div>

          <div className="brand-hero-preview">
            <div className="brand-preview-row">
              <div className="brand-preview-dark">
                <img src="/components/logo-dark.svg" alt="MemexHQ Logo Dark" />
              </div>
              <div className="brand-preview-light">
                <img src="/components/logo-light.svg" alt="MemexHQ Logo Light" />
              </div>
            </div>
          </div>

          <div className="brand-section">
            <h3 className="brand-section-title">Logo — Dark background</h3>
            <p className="brand-section-desc">
              Use on dark or black backgrounds. The teal accent pops against the dark theme.
            </p>
            <div className="brand-asset-grid">
              <div className="brand-asset-card">
                <div className="brand-preview" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <img src="/components/logo-dark.svg" alt="MemexHQ Logo Dark" style={{ width: '140px', height: 'auto' }} />
                </div>
                <div className="brand-asset-info">
                  <span className="brand-asset-name">Logo + wordmark</span>
                  <div className="brand-asset-links">
                    <button onClick={() => handleSvgDownload('/components/logo-dark.svg')}>SVG</button>
                    <span> · </span>
                    <button onClick={() => handlePngDownload('/components/logo-dark.svg')}>PNG</button>
                  </div>
                </div>
              </div>

              <div className="brand-asset-card">
                <div className="brand-preview" style={{ background: 'var(--bg)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center' }}>
                  <img src="/components/logo-mark-dark.svg" alt="MemexHQ Logo Mark Dark" style={{ width: '56px', height: 'auto' }} />
                </div>
                <div className="brand-asset-info">
                  <span className="brand-asset-name">Logo mark only</span>
                  <div className="brand-asset-links">
                    <button onClick={() => handleSvgDownload('/components/logo-mark-dark.svg')}>SVG</button>
                    <span> · </span>
                    <button onClick={() => handlePngDownload('/components/logo-mark-dark.svg')}>PNG</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-section">
            <h3 className="brand-section-title">Logo — Light background</h3>
            <p className="brand-section-desc">
              Use on light or white backgrounds. The logo adapts with a slightly deeper teal for contrast.
            </p>
            <div className="brand-asset-grid">
              <div className="brand-asset-card">
                <div className="brand-preview" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
                  <img src="/components/logo-light.svg" alt="MemexHQ Logo Light" style={{ width: '140px', height: 'auto' }} />
                </div>
                <div className="brand-asset-info">
                  <span className="brand-asset-name">Logo + wordmark</span>
                  <div className="brand-asset-links">
                    <button onClick={() => handleSvgDownload('/components/logo-light.svg')}>SVG</button>
                    <span> · </span>
                    <button onClick={() => handlePngDownload('/components/logo-light.svg')}>PNG</button>
                  </div>
                </div>
              </div>

              <div className="brand-asset-card">
                <div className="brand-preview" style={{ background: '#ffffff', border: '1px solid #e5e7eb', display: 'grid', placeItems: 'center' }}>
                  <img src="/components/logo-mark-light.svg" alt="MemexHQ Logo Mark Light" style={{ width: '56px', height: 'auto' }} />
                </div>
                <div className="brand-asset-info">
                  <span className="brand-asset-name">Logo mark only</span>
                  <div className="brand-asset-links">
                    <button onClick={() => handleSvgDownload('/components/logo-mark-light.svg')}>SVG</button>
                    <span> · </span>
                    <button onClick={() => handlePngDownload('/components/logo-mark-light.svg')}>PNG</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-section">
            <h3 className="brand-section-title">Colors</h3>
            <p className="brand-section-desc">
              The MemexHQ palette is built around a dark base with a neon teal accent. Use the accent colors purposefully — they signal interactivity and brand identity.
            </p>
            <div className="brand-color-grid">
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#00e5a0' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Accent / Teal (dark)</span>
                <span className="brand-color-val">#00e5a0</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#00a86b', border: '1px solid #d0d9e6' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Accent / Teal (light)</span>
                <span className="brand-color-val">#00a86b</span>
              </div>
            </div>
              <div className="brand-color-card">
                <div className="brand-swatch" style={{ background: '#0066ff' }} />
                <div className="brand-color-info">
                  <span className="brand-color-name">Accent / Blue</span>
                  <span className="brand-color-val">#0066ff</span>
                </div>
              </div>
              <div className="brand-color-card">
                <div className="brand-swatch" style={{ background: '#ff6b35' }} />
                <div className="brand-color-info">
                  <span className="brand-color-name">Accent / Orange</span>
                  <span className="brand-color-val">#ff6b35</span>
                </div>
              </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#07090c', border: '1px solid var(--border)' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Background (dark)</span>
                <span className="brand-color-val">#07090c</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#f2f4f7', border: '1px solid #d0d9e6' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Background (light)</span>
                <span className="brand-color-val">#f2f4f7</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#0d1117', border: '1px solid var(--border)' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Surface (dark)</span>
                <span className="brand-color-val">#0d1117</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#ffffff', border: '1px solid #d0d9e6' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Surface (light)</span>
                <span className="brand-color-val">#ffffff</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#dde4ec' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Text (dark)</span>
                <span className="brand-color-val">#dde4ec</span>
              </div>
            </div>
            <div className="brand-color-card">
              <div className="brand-swatch" style={{ background: '#0f1620', border: '1px solid #d0d9e6' }} />
              <div className="brand-color-info">
                <span className="brand-color-name">Text (light)</span>
                <span className="brand-color-val">#0f1620</span>
              </div>
            </div>
            </div>
          </div>

          <div className="brand-section">
            <h3 className="brand-section-title">Typography</h3>
            <p className="brand-section-desc">
              MemexHQ uses two typefaces: Fraunces for display headings and DM Mono for body and interface text. Both should be loaded from Google Fonts.
            </p>
            <div className="brand-type-grid">
              <div className="brand-type-card">
                <div className="brand-type-sample" style={{ fontFamily: "'Fraunces', serif", fontSize: '36px', fontWeight: 200, color: 'var(--text)', lineHeight: 1 }}>
                  Aa
                </div>
                <div className="brand-type-info">
                  <span className="brand-type-name">Fraunces</span>
                  <span className="brand-type-role">Display / Headings</span>
                  <span className="brand-type-meta">Google Fonts · Weights: 200–900 + italic</span>
                </div>
              </div>
              <div className="brand-type-card">
                <div className="brand-type-sample" style={{ fontFamily: "'DM Mono', monospace", fontSize: '20px', color: 'var(--text)', letterSpacing: '0.02em' }}>
                  ABCabc 123
                </div>
                <div className="brand-type-info">
                  <span className="brand-type-name">DM Mono</span>
                  <span className="brand-type-role">Body / Interface</span>
                  <span className="brand-type-meta">Google Fonts · Weights: 300, 400, 500 + italic</span>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-section">
            <h3 className="brand-section-title">Favicon</h3>
            <p className="brand-section-desc">
              The favicon is a simplified version of the logo mark, optimized for 32×32 display.
            </p>
            <div className="brand-asset-grid">
              <div className="brand-asset-card">
                <div className="brand-preview" style={{ background: 'var(--bg)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="29" width="32" height="2.4" rx="1.2" fill="#00e5a0"/>
                    <rect x="4" y="12" width="11.5" height="14" rx="2" fill="none" stroke="#00e5a0" strokeWidth="1.6"/>
                    <rect x="24.5" y="12" width="11.5" height="14" rx="2" fill="none" stroke="#00e5a0" strokeWidth="1.6"/>
                    <line x1="15.5" y1="19" x2="24.5" y2="19" stroke="#00e5a0" strokeWidth="1.2" opacity=".6"/>
                    <circle cx="20" cy="19" r="2.4" fill="#00e5a0"/>
                    <line x1="10" y1="26" x2="10" y2="29" stroke="#00e5a0" strokeWidth="1.2" opacity=".45"/>
                    <line x1="30" y1="26" x2="30" y2="29" stroke="#00e5a0" strokeWidth="1.2" opacity=".45"/>
                  </svg>
                </div>
                <div className="brand-asset-info">
                  <span className="brand-asset-name">Favicon (32×32)</span>
                  <div className="brand-asset-links">
                    <button onClick={() => handleSvgDownload('/components/favicon.svg')}>SVG</button>
                    <span> · </span>
                    <button onClick={() => handlePngDownload('/components/favicon.svg')}>PNG</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

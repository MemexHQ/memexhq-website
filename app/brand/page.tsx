'use client'

import '../globals.css'

export default function BrandPage() {
  return (
    <>
      <canvas id="bg-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.2, pointerEvents: 'none' }} />

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
              Resources and assets to help you work with MemexHQ brand.
            </p>
            <a href="/components/logo-dark.svg" download className="btn-primary" style={{ marginTop: '40px' }}>
              Download all assets
            </a>
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
                    <a href="/components/logo-dark.svg" download>SVG</a>
                    <span> · </span>
                    <a href="/components/logo-dark.svg" download>PNG</a>
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
                    <a href="/components/logo-mark-dark.svg" download>SVG</a>
                    <span> · </span>
                    <a href="/components/logo-mark-dark.svg" download>PNG</a>
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
                    <a href="/components/logo-light.svg" download>SVG</a>
                    <span> · </span>
                    <a href="/components/logo-light.svg" download>PNG</a>
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
                    <a href="/components/logo-mark-light.svg" download>SVG</a>
                    <span> · </span>
                    <a href="/components/logo-mark-light.svg" download>PNG</a>
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
                    <a href="/components/favicon.svg" download>SVG</a>
                    <span> · </span>
                    <a href="/components/favicon.svg" download>PNG</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var c=document.getElementById('bg-canvas'),ctx=c.getContext('2d');
  var W,H,nodes=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}
  function N(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.22;this.vy=(Math.random()-.5)*.22;this.r=Math.random()*1.8+.8;this.a=Math.random()>.5}
  function init(){nodes=Array.from({length:55},function(){return new N()})}
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<nodes.length;i++){
      nodes[i].x+=nodes[i].vx;nodes[i].y+=nodes[i].vy;
      if(nodes[i].x<0||nodes[i].x>W)nodes[i].vx*=-1;
      if(nodes[i].y<0||nodes[i].y>H)nodes[i].vy*=-1;
    }
    for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){
      var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){var al=(1-d/130)*.18;
        ctx.beginPath();
        ctx.strokeStyle=nodes[i].a?'rgba(0,229,160,'+al+')':'rgba(0,102,255,'+al+')';
        ctx.lineWidth=.5;
        ctx.moveTo(nodes[i].x,nodes[i].y);
        ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.stroke()}
    }
    for(var i=0;i<nodes.length;i++){
      ctx.beginPath();
      ctx.arc(nodes[i].x,nodes[i].y,nodes[i].r,0,Math.PI*2);
      ctx.fillStyle=nodes[i].a?'rgba(0,229,160,.6)':'rgba(0,102,255,.6)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',function(){resize();init()});
  resize();init();draw();
})();
      ` }} />
    </>
  )
}

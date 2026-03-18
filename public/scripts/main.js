/* ── BG CANVAS ── */
(function(){
  const c=document.getElementById('bg-canvas'),ctx=c.getContext('2d');
  let W,H,nodes=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  function Node(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.25;this.vy=(Math.random()-.5)*.25;this.r=Math.random()*2+1;this.a=Math.random()>.5;}
  function init(){nodes=Array.from({length:60},()=>new Node());}
  function draw(){
    ctx.clearRect(0,0,W,H);
    nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<140){const al=(1-d/140)*.2;ctx.beginPath();ctx.strokeStyle=nodes[i].a?`rgba(0,229,160,${al})`:`rgba(0,102,255,${al})`;ctx.lineWidth=.5;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}
    }
    nodes.forEach(n=>{ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=n.a?'rgba(0,229,160,.65)':'rgba(0,102,255,.65)';ctx.fill();});
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{resize();init();});
  resize();init();draw();
})();

/* ── NETWORK DIAGRAM ── */
(function(){
  const wrap=document.getElementById('ndCanvas');
  if(!wrap)return;
  const icons=['⌥','◈','◎','⬡','◆','✦'];
  const pos=[[50,8],[85,28],[88,68],[50,90],[12,68],[12,28]];
  pos.forEach((p,i)=>{
    const nd=document.createElement('div');
    nd.style.cssText=`position:absolute;width:36px;height:36px;left:${p[0]}%;top:${p[1]}%;transform:translate(-50%,-50%);background:var(--surface2);border:1px solid var(--border2);border-radius:7px;display:grid;place-items:center;font-size:12px;transition:border-color .3s;z-index:2`;
    nd.textContent=icons[i];
    nd.addEventListener('mouseenter',()=>nd.style.borderColor='var(--accent)');
    nd.addEventListener('mouseleave',()=>nd.style.borderColor='');
    wrap.appendChild(nd);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:1';
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1','50%');line.setAttribute('y1','50%');
    line.setAttribute('x2',p[0]+'%');line.setAttribute('y2',p[1]+'%');
    line.setAttribute('stroke','rgba(0,229,160,0.2)');line.setAttribute('stroke-width','1');
    line.setAttribute('stroke-dasharray','4 4');
    svg.appendChild(line);wrap.appendChild(svg);
  });
})();

/* ── DEMO TABS ── */
(function(){
  const tabs=document.querySelectorAll('.demo-tab');
  if(!tabs.length) return;
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.demo-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.demo-pane').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      const pane=document.getElementById('tab-'+tab.dataset.tab);
      if(pane) pane.classList.add('active');
    });
  });
})();

/* ── INTERSECTION OBSERVER ── */
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
  },{threshold:0.12});
  document.querySelectorAll('.reveal,.step,.node-card,.pf,.problem-card,.price-card').forEach(el=>io.observe(el));
  document.querySelectorAll('.node-card').forEach((c,i)=>{c.style.transitionDelay=(i*0.06)+'s';});
  document.querySelectorAll('.problem-card').forEach((c,i)=>{c.style.transitionDelay=(i*0.1)+'s';});
  document.querySelectorAll('.price-card').forEach((c,i)=>{c.style.transitionDelay=(i*0.12)+'s';});
})();

/* ── ROLE BUTTONS ── */
(function(){
  const grid=document.getElementById('mainRoleGrid');
  if(!grid) return;
  grid.querySelectorAll('.role-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      grid.querySelectorAll('.role-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
    });
  });
})();

/* ── FORM ── */
(function(){
  const form=document.getElementById('mainForm');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    let valid=true;
    const email=document.getElementById('memail');
    const company=document.getElementById('mcompany');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){document.getElementById('sf-email').classList.add('err');valid=false;}
    else{document.getElementById('sf-email').classList.remove('err');}
    if(!company.value.trim()){document.getElementById('sf-company').classList.add('err');valid=false;}
    else{document.getElementById('sf-company').classList.remove('err');}
    if(!valid)return;
    const btn=document.getElementById('mainSubmit');
    btn.textContent='Sending…';btn.disabled=true;btn.style.opacity='.7';
    setTimeout(()=>{
      form.classList.add('hide');
      const fch=document.getElementById('fch');
      if(fch) fch.classList.add('hide');
      const ref='MEM-'+Math.random().toString(36).substring(2,8).toUpperCase();
      const refEl=document.getElementById('mainRef');
      if(refEl) refEl.textContent='MEM — '+ref;
      const success=document.getElementById('mainSuccess');
      if(success) success.classList.add('show');
    },1200);
  });
  ['memail','mcompany'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('input',function(){this.closest('.sfield').classList.remove('err');});
  });
})();

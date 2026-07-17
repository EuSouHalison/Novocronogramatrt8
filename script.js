(() => {
  const KEY='trt8-plano-guerra-v2';
  const THEME='trt8-theme';
  const boxes=[...document.querySelectorAll('.blk')];
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const state=JSON.parse(localStorage.getItem(KEY)||'{}');
  const fmt=d=>new Intl.DateTimeFormat('pt-BR').format(d);
  const today=new Date();
  const limit=new Date(2027,1,7);
  const days=Math.max(0,Math.ceil((limit-today)/86400000));

  $('#stat-today').textContent=fmt(today);
  $('#stat-days').textContent=`${days} dias`;
  const oldToday=$('#c-today'); if(oldToday) oldToday.textContent=fmt(today);
  const oldDays=$('#c-days'); if(oldDays) oldDays.textContent=`${days} dias · 07/02/2027`;

  boxes.forEach(b=>b.checked=!!state[b.id]);

  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
  function refresh(){
    const done=boxes.filter(b=>b.checked).length;
    const total=boxes.length;
    const pct=total?Math.round(done/total*100):0;
    $('#p-done').textContent=done; $('#p-total').textContent=total;
    $('#side-done').textContent=done; $('#side-total').textContent=total; $('#side-percent').textContent=pct;
    $('#hero-percent').textContent=`${pct}%`; $('#hero-done').textContent=`${done} de ${total} blocos`;
    $('#side-bar').style.width=`${pct}%`; $('#progress-ring').style.setProperty('--p',pct);
    const grouped={};
    boxes.forEach(b=>{const w=b.dataset.w;(grouped[w]??={d:0,t:0}).t++;if(b.checked)grouped[w].d++});
    $$('.wk-prog').forEach(el=>{const s=grouped[el.dataset.w]||{d:0,t:0};el.textContent=`${s.d}/${s.t}`;el.classList.toggle('full',s.t>0&&s.d===s.t)});
  }
  boxes.forEach(b=>b.addEventListener('change',()=>{state[b.id]=b.checked?1:0;if(!b.checked)delete state[b.id];localStorage.setItem(KEY,JSON.stringify(state));refresh()}));
  $('#reset-progress').addEventListener('click',()=>{if(confirm('Deseja realmente zerar todo o progresso?')){boxes.forEach(b=>b.checked=false);localStorage.removeItem(KEY);refresh();toast('Progresso zerado')}});
  $('#print-btn').addEventListener('click',()=>window.print());
  $('#menu-btn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>$('#sidebar').classList.remove('open')));

  const savedTheme=localStorage.getItem(THEME);
  if(savedTheme) document.documentElement.dataset.theme=savedTheme;
  $('#theme-btn').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem(THEME,next)});

  const sections=$$('main section[id]');
  const navLinks=$$('.nav a');
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}}),{rootMargin:'-25% 0px -65% 0px'});
  sections.forEach(s=>obs.observe(s));
  refresh();
})();

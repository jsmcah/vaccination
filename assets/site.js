function reveal(){const id=decodeURIComponent(location.hash.slice(1));const el=id&&document.getElementById(id);if(!el)return;
const d=el.closest('details');if(d&&!d.open){d.open=true;el.scrollIntoView()}}
window.addEventListener('hashchange',reveal);window.addEventListener('DOMContentLoaded',reveal);
const tAll=document.getElementById('toggle-all');   // open or close every twiddle at once
if(tAll)tAll.addEventListener('click',()=>{const open=tAll.getAttribute('aria-pressed')!=='true';
document.querySelectorAll('details.twiddle').forEach(d=>d.open=open);
tAll.setAttribute('aria-pressed',String(open));tAll.textContent=open?'Close all sections':'Open all sections'});
let printState=null;   // printing opens every section and premise row, then restores what the reader had open
window.addEventListener('beforeprint',()=>{if(printState)return;const ds=[...document.querySelectorAll('details.twiddle')],rs=[...document.querySelectorAll('tr.detail')];
printState={ds:ds.map(d=>d.open),rs:rs.map(r=>r.hidden)};ds.forEach(d=>d.open=true);rs.forEach(r=>r.hidden=false)});
window.addEventListener('afterprint',()=>{if(!printState)return;document.querySelectorAll('details.twiddle').forEach((d,i)=>d.open=printState.ds[i]);
document.querySelectorAll('tr.detail').forEach((r,i)=>r.hidden=printState.rs[i]);printState=null});
const card=document.getElementById('card');let cur=null,timer=null;
const fine=matchMedia('(hover: hover)').matches;
function show(b){clearTimeout(timer);cur=b;const d=b.dataset;
card.innerHTML=`<h3>${d.name}</h3><div>${d.design||''}${d.n?' · '+d.n:''}</div>
<div><span class="m">Funding</span> ${d.funding||'not recorded'}</div>
<div><span class="m">Study's main limitation</span> ${d.limit||''}</div><a href="${d.href}">Full study page</a>`;
card.hidden=false;const r=b.getBoundingClientRect();
card.style.left=Math.max(16,Math.min(r.left+scrollX,scrollX+document.documentElement.clientWidth-card.offsetWidth-16))+'px';
card.style.top=(r.bottom+scrollY+8)+'px';}
function hideSoon(){timer=setTimeout(()=>{card.hidden=true;cur=null},180)}
document.addEventListener('mouseover',e=>{const b=e.target.closest('button.cite');if(b&&fine)show(b)});
document.addEventListener('mouseout',e=>{if(e.target.closest('button.cite')&&fine)hideSoon()});
document.addEventListener('focusin',e=>{const b=e.target.closest('button.cite');if(b)show(b)});
card.addEventListener('mouseenter',()=>clearTimeout(timer));card.addEventListener('mouseleave',()=>{if(fine)hideSoon()});
document.addEventListener('click',e=>{const b=e.target.closest('button.cite');
if(b){if(cur===b&&!card.hidden&&!fine){card.hidden=true;cur=null}else show(b);return}
const c=e.target.closest('button.more');if(c){const d=document.getElementById(c.getAttribute('aria-controls'));
const o=c.getAttribute('aria-expanded')==='true';c.setAttribute('aria-expanded',String(!o));c.innerHTML=o?c.dataset.label:'Hide';d.hidden=o;return}
if(!e.target.closest('#card')){card.hidden=true;cur=null}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!card.hidden){card.hidden=true;cur&&cur.focus();cur=null}});

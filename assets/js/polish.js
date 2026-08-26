/* IWA RICH YOU D — Motion & Interaction Layer */
(function(){
'use strict';
function init(){
  document.body.classList.add('motion-ready');
  let progress=document.getElementById('iwaScrollProgress');
  if(!progress){progress=document.createElement('div');progress.id='iwaScrollProgress';progress.className='iwa-scroll-progress';document.body.prepend(progress);}
  const updateProgress=()=>{const doc=document.documentElement;const max=doc.scrollHeight-window.innerHeight;progress.style.width=(max>0?Math.min(100,(window.scrollY/max)*100):0)+'%';};
  window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
  const revealTargets=document.querySelectorAll('.section,.section-head,.about-grid,.service-card,.product-category,.product-catalog-card,.contact-card,footer');
  revealTargets.forEach((el,i)=>{el.classList.add('iwa-reveal');el.style.setProperty('--iwa-delay',Math.min((i%8)*55,385)+'ms');});
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('iwa-visible');io.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});revealTargets.forEach(el=>io.observe(el));}else revealTargets.forEach(el=>el.classList.add('iwa-visible'));
  const hero=document.querySelector('.hero'),heroArt=document.querySelector('.hero-card');
  if(hero&&heroArt&&!reduce){hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();heroArt.style.setProperty('--mx',(((e.clientX-r.left)/r.width-.5)*18).toFixed(2)+'px');heroArt.style.setProperty('--my',(((e.clientY-r.top)/r.height-.5)*12).toFixed(2)+'px');},{passive:true});hero.addEventListener('mouseleave',()=>{heroArt.style.setProperty('--mx','0px');heroArt.style.setProperty('--my','0px');});}
  if(!reduce)document.querySelectorAll('.service-card,.product-catalog-card,.contact-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--rx',(((e.clientY-r.top)/r.height-.5)*-2.4).toFixed(2)+'deg');card.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*2.4).toFixed(2)+'deg');});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});});
  document.addEventListener('click',e=>{const target=e.target.closest('button,.btn,.detail-btn,.source-btn');if(!target||reduce)return;const r=target.getBoundingClientRect(),ripple=document.createElement('span'),size=Math.max(r.width,r.height)*1.35;ripple.className='iwa-ripple';ripple.style.width=ripple.style.height=size+'px';ripple.style.left=(e.clientX-r.left-size/2)+'px';ripple.style.top=(e.clientY-r.top-size/2)+'px';target.appendChild(ripple);setTimeout(()=>ripple.remove(),620);});
  const sections=[...document.querySelectorAll('main section[id]')],navButtons=[...document.querySelectorAll('[data-section]')];
  if('IntersectionObserver' in window){const navIO=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navButtons.forEach(b=>b.setAttribute('aria-current',b.dataset.section===entry.target.id?'true':'false'));}),{rootMargin:'-28% 0px -62% 0px',threshold:0});sections.forEach(s=>navIO.observe(s));}
  const loader=document.createElement('div');loader.className='iwa-boot-loader';loader.innerHTML='<div class="iwa-loader-orbit"><div class="iwa-loader-ring"></div><img src="assets/img/logo.png" alt="IWA RICH YOU D CO.,LTD."></div><div class="iwa-loader-brand">IWA RICH YOU D CO.,LTD.<small>ICT SOLUTIONS · DIGITAL LEARNING</small></div><div class="iwa-loader-bar"><span></span></div>';document.body.appendChild(loader);requestAnimationFrame(()=>loader.classList.add('show'));const dismiss=()=>setTimeout(()=>loader.classList.add('hide'),720);if(document.readyState==='complete')dismiss();else window.addEventListener('load',dismiss,{once:true});
  document.querySelectorAll('.copyright').forEach(el=>{el.innerHTML=el.innerHTML.replace(/©\s*2026/,'© '+new Date().getFullYear());});
}
document.addEventListener('DOMContentLoaded',init,{once:true});
})();

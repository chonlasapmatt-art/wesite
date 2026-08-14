/* ============================================================
   IWA RICH U D — Application Logic
   ============================================================ */
(function(){
'use strict';

/* ============================================================
   DATA
   ============================================================ */
const IMG = 'assets/img/';

const SERVICES = [
  {num:'01', title:'Network Infrastructure & Design', icon:'net', items:[
    'ออกแบบและวางระบบเครือข่าย (LAN/Fiber Optic)',
    'ติดตั้งและบริหารจัดการ Server (Windows/Linux)',
    'ระบบความปลอดภัยเครือข่าย (Network Security & Firewall)',
    'ระบบห้องเรียนอัจฉริยะครบวงจร (Smart Classroom Solution)',
    'ห้องปฏิบัติการทางภาษาอัจฉริยะ (Digital Language Lab)'
  ]},
  {num:'02', title:'Software & Application Development', icon:'code', items:[
    'พัฒนาโปรแกรมคอมพิวเตอร์ตามความต้องการ (Custom Software)',
    'พัฒนา Mobile & Web Application',
    'เชื่อมต่อระบบปฏิบัติการ (System Integration)',
    'แพลตฟอร์มบริหารจัดการการเรียนรู้ (LMS)'
  ]},
  {num:'03', title:'IT Maintenance Service', icon:'wrench', items:[
    'บริการดูแลรักษารายเดือน-รายปี (Preventive Maintenance)',
    'บริการกู้คืนข้อมูล (Data Recovery) และตรวจเช็กไวรัส'
  ]},
  {num:'04', title:'Hardware & Software Supply', icon:'box', items:[
    'จำหน่ายอุปกรณ์คอมพิวเตอร์และซอฟต์แวร์ลิขสิทธิ์แท้',
    'จอภาพระบบอัจฉริยะ (AI-Powered Interactive Smart Display)',
    'สื่อมัลติมีเดียระดับปฐมวัยและประถมศึกษา (Edutainment)',
    'สื่อพัฒนาทักษะภาษาอังกฤษอ้างอิงมาตรฐาน CEFR ครบทุกระดับ'
  ]},
  {num:'05', title:'ICT Training & Seminar', icon:'grad', items:[
    'อบรมการใช้งานระบบและซอฟต์แวร์สำนักงาน',
    'อบรมการใช้งานห้องเรียน/ห้องปฏิบัติการทางภาษาอัจฉริยะ',
    'อบรมหลักสูตรภาษาอังกฤษตามมาตรฐาน CEFR สำหรับครู',
    'อบรมการใช้สื่อมัลติมีเดียเพื่อการเรียนการสอน'
  ]}
];

const ICONS = {
  net: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2.2" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="19" r="2.2" stroke="currentColor" stroke-width="1.6"/><circle cx="19" cy="19" r="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.2V13M12 13L5 17M12 13l7 4" stroke="currentColor" stroke-width="1.6"/></svg>',
  code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 8l-5 4 5 4M16 8l5 4-5 4M13.5 5l-3 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wrench: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  box: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 8l9-4 9 4-9 4-9-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 8v8l9 4 9-4V8M12 12v8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  grad: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 8l10-4 10 4-10 4-10-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" stroke-width="1.6"/></svg>'
};

const PRODUCTS = [
  {id:'p1', level:'ปฐมวัย', name:'โปรแกรมพัฒนาทักษะกระบวนการคิดเสริมเชาวน์ปัญญา', desc:'สื่อมัลติมีเดียเสริมกระบวนการคิด การสังเกต การจำแนก และความสัมพันธ์เชิงมิติ', price:2900, c1:'#3E6B8C', c2:'#1E3E73'},
  {id:'p2', level:'ปฐมวัย', name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์', desc:'สอนความสัมพันธ์ทางคณิต การนับจำนวน เรขาคณิต การวัด การชั่ง การตวง', price:2900, c1:'#C98A27', c2:'#8C6A3E'},
  {id:'p3', level:'ปฐมวัย', name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์', desc:'เนื้อหาสอดคล้องเรื่องราวเกี่ยวกับตัวเด็ก บุคคล สถานที่ และธรรมชาติรอบตัว', price:2900, c1:'#3E8C5D', c2:'#215C39'},
  {id:'p4', level:'ปฐมวัย', name:'โปรแกรมพัฒนาทักษะการใช้ภาษา', desc:'ฝึกพยัญชนะไทย สระ การประสมคำ และมาตราตัวสะกด ผ่านกระดานอัจฉริยะ', price:2500, c1:'#6A3E8C', c2:'#402459'},
  {id:'p5', level:'ปฐมวัย', name:'สื่อการเรียนรู้ระดับปฐมวัย (CAI)', desc:'อิงหลักสูตรปฐมวัย พ.ศ. 2560 ครบ 4 สาระการเรียนรู้', price:3200, c1:'#16305C', c2:'#0E2144'},
  {id:'p6', level:'ปฐมวัย', name:'สื่อมัลติมีเดีย "อาเซียนน่ารู้"', desc:'ความรู้เกี่ยวกับ 10 ประเทศสมาชิกอาเซียน ธงชาติ เมืองหลวง วัฒนธรรม', price:2200, c1:'#8C3E3E', c2:'#5C2323'},
  {id:'p7', level:'ปฐมวัย', name:'สื่อโฟนิคส์ (Phonics Hero)', desc:'พัฒนาทักษะการอ่านออกเสียงและสะกดคำภาษาอังกฤษแบบโฟนิคส์', price:3500, c1:'#C9A227', c2:'#8a6d16', img:IMG+'product-phonicshero.jpg'},
  {id:'p8', level:'ปฐมวัย', name:'Picaro English', desc:'หลักสูตรภาษาอังกฤษผ่านกิจกรรมเกมส์ อ้างอิงมาตรฐาน CEFR', price:4900, c1:'#3E6B8C', c2:'#16305C', img:IMG+'product-picaro.jpg'},
  {id:'p9', level:'ประถมศึกษา', name:'Digital Library@School (DLS)', desc:'บทเรียนคอมพิวเตอร์ช่วยสอนครบทุกกลุ่มสาระ อิงหลักสูตรแกนกลาง', price:5900, c1:'#16305C', c2:'#0E2144', img:IMG+'product-dls.jpg'},
  {id:'p10', level:'ประถมศึกษา', name:'DLS คณิตศาสตร์', desc:'สื่อพัฒนาทักษะคณิตศาสตร์ระดับประถมศึกษา ผ่านภาพเคลื่อนไหวและแบบโต้ตอบ', price:3800, c1:'#C98A27', c2:'#8C6A3E'},
  {id:'p11', level:'ประถมศึกษา', name:'DLS วิทยาศาสตร์', desc:'สื่อพัฒนาทักษะวิทยาศาสตร์ระดับประถมศึกษา เข้าใจง่ายด้วยภาพและเสียง', price:3800, c1:'#3E8C5D', c2:'#215C39'},
  {id:'p12', level:'ประถมศึกษา', name:'DLS ภาษาไทย', desc:'สื่อพัฒนาทักษะภาษาไทยระดับประถมศึกษา ผ่านเกมและแบบทดสอบ', price:3800, c1:'#6A3E8C', c2:'#402459'},
  {id:'p13', level:'มัธยมศึกษา', name:'Vantage Essential English', desc:'หลักสูตรออนไลน์จากอังกฤษ อิง CEFR 6 ระดับ (A1-C1) พร้อม Placement Test', price:6900, c1:'#16305C', c2:'#0E2144', img:IMG+'product-vantage.jpg'},
];

const GALLERY = [
  {label:'ทีมงาน IWA กับหลักสูตร Picaro English', img:IMG+'training-group.jpg', full:IMG+'training-group.jpg'},
  {label:'บรรยายกลยุทธ์และแนวทางการเรียนรู้ Picaro English', img:IMG+'training-presenter.jpg'},
  {label:'English CEFR Boost Day จังหวัดราชบุรี', img:IMG+'training-cefr-boostday.jpg'},
  {label:'กิจกรรม Inspire Motivate Enjoy — Picaro', img:IMG+'training-picaro-inspire.jpg'},
  {label:'อบรมเชิงปฏิบัติการสำหรับครูผู้สอน', img:IMG+'training-classroom.jpg'},
];

const PROMO_CODES = { 'IWASCHOOL10': 0.10, 'EDU2026': 0.15 };

/* ============================================================
   STATE (persisted)
   ============================================================ */
let cart = loadCart();
let promo = loadPromo();

function loadCart(){
  try{ return JSON.parse(localStorage.getItem('iwa_cart')) || {}; }catch(e){ return {}; }
}
function saveCart(){ localStorage.setItem('iwa_cart', JSON.stringify(cart)); }
function loadPromo(){
  try{ return JSON.parse(localStorage.getItem('iwa_promo')) || null; }catch(e){ return null; }
}
function savePromo(){ localStorage.setItem('iwa_promo', JSON.stringify(promo)); }

/* ============================================================
   HELPERS
   ============================================================ */
function fmtTHB(n){ return n.toLocaleString('th-TH'); }
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

function thumbHTML(p, sizeClass){
  if(p.img){
    return `<div class="product-thumb ${sizeClass||''}"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="lvl-tag">${p.level}</span></div>`;
  }
  return `<div class="product-thumb grad ${sizeClass||''}" style="--c1:${p.c1};--c2:${p.c2}">
      <span class="lvl-tag">${p.level}</span>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4z" stroke="#fff" stroke-width="1.4" opacity="0.85"/><path d="M8 9h8M8 13h5" stroke="#fff" stroke-width="1.4" opacity="0.85"/></svg>
    </div>`;
}

/* ============================================================
   RENDER: SERVICES / PRODUCTS / GALLERY
   ============================================================ */
function serviceCardHTML(s){
  return `<div class="svc-card" data-nav="services">
    <div class="svc-icon">${ICONS[s.icon]}</div>
    <div class="svc-num">${s.num}</div>
    <h3>${s.title}</h3>
    <ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>
  </div>`;
}

function productCardHTML(p){
  const inCart = !!cart[p.id];
  return `<div class="product-card" data-pid="${p.id}">
    ${thumbHTML(p)}
    <div class="product-body">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <div class="product-foot">
        <span class="price">฿${fmtTHB(p.price)}<small>ราคาตัวอย่าง / ปี</small></span>
        <button class="add-btn ${inCart?'added':''}" data-add="${p.id}" aria-label="เพิ่มลงตะกร้า ${p.name}">
          ${inCart ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#0E2144" stroke-width="2.2" stroke-linecap="round"/></svg>'}
        </button>
      </div>
    </div>
  </div>`;
}

function galleryTileHTML(g, i){
  return `<button class="gallery-tile reveal" data-lightbox="${i}" style="transition-delay:${(i%6)*0.06}s">
    <img src="${g.img}" alt="${g.label}" loading="lazy">
    <svg class="expand-ic" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>${g.label}</span>
  </button>`;
}

function renderHome(){
  $('#homeServiceGrid').innerHTML = SERVICES.map(serviceCardHTML).join('');
  $('#homeProductGrid').innerHTML = PRODUCTS.slice(0,4).map(productCardHTML).join('');
}
function renderServicesPage(){
  $('#servicesFullGrid').innerHTML = SERVICES.map(serviceCardHTML).join('');
}
function renderGallery(){
  $('#galleryGrid').innerHTML = GALLERY.map(galleryTileHTML).join('');
  observeReveals();
}

let currentLevel = 'all';
let currentSearch = '';
function renderStore(){
  let list = currentLevel==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.level===currentLevel);
  if(currentSearch.trim()){
    const q = currentSearch.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }
  const grid = $('#storeGrid');
  if(list.length===0){
    grid.innerHTML = `<div class="no-results">
      <p>ไม่พบสินค้าที่ค้นหา ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่อื่น</p>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join('');
}

/* ============================================================
   CART
   ============================================================ */
function cartCount(){ return Object.values(cart).reduce((a,b)=>a+b,0); }
function cartSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    return sum + (p ? p.price*qty : 0);
  },0);
}
function cartTotal(){
  const sub = cartSubtotal();
  const discount = promo ? Math.round(sub * promo.rate) : 0;
  return Math.max(0, sub - discount);
}

function updateCartBadge(){
  const count = cartCount();
  const badge = $('#cartBadge');
  badge.textContent = count;
  badge.classList.toggle('show', count>0);
  const mobileCta = $('#mobileCartCta');
  $('#mobileCartText').textContent = count + ' รายการในตะกร้า';
  mobileCta.classList.toggle('show', count>0 && $('#view-store').classList.contains('active'));
}

function bumpCartIcon(){
  const btn = $('#cartBtn');
  btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
}

function renderCartView(){
  const el = $('#cartContent');
  const ids = Object.keys(cart);
  if(ids.length===0){
    el.innerHTML = `<div class="empty-cart">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.6L21 8H6" stroke="#4A5468" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="21" r="1.4" fill="#4A5468"/><circle cx="18" cy="21" r="1.4" fill="#4A5468"/></svg>
      <p>ตะกร้าของคุณยังว่างอยู่</p>
      <button class="btn btn-navy" data-nav="store" style="margin-top:18px">เลือกซื้อสื่อการเรียนรู้</button>
    </div>`;
    bindNav(el);
    return;
  }
  const itemsHTML = ids.map(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    const qty = cart[id];
    const thumb = p.img ? `<img src="${p.img}" alt="${p.name}">` : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4z" stroke="#fff" stroke-width="1.4" opacity="0.85"/></svg>`;
    const bg = p.img ? '#16305C' : p.c1;
    return `<div class="cart-item" data-row="${id}">
      <div class="cart-thumb" style="background:${bg}">${thumb}</div>
      <div>
        <h5>${p.name}</h5>
        <span class="lvl">${p.level} · ฿${fmtTHB(p.price)}</span>
      </div>
      <div class="qty-box">
        <button data-qty="${id}" data-delta="-1" aria-label="ลดจำนวน">−</button>
        <span>${qty}</span>
        <button data-qty="${id}" data-delta="1" aria-label="เพิ่มจำนวน">+</button>
      </div>
      <button class="remove-btn" data-remove="${id}">ลบ</button>
      <div class="line-total">฿${fmtTHB(p.price*qty)}</div>
    </div>`;
  }).join('');

  const sub = cartSubtotal();
  const discount = promo ? Math.round(sub*promo.rate) : 0;
  const total = cartTotal();

  el.innerHTML = `<div class="cart-layout">
    <div class="cart-list">${itemsHTML}</div>
    <div class="summary-card">
      <h3 style="margin-bottom:16px;font-size:1.1rem">สรุปคำสั่งซื้อ</h3>
      <div class="summary-row"><span>จำนวนสินค้า</span><span>${cartCount()} รายการ</span></div>
      <div class="summary-row"><span>ยอดรวม</span><span>฿${fmtTHB(sub)}</span></div>
      ${promo ? `<div class="summary-row" style="color:var(--success)"><span>ส่วนลด (${promo.code})</span><span>-฿${fmtTHB(discount)}</span></div>` : ''}
      <div class="summary-row total"><span>ยอดชำระทั้งหมด</span><span class="amt">฿${fmtTHB(total)}</span></div>

      <div class="promo-row">
        <input type="text" id="promoInput" placeholder="รหัสส่วนลด (เช่น IWASCHOOL10)" value="${promo?promo.code:''}">
        <button class="btn btn-ghost btn-sm" id="applyPromoBtn">ใช้โค้ด</button>
      </div>
      <div class="promo-msg" id="promoMsg"></div>

      <button class="btn btn-gold" id="checkoutBtn" style="width:100%;margin-top:6px">ดำเนินการสั่งซื้อ</button>
      <p class="form-note" style="text-align:center;margin-top:12px">รองรับ PromptPay / โอนผ่านธนาคาร / ออกใบเสนอราคา</p>
    </div>
  </div>`;

  $all('[data-qty]', el).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.qty, delta = parseInt(btn.dataset.delta);
      const next = (cart[id]||1) + delta;
      if(next <= 0){ removeItem(id); return; }
      cart[id] = next;
      saveCart();
      renderCartView(); updateCartBadge();
    });
  });
  $all('[data-remove]', el).forEach(btn=>{
    btn.addEventListener('click', ()=> removeItem(btn.dataset.remove));
  });
  $('#checkoutBtn').addEventListener('click', openCheckout);

  const promoInput = $('#promoInput');
  $('#applyPromoBtn').addEventListener('click', ()=>{
    const code = promoInput.value.trim().toUpperCase();
    const msg = $('#promoMsg');
    if(!code){ promo=null; savePromo(); renderCartView(); return; }
    if(PROMO_CODES[code]){
      promo = {code, rate:PROMO_CODES[code]};
      savePromo();
      renderCartView();
      showToast(`ใช้โค้ดส่วนลด "${code}" สำเร็จ (-${PROMO_CODES[code]*100}%)`, 'ok');
    } else {
      msg.textContent = 'รหัสส่วนลดไม่ถูกต้องหรือหมดอายุ';
      msg.className = 'promo-msg err';
    }
  });
}

function removeItem(id){
  const row = $(`[data-row="${id}"]`);
  if(row){
    row.classList.add('removing');
    setTimeout(()=>{
      delete cart[id];
      saveCart();
      renderCartView(); updateCartBadge();
      $all(`[data-add="${id}"]`).forEach(b=>b.classList.remove('added'));
    }, 280);
  } else {
    delete cart[id];
    saveCart();
    renderCartView(); updateCartBadge();
  }
}

function addToCart(id, sourceEl){
  cart[id] = (cart[id]||0) + 1;
  saveCart();
  updateCartBadge();
  bumpCartIcon();
  flyToCart(sourceEl);
  const p = PRODUCTS.find(x=>x.id===id);
  if(p) showToast(`เพิ่ม "${p.name}" ลงตะกร้าแล้ว`, 'ok');
}

function flyToCart(sourceEl){
  if(!sourceEl) return;
  const cartBtn = $('#cartBtn');
  if(!cartBtn) return;
  const start = sourceEl.getBoundingClientRect();
  const end = cartBtn.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'fly-ghost';
  ghost.style.left = (start.left + start.width/2 - 8) + 'px';
  ghost.style.top = (start.top + start.height/2 - 8) + 'px';
  ghost.style.width = '16px';
  ghost.style.height = '16px';
  ghost.style.background = 'var(--gold)';
  document.body.appendChild(ghost);
  requestAnimationFrame(()=>{
    ghost.style.left = (end.left + end.width/2 - 4) + 'px';
    ghost.style.top = (end.top + end.height/2 - 4) + 'px';
    ghost.style.width = '8px';
    ghost.style.height = '8px';
    ghost.style.opacity = '0.3';
  });
  setTimeout(()=> ghost.remove(), 750);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function showView(name){
  $all('.view').forEach(v=>v.classList.remove('active'));
  const target = document.getElementById('view-'+name);
  if(target) target.classList.add('active');
  $all('[data-nav]').forEach(btn=>{
    btn.setAttribute('aria-current', btn.dataset.nav===name ? 'true' : 'false');
  });
  $('#mobileNav').classList.remove('open');
  $('#burgerBtn').classList.remove('open');
  $('#burgerBtn').setAttribute('aria-expanded','false');
  window.scrollTo({top:0, behavior:'smooth'});
  if(name==='cart') renderCartView();
  updateCartBadge();
  history.pushState(null, '', '#'+name);
  observeReveals();
}

function bindNav(scope){
  $all('[data-nav]', scope).forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); showView(el.dataset.nav); });
  });
}

window.addEventListener('popstate', ()=>{
  const h = location.hash.replace('#','');
  const validViews = ['home','about','services','store','training','contact','cart'];
  showView(validViews.includes(h) ? h : 'home');
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
let io;
function observeReveals(){
  if(!io){
    io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  }
  $all('.reveal:not(.in), .reveal-stagger:not(.in)').forEach(el=> io.observe(el));
}

/* ============================================================
   HEADER SCROLL STATE + SCROLL PROGRESS + BACK TO TOP
   ============================================================ */
function onScroll(){
  const y = window.scrollY || document.documentElement.scrollTop;
  $('header').classList.toggle('scrolled', y > 30);
  $('#toTop').classList.toggle('show', y > 500);
  const doc = document.documentElement;
  const h = doc.scrollHeight - doc.clientHeight;
  $('#scrollProgress').style.width = (h>0 ? (y/h)*100 : 0) + '%';
}
window.addEventListener('scroll', onScroll, {passive:true});

/* ============================================================
   TOASTS
   ============================================================ */
function showToast(msg, type){
  const stack = $('#toastStack');
  const el = document.createElement('div');
  el.className = 'toast ' + (type||'ok');
  const icon = type==='err'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.6"/><path d="M12 8v5M12 16h.01" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el.innerHTML = icon + `<span>${msg}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 400);
  }, 3600);
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti(){
  const colors = ['#C9A227','#E8C468','#16305C','#3E8C5D','#8C3E3E'];
  for(let i=0;i<46;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random()*6;
    piece.style.left = Math.random()*100 + 'vw';
    piece.style.width = size+'px';
    piece.style.height = (size*0.4)+'px';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (2.2 + Math.random()*1.6) + 's';
    piece.style.opacity = String(0.7 + Math.random()*0.3);
    document.body.appendChild(piece);
    setTimeout(()=> piece.remove(), 4200);
  }
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(i){
  const g = GALLERY[i];
  if(!g) return;
  $('#lightboxImg').src = g.full || g.img;
  $('#lightboxImg').alt = g.label;
  $('#lightboxCaption').textContent = g.label;
  $('#lightboxOverlay').classList.add('show');
}
function closeLightbox(){ $('#lightboxOverlay').classList.remove('show'); }

/* ============================================================
   CHECKOUT (multi-step)
   ============================================================ */
let checkoutStep = 1;
let selectedPay = 'promptpay';

function openCheckout(){
  if(cartCount()===0) return;
  checkoutStep = 1;
  selectedPay = 'promptpay';
  renderCheckoutStep();
  $('#checkoutOverlay').classList.add('show');
}

function stepTrackHTML(){
  let dots = '';
  for(let i=1;i<=3;i++) dots += `<div class="dot ${i<=checkoutStep?'done':''}"></div>`;
  return `<div class="step-track">${dots}</div>`;
}

function renderCheckoutStep(){
  const body = $('#checkoutBody');
  const total = cartTotal();

  if(checkoutStep===1){
    body.innerHTML = stepTrackHTML() + `
      <h3 style="font-size:1.2rem;margin-bottom:6px">ข้อมูลผู้สั่งซื้อ</h3>
      <p style="color:var(--ink-soft);font-size:0.88rem;margin-bottom:20px">ขั้นตอน 1/3 — กรอกข้อมูลติดต่อ ยอดสั่งซื้อ ฿${fmtTHB(total)}</p>
      <form id="checkoutFormStep1" novalidate>
        <div class="field" id="f-coName"><label>ชื่อ-นามสกุลผู้ติดต่อ</label><input type="text" id="coName" required minlength="2"><div class="field-error">กรุณากรอกชื่อ-นามสกุล</div></div>
        <div class="field" id="f-coOrg"><label>โรงเรียน / หน่วยงาน</label><input type="text" id="coOrg" required><div class="field-error">กรุณากรอกชื่อโรงเรียน/หน่วยงาน</div></div>
        <div class="field" id="f-coPhone"><label>เบอร์โทรศัพท์</label><input type="tel" id="coPhone" required placeholder="08X-XXX-XXXX"><div class="field-error">กรุณากรอกเบอร์โทร 9-10 หลัก</div></div>
        <div class="field" id="f-coEmail"><label>อีเมล</label><input type="email" id="coEmail" required placeholder="you@example.com"><div class="field-error">กรุณากรอกอีเมลให้ถูกต้อง</div></div>
        <button type="submit" class="btn btn-gold" style="width:100%">ถัดไป: เลือกวิธีชำระเงิน</button>
      </form>`;
    const saved = JSON.parse(sessionStorage.getItem('iwa_checkout_contact')||'{}');
    ['coName','coOrg','coPhone','coEmail'].forEach(id=>{ if(saved[id]) $('#'+id).value = saved[id]; });

    $('#checkoutFormStep1').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fields = [
        {id:'coName', test: v => v.trim().length>=2},
        {id:'coOrg', test: v => v.trim().length>=2},
        {id:'coPhone', test: v => /^0[0-9]{8,9}$/.test(v.replace(/[-\s]/g,''))},
        {id:'coEmail', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())}
      ];
      let ok = true;
      const data = {};
      fields.forEach(f=>{
        const input = $('#'+f.id);
        const valid = f.test(input.value);
        $('#f-'+f.id).classList.toggle('has-error', !valid);
        if(!valid) ok = false;
        data[f.id] = input.value.trim();
      });
      if(!ok){ showToast('กรุณาตรวจสอบข้อมูลในแบบฟอร์มอีกครั้ง', 'err'); return; }
      sessionStorage.setItem('iwa_checkout_contact', JSON.stringify(data));
      checkoutStep = 2;
      renderCheckoutStep();
    });
    return;
  }

  if(checkoutStep===2){
    body.innerHTML = stepTrackHTML() + `
      <h3 style="font-size:1.2rem;margin-bottom:6px">เลือกวิธีการชำระเงิน</h3>
      <p style="color:var(--ink-soft);font-size:0.88rem;margin-bottom:20px">ขั้นตอน 2/3 — ยอดชำระทั้งหมด ฿${fmtTHB(total)}</p>
      <div class="pay-methods" id="payMethods">
        <label class="pay-option ${selectedPay==='promptpay'?'checked':''}" data-pay="promptpay">
          <input type="radio" name="payMethod" value="promptpay" ${selectedPay==='promptpay'?'checked':''}>
          <div><div class="po-title">พร้อมเพย์ (PromptPay QR)</div><div class="po-sub">สแกนจ่ายผ่านแอปธนาคาร — ตัวอย่างระบบสาธิต</div></div>
        </label>
        <label class="pay-option ${selectedPay==='bank'?'checked':''}" data-pay="bank">
          <input type="radio" name="payMethod" value="bank" ${selectedPay==='bank'?'checked':''}>
          <div><div class="po-title">โอนผ่านธนาคาร</div><div class="po-sub">รับเลขที่บัญชีและแนบสลิปยืนยันภายหลัง</div></div>
        </label>
        <label class="pay-option ${selectedPay==='quote'?'checked':''}" data-pay="quote">
          <input type="radio" name="payMethod" value="quote" ${selectedPay==='quote'?'checked':''}>
          <div><div class="po-title">ขอใบเสนอราคา / ออกใบแจ้งหนี้</div><div class="po-sub">สำหรับหน่วยงานราชการ/สถานศึกษาที่ต้องเบิกจ่าย</div></div>
        </label>
      </div>
      <div style="display:flex;gap:10px;margin-top:22px">
        <button type="button" class="btn btn-ghost" id="backStep1" style="flex:1">ย้อนกลับ</button>
        <button type="button" class="btn btn-gold" id="toStep3" style="flex:2">ถัดไป: ยืนยันคำสั่งซื้อ</button>
      </div>`;

    $all('.pay-option', body).forEach(opt=>{
      opt.addEventListener('click', ()=>{
        selectedPay = opt.dataset.pay;
        $all('.pay-option', body).forEach(o=>o.classList.toggle('checked', o===opt));
        $all('input[name="payMethod"]', body).forEach(r=> r.checked = (r.value===selectedPay));
      });
    });
    $('#backStep1').addEventListener('click', ()=>{ checkoutStep=1; renderCheckoutStep(); });
    $('#toStep3').addEventListener('click', ()=>{ checkoutStep=3; renderCheckoutStep(); });
    return;
  }

  if(checkoutStep===3){
    const contact = JSON.parse(sessionStorage.getItem('iwa_checkout_contact')||'{}');
    const lines = Object.entries(cart).map(([id,qty])=>{
      const p = PRODUCTS.find(x=>x.id===id);
      return `<div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:6px 0;color:var(--ink-soft)"><span>${p.name} × ${qty}</span><span style="font-family:var(--font-mono)">฿${fmtTHB(p.price*qty)}</span></div>`;
    }).join('');

    const payLabel = {promptpay:'พร้อมเพย์ (PromptPay QR)', bank:'โอนผ่านธนาคาร', quote:'ขอใบเสนอราคา / ออกใบแจ้งหนี้'}[selectedPay];

    let payBlock = '';
    if(selectedPay==='promptpay'){
      payBlock = `<div class="qr-wrap">
        <canvas id="ppQrCanvas"></canvas>
        <div class="qr-demo-tag">QR ตัวอย่าง (Demo) — ไม่ผูกบัญชีรับเงินจริง</div>
        <p class="form-note" style="margin-top:10px">ในระบบใช้งานจริง QR นี้จะสร้างจากเลขพร้อมเพย์ของบริษัทและยอดชำระอัตโนมัติ ตามมาตรฐาน EMV QR ของ ธปท.</p>
      </div>`;
    } else if(selectedPay==='bank'){
      payBlock = `<div class="info-card" style="box-shadow:none;border:1px solid var(--line)">
        <div class="info-card-body" style="padding:18px">
          <div class="info-row"><div><strong>ธนาคารกสิกรไทย</strong><span>เลขที่บัญชี 123-4-56789-0 (ตัวอย่าง)</span></div></div>
          <div class="info-row"><div><strong>ชื่อบัญชี</strong><span>บริษัท ไอว่า ริช ยู ดี จำกัด</span></div></div>
        </div>
      </div>
      <p class="form-note" style="margin-top:10px">กรุณาแนบสลิปการโอนเงินทางอีเมลหลังยืนยันคำสั่งซื้อ ทีมงานจะตรวจสอบและติดต่อกลับภายใน 1 วันทำการ</p>`;
    } else {
      payBlock = `<p class="form-note">ทีมงานจะจัดทำใบเสนอราคา/ใบแจ้งหนี้อย่างเป็นทางการและส่งให้ทางอีเมลภายใน 1 วันทำการ</p>`;
    }

    body.innerHTML = stepTrackHTML() + `
      <h3 style="font-size:1.2rem;margin-bottom:6px">ยืนยันคำสั่งซื้อ</h3>
      <p style="color:var(--ink-soft);font-size:0.88rem;margin-bottom:16px">ขั้นตอน 3/3</p>
      <div style="background:var(--paper);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:16px">
        <div style="font-size:0.82rem;color:var(--ink-soft);margin-bottom:6px">${contact.coName||''} · ${contact.coOrg||''}</div>
        ${lines}
        <div style="display:flex;justify-content:space-between;font-weight:700;color:var(--navy-deep);border-top:1px solid var(--line);margin-top:8px;padding-top:10px"><span>รวมทั้งสิ้น</span><span style="font-family:var(--font-mono)">฿${fmtTHB(total)}</span></div>
      </div>
      <p style="font-size:0.85rem;color:var(--ink-soft);margin-bottom:14px">วิธีชำระเงิน: <strong style="color:var(--navy-deep)">${payLabel}</strong></p>
      ${payBlock}
      <div style="display:flex;gap:10px;margin-top:22px">
        <button type="button" class="btn btn-ghost" id="backStep2" style="flex:1">ย้อนกลับ</button>
        <button type="button" class="btn btn-gold" id="confirmOrderBtn" style="flex:2">ยืนยันคำสั่งซื้อ</button>
      </div>`;

    if(selectedPay==='promptpay'){
      try{
        const payload = window.buildPromptPayPayload('0000000000', total);
        const qr = qrcode(0, 'M');
        qr.addData(payload);
        qr.make();
        const canvas = $('#ppQrCanvas');
        const cellSize = 6, margin = 4;
        const count = qr.getModuleCount();
        const size = (count + margin*2) * cellSize;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,size,size);
        ctx.fillStyle = '#0E2144';
        for(let r=0;r<count;r++){
          for(let c=0;c<count;c++){
            if(qr.isDark(r,c)) ctx.fillRect((c+margin)*cellSize, (r+margin)*cellSize, cellSize, cellSize);
          }
        }
      }catch(err){ /* QR generation best-effort; checkout still works without it */ }
    }

    $('#backStep2').addEventListener('click', ()=>{ checkoutStep=2; renderCheckoutStep(); });
    $('#confirmOrderBtn').addEventListener('click', ()=> finalizeOrder(contact, payLabel));
    return;
  }
}

function finalizeOrder(contact, payLabel){
  const total = cartTotal();
  const orderId = 'IWA-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(1000+Math.random()*9000);

  const lines = Object.entries(cart).map(([id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    return `- ${p.name} x${qty} = ฿${fmtTHB(p.price*qty)}`;
  }).join('%0D%0A');

  const mailBody = `รายการสั่งซื้อ (${orderId})%0D%0A%0D%0Aผู้สั่งซื้อ: ${contact.coName}%0D%0Aหน่วยงาน: ${contact.coOrg}%0D%0Aโทร: ${contact.coPhone}%0D%0Aอีเมล: ${contact.coEmail}%0D%0Aวิธีชำระเงิน: ${payLabel}%0D%0A%0D%0Aรายการสินค้า:%0D%0A${lines}%0D%0A%0D%0Aยอดรวมทั้งสิ้น: ฿${fmtTHB(total)}`;
  const mailtoLink = `mailto:supannee@iwarichyoudee.com?subject=${encodeURIComponent('คำสั่งซื้อใหม่ '+orderId)}&body=${mailBody}`;

  const orderRecord = {orderId, date:new Date().toISOString(), contact, payLabel, total, items:Object.entries(cart).map(([id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id); return {name:p.name, qty, price:p.price};
  })};
  try{
    const history = JSON.parse(localStorage.getItem('iwa_orders')||'[]');
    history.push(orderRecord);
    localStorage.setItem('iwa_orders', JSON.stringify(history));
  }catch(e){}

  $('#checkoutBody').innerHTML = `
    <div class="order-success" id="orderSuccessPrint">
      <div class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h3 style="font-size:1.15rem">รับคำสั่งซื้อเรียบร้อย</h3>
      <p style="color:var(--ink-soft);font-size:0.9rem;margin-top:6px">หมายเลขคำสั่งซื้อของคุณคือ</p>
      <div class="order-id">${orderId}</div>
      <p style="color:var(--ink-soft);font-size:0.88rem;margin:14px 0">ทีมงานจะติดต่อกลับภายใน 1 วันทำการเพื่อยืนยันการชำระเงิน (${payLabel})</p>
      <a href="${mailtoLink}" class="btn btn-navy" style="width:100%;margin-top:6px">ส่งสรุปคำสั่งซื้อทางอีเมล</a>
      <button class="btn btn-ghost" id="printOrderBtn" style="width:100%;margin-top:10px">พิมพ์ / บันทึกใบสรุปคำสั่งซื้อ</button>
      <button class="btn btn-ghost" id="closeSuccess" style="width:100%;margin-top:10px">กลับไปหน้าตะกร้า</button>
    </div>`;

  cart = {}; promo = null;
  saveCart(); savePromo();
  updateCartBadge();
  $all('[data-add]').forEach(b=>b.classList.remove('added'));
  launchConfetti();

  $('#printOrderBtn').addEventListener('click', ()=> window.print());
  $('#closeSuccess').addEventListener('click', ()=>{
    $('#checkoutOverlay').classList.remove('show');
    renderCartView();
  });
}

/* ============================================================
   INIT / EVENT WIRING
   ============================================================ */
function init(){
  renderHome();
  renderServicesPage();
  renderGallery();
  renderStore();
  updateCartBadge();

  bindNav(document);

  $('#burgerBtn').addEventListener('click', ()=>{
    const nav = $('#mobileNav');
    const open = nav.classList.toggle('open');
    $('#burgerBtn').classList.toggle('open', open);
    $('#burgerBtn').setAttribute('aria-expanded', open);
  });

  $('#storeTabs').addEventListener('click', (e)=>{
    const btn = e.target.closest('.tab-btn');
    if(!btn) return;
    $all('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    renderStore();
  });

  $('#storeSearch').addEventListener('input', (e)=>{
    currentSearch = e.target.value;
    renderStore();
  });

  document.body.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('[data-add]');
    if(!addBtn) return;
    const id = addBtn.dataset.add;
    addBtn.classList.add('added','pop');
    setTimeout(()=> addBtn.classList.remove('pop'), 450);
    addBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    addToCart(id, addBtn);
  });

  document.body.addEventListener('click', (e)=>{
    const tile = e.target.closest('[data-lightbox]');
    if(!tile) return;
    openLightbox(parseInt(tile.dataset.lightbox));
  });
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxOverlay').addEventListener('click', (e)=>{ if(e.target.id==='lightboxOverlay') closeLightbox(); });

  $('#closeCheckout').addEventListener('click', ()=> $('#checkoutOverlay').classList.remove('show'));
  $('#checkoutOverlay').addEventListener('click', (e)=>{ if(e.target.id==='checkoutOverlay') e.currentTarget.classList.remove('show'); });

  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){ closeLightbox(); $('#checkoutOverlay').classList.remove('show'); }
  });

  /* contact form */
  $('#contactForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fields = [
      {id:'cName', test: v => v.trim().length>=2, err:'กรุณากรอกชื่อ-นามสกุล'},
      {id:'cPhone', test: v => /^0[0-9]{8,9}$/.test(v.replace(/[-\s]/g,'')), err:'กรุณากรอกเบอร์โทรให้ถูกต้อง'},
      {id:'cEmail', test: v => v.trim()==='' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), err:'รูปแบบอีเมลไม่ถูกต้อง'}
    ];
    let ok = true;
    fields.forEach(f=>{
      const input = $('#'+f.id);
      const valid = f.test(input.value);
      const wrap = input.closest('.field');
      wrap.classList.toggle('has-error', !valid);
      if(!valid) ok = false;
    });
    if(!ok){ showToast('กรุณาตรวจสอบข้อมูลในแบบฟอร์ม', 'err'); return; }

    const name = $('#cName').value;
    const org = $('#cOrg').value;
    const phone = $('#cPhone').value;
    const email = $('#cEmail').value;
    const msg = $('#cMsg').value;
    const body = `ชื่อ: ${name}%0D%0Aหน่วยงาน: ${org}%0D%0Aโทร: ${phone}%0D%0Aอีเมล: ${email}%0D%0A%0D%0Aข้อความ:%0D%0A${msg}`;
    const link = `mailto:supannee@iwarichyoudee.com?subject=${encodeURIComponent('ติดต่อสอบถามจากเว็บไซต์ - '+name)}&body=${body}`;
    $('#contactSuccess').classList.add('show');
    showToast('ส่งข้อความเรียบร้อยแล้ว', 'ok');
    window.open(link, '_blank');
    e.target.reset();
  });

  /* animated hero counters */
  animateCounters();
  observeReveals();

  const initialHash = location.hash.replace('#','');
  const validViews = ['home','about','services','store','training','contact','cart'];
  showView(validViews.includes(initialHash) ? initialHash : 'home');
}

function animateCounters(){
  $all('[data-count]').forEach(el=>{
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();

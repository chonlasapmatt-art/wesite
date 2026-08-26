/* IWA RICH U D — Company & Product Catalog
   Product ordering / cart / checkout intentionally removed. */
(function(){
'use strict';

const IMG='assets/img/';
const EDTECH='https://www.edtech-info.com/';

/* Load the catalog-specific stylesheet after the existing site styles so it can
   enhance the product cards without touching the rest of the original design. */
const catalogCss=document.createElement('link');
catalogCss.rel='stylesheet';
catalogCss.href='assets/css/catalog.css';
document.head.appendChild(catalogCss);

const SERVICES=[
 {title:'Network Infrastructure & Design',img:IMG+'service-network.jpg',items:['ออกแบบและวางระบบเครือข่าย LAN/Fiber Optic','Server และ Network Security','Smart Classroom Solution','Digital Language Lab']},
 {title:'Software & Application Development',img:IMG+'service-software.jpg',items:['Custom Software','Mobile & Web Application','System Integration','Learning Management System (LMS)']},
 {title:'IT Maintenance Service',img:IMG+'service-maintenance.jpg',items:['บริการดูแลรักษารายเดือน-รายปี','ตรวจเช็กระบบและกู้คืนข้อมูล','ดูแลอุปกรณ์และซอฟต์แวร์']},
 {title:'Hardware & Software Supply',img:IMG+'service-hardware.jpg',items:['อุปกรณ์คอมพิวเตอร์และซอฟต์แวร์ลิขสิทธิ์','Interactive Smart Display','สื่อมัลติมีเดียเพื่อการศึกษา']},
 {title:'ICT Training & Seminar',img:IMG+'service-training.jpg',items:['อบรมการใช้งานระบบและซอฟต์แวร์','อบรม Smart Classroom / Language Lab','อบรมสื่อการเรียนรู้และ CEFR']},
 {title:'บริการพัฒนาแอปพลิเคชันและระบบอัตโนมัติด้วย AI (AI Application & Intelligent Automation)',img:IMG+'service-software.jpg',items:['พัฒนา AI Application ให้เหมาะกับความต้องการขององค์กร','ออกแบบระบบอัตโนมัติด้วย AI เพื่อลดขั้นตอนการทำงาน','เชื่อมต่อ AI เข้ากับ Web / Mobile / Business Process']}
];

const PRODUCT_GROUPS=[
 {title:'หลักสูตรภาษาอังกฤษสำหรับเด็ก',en:'CHILDREN\'S ENGLISH PROGRAMS',intro:'หลักสูตรภาษาอังกฤษสำหรับเด็กที่เน้นการเรียนรู้แบบผสมผสาน สนุก และพัฒนาทักษะภาษาอย่างเป็นขั้นตอน',products:[
  {name:'Picaro English',desc:'หลักสูตรภาษาอังกฤษสำหรับเด็กผ่านการเรียนรู้แบบเกมและกิจกรรม อ้างอิงกรอบ CEFR',level:'เด็ก / ประถมศึกษา',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage111.jpg',source:EDTECH+'17553221/picaro-english'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 1',desc:'ชุดหนังสือ Student\'s Book, Workbook และ Picaro Game Online สำหรับระดับเริ่มต้น',level:'Level 1',img:IMG+'product-picaro.jpg',source:EDTECH+'product/220690'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 2',desc:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก พร้อมหนังสือและกิจกรรมออนไลน์',level:'Level 2',img:IMG+'product-picaro.jpg',source:EDTECH+'product/220691'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 3',desc:'ชุดหนังสือและ Picaro Game Online สำหรับพัฒนาทักษะภาษาอังกฤษในระดับต่อเนื่อง',level:'Level 3',img:IMG+'product-picaro.jpg',source:EDTECH+'product/220692'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 4',desc:'ชุดหนังสือและ Picaro Game Online สำหรับระดับที่สูงขึ้น',level:'Level 4',img:IMG+'product-picaro.jpg',source:EDTECH+'product/220693'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 1-4',desc:'ชุดครบ 4 ระดับ สำหรับการเรียนรู้อย่างต่อเนื่องตั้งแต่ Level 1 ถึง Level 4',level:'Level 1–4',img:IMG+'product-picaro.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร',en:'COMMUNICATIVE ENGLISH PROGRAMS',intro:'หลักสูตรเพื่อฝึกการสื่อสารภาษาอังกฤษในสถานการณ์จริง พร้อมแนวทางการเรียนรู้ที่สอดคล้องกับ CEFR',products:[
  {name:'Velawoods English',desc:'ฝึกทักษะการสื่อสารผ่านสถานการณ์จำลองในเมืองเสมือนจริง เหมาะสำหรับการเรียนรู้แบบออนไลน์',level:'CEFR',img:IMG+'product-vantage.jpg',source:EDTECH+'17304334/หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร'},
  {name:'Vantage Connected Learn Social',desc:'พัฒนาทักษะการสื่อสารภาษาอังกฤษตามกรอบ CEFR ผ่าน Learn Social Platform',level:'CEFR / Learn Social',img:IMG+'product-vantage.jpg',source:EDTECH+'17604389/vantage-connected-learn-social'},
  {name:'Dynamic English',desc:'พัฒนาทักษะการฟังและการสื่อสารภาษาอังกฤษจากเจ้าของภาษาในรูปแบบบทละครและบทสนทนา',level:'Communication',img:IMG+'hero-laptops.jpg',source:EDTECH+'17312039/dynamic-english'},
  {name:'Beginner Course (A1)',desc:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสารระดับเริ่มต้น',level:'A1',img:IMG+'product-vantage.jpg',source:EDTECH+'category/0'},
  {name:'Pre-Intermediate Course (A2)',desc:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสารระดับต่อเนื่อง',level:'A2',img:IMG+'product-vantage.jpg',source:EDTECH+'category/0'},
  {name:'Coursebook (A1 / A2)',desc:'หนังสือประกอบการเรียนรู้สำหรับหลักสูตรภาษาอังกฤษเพื่อการสื่อสาร',level:'Coursebook',img:IMG+'product-dls.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'สื่อมัลติมีเดียระดับปฐมวัย',en:'PRESCHOOL MULTIMEDIA',intro:'สื่อการเรียนรู้ที่ออกแบบให้เหมาะกับเด็กปฐมวัยและการใช้งานผ่านห้องเรียนหรือกระดานอัจฉริยะ',products:[
  {name:'Click2Plearn',desc:'สื่อที่สอดคล้องกับหลักสูตรปฐมวัย พ.ศ. 2560 และส่งเสริมพัฒนาการทุกด้าน',level:'ปฐมวัย',img:'https://shop-image.readyplanet.com/NdwewGDZ_jSsQQze9rt4Tl4xUD8%3D/d9c5efabba7f4da88f7941439e977acc',source:EDTECH+'product/240335'},
  {name:'โปรแกรมพัฒนาทักษะการใช้ภาษา',desc:'พัฒนาทักษะฟัง พูด อ่าน และเขียน ทั้งภาษาไทยและภาษาอังกฤษสำหรับเด็กปฐมวัย',level:'ปฐมวัย',img:IMG+'product-p4.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์',desc:'พัฒนาทักษะการนับ คำนวณ เรขาคณิต การวัด การชั่ง การตวง เงิน และเวลา',level:'ปฐมวัย',img:IMG+'product-p2.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์',desc:'เนื้อหาเกี่ยวกับธรรมชาติ สิ่งรอบตัว บุคคล และสถานที่แวดล้อมเด็ก',level:'ปฐมวัย',img:IMG+'product-p3.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะกระบวนการคิดเสริมเชาวน์ปัญญา',desc:'พัฒนาความจำ การสังเกต การจำแนก การจัดกลุ่ม การเรียงลำดับ และมิติสัมพันธ์',level:'ปฐมวัย',img:IMG+'product-p1.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมสื่อมัลติมีเดียเพื่อการเรียนรู้เด็กปฐมวัย',desc:'สื่อเสริมการเรียนรู้เรื่องประชาคมอาเซียน ครอบคลุมความรู้และกิจกรรมฝึกทักษะ',level:'ปฐมวัย',img:IMG+'product-p6.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'ระบบคลังข้อสอบสำหรับเด็กปฐมวัย',desc:'คลังข้อสอบเพื่อเตรียมความพร้อมก่อนเข้าเรียนระดับประถมศึกษา',level:'ปฐมวัย',img:IMG+'product-p5.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'ระบบ e-Learning สำหรับครูปฐมวัย',desc:'แหล่งเรียนรู้เพื่อพัฒนาครูปฐมวัยผ่านบทเรียนอิเล็กทรอนิกส์รูปแบบมัลติมีเดีย',level:'สำหรับครู',img:IMG+'product-dls.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'}
 ]},
 {title:'สื่อมัลติมีเดียระดับประถมศึกษา',en:'PRIMARY MULTIMEDIA',intro:'สื่อดิจิทัลเพื่อการเรียนการสอนระดับประถมศึกษา ครอบคลุมหลายกลุ่มสาระและใช้งานกับห้องเรียนสมัยใหม่',products:[
  {name:'Digital Library@School',desc:'คลังสื่อและบทเรียนดิจิทัลสำหรับการเรียนรู้ในโรงเรียน',level:'ประถมศึกษา',img:IMG+'product-dls.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมสื่อมัลติมีเดียเพื่อการเรียนรู้ ชุด อาเซียนน่ารู้',desc:'เรียนรู้เรื่องประเทศสมาชิกอาเซียน ธงชาติ เมืองหลวง วัฒนธรรม และกิจกรรมฝึกทักษะ',level:'ประถมศึกษา',img:IMG+'product-p6.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'อ่านออก เขียนได้ ง่ายนิดเดียว',desc:'สื่อพัฒนาทักษะการอ่านและการเขียนภาษาไทย ผ่านแอนิเมชัน เกม และแบบทดสอบ',level:'ภาษาไทย',img:IMG+'product-p4.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์',desc:'สื่อมัลติมีเดียพัฒนาทักษะคณิตศาสตร์ให้สอดคล้องกับหลักสูตรแกนกลาง',level:'คณิตศาสตร์',img:IMG+'product-p10.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์',desc:'สื่อมัลติมีเดียพัฒนาทักษะวิทยาศาสตร์ระดับประถมศึกษา',level:'วิทยาศาสตร์',img:IMG+'product-p11.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะการใช้ภาษาไทยประถมศึกษา',desc:'สื่อมัลติมีเดียพัฒนาทักษะภาษาไทยสำหรับนักเรียนระดับประถมศึกษา',level:'ภาษาไทย',img:IMG+'product-p12.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'}
 ]},
 {title:'หนังสืออิเล็กทรอนิกส์ (e-Book)',en:'E-BOOK & DIGITAL READING',intro:'หนังสืออิเล็กทรอนิกส์และกิจกรรมดิจิทัลที่ใช้งานได้ทั้งในห้องเรียนและการเรียนรู้ด้วยตนเอง',products:[
  {name:'eBook กิจกรรมพัฒนาทักษะเด็กปฐมวัย',desc:'e-Book แบบ 3 มิติ พร้อมกิจกรรมระบายสีและกิจกรรมพัฒนาทักษะสำหรับเด็กปฐมวัย',level:'e-Book',img:IMG+'product-p5.jpg',source:EDTECH+'17570280/หนังสืออิเล็กทรอนิกส์-e-book'}
 ]},
 {title:'LED Interactive Intelligent Panel',en:'SMART CLASSROOM DISPLAY',intro:'จอ Interactive สำหรับห้องเรียนและการประชุม พร้อมระบบสัมผัสและความละเอียดสูง',products:[
  {name:'LED Interactive Intelligent Panel ขนาด 65 นิ้ว',desc:'จอ LED ระบบสัมผัส Multi-touch ความละเอียด 4K รองรับการใช้งานหลากหลายรูปแบบ',level:'65 นิ้ว',img:IMG+'hero-smartboard.jpg',source:EDTECH+'product/228944'},
  {name:'LED Interactive Intelligent Panel ขนาด 75 นิ้ว',desc:'จอ Interactive ขนาดใหญ่สำหรับห้องเรียน ห้องประชุม และพื้นที่การเรียนรู้',level:'75 นิ้ว',img:IMG+'hero-smartboard.jpg',source:EDTECH+'category/0'},
  {name:'LED Interactive Intelligent Panel ขนาด 86 นิ้ว',desc:'จอ Interactive ขนาดใหญ่สำหรับพื้นที่ที่ต้องการมุมมองกว้างและการทำงานร่วมกัน',level:'86 นิ้ว',img:IMG+'hero-smartboard.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'English Proficiency Test',en:'ENGLISH ASSESSMENT',intro:'เครื่องมือประเมินความสามารถทางภาษาอังกฤษเพื่อวัดระดับและใช้วางแผนพัฒนาผู้เรียน',products:[
  {name:'English Proficiency Test',desc:'ระบบประเมินทักษะภาษาอังกฤษสำหรับใช้วัดระดับความสามารถและประกอบการวางแผนการเรียนรู้',level:'Assessment',img:IMG+'logo-cefr.jpg',source:EDTECH+'category/0'},
  {name:'CEFR Placement & Progress Assessment',desc:'แนวทางประเมินระดับภาษาอังกฤษตามกรอบ CEFR เพื่อช่วยวางแผนเส้นทางการเรียนรู้',level:'CEFR',img:IMG+'logo-cefr.jpg',source:EDTECH+'17304334/หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร'}
 ]}
];

const TRAINING=[
 {title:'อบรมเชิงปฏิบัติการสำหรับครูผู้สอน',img:IMG+'training-classroom.jpg',items:['การใช้สื่อดิจิทัลเพื่อการเรียนการสอน','กิจกรรมเชิงปฏิบัติการสำหรับผู้สอน']},
 {title:'Picaro English Training',img:IMG+'training-presenter.jpg',items:['แนวทางการเรียนรู้ภาษาอังกฤษ','กิจกรรม Inspire Motivate Enjoy']},
 {title:'English CEFR Boost Day',img:IMG+'training-cefr-boostday.jpg',items:['กิจกรรมพัฒนาทักษะภาษาอังกฤษ','แนวทางการประยุกต์ใช้ CEFR']}
];

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function imgTag(src,alt){return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${IMG}logo.png'">`;}
function renderServices(){
 const el=document.getElementById('serviceGrid');if(!el)return;
 el.innerHTML=SERVICES.map((s,i)=>`<article class="card service-card ${i===5?'service-card-ai':''}">${imgTag(s.img,s.title)}<div class="service-number">${String(i+1).padStart(2,'0')}</div><h3>${esc(s.title)}</h3><ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');
}
function productCard(p,i){return `<article class="card product-card product-catalog-card"><div class="product-media">${imgTag(p.img,p.name)}<span class="product-pill">${esc(p.level)}</span></div><div class="product-body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="product-actions"><button class="detail-btn" data-product="${i}">ดูรายละเอียด</button><a class="source-btn" href="${esc(p.source||'#')}" target="_blank" rel="noopener">ดูข้อมูลต้นทาง</a></div></div></article>`;}
let FLAT_PRODUCTS=[];
function renderProducts(){
 const el=document.getElementById('productGrid');if(!el)return;FLAT_PRODUCTS=[];
 el.innerHTML=PRODUCT_GROUPS.map((group,gi)=>{const cards=group.products.map(p=>{const flatIndex=FLAT_PRODUCTS.length;FLAT_PRODUCTS.push(p);return productCard(p,flatIndex);}).join('');return `<section class="product-category" data-product-category="${gi}"><div class="product-category-head"><div><span class="eyebrow">${esc(group.en)}</span><h3>${esc(group.title)}</h3><p>${esc(group.intro)}</p></div><span class="product-count">${group.products.length} รายการ</span></div><div class="product-category-grid">${cards}</div></section>`;}).join('');
 el.addEventListener('click',e=>{const b=e.target.closest('[data-product]');if(b)openProduct(Number(b.dataset.product));});
}
function renderTraining(){const el=document.getElementById('trainingGrid');if(!el)return;el.innerHTML=TRAINING.map(t=>`<article class="card service-card">${imgTag(t.img,t.title)}<h3>${esc(t.title)}</h3><ul>${t.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');}
function openProduct(i){
 const p=FLAT_PRODUCTS[i],modal=document.getElementById('productModal');if(!p||!modal)return;
 const img=document.getElementById('modalImage');img.src=p.img;img.alt=p.name;img.onerror=()=>{img.onerror=null;img.src=IMG+'logo.png';};
 document.getElementById('modalLevel').textContent=p.level;document.getElementById('modalTitle').textContent=p.name;document.getElementById('modalDesc').textContent=p.desc;
 const source=document.getElementById('modalSource');if(source){source.href=p.source||'#';source.style.display=p.source?'inline-flex':'none';}
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeProduct(){const m=document.getElementById('productModal');if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function go(id){const el=document.getElementById(id);if(!el)return;document.querySelectorAll('[data-section]').forEach(x=>x.classList.toggle('active',x.dataset.section===id));el.scrollIntoView({behavior:'smooth',block:'start'});const mobile=document.getElementById('mobileNav');if(mobile)mobile.classList.remove('open');}

document.addEventListener('DOMContentLoaded',()=>{
 renderServices();renderProducts();renderTraining();
 document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.section)));
 const burger=document.getElementById('burgerBtn');if(burger)burger.addEventListener('click',()=>document.getElementById('mobileNav').classList.toggle('open'));
 const modalClose=document.getElementById('modalClose');if(modalClose)modalClose.addEventListener('click',closeProduct);
 const modal=document.getElementById('productModal');if(modal)modal.addEventListener('click',e=>{if(e.target.id==='productModal')closeProduct();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct();});
 const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){const id=x.target.id;document.querySelectorAll('.main-nav button,.mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));}}),{threshold:.2,rootMargin:'-20% 0px -65% 0px'});
 document.querySelectorAll('main section[id]').forEach(s=>io.observe(s));
});
})();

/* IWA RICH U D — Company & Product Catalog
   Shopping cart / checkout / order tracking removed. */
(function(){
'use strict';

const IMG='assets/img/';

const SERVICES=[
 {title:'Network Infrastructure & Design',img:IMG+'service-network.jpg',items:['ออกแบบและวางระบบเครือข่าย LAN/Fiber Optic','Server และ Network Security','Smart Classroom Solution','Digital Language Lab']},
 {title:'Software & Application Development',img:IMG+'service-software.jpg',items:['Custom Software','Mobile & Web Application','System Integration','Learning Management System (LMS)']},
 {title:'IT Maintenance Service',img:IMG+'service-maintenance.jpg',items:['บริการดูแลรักษารายเดือน-รายปี','ตรวจเช็กระบบและกู้คืนข้อมูล','ดูแลอุปกรณ์และซอฟต์แวร์']},
 {title:'Hardware & Software Supply',img:IMG+'service-hardware.jpg',items:['อุปกรณ์คอมพิวเตอร์และซอฟต์แวร์ลิขสิทธิ์','Interactive Smart Display','สื่อมัลติมีเดียเพื่อการศึกษา']},
 {title:'ICT Training & Seminar',img:IMG+'service-training.jpg',items:['อบรมการใช้งานระบบและซอฟต์แวร์','อบรม Smart Classroom / Language Lab','อบรมสื่อการเรียนรู้และ CEFR']}
];

const PRODUCTS=[
 {level:'ปฐมวัย',name:'โปรแกรมพัฒนาทักษะกระบวนการคิดเสริมเชาวน์ปัญญา',desc:'สื่อมัลติมีเดียเสริมกระบวนการคิด การสังเกต การจำแนก และความสัมพันธ์เชิงมิติ',img:IMG+'product-p1.jpg'},
 {level:'ปฐมวัย',name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์',desc:'สอนความสัมพันธ์ทางคณิต การนับจำนวน เรขาคณิต การวัด การชั่ง และการตวง',img:IMG+'product-p2.jpg'},
 {level:'ปฐมวัย',name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์',desc:'เนื้อหาเกี่ยวกับตัวเด็ก บุคคล สถานที่ และธรรมชาติรอบตัว',img:IMG+'product-p3.jpg'},
 {level:'ปฐมวัย',name:'โปรแกรมพัฒนาทักษะการใช้ภาษา',desc:'ฝึกพยัญชนะไทย สระ การประสมคำ และมาตราตัวสะกด ผ่านสื่อดิจิทัล',img:IMG+'product-p4.jpg'},
 {level:'ปฐมวัย',name:'สื่อการเรียนรู้ระดับปฐมวัย (CAI)',desc:'อิงหลักสูตรปฐมวัย พ.ศ. 2560 ครบ 4 สาระการเรียนรู้',img:IMG+'product-p5.jpg'},
 {level:'ปฐมวัย',name:'สื่อมัลติมีเดีย "อาเซียนน่ารู้"',desc:'ความรู้เกี่ยวกับ 10 ประเทศสมาชิกอาเซียน ธงชาติ เมืองหลวง และวัฒนธรรม',img:IMG+'product-p6.jpg'},
 {level:'ปฐมวัย',name:'สื่อโฟนิคส์ (Phonics Hero)',desc:'พัฒนาทักษะการอ่านออกเสียงและสะกดคำภาษาอังกฤษแบบโฟนิคส์',img:IMG+'product-phonicshero.jpg'},
 {level:'ปฐมวัย',name:'Picaro English',desc:'หลักสูตรภาษาอังกฤษผ่านกิจกรรมและเกม อ้างอิงมาตรฐาน CEFR',img:IMG+'product-picaro.jpg'},
 {level:'ประถมศึกษา',name:'Digital Library@School (DLS)',desc:'บทเรียนคอมพิวเตอร์ช่วยสอนครบทุกกลุ่มสาระ อิงหลักสูตรแกนกลาง',img:IMG+'product-dls.jpg'},
 {level:'ประถมศึกษา',name:'DLS คณิตศาสตร์',desc:'สื่อพัฒนาทักษะคณิตศาสตร์ระดับประถมศึกษา ผ่านภาพเคลื่อนไหวและแบบโต้ตอบ',img:IMG+'product-p10.jpg'},
 {level:'ประถมศึกษา',name:'DLS วิทยาศาสตร์',desc:'สื่อพัฒนาทักษะวิทยาศาสตร์ระดับประถมศึกษา เข้าใจง่ายด้วยภาพและเสียง',img:IMG+'product-p11.jpg'},
 {level:'ประถมศึกษา',name:'DLS ภาษาไทย',desc:'สื่อพัฒนาทักษะภาษาไทยระดับประถมศึกษา ผ่านเกมและแบบทดสอบ',img:IMG+'product-p12.jpg'},
 {level:'มัธยมศึกษา',name:'Vantage Essential English',desc:'หลักสูตรออนไลน์จากอังกฤษ อิง CEFR 6 ระดับ (A1-C1) พร้อม Placement Test',img:IMG+'product-vantage.jpg'}
];

const TRAINING=[
 {title:'อบรมเชิงปฏิบัติการสำหรับครูผู้สอน',img:IMG+'training-classroom.jpg',items:['การใช้สื่อดิจิทัลเพื่อการเรียนการสอน','กิจกรรมเชิงปฏิบัติการสำหรับผู้สอน']},
 {title:'Picaro English Training',img:IMG+'training-presenter.jpg',items:['แนวทางการเรียนรู้ภาษาอังกฤษ','กิจกรรม Inspire Motivate Enjoy']},
 {title:'English CEFR Boost Day',img:IMG+'training-cefr-boostday.jpg',items:['กิจกรรมพัฒนาทักษะภาษาอังกฤษ','แนวทางการประยุกต์ใช้ CEFR']}
];

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function renderServices(){
 const el=document.getElementById('serviceGrid'); if(!el)return;
 el.innerHTML=SERVICES.map(s=>`<article class="card service-card"><img src="${s.img}" alt="${esc(s.title)}"><h3>${esc(s.title)}</h3><ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');
}
function renderProducts(){
 const el=document.getElementById('productGrid'); if(!el)return;
 el.innerHTML=PRODUCTS.map((p,i)=>`<article class="card product-card"><img src="${p.img}" alt="${esc(p.name)}"><div class="product-body"><span class="tag">${esc(p.level)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><button class="detail-btn" data-product="${i}">ดูรายละเอียดสินค้า</button></div></article>`).join('');
 el.addEventListener('click',e=>{const b=e.target.closest('[data-product]');if(b)openProduct(Number(b.dataset.product));});
}
function renderTraining(){
 const el=document.getElementById('trainingGrid'); if(!el)return;
 el.innerHTML=TRAINING.map(t=>`<article class="card service-card"><img src="${t.img}" alt="${esc(t.title)}"><h3>${esc(t.title)}</h3><ul>${t.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');
}
function openProduct(i){
 const p=PRODUCTS[i], modal=document.getElementById('productModal');
 if(!p||!modal)return;
 document.getElementById('modalImage').src=p.img; document.getElementById('modalImage').alt=p.name;
 document.getElementById('modalLevel').textContent=p.level; document.getElementById('modalTitle').textContent=p.name; document.getElementById('modalDesc').textContent=p.desc;
 modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeProduct(){const m=document.getElementById('productModal');m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function go(id){const el=document.getElementById(id);if(!el)return;document.querySelectorAll('[data-section]').forEach(x=>x.classList.toggle('active',x.dataset.section===id));el.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('mobileNav').classList.remove('open');}

document.addEventListener('DOMContentLoaded',()=>{
 renderServices();renderProducts();renderTraining();
 document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.section)));
 document.getElementById('burgerBtn').addEventListener('click',()=>document.getElementById('mobileNav').classList.toggle('open'));
 document.getElementById('modalClose').addEventListener('click',closeProduct);
 document.getElementById('productModal').addEventListener('click',e=>{if(e.target.id==='productModal')closeProduct();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct();});
 const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){const id=x.target.id;document.querySelectorAll('.main-nav button,.mobile-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));}}),{threshold:.2,rootMargin:'-20% 0px -65% 0px'});
 document.querySelectorAll('main section[id]').forEach(s=>io.observe(s));
});
})();

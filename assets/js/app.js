/* ============================================================
   IWA RICH YOU D — Company & Product Catalog
   Product ordering / cart / checkout intentionally removed.
   ============================================================ */
(function(){
'use strict';

const IMG='assets/img/';
const EDTECH='https://www.edtech-info.com/';

/* Load catalog-specific stylesheet */
const catalogCss=document.createElement('link');
catalogCss.rel='stylesheet';
catalogCss.href='assets/css/catalog.css';
document.head.appendChild(catalogCss);

/* Load motion stylesheet */
const motionCss=document.createElement('link');
motionCss.rel='stylesheet';
motionCss.href='assets/css/motion.css';
document.head.appendChild(motionCss);

/* ──── DATA ──── */
const SERVICES=[
 {title:'Network Infrastructure & Design',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',img:IMG+'service-network.jpg',items:['ออกแบบและวางระบบเครือข่าย LAN/Fiber Optic','Server และ Network Security','Smart Classroom Solution','Digital Language Lab']},
 {title:'Software & Application Development',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',img:IMG+'service-software.jpg',items:['Custom Software','Mobile & Web Application','System Integration','Learning Management System (LMS)']},
 {title:'IT Maintenance Service',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',img:IMG+'service-maintenance.jpg',items:['บริการดูแลรักษารายเดือน-รายปี','ตรวจเช็กระบบและกู้คืนข้อมูล','ดูแลอุปกรณ์และซอฟต์แวร์']},
 {title:'Hardware & Software Supply',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',img:IMG+'service-hardware.jpg',items:['อุปกรณ์คอมพิวเตอร์และซอฟต์แวร์ลิขสิทธิ์','Interactive Smart Display','สื่อมัลติมีเดียเพื่อการศึกษา']},
 {title:'ICT Training & Seminar',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',img:IMG+'service-training.jpg',items:['อบรมการใช้งานระบบและซอฟต์แวร์','อบรม Smart Classroom / Language Lab','อบรมสื่อการเรียนรู้และ CEFR']},
 {title:'บริการพัฒนาแอปพลิเคชันและระบบอัตโนมัติด้วย AI',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.57-3.25 3.93a1 1 0 00-.75.97V14"/><circle cx="12" cy="17" r="1"/></svg>',img:IMG+'service-software.jpg',items:['พัฒนา AI Application ให้เหมาะกับความต้องการขององค์กร','ออกแบบระบบอัตโนมัติด้วย AI เพื่อลดขั้นตอนการทำงาน','เชื่อมต่อ AI เข้ากับ Web / Mobile / Business Process'],isAI:true}
];

const PRODUCT_GROUPS=[
 {title:'หลักสูตรภาษาอังกฤษสำหรับเด็ก',en:"CHILDREN'S ENGLISH PROGRAMS",intro:'หลักสูตรภาษาอังกฤษสำหรับเด็กที่เน้นการเรียนรู้แบบผสมผสาน สนุก และพัฒนาทักษะภาษาอย่างเป็นขั้นตอน',products:[
  {name:'Picaro English',desc:'หลักสูตรภาษาอังกฤษสำหรับเด็กผ่านการเรียนรู้แบบเกมและกิจกรรม อ้างอิงกรอบ CEFR',level:'เด็ก / ประถมศึกษา',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage111.jpg',source:EDTECH+'17553221/picaro-english'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 1',desc:'ชุดหนังสือ Student\'s Book, Workbook และ Picaro Game Online สำหรับระดับเริ่มต้น',level:'Level 1',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-71.jpg',source:EDTECH+'product/220690'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 2',desc:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก พร้อมหนังสือและกิจกรรมออนไลน์',level:'Level 2',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-84.jpg',source:EDTECH+'product/220691'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 3',desc:'ชุดหนังสือและ Picaro Game Online สำหรับพัฒนาทักษะภาษาอังกฤษในระดับต่อเนื่อง',level:'Level 3',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-92.jpg',source:EDTECH+'product/220692'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 4',desc:'ชุดหนังสือและ Picaro Game Online สำหรับระดับที่สูงขึ้น',level:'Level 4',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-104.jpg',source:EDTECH+'product/220693'},
  {name:'ชุดการเรียนรู้ภาษาอังกฤษสำหรับเด็ก Level 1-4',desc:'ชุดครบ 4 ระดับ สำหรับการเรียนรู้อย่างต่อเนื่องตั้งแต่ Level 1 ถึง Level 4',level:'Level 1–4',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage212.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร',en:'COMMUNICATIVE ENGLISH PROGRAMS',intro:'หลักสูตรเพื่อฝึกการสื่อสารภาษาอังกฤษในสถานการณ์จริง พร้อมแนวทางการเรียนรู้ที่สอดคล้องกับ CEFR',products:[
  {name:'Velawoods English',desc:'ฝึกทักษะการสื่อสารผ่านสถานการณ์จำลองในเมืองเสมือนจริง เหมาะสำหรับการเรียนรู้แบบออนไลน์',level:'CEFR',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-01-011.jpg',source:EDTECH+'17304334/หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร'},
  {name:'Vantage Connected Learn Social',desc:'พัฒนาทักษะการสื่อสารภาษาอังกฤษตามกรอบ CEFR ผ่าน Learn Social Platform',level:'CEFR / Learn Social',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-03.jpg',source:EDTECH+'17604389/vantage-connected-learn-social'},
  {name:'Dynamic English',desc:'พัฒนาทักษะการฟังและการสื่อสารภาษาอังกฤษจากเจ้าของภาษาในรูปแบบบทละครและบทสนทนา',level:'Communication',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/DE-11.jpg',source:EDTECH+'17312039/dynamic-english'},
  {name:'Beginner Course (A1)',desc:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสารระดับเริ่มต้น',level:'A1',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-04.jpg',source:EDTECH+'category/0'},
  {name:'Pre-Intermediate Course (A2)',desc:'หลักสูตรภาษาอังกฤษเพื่อการสื่อสารระดับต่อเนื่อง',level:'A2',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-05.jpg',source:EDTECH+'category/0'},
  {name:'Coursebook (A1 / A2)',desc:'หนังสือประกอบการเรียนรู้สำหรับหลักสูตรภาษาอังกฤษเพื่อการสื่อสาร',level:'Coursebook',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-06.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'สื่อมัลติมีเดียระดับปฐมวัย',en:'PRESCHOOL MULTIMEDIA',intro:'สื่อการเรียนรู้ที่ออกแบบให้เหมาะกับเด็กปฐมวัยและการใช้งานผ่านห้องเรียนหรือกระดานอัจฉริยะ',products:[
  {name:'Click2Plearn',desc:'สื่อที่สอดคล้องกับหลักสูตรปฐมวัย พ.ศ. 2560 และส่งเสริมพัฒนาการทุกด้าน',level:'ปฐมวัย',img:'https://shop-image.readyplanet.com/NdwewGDZ_jSsQQze9rt4Tl4xUD8%3D/d9c5efabba7f4da88f7941439e977acc',source:EDTECH+'product/240335'},
  {name:'โปรแกรมพัฒนาทักษะการใช้ภาษา',desc:'พัฒนาทักษะฟัง พูด อ่าน และเขียน ทั้งภาษาไทยและภาษาอังกฤษสำหรับเด็กปฐมวัย',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-121.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์',desc:'พัฒนาทักษะการนับ คำนวณ เรขาคณิต การวัด การชั่ง การตวง เงิน และเวลา',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-131.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์',desc:'เนื้อหาเกี่ยวกับธรรมชาติ สิ่งรอบตัว บุคคล และสถานที่แวดล้อมเด็ก',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-142.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมพัฒนาทักษะกระบวนการคิดเสริมเชาวน์ปัญญา',desc:'พัฒนาความจำ การสังเกต การจำแนก การจัดกลุ่ม การเรียงลำดับ และมิติสัมพันธ์',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-151.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'โปรแกรมสื่อมัลติมีเดียเพื่อการเรียนรู้เด็กปฐมวัย',desc:'สื่อเสริมการเรียนรู้เรื่องประชาคมอาเซียน ครอบคลุมความรู้และกิจกรรมฝึกทักษะ',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-163.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'ระบบคลังข้อสอบสำหรับเด็กปฐมวัย',desc:'คลังข้อสอบเพื่อเตรียมความพร้อมก่อนเข้าเรียนระดับประถมศึกษา',level:'ปฐมวัย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-173.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'},
  {name:'ระบบ e-Learning สำหรับครูปฐมวัย',desc:'แหล่งเรียนรู้เพื่อพัฒนาครูปฐมวัยผ่านบทเรียนอิเล็กทรอนิกส์รูปแบบมัลติมีเดีย',level:'สำหรับครู',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-07.jpg',source:EDTECH+'17310714/สื่อมัลติมีเดียระดับปฐมวัย'}
 ]},
 {title:'สื่อมัลติมีเดียระดับประถมศึกษา',en:'PRIMARY MULTIMEDIA',intro:'สื่อดิจิทัลเพื่อการเรียนการสอนระดับประถมศึกษา ครอบคลุมหลายกลุ่มสาระและใช้งานกับห้องเรียนสมัยใหม่',products:[
  {name:'Digital Library@School',desc:'คลังสื่อและบทเรียนดิจิทัลสำหรับการเรียนรู้ในโรงเรียน',level:'ประถมศึกษา',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-08.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมสื่อมัลติมีเดียเพื่อการเรียนรู้ ชุด อาเซียนน่ารู้',desc:'เรียนรู้เรื่องประเทศสมาชิกอาเซียน ธงชาติ เมืองหลวง วัฒนธรรม และกิจกรรมฝึกทักษะ',level:'ประถมศึกษา',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-191.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'อ่านออก เขียนได้ ง่ายนิดเดียว',desc:'สื่อพัฒนาทักษะการอ่านและการเขียนภาษาไทย ผ่านแอนิเมชัน เกม และแบบทดสอบ',level:'ภาษาไทย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-20.jpg',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะทางคณิตศาสตร์',desc:'สื่อมัลติมีเดียพัฒนาทักษะคณิตศาสตร์ให้สอดคล้องกับหลักสูตรแกนกลาง',level:'คณิตศาสตร์',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/110.png',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะทางวิทยาศาสตร์',desc:'สื่อมัลติมีเดียพัฒนาทักษะวิทยาศาสตร์ระดับประถมศึกษา',level:'วิทยาศาสตร์',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/211.png',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'},
  {name:'โปรแกรมพัฒนาทักษะการใช้ภาษาไทยประถมศึกษา',desc:'สื่อมัลติมีเดียพัฒนาทักษะภาษาไทยสำหรับนักเรียนระดับประถมศึกษา',level:'ภาษาไทย',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/37.png',source:EDTECH+'17310715/สื่อมัลติมีเดียระดับประถมศึกษา'}
 ]},
 {title:'หนังสืออิเล็กทรอนิกส์ (e-Book)',en:'E-BOOK & DIGITAL READING',intro:'หนังสืออิเล็กทรอนิกส์และกิจกรรมดิจิทัลที่ใช้งานได้ทั้งในห้องเรียนและการเรียนรู้ด้วยตนเอง',products:[
  {name:'eBook กิจกรรมพัฒนาทักษะเด็กปฐมวัย',desc:'e-Book แบบ 3 มิติ พร้อมกิจกรรมระบายสีและกิจกรรมพัฒนาทักษะสำหรับเด็กปฐมวัย',level:'e-Book',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Picture11.jpg',source:EDTECH+'17570280/หนังสืออิเล็กทรอนิกส์-e-book'}
 ]},
 {title:'LED Interactive Intelligent Panel',en:'SMART CLASSROOM DISPLAY',intro:'จอ Interactive สำหรับห้องเรียนและการประชุม พร้อมระบบสัมผัสและความละเอียดสูง',products:[
  {name:'LED Interactive Intelligent Panel ขนาด 65 นิ้ว',desc:'จอ LED ระบบสัมผัส Multi-touch ความละเอียด 4K รองรับการใช้งานหลากหลายรูปแบบ',level:'65 นิ้ว',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage-11.jpg',source:EDTECH+'product/228944'},
  {name:'LED Interactive Intelligent Panel ขนาด 75 นิ้ว',desc:'จอ Interactive ขนาดใหญ่สำหรับห้องเรียน ห้องประชุม และพื้นที่การเรียนรู้',level:'75 นิ้ว',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_page-0001.jpg',source:EDTECH+'category/0'},
  {name:'LED Interactive Intelligent Panel ขนาด 86 นิ้ว',desc:'จอ Interactive ขนาดใหญ่สำหรับพื้นที่ที่ต้องการมุมมองกว้างและการทำงานร่วมกัน',level:'86 นิ้ว',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/11_Vantage_page-0002.jpg',source:EDTECH+'category/0'}
 ]},
 {title:'English Proficiency Test',en:'ENGLISH ASSESSMENT',intro:'เครื่องมือประเมินความสามารถทางภาษาอังกฤษเพื่อวัดระดับและใช้วางแผนพัฒนาผู้เรียน',products:[
  {name:'English Proficiency Test',desc:'ระบบประเมินทักษะภาษาอังกฤษสำหรับใช้วัดระดับความสามารถและประกอบการวางแผนการเรียนรู้',level:'Assessment',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Untitled-14.jpg',source:EDTECH+'category/0'},
  {name:'CEFR Placement & Progress Assessment',desc:'แนวทางประเมินระดับภาษาอังกฤษตามกรอบ CEFR เพื่อช่วยวางแผนเส้นทางการเรียนรู้',level:'CEFR',img:'https://v4i.rweb-images.com/www.edtech-info.com/images/editor/Salepage+pic-113.jpg',source:EDTECH+'17304334/หลักสูตรภาษาอังกฤษเพื่อการสื่อสาร'}
 ]}
];

const TRAINING=[
 {title:'อบรมเชิงปฏิบัติการสำหรับครูผู้สอน',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',img:IMG+'training-classroom.jpg',items:['การใช้สื่อดิจิทัลเพื่อการเรียนการสอน','กิจกรรมเชิงปฏิบัติการสำหรับผู้สอน']},
 {title:'Picaro English Training',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',img:IMG+'training-presenter.jpg',items:['แนวทางการเรียนรู้ภาษาอังกฤษ','กิจกรรม Inspire Motivate Enjoy']},
 {title:'English CEFR Boost Day',icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',img:IMG+'training-cefr-boostday.jpg',items:['กิจกรรมพัฒนาทักษะภาษาอังกฤษ','แนวทางการประยุกต์ใช้ CEFR']}
];

/* ──── HELPERS ──── */
function esc(s){return String(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
function imgTag(src,alt){return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${IMG}logo.png'">`;}

/* ──── RENDER SERVICES ──── */
function renderServices(){
  const el=document.getElementById('serviceGrid');
  if(!el)return;
  el.innerHTML=SERVICES.map((s,i)=>`
    <article class="svc-card${s.isAI?' service-card-ai':''}">
      <div class="svc-photo">${imgTag(s.img,s.title)}</div>
      <div class="svc-icon">${s.icon||''}</div>
      <span class="svc-num">${String(i+1).padStart(2,'0')}</span>
      <h3>${esc(s.title)}</h3>
      <ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    </article>
  `).join('');
}

/* ──── RENDER PRODUCTS ──── */
let FLAT_PRODUCTS=[];
function productCard(p,i){
  return `<article class="product-catalog-card">
    <div class="product-media">${imgTag(p.img,p.name)}<span class="product-pill">${esc(p.level)}</span></div>
    <div class="product-body">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="product-actions">
        <button class="detail-btn" data-product="${i}">ดูรายละเอียด</button>
        <a class="source-btn" href="${esc(p.source||'#')}" target="_blank" rel="noopener">ข้อมูลต้นทาง</a>
      </div>
    </div>
  </article>`;
}
function renderProducts(){
  const el=document.getElementById('productGrid');
  if(!el)return;FLAT_PRODUCTS=[];
  el.innerHTML=PRODUCT_GROUPS.map((group,gi)=>{
    const cards=group.products.map(p=>{
      const flatIndex=FLAT_PRODUCTS.length;
      FLAT_PRODUCTS.push(p);
      return productCard(p,flatIndex);
    }).join('');
    return `<section class="product-category" data-product-category="${gi}">
      <div class="product-category-head">
        <div>
          <span class="eyebrow">${esc(group.en)}</span>
          <h3>${esc(group.title)}</h3>
          <p>${esc(group.intro)}</p>
        </div>
        <span class="product-count">${group.products.length} รายการ</span>
      </div>
      <div class="product-category-grid">${cards}</div>
    </section>`;
  }).join('');
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-product]');
    if(b)openProduct(Number(b.dataset.product));
  });
}

/* ──── RENDER TRAINING ──── */
function renderTraining(){
  const el=document.getElementById('trainingGrid');
  if(!el)return;
  el.innerHTML=TRAINING.map(t=>`
    <article class="svc-card">
      <div class="svc-photo">${imgTag(t.img,t.title)}</div>
      <div class="svc-icon">${t.icon||''}</div>
      <h3>${esc(t.title)}</h3>
      <ul>${t.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    </article>
  `).join('');
}

/* ──── PRODUCT MODAL ──── */
function openProduct(i){
  const p=FLAT_PRODUCTS[i],modal=document.getElementById('productModal');
  if(!p||!modal)return;
  const img=document.getElementById('modalImage');
  img.src=p.img;img.alt=p.name;
  img.onerror=function(){this.onerror=null;this.src=IMG+'logo.png';};
  document.getElementById('modalLevel').textContent=p.level;
  document.getElementById('modalTitle').textContent=p.name;
  document.getElementById('modalDesc').textContent=p.desc;
  const source=document.getElementById('modalSource');
  if(source){source.href=p.source||'#';source.style.display=p.source?'inline-flex':'none';}
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeProduct(){
  const m=document.getElementById('productModal');
  if(!m)return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

/* ──── NAVIGATION ──── */
function go(id){
  const el=document.getElementById(id);
  if(!el)return;
  document.querySelectorAll('[data-section]').forEach(x=>{
    x.classList.toggle('active',x.dataset.section===id);
    x.setAttribute('aria-current',x.dataset.section===id?'true':'false');
  });
  el.scrollIntoView({behavior:'smooth',block:'start'});
  const mobile=document.getElementById('mobileNav');
  if(mobile){mobile.classList.remove('open');mobile.setAttribute('aria-hidden','true');}
  const burger=document.getElementById('burgerBtn');
  if(burger){burger.classList.remove('open');burger.setAttribute('aria-expanded','false');}
}

/* ──── BOOT LOADER ──── */
function initBootLoader(){
  const loader=document.getElementById('bootLoader');
  const progress=document.getElementById('bootProgress');
  const text=document.getElementById('bootText');
  if(!loader)return;

  document.body.classList.add('boot-active');
  loader.classList.add('show');

  let pct=0;
  const msgs=['กำลังโหลด...','กำลังเตรียมข้อมูล...','เกือบพร้อมแล้ว...','ยินดีต้อนรับ'];
  const interval=setInterval(()=>{
    pct+=Math.random()*18+5;
    if(pct>=100){
      pct=100;
      clearInterval(interval);
      progress.style.width='100%';
      text.textContent=msgs[3];
      setTimeout(()=>{
        loader.classList.add('hide');
        document.body.classList.remove('boot-active');
        setTimeout(()=>loader.remove(),600);
      },400);
    }else{
      progress.style.width=pct+'%';
      const idx=Math.min(Math.floor(pct/30),msgs.length-2);
      text.textContent=msgs[idx];
    }
  },120);
}

/* ──── SCROLL SYSTEMS ──── */
function initScrollSystems(){
  // Scroll progress
  const progressBar=document.querySelector('.scroll-progress');
  if(progressBar){
    const updateProgress=()=>{
      const doc=document.documentElement;
      const max=doc.scrollHeight-window.innerHeight;
      progressBar.style.width=(max>0?Math.min(100,(window.scrollY/max)*100):0)+'%';
    };
    window.addEventListener('scroll',updateProgress,{passive:true});
    updateProgress();
  }

  // Header scroll effect
  const header=document.getElementById('siteHeader');
  if(header){
    window.addEventListener('scroll',()=>{
      header.classList.toggle('scrolled',window.scrollY>20);
    },{passive:true});
  }

  // Back to top
  const toTop=document.getElementById('toTop');
  if(toTop){
    window.addEventListener('scroll',()=>{
      toTop.classList.toggle('show',window.scrollY>400);
    },{passive:true});
    toTop.addEventListener('click',()=>{
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  // Scroll reveal
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls=document.querySelectorAll('.iwa-reveal, .reveal, .reveal-stagger');
  if('IntersectionObserver' in window&&!reduce){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('iwa-visible','in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revealEls.forEach(el=>io.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('iwa-visible','in'));
  }

  // Product card stagger
  const productCards=document.querySelectorAll('.product-catalog-card');
  if('IntersectionObserver' in window&&!reduce){
    const cardIO=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          cardIO.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    productCards.forEach(card=>cardIO.observe(card));
  }else{
    productCards.forEach(card=>card.classList.add('in'));
  }

  // Active nav tracking
  const sections=[...document.querySelectorAll('main section[id], .hero[id]')];
  const navButtons=[...document.querySelectorAll('[data-section]')];
  if('IntersectionObserver' in window){
    const navIO=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          navButtons.forEach(b=>{
            b.setAttribute('aria-current',b.dataset.section===entry.target.id?'true':'false');
          });
        }
      });
    },{rootMargin:'-28% 0px -62% 0px',threshold:0});
    sections.forEach(s=>navIO.observe(s));
  }
}

/* ──── INTERACTIVE EFFECTS ──── */
function initInteractiveEffects(){
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero card mouse parallax
  const hero=document.querySelector('.hero');
  const heroCard=document.querySelector('.hero-card');
  if(hero&&heroCard&&!reduce){
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect();
      heroCard.style.setProperty('--mx',(((e.clientX-r.left)/r.width-.5)*16).toFixed(2)+'px');
      heroCard.style.setProperty('--my',(((e.clientY-r.top)/r.height-.5)*10).toFixed(2)+'px');
    },{passive:true});
    hero.addEventListener('mouseleave',()=>{
      heroCard.style.setProperty('--mx','0px');
      heroCard.style.setProperty('--my','0px');
    });
  }

  // Card 3D tilt
  if(!reduce){
    document.querySelectorAll('.product-catalog-card,.svc-card,.info-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--rx',(((e.clientY-r.top)/r.height-.5)*-2.5).toFixed(2)+'deg');
        card.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*2.5).toFixed(2)+'deg');
      });
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--rx','0deg');
        card.style.setProperty('--ry','0deg');
      });
    });
  }

  // Button ripple
  document.addEventListener('click',e=>{
    const target=e.target.closest('button,.btn,.detail-btn,.source-btn');
    if(!target||reduce)return;
    const r=target.getBoundingClientRect();
    const ripple=document.createElement('span');
    const size=Math.max(r.width,r.height)*1.35;
    ripple.className='iwa-ripple';
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-r.left-size/2)+'px';
    ripple.style.top=(e.clientY-r.top-size/2)+'px';
    target.appendChild(ripple);
    setTimeout(()=>ripple.remove(),620);
  });
}

/* ──── INIT ──── */
document.addEventListener('DOMContentLoaded',()=>{
  // Boot loader
  initBootLoader();

  // Render content
  renderServices();
  renderProducts();
  renderTraining();

  // Navigation
  document.querySelectorAll('[data-section]').forEach(b=>{
    b.addEventListener('click',()=>go(b.dataset.section));
  });

  // Burger menu
  const burger=document.getElementById('burgerBtn');
  const mobileNav=document.getElementById('mobileNav');
  if(burger&&mobileNav){
    burger.addEventListener('click',()=>{
      const isOpen=mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden',isOpen?'true':'false');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded',(!isOpen).toString());
    });
  }

  // Modal
  const modalClose=document.getElementById('modalClose');
  if(modalClose)modalClose.addEventListener('click',closeProduct);
  const modal=document.getElementById('productModal');
  if(modal)modal.addEventListener('click',e=>{if(e.target.id==='productModal')closeProduct();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct();});

  // Scroll systems (delayed to after boot)
  setTimeout(initScrollSystems,100);

  // Interactive effects (delayed to after boot)
  setTimeout(initInteractiveEffects,200);

  // Update copyright year
  document.querySelectorAll('.copyright').forEach(el=>{
    el.innerHTML=el.innerHTML.replace(/©\s*2026/,'© '+new Date().getFullYear());
  });
});
})();

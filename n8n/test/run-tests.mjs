#!/usr/bin/env node
/**
 * ทดสอบโค้ดใน Code node ทั้ง 3 ตัว โดยจำลอง $input / $() ของ n8n
 * ใช้: node test/run-tests.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const wf = JSON.parse(readFileSync(join(ROOT, 'line-oa-ai-agent.json'), 'utf8'));
const codeOf = (name) => wf.nodes.find((n) => n.name === name).parameters.jsCode;

/* ---------- ตัวจำลองสภาพแวดล้อมของ n8n ---------- */
function runNode(code, { input = [], nodes = {}, json = null } = {}) {
  const wrap = (items) => ({
    all: () => items,
    first: () => items[0] || { json: {} },
    item: items[0] || { json: {} },
  });
  const $input = wrap(input);
  const $ = (name) => {
    if (!(name in nodes)) throw new Error('no node ' + name);
    return wrap(nodes[name]);
  };
  const $json = json || (input[0] ? input[0].json : {});
  return new Function('$input', '$', '$json', code)($input, $, $json);
}

/* ---------- ข้อมูลตัวอย่างใน Google Sheet ---------- */
const FAQ = [
  { keyword: 'ราคา', answer: 'สื่อการเรียนรู้เริ่มต้นที่ 2,200 บาท ราคาจริงขึ้นกับจำนวนสิทธิ์ใช้งานครับ' },
  { keyword: 'สมัครเรียน', answer: 'สมัครได้ที่หน้าเว็บไซต์ หรือโทร 099-626-9787 ครับ' },
  { keyword: 'ทดลองเรียน', answer: 'มีบริการสาธิตและทดลองใช้สื่อฟรีครับ นัดหมายล่วงหน้า 3 วัน' },
  { keyword: 'ติดต่อ|เบอร์โทร|โทร', answer: 'โทร 099-626-9787, 082-731-8082 อีเมล supannee@iwarichyoudee.com' },
  { keyword: 'ที่อยู่', answer: '222/56 หมู่ 7 ต.นิมิตรราช อ.บางบัวทอง จ.นนทบุรี 11110' },
  { keyword: 'CEFR', answer: 'หลักสูตรของเราอ้างอิงมาตรฐาน CEFR ครบ A1-C1 ครับ' },
  { keyword: 'ห้องเรียนอัจฉริยะ', answer: 'ติดตั้ง Smart Classroom ครบวงจร ประเมินหน้างานฟรีครับ' },
];
const KNOWLEDGE = [
  { topic: 'เวลาทำการ', content: 'จันทร์-ศุกร์ 08:30-17:30 น. หยุดเสาร์-อาทิตย์และวันหยุดนักขัตฤกษ์' },
];

const asItems = (rows) => rows.map((json) => ({ json }));

function matchAll(texts) {
  return runNode(codeOf('Smart Thai Matcher'), {
    input: texts.map((text, i) => ({
      json: { userId: 'U' + i, replyToken: 'RT' + i, text, messageType: 'text' },
    })),
    nodes: { 'Get FAQ': asItems(FAQ), 'Get Knowledge': asItems(KNOWLEDGE) },
  });
}
const match = (text) => matchAll([text])[0].json;

/* ---------- เคสทดสอบ ---------- */
let pass = 0, fail = 0;
const check = (label, cond, extra = '') => {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ ' + label + (extra ? '  -> ' + extra : '')); }
};

console.log('\n[1] จับคู่คำถามที่สะกดถูก');
for (const q of ['ราคา', 'สมัครเรียน', 'ทดลองเรียน', 'ที่อยู่']) {
  const r = match(q);
  check(`"${q}" -> ${r.matchedKeyword} (${r.route}/${r.score})`, r.route === 'direct' && r.matchedKeyword === q, JSON.stringify(r.matchType));
}

console.log('\n[2] คำที่พิมพ์ผิด / วรรณยุกต์เพี้ยน / สระเพี้ยน');
const typos = [
  ['ราคะ', 'ราคา'],
  ['ร่าคา', 'ราคา'],
  ['ราค่า', 'ราคา'],
  ['ลาคา', 'ราคา'],
  ['ราฆา', 'ราคา'],
  ['ราคาา', 'ราคา'],
  ['สมัคเรียน', 'สมัครเรียน'],
  ['สมักรเรียน', 'สมัครเรียน'],
  ['ทดลองเรีบน', 'ทดลองเรียน'],
  ['ทีอยู่', 'ที่อยู่'],
  ['เบอโทร', 'ติดต่อ|เบอร์โทร|โทร'],
];
for (const [q, expect] of typos) {
  const r = match(q);
  const hit = r.matchedKeyword && expect.split('|').includes(r.matchedKeyword);
  check(`"${q}" -> ${r.matchedKeyword || '(ไม่เจอ)'} ${Math.round(r.score * 100)}% [${r.route}]`, hit, expect);
}

console.log('\n[3] คำผิดฝังในประโยคยาว');
for (const [q, expect] of [
  ['ขอทราบราคาหน่อยครับ', 'ราคา'],
  ['อยากทราบราคะของสื่อปฐมวัยครับ', 'ราคา'],
  ['สนใจสมัคเรียนต้องทำยังไงบ้างคะ', 'สมัครเรียน'],
  ['ขอเบอร์ติดต่อหน่อยครับ', 'ติดต่อ'],
]) {
  const r = match(q);
  check(`"${q}" -> ${r.matchedKeyword || '(ไม่เจอ)'} ${Math.round(r.score * 100)}%`, r.matchedKeyword === expect, expect);
}

console.log('\n[4] ลืมสลับภาษา (พิมพ์ไทยด้วยแป้นอังกฤษ)');
for (const [q, expect] of [['ik8k', 'ราคา'], ['ทu8k', 'ราคา']]) {
  const r = match(q);
  const ok = r.matchedKeyword === expect || r.keyboardFixed === 'ราคา';
  check(`"${q}" -> แปลงได้ "${r.keyboardFixed}" / ตรงกับ ${r.matchedKeyword || '-'}`, ok, expect);
}

console.log('\n[5] คำที่เดาไม่ได้ ต้องส่งต่อให้ AI พร้อม context');
for (const q of ['พารา', 'มีโปรโมชั่นอะไรบ้าง', 'ขอใบเสนอราคาโรงเรียน 40 เครื่อง']) {
  const r = match(q);
  const okPrompt = r.route === 'ai' && r.systemPrompt.includes('ไอว่า ริช ยู ดี') && r.systemPrompt.includes('เวลาทำการ');
  check(`"${q}" -> route=${r.route}, ตัวเลือก=${r.suggestions.length}, prompt=${r.systemPrompt ? r.systemPrompt.length : 0} ตัวอักษร`, okPrompt);
}
const para = match('พารา');
check('“พารา” ถูกเสนอ "ราคา" เป็นตัวเลือกอันดับ 1 ให้ AI', para.suggestions[0] === 'ราคา', JSON.stringify(para.suggestions));

console.log('\n[6] event พิเศษ');
check('เพิ่มเพื่อนใหม่ -> ข้อความต้อนรับ', match('__FOLLOW__').matchType === 'greeting');
check('ส่งสติกเกอร์ -> ขอให้พิมพ์ข้อความ', match('__NON_TEXT__').matchType === 'non_text');

console.log('\n[7] Parse LINE Event');
const parsed = runNode(codeOf('Parse LINE Event'), {
  input: [{ json: { body: { events: [
    { type: 'message', replyToken: 'r1', source: { userId: 'U1', type: 'user' }, message: { type: 'text', text: ' ราคา ' } },
    { type: 'message', replyToken: 'r2', source: { userId: 'U2', type: 'user' }, message: { type: 'sticker' } },
    { type: 'follow', replyToken: 'r3', source: { userId: 'U3', type: 'user' } },
    { type: 'unsend', replyToken: 'r4', source: { userId: 'U4' } },
  ] } } }],
});
check('แยก event ได้ 3 รายการ (ข้อความ/สติกเกอร์/เพิ่มเพื่อน)', parsed.length === 3, String(parsed.length));
check('ตัดช่องว่างหัวท้ายข้อความ', parsed[0].json.text === 'ราคา');
check('อ่าน userId และ replyToken ถูกต้อง', parsed[0].json.userId === 'U1' && parsed[0].json.replyToken === 'r1');
const verify = runNode(codeOf('Parse LINE Event'), { input: [{ json: { body: { events: [] } } }] });
check('LINE verify request -> ไม่ทำอะไรต่อ', verify.length === 0);
const legacy = runNode(codeOf('Parse LINE Event'), { input: [{ json: { body: { message: 'ราคา' } } }] });
check('payload ทดสอบแบบง่าย { message } ยังใช้ได้', legacy.length === 1 && legacy[0].json.text === 'ราคา');

console.log('\n[8] Build LINE Reply');
const replyOf = (cur, matchJson) =>
  runNode(codeOf('Build LINE Reply'), {
    json: cur,
    nodes: { 'Smart Thai Matcher': [{ json: matchJson }] },
  }).json;

const built = replyOf(
  { output: '**ราคา** เริ่มต้น 2,200 บาท\n- มีส่วนลด\n- ผ่อนได้' },
  { userId: 'U1', replyToken: 'RT', userMessage: 'ราคา', route: 'ai', matchType: 'ai_open', score: 0.5, suggestions: ['ราคา', 'สมัครเรียน'] }
);
check('ล้าง Markdown ออกจากคำตอบ', !built.answerText.includes('**') && built.answerText.includes('• มีส่วนลด'), built.answerText);
check('ประกอบ payload ของ LINE ถูกต้อง', built.body.replyToken === 'RT' && built.body.messages[0].type === 'text');
check('แนบ Quick Reply', built.body.messages.at(-1).quickReply.items.length === 2);

const long = replyOf(
  { answer: ('ทดสอบข้อความยาวมาก\n').repeat(900) },
  { userId: 'U1', replyToken: 'RT', route: 'direct', suggestions: [] }
);
check('ตัดข้อความยาวเป็นหลายข้อความ (<=5)', long.body.messages.length > 1 && long.body.messages.length <= 5, String(long.body.messages.length));
check('ทุกข้อความไม่เกิน 5,000 ตัวอักษร', long.body.messages.every((m) => m.text.length <= 5000));

const empty = replyOf({}, { userId: 'U1', replyToken: 'RT', route: 'ai', suggestions: ['ราคา'] });
check('AI ล่ม -> ยังมีข้อความสำรองตอบลูกค้า', empty.answerText.includes('099-626-9787'));

console.log('\n[9] หลายข้อความใน request เดียว (LINE ส่งรวมกันมาได้)');
const multi = matchAll(['ราคา', 'พารา', 'ที่อยู่']);
check('ตอบครบทุกข้อความ', multi.length === 3, String(multi.length));
check('replyToken ไม่สลับคน', multi.every((m, i) => m.json.replyToken === 'RT' + i && m.json.userId === 'U' + i));
const pairedReply = replyOf({ output: 'คำตอบของคนที่สอง' }, multi[1].json);
check('Build Reply ใช้ replyToken ของข้อความนั้น ๆ', pairedReply.body.replyToken === 'RT1');

console.log('\n[10] เรียงข้อมูลจากชีตตามความเกี่ยวข้อง (ตอบตรงประเด็น)');
const KNOWLEDGE_MANY = [
  { topic: 'พื้นที่ให้บริการ', content: 'ให้บริการทั่วประเทศ สำนักงานอยู่จังหวัดนนทบุรี' },
  { topic: 'การรับประกัน', content: 'ฮาร์ดแวร์รับประกันตามเงื่อนไขผู้ผลิต ซอฟต์แวร์ซัพพอร์ตตลอดอายุสิทธิ์' },
  { topic: 'เวลาทำการ', content: 'จันทร์-ศุกร์ 08:30-17:30 น. หยุดเสาร์-อาทิตย์' },
];
function matchWithKnowledge(text) {
  return runNode(codeOf('Smart Thai Matcher'), {
    input: [{ json: { userId: 'U1', replyToken: 'RT', text, messageType: 'text' } }],
    nodes: { 'Get FAQ': asItems(FAQ), 'Get Knowledge': asItems(KNOWLEDGE_MANY) },
  })[0].json;
}
const kq = matchWithKnowledge('การรับประกันเป็นยังไง');
const kBlock = kq.systemPrompt.split('=== คลังความรู้')[1].split('=== FAQ')[0];
check('คำถามเรื่องรับประกัน -> แถว "การรับประกัน" ถูกยกขึ้นเป็นอันดับ 1', kBlock.trim().split('\n')[1].includes('การรับประกัน'), kBlock.trim().split('\n')[1]);
const fq = matchWithKnowledge('อยากทราบราคะครับ ขอแบบละเอียดหน่อยว่ามีสื่ออะไรบ้างและแต่ละตัวต่างกันยังไง');
const fBlock = fq.systemPrompt.split('=== FAQ')[1];
check('คำถามยาวเรื่องราคา -> FAQ "ราคา" ถูกยกขึ้นเป็นข้อ 1', fBlock.includes('1. [ราคา]'), fBlock.trim().split('\n')[1]);
check('คำถามยาวที่ต้องอธิบาย -> ส่งให้ AI ไม่ตอบ FAQ สั้น ๆ', fq.route === 'ai', fq.route);

console.log(`\n=== ผ่าน ${pass} / ล้มเหลว ${fail} ===\n`);
process.exit(fail ? 1 : 0);

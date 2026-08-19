/** ทดสอบโค้ดในโหนด "เตรียมข้อมูลให้ AI" โดยไม่ต้องต่อ n8n: node test.mjs */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
execFileSync('node', [join(HERE, 'build.mjs')], { stdio: 'inherit' });
const wf = JSON.parse(readFileSync(join(HERE, 'line-oa-simple.json'), 'utf8'));
const code = wf.nodes.find((n) => n.name === 'เตรียมข้อมูลให้ AI').parameters.jsCode;

const FAQ = [
  { keyword: 'ราคา, ค่าใช้จ่าย, กี่บาท', answer: 'สื่อการเรียนรู้เริ่มต้น 2,200 บาท ราคาจริงขึ้นกับจำนวนสิทธิ์ใช้งาน' },
  { keyword: 'สมัครเรียน, สั่งซื้อ', answer: 'สั่งซื้อผ่านเว็บไซต์ หรือแจ้งทีมงานเพื่อออกใบเสนอราคา' },
  { keyword: 'ทดลองเรียน, สาธิต', answer: 'มีบริการสาธิตและทดลองใช้ฟรี นัดล่วงหน้า 3 วันทำการ' },
  { keyword: 'ติดต่อ, เบอร์โทร', answer: 'โทร 099-626-9787, 082-731-8082' },
  { keyword: 'เวลาทำการ', answer: 'จันทร์-ศุกร์ 08:30-17:30 น.' },
];

function run(events) {
  const $input = { all: () => FAQ.map((json) => ({ json })) };
  const $ = () => ({ first: () => ({ json: { body: { events } } }) });
  return new Function('$input', '$', code)($input, $);
}
const ask = (text) =>
  run([{ type: 'message', replyToken: 'RT', source: { userId: 'U1' }, message: { type: 'text', text } }]);

let pass = 0, fail = 0;
const check = (label, cond, extra = '') => {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ ' + label + (extra ? ' -> ' + extra : '')); }
};
// หัวข้อที่ AI เห็นเป็นอันดับ 1 ในรายการที่เรียงให้แล้ว
const topRow = (out) => out[0].json.systemPrompt.match(/^1\. \[(.+?)\]/m)[1];

console.log('\nจัดอันดับข้อมูลจากชีตให้ตรงคำถาม (รวมกรณีพิมพ์ผิด)');
for (const [q, expect] of [
  ['ราคา', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['ราคะ', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['ร่าคา', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['ลาคา', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['ราคาาาา', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['ขอทราบราคาหน่อยครับ', 'ราคา, ค่าใช้จ่าย, กี่บาท'],
  ['สมัคเรียน', 'สมัครเรียน, สั่งซื้อ'],
  ['อยากทดลองเรีบนก่อนได้ไหม', 'ทดลองเรียน, สาธิต'],
  ['เปิดกี่โมง เวลาทำการ', 'เวลาทำการ'],
]) {
  const out = ask(q);
  check(`"${q}" -> อันดับ 1 คือ [${topRow(out)}]`, topRow(out) === expect, expect);
}

console.log('\nสิ่งที่ส่งต่อให้ AI และ LINE');
const one = ask('พารา')[0].json;
check('ส่ง replyToken ต่อให้โหนดตอบกลับ', one.replyToken === 'RT');
check('ส่งคำถามดิบให้ AI', one.question === 'พารา');
check('บอก AI ว่าเดาว่าน่าจะหมายถึงอะไร', one.systemPrompt.includes('ระบบเดาว่าน่าจะหมายถึง: "ราคา'), one.systemPrompt.split('ระบบเดาว่าน่าจะหมายถึง:')[1].split('\n')[0]);
check('มีข้อมูลบริษัทใน prompt', one.systemPrompt.includes('099-626-9787'));
check('มีข้อมูลจากชีตครบทุกแถว', FAQ.every((r) => one.systemPrompt.includes(r.answer)));
check('สั่งให้ตอบจบในข้อความเดียว ไม่โยนให้ทีมงาน', one.systemPrompt.includes('จบในข้อความเดียว'));

console.log('\nกรณีอื่น ๆ');
check('สติกเกอร์/รูป -> ไม่ตอบ', run([{ type: 'message', replyToken: 'RT', message: { type: 'sticker' } }]).length === 0);
check('LINE verify (ไม่มี event) -> ไม่ตอบ', run([]).length === 0);
check('หลายข้อความพร้อมกัน -> ตอบครบ ไม่สลับคน', (() => {
  const out = run([
    { type: 'message', replyToken: 'A', source: { userId: 'U1' }, message: { type: 'text', text: 'ราคา' } },
    { type: 'message', replyToken: 'B', source: { userId: 'U2' }, message: { type: 'text', text: 'เวลาทำการ' } },
  ]);
  return out.length === 2 && out[0].json.replyToken === 'A' && out[1].json.replyToken === 'B';
})());

console.log(`\n=== ผ่าน ${pass} / ล้มเหลว ${fail} ===\n`);
process.exit(fail ? 1 : 0);

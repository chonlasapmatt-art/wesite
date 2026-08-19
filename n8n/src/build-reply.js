/* ============================================================
   3) Build LINE Reply   (โหมด: Run Once for Each Item)
   ------------------------------------------------------------
   รวมผลลัพธ์จาก 2 ทาง (ตอบตรงจาก Sheet / ตอบโดย AI Agent)
   แล้วประกอบเป็น payload ของ LINE Reply API
   - ทำงานทีละข้อความ จึงตอบถูกคนแม้ LINE ส่งมาหลาย event พร้อมกัน
   - ล้าง Markdown ที่ LINE แสดงผลไม่ได้
   - ตัดข้อความยาวเป็นหลายข้อความ (สูงสุด 5 ตามลิมิตของ LINE)
   - แนบปุ่ม Quick Reply หัวข้อยอดนิยม ช่วยลูกค้าที่พิมพ์ผิดซ้ำ ๆ
   - ถ้า AI ล่ม/ตอบว่าง จะมีข้อความสำรองเสมอ ไม่ปล่อยให้ลูกค้าเงียบ
   ============================================================ */

const MAX_CHARS_PER_MESSAGE = 4800;
const MAX_MESSAGES = 5;
const HONORIFIC = 'ครับ';
const CONTACT_PHONE = '099-626-9787';

const cur = $json || {};

// ดึงผลการจับคู่ของ "ข้อความนี้" (paired item) เพื่อไม่ให้ตอบสลับคน
let match;
try {
  match = $('Smart Thai Matcher').item.json;
} catch (e) {
  match = $('Smart Thai Matcher').first().json;
}

// AI Agent คืนคำตอบที่ .output / เส้นทางตอบตรงจากชีตคืนที่ .answer
let text = String(cur.output || cur.answer || match.answer || '').trim();

if (!text) {
  const topics = (match.suggestions || []).slice(0, 4).map((s) => '• ' + s).join('\n');
  text =
    'ขออภัย' + HONORIFIC + ' ระบบขัดข้องชั่วคราว 🙏\n' +
    'รบกวนพิมพ์คำถามอีกครั้ง หรือติดต่อทีมงานโดยตรงที่ ' + CONTACT_PHONE + '\n' +
    (topics ? '\nหัวข้อที่สอบถามได้บ่อย:\n' + topics : '');
}

// LINE ไม่ render markdown — ตัดสัญลักษณ์ที่จะโผล่เป็นขยะออก
text = text
  .replace(/\*\*(.+?)\*\*/g, '$1')
  .replace(/__(.+?)__/g, '$1')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/^\s*[-*]\s+/gm, '• ')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

// แบ่งข้อความยาวโดยพยายามตัดที่ย่อหน้า/ช่องว่าง
function chunk(str, size) {
  const parts = [];
  let rest = str;
  while (rest.length > size && parts.length < MAX_MESSAGES - 1) {
    let cut = rest.lastIndexOf('\n', size);
    if (cut < size * 0.5) cut = rest.lastIndexOf(' ', size);
    if (cut < size * 0.5) cut = size;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  parts.push(rest.slice(0, size));
  return parts.filter(Boolean);
}

const messages = chunk(text, MAX_CHARS_PER_MESSAGE).map((t) => ({ type: 'text', text: t }));

// ปุ่มลัดหัวข้อยอดนิยม (LINE ให้แนบกับข้อความสุดท้ายเท่านั้น)
const items = (match.suggestions || [])
  .filter((s) => s && String(s).trim())
  .slice(0, 6)
  .map((s) => {
    const label = String(s).trim().slice(0, 20);
    return { type: 'action', action: { type: 'message', label, text: label } };
  });

if (items.length) messages[messages.length - 1].quickReply = { items };

return {
  json: {
    replyToken: match.replyToken,
    userId: match.userId,
    userMessage: match.userMessage,
    route: match.route,
    matchType: match.matchType,
    matchedKeyword: match.matchedKeyword || '',
    score: match.score,
    answerText: text,
    body: { replyToken: match.replyToken, messages },
  },
};

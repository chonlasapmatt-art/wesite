/* ============================================================
   1) Parse LINE Event
   ------------------------------------------------------------
   ดึงข้อความจริงออกจาก payload ของ LINE Messaging API
   - LINE ส่งมาที่ body.events[] (ไม่ใช่ body.message)
   - รองรับหลาย event ใน 1 request
   - ข้าม event ที่ไม่ใช่ข้อความตัวอักษร (สติกเกอร์ รูป ไลฟ์ ฯลฯ)
   - คืน [] เมื่อเป็น verify request ของ LINE  -> workflow จบเงียบ ๆ
   ============================================================ */

const raw = $input.first().json || {};
const body = raw.body || raw;
const events = Array.isArray(body.events) ? body.events : [];

const out = [];

for (const ev of events) {
  if (!ev || !ev.replyToken) continue;

  const source = ev.source || {};
  const userId = source.userId || source.groupId || source.roomId || '';

  // ข้อความตัวอักษรเท่านั้น
  if (ev.type === 'message' && ev.message && ev.message.type === 'text') {
    const text = String(ev.message.text || '').trim();
    if (!text) continue;
    out.push({
      json: {
        userId,
        replyToken: ev.replyToken,
        text,
        messageType: 'text',
        sourceType: source.type || 'user',
        timestamp: ev.timestamp || Date.now(),
      },
    });
    continue;
  }

  // ผู้ใช้เพิ่งกดเพิ่มเพื่อน -> ทักทายและแนะนำวิธีใช้
  if (ev.type === 'follow') {
    out.push({
      json: {
        userId,
        replyToken: ev.replyToken,
        text: '__FOLLOW__',
        messageType: 'follow',
        sourceType: source.type || 'user',
        timestamp: ev.timestamp || Date.now(),
      },
    });
    continue;
  }

  // สติกเกอร์/รูป/ไฟล์ -> ตอบกลับสั้น ๆ ว่าให้พิมพ์เป็นข้อความ
  if (ev.type === 'message') {
    out.push({
      json: {
        userId,
        replyToken: ev.replyToken,
        text: '__NON_TEXT__',
        messageType: (ev.message && ev.message.type) || 'unknown',
        sourceType: source.type || 'user',
        timestamp: ev.timestamp || Date.now(),
      },
    });
  }
}

// เผื่อกรณีทดสอบด้วย payload ง่าย ๆ เช่น { "message": "ราคา" }
if (out.length === 0 && typeof body.message === 'string' && body.message.trim()) {
  out.push({
    json: {
      userId: body.userId || 'test-user',
      replyToken: body.replyToken || '',
      text: body.message.trim(),
      messageType: 'text',
      sourceType: 'user',
      timestamp: Date.now(),
    },
  });
}

return out;

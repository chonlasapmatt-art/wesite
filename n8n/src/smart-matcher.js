/* ============================================================
   2) Smart Thai Matcher  (หัวใจของระบบ)
   ------------------------------------------------------------
   หน้าที่:
   1. อ่านคำถามลูกค้า + FAQ + คลังความรู้ จาก Google Sheets
   2. จับคู่คำถามแบบ "ทนคำผิด" (typo-tolerant) สำหรับภาษาไทย
        - ตัดวรรณยุกต์/ไม้ไต่คู้/ทัณฑฆาต   ราคา / ร่าคา / ราค่า  -> เหมือนกัน
        - ยุบสระที่เสียงใกล้กัน            ราคะ / ราคา            -> เหมือนกัน
        - ยุบพยัญชนะเสียงเดียวกัน          ราคา / ลาคา / ราฆา     -> เหมือนกัน
        - แก้เคสลืมสลับภาษา                he8k / ik8k            -> ราคา
        - Levenshtein + Dice bigram + โครงพยัญชนะ + fuzzy substring
   3. ตัดสินใจ route:
        'direct' = มั่นใจมาก ตอบจาก Sheet ทันที (เร็ว/ไม่เสียค่า token)
        'ai'     = ส่งต่อให้ AI Agent พร้อม context ทั้งหมด
   ============================================================ */

/* ---------- ปรับจูนได้ตรงนี้ ---------- */
const DIRECT_THRESHOLD    = 0.90; // >= ค่านี้ = ตอบจาก Sheet ทันที (ตั้ง 2 = ให้ AI ตอบทุกครั้ง)
const CANDIDATE_THRESHOLD = 0.35; // >= ค่านี้ = ส่งเป็น "ตัวเลือกที่น่าจะใช่" ให้ AI พิจารณา
const SHORT_QUERY_SLACK   = 8;    // คำถามที่ยาวเกินคีย์เวิร์ดเกินนี้ ถือว่าเป็นประโยค -> ให้ AI ตอบ
const MAX_CANDIDATES      = 8;    // จำนวนตัวเลือกที่ส่งให้ AI
const MAX_FAQ_IN_PROMPT   = 60;   // จำนวนแถว FAQ สูงสุดใน prompt (เรียงตามความเกี่ยวข้องก่อน)
const MAX_KNOWLEDGE_ROWS  = 200;  // จำนวนแถวคลังความรู้ที่อ่านจากชีต
const MAX_KNOWLEDGE_IN_PROMPT = 30; // จำนวนแถวคลังความรู้ที่ส่งเข้า prompt
const MAX_ANSWER_CHARS    = 500;  // ตัดคำตอบยาว ๆ ก่อนใส่ prompt
const HONORIFIC           = 'ครับ'; // คำลงท้ายของบอท ('ครับ' หรือ 'ค่ะ')

const BUSINESS_PROFILE = /*__BUSINESS_PROFILE__*/ '';

/* ============================================================
   ส่วนที่ 1: ตัวช่วยทำความสะอาด / ยุบเสียงภาษาไทย
   ============================================================ */

// วรรณยุกต์ ไม้ไต่คู้ ทัณฑฆาต นิคหิต ยามักการ (U+0E47-U+0E4E)
const TONE_MARKS = /[\u0E47-\u0E4E]/g;
// สระและเครื่องหมายทั้งหมด (ใช้ตอนถอด "โครงพยัญชนะ")
const THAI_VOWELS = /[\u0E30-\u0E3A\u0E40-\u0E4E]/g;
// ช่วงอักษรไทยทั้งหมด
const THAI_RANGE = /[\u0E00-\u0E7F]/;

// พยัญชนะที่ออกเสียงเหมือน/ใกล้กัน -> ยุบเป็นตัวแทนเดียว
const CONSONANT_CLASS = {
  'ข': 'ค', 'ฃ': 'ค', 'ค': 'ค', 'ฅ': 'ค', 'ฆ': 'ค',
  'ฉ': 'ช', 'ช': 'ช', 'ฌ': 'ช',
  'ซ': 'ส', 'ศ': 'ส', 'ษ': 'ส', 'ส': 'ส',
  'ญ': 'ย', 'ย': 'ย',
  'ฎ': 'ด', 'ด': 'ด',
  'ฏ': 'ต', 'ต': 'ต',
  'ฐ': 'ท', 'ฑ': 'ท', 'ฒ': 'ท', 'ถ': 'ท', 'ท': 'ท', 'ธ': 'ท',
  'ณ': 'น', 'น': 'น',
  'ผ': 'พ', 'พ': 'พ', 'ภ': 'พ',
  'ฝ': 'ฟ', 'ฟ': 'ฟ',
  'ร': 'ร', 'ล': 'ร', 'ฬ': 'ร',
  'ห': 'ห', 'ฮ': 'ห',
};

// สระที่มักพิมพ์สลับกัน -> ยุบเป็นตัวแทนเดียว
const VOWEL_CLASS = {
  'ะ': 'า', 'ั': 'า', 'า': 'า', 'ๅ': 'า', 'ำ': 'า',
  'ิ': 'ี', 'ี': 'ี',
  'ึ': 'ื', 'ื': 'ื',
  'ุ': 'ู', 'ู': 'ู',
  'เ': 'เ', 'แ': 'เ', 'โ': 'เ',
  'ใ': 'ไ', 'ไ': 'ไ',
};

// แป้นพิมพ์เกษมณี: กดแป้นอังกฤษ -> ตัวอักษรไทยที่ควรได้
const EN_TO_TH = {
  q: 'ๆ', w: 'ไ', e: 'ำ', r: 'พ', t: 'ะ', y: 'ั', u: 'ี', i: 'ร', o: 'น', p: 'ย',
  '[': 'บ', ']': 'ล', a: 'ฟ', s: 'ห', d: 'ก', f: 'ด', g: 'เ', h: '้', j: '่',
  k: 'า', l: 'ส', ';': 'ว', "'": 'ง', z: 'ผ', x: 'ป', c: 'แ', v: 'อ', b: 'ิ',
  n: 'ื', m: 'ท', ',': 'ม', '.': 'ใ', '/': 'ฝ',
  '1': 'ๅ', '2': '/', '3': '_', '4': 'ภ', '5': 'ถ', '6': 'ุ', '7': 'ึ',
  '8': 'ค', '9': 'ต', '0': 'จ', '-': 'ข', '=': 'ช',
  Q: '๐', W: '"', E: 'ฎ', R: 'ฑ', T: 'ธ', Y: 'ํ', U: '๊', I: 'ณ', O: 'ฯ', P: 'ญ',
  A: 'ฤ', S: 'ฆ', D: 'ฏ', F: 'โ', G: 'ฌ', H: '็', J: '๋', K: 'ษ', L: 'ศ',
  Z: '(', X: ')', C: 'ฉ', V: 'ฮ', B: 'ฺ', N: '์', M: '?',
};

/** ทำความสะอาดขั้นต้น: ตัดอิโมจิ/เครื่องหมาย/ช่องว่างซ้ำ/ตัวซ้ำรัว ๆ */
function normalize(input) {
  let s = String(input == null ? '' : input).normalize('NFC').toLowerCase();
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');                       // zero-width
  s = s.replace(/[\u0E2F\u0E46\u0E4F\u0E5A\u0E5B]/g, '');          // ฯ ๆ ๏ ๚ ๛
  s = s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, ' '); // อิโมจิ/สัญลักษณ์
  s = s.replace(/[!-\/:-@\[-`{-~]/g, ' ');                           // เครื่องหมาย ASCII
  s = s.replace(/[\u2000-\u206F\u3000-\u303F]/g, ' ');              // เครื่องหมายสากล
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/(.)\1{2,}/g, '$1$1');                                // ครัาาาาบ -> ครัาบ
  return s;
}

/** ยุบเสียง: ตัดวรรณยุกต์ + ยุบพยัญชนะ/สระที่ใกล้กัน + ตัดช่องว่าง */
function fold(input) {
  let s = normalize(input).replace(TONE_MARKS, '');
  let out = '';
  for (const ch of s) {
    if (ch === ' ') continue;
    out += CONSONANT_CLASS[ch] || VOWEL_CLASS[ch] || ch;
  }
  return out;
}

/** โครงพยัญชนะ: เหลือแต่พยัญชนะ ใช้จับคำที่สระเพี้ยนทั้งคำ */
function skeleton(folded) {
  return folded.replace(THAI_VOWELS, '');
}

/** แปลงข้อความที่ลืมสลับภาษา: "ik8k" -> "ราคา" (รองรับกรณีสลับภาษากลางคันด้วย) */
function fromEnglishKeys(input) {
  const s = String(input == null ? '' : input);
  let out = '';
  let converted = 0;
  for (const ch of s) {
    if (EN_TO_TH[ch]) { out += EN_TO_TH[ch]; converted++; }
    else out += ch;
  }
  return converted >= 2 && out !== s ? out : '';
}

/* ============================================================
   ส่วนที่ 2: อัลกอริทึมวัดความคล้าย
   ============================================================ */

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    const ca = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = ca === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

function levRatio(a, b) {
  if (!a || !b) return 0;
  const max = Math.max(a.length, b.length);
  return max === 0 ? 0 : 1 - levenshtein(a, b) / max;
}

/** Dice coefficient บน bigram — ทนต่อการสลับตำแหน่งคำ */
function diceBigram(a, b) {
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
  const grams = (s) => {
    const m = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.substr(i, 2);
      m.set(g, (m.get(g) || 0) + 1);
    }
    return m;
  };
  const ga = grams(a), gb = grams(b);
  let hit = 0;
  for (const [g, n] of ga) if (gb.has(g)) hit += Math.min(n, gb.get(g));
  return (2 * hit) / (a.length - 1 + b.length - 1);
}

/** หา "หน้าต่าง" ในประโยคที่คล้ายคีย์เวิร์ดที่สุด — จับคำผิดที่ฝังอยู่กลางประโยค */
function bestWindowRatio(haystack, needle) {
  if (!haystack || !needle) return 0;
  let best = 0;
  for (const w of [needle.length - 1, needle.length, needle.length + 1]) {
    if (w < 2 || w > haystack.length) continue;
    for (let i = 0; i + w <= haystack.length; i++) {
      const r = levRatio(haystack.substr(i, w), needle);
      if (r > best) best = r;
      if (best === 1) return 1;
    }
  }
  return best;
}

/** คะแนนความคล้าง 0..1 ระหว่างข้อความลูกค้ากับคีย์เวิร์ด (ทั้งคู่ผ่าน fold แล้ว) */
function similarity(q, k) {
  if (!q || !k) return 0;
  if (q === k) return 1;

  const long = q.length >= k.length ? q : k;
  const short = q.length >= k.length ? k : q;
  let best = 0;

  // 1) คีย์เวิร์ดโผล่อยู่ในประโยคตรง ๆ  ("ราคาเท่าไหร่ครับ" มี "ราคา")
  if (short.length >= 2 && long.includes(short)) {
    best = Math.max(best, 0.88 + 0.10 * (short.length / long.length));
  }

  // 2) ความคล้ายทั้งสตริง
  best = Math.max(best, levRatio(q, k));
  best = Math.max(best, diceBigram(q, k) * 0.97);

  // 3) คำผิดที่ฝังกลางประโยค ("อยากทราบราคะของสื่อ")
  if (k.length >= 3) {
    const w = bestWindowRatio(q, k);
    if (w >= 0.7) best = Math.max(best, 0.55 + 0.42 * w);
  }

  // 4) โครงพยัญชนะตรงกัน (สระเพี้ยนทั้งคำ)
  const qs = skeleton(q), ks = skeleton(k);
  if (ks.length >= 2 && qs === ks) best = Math.max(best, 0.90);
  else if (ks.length >= 3 && qs.includes(ks)) best = Math.max(best, 0.82);

  return Math.min(best, 1);
}

/* ============================================================
   ส่วนที่ 3: อ่านข้อมูลจาก Google Sheets
   ============================================================ */

function pick(row, names) {
  for (const key of Object.keys(row)) {
    const k = key.trim().toLowerCase();
    if (names.includes(k)) {
      const v = row[key];
      if (v != null && String(v).trim() !== '') return String(v).trim();
    }
  }
  return '';
}

function safeRows(nodeName) {
  try {
    return $(nodeName).all().map((i) => i.json).filter((r) => r && typeof r === 'object');
  } catch (e) {
    return [];
  }
}

const KEYWORD_COLS = ['keyword', 'keywords', 'question', 'q', 'topic', 'คำถาม', 'คีย์เวิร์ด', 'หัวข้อ'];
const ANSWER_COLS  = ['answer', 'a', 'response', 'reply', 'คำตอบ', 'ตอบ'];
const TITLE_COLS   = ['topic', 'title', 'subject', 'หัวข้อ', 'เรื่อง'];
const CONTENT_COLS = ['content', 'detail', 'details', 'info', 'note', 'body', 'รายละเอียด', 'เนื้อหา', 'ข้อมูล'];

const faqRows = safeRows('Get FAQ')
  .map((r) => ({ keyword: pick(r, KEYWORD_COLS), answer: pick(r, ANSWER_COLS) }))
  .filter((r) => r.keyword && r.answer);

const knowledgeRows = safeRows('Get Knowledge')
  .map((r) => ({ topic: pick(r, TITLE_COLS), content: pick(r, CONTENT_COLS) }))
  .filter((r) => r.content)
  .slice(0, MAX_KNOWLEDGE_ROWS);

/* ============================================================
   ส่วนที่ 4: ประมวลผลทีละข้อความ
   ------------------------------------------------------------
   LINE ส่งได้หลาย event ใน 1 request จึงวนทำทุกข้อความที่เข้ามา
   ============================================================ */

const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

function handle(evt) {
  const userMessage = String(evt.text || '').trim();
  const base = {
    userId: evt.userId || '',
    replyToken: evt.replyToken || '',
    userMessage,
    messageType: evt.messageType || 'text',
  };

  // ---- ทางลัด: เพิ่มเพื่อนใหม่ / ส่งสติกเกอร์-รูป
  if (userMessage === '__FOLLOW__') {
    return {
      ...base,
      route: 'direct',
      matchType: 'greeting',
      score: 1,
      answer:
        'สวัสดี' + HONORIFIC + ' ยินดีต้อนรับสู่ บริษัท ไอว่า ริช ยู ดี จำกัด 🙏\n' +
        'สอบถามเรื่องสินค้า บริการ ราคา หรือการอบรมได้เลย' + HONORIFIC + ' พิมพ์ผิดนิดหน่อยก็เข้าใจ' + HONORIFIC + ' 😊',
      suggestions: faqRows.slice(0, 6).map((r) => r.keyword),
    };
  }

  if (userMessage === '__NON_TEXT__') {
    return {
      ...base,
      route: 'direct',
      matchType: 'non_text',
      score: 1,
      answer: 'ขอบคุณ' + HONORIFIC + ' 😊 รบกวนพิมพ์คำถามเป็นข้อความมาได้เลย' + HONORIFIC + ' เดี๋ยวผมช่วยหาคำตอบให้ทันที',
      suggestions: faqRows.slice(0, 6).map((r) => r.keyword),
    };
  }

  // ---- สร้าง "รูปแบบคำถาม" หลายเวอร์ชัน เผื่อลืมสลับภาษา
  const variants = [userMessage];
  const kbFixed = fromEnglishKeys(userMessage);
  if (kbFixed) variants.push(kbFixed);
  const foldedVariants = variants.map(fold).filter(Boolean);

  // ---- ให้คะแนนทุกแถว (1 แถวมีหลายคีย์เวิร์ดได้ คั่นด้วย , | / ขึ้นบรรทัดใหม่)
  const scored = [];
  for (const row of faqRows) {
    const keywords = row.keyword.split(/[,|/\n;]+/).map((x) => x.trim()).filter(Boolean);
    let bestScore = 0;
    let bestKeyword = keywords[0] || row.keyword;
    for (const kw of keywords) {
      const kf = fold(kw);
      for (const qf of foldedVariants) {
        const sc = similarity(qf, kf);
        if (sc > bestScore) { bestScore = sc; bestKeyword = kw; }
      }
    }
    scored.push({ keyword: bestKeyword, answer: row.answer, score: bestScore });
  }
  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const candidates = scored.filter((r) => r.score >= CANDIDATE_THRESHOLD).slice(0, MAX_CANDIDATES);
  const suggestions = (candidates.length ? candidates : scored.slice(0, 6)).map((r) => r.keyword);

  // ---- ทางด่วน: ตอบจาก Sheet ทันที ต่อเมื่อครบ 3 เงื่อนไข
  //      (1) คะแนนสูงพอ  (2) ไม่มีหัวข้ออื่นคะแนนใกล้กัน  (3) เป็นคำถามสั้น ๆ ไม่ใช่ประโยคยาว
  //      ประโยคยาวอย่าง "ขอใบเสนอราคาโรงเรียน 40 เครื่อง" ต้องให้ AI ตอบ เพราะมีรายละเอียดเกิน FAQ
  const runnerUp = scored[1] ? scored[1].score : 0;
  const topKeywordLen = top ? fold(top.keyword).length : 0;
  const isShortQuery = foldedVariants.some((v) => v.length <= topKeywordLen + SHORT_QUERY_SLACK);

  if (top && top.score >= DIRECT_THRESHOLD && (top.score - runnerUp) >= 0.05 && isShortQuery) {
    return {
      ...base,
      route: 'direct',
      matchType: top.score === 1 ? 'exact' : 'fuzzy',
      matchedKeyword: top.keyword,
      score: Number(top.score.toFixed(3)),
      keyboardFixed: kbFixed || '',
      answer: top.answer,
      suggestions: suggestions.filter((x) => x !== top.keyword).slice(0, 5),
    };
  }

  /* ---- ประกอบ System Prompt ส่งให้ AI Agent ----
     เรียง FAQ และคลังความรู้ตาม "ความเกี่ยวข้องกับคำถามนี้" ก่อนเสมอ
     เรื่องที่ตรงประเด็นที่สุดจึงอยู่ต้น prompt และไม่มีทางถูกตัดทิ้ง */
  const faqBlock = scored
    .slice(0, MAX_FAQ_IN_PROMPT)
    .map((r, i) => i + 1 + '. [' + r.keyword + '] ' + clip(r.answer, MAX_ANSWER_CHARS))
    .join('\n');

  const knowledgeBlock = knowledgeRows
    .map((r) => {
      const tf = fold(r.topic);
      const cf = fold(r.content);
      let sc = 0;
      for (const qf of foldedVariants) {
        if (tf) sc = Math.max(sc, similarity(qf, tf));
        if (qf.length >= 3 && cf.includes(qf)) sc = Math.max(sc, 0.80);
      }
      return { ...r, score: sc };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_KNOWLEDGE_IN_PROMPT)
    .map((r) => '- ' + (r.topic ? r.topic + ': ' : '') + clip(r.content, MAX_ANSWER_CHARS))
    .join('\n');

  const candidateBlock = candidates.length
    ? candidates
        .map((r) => '- "' + r.keyword + '" (ความใกล้เคียง ' + Math.round(r.score * 100) + '%) -> ' + clip(r.answer, MAX_ANSWER_CHARS))
        .join('\n')
    : '(ไม่พบหัวข้อที่ใกล้เคียงพอ ให้ตอบจากข้อมูลบริษัทและคลังความรู้ด้านบน)';

  const kbNote = kbFixed
    ? '\nหมายเหตุ: ลูกค้าอาจลืมสลับภาษา ข้อความนี้ถ้าแปลงเป็นแป้นไทยจะได้ว่า "' + kbFixed + '"'
    : '';

  const systemPrompt = [
    'คุณคือ "น้องไอว่า" พนักงานผู้ช่วยตอบแชท LINE OA ของ บริษัท ไอว่า ริช ยู ดี จำกัด',
    'หน้าที่ของคุณคือตอบคำถามลูกค้าได้ทุกเรื่องที่เกี่ยวกับธุรกิจนี้ อย่างสุภาพ กระชับ และถูกต้อง',
    '',
    '=== ข้อมูลบริษัท (ใช้ตอบได้ทั้งหมด) ===',
    BUSINESS_PROFILE,
    '',
    '=== คลังความรู้เพิ่มเติมจากทีมงาน (เรียงตามความเกี่ยวข้องกับคำถามนี้) ===',
    knowledgeBlock || '(ยังไม่มีข้อมูลเพิ่มเติม)',
    '',
    '=== FAQ ที่ทีมงานเตรียมไว้ (เรียงตามความเกี่ยวข้อง ข้อ 1 ใกล้เคียงที่สุด — ให้ยึดเป็นคำตอบมาตรฐาน) ===',
    faqBlock || '(ยังไม่มี FAQ)',
    '',
    '=== ระบบเดาให้แล้วว่าลูกค้าน่าจะหมายถึงหัวข้อนี้ ===',
    'ข้อความดิบที่ลูกค้าพิมพ์: "' + userMessage + '"' + kbNote,
    candidateBlock,
    '',
    '=== กติกาการตอบ (สำคัญมาก) ===',
    '1. ตอบเป็นภาษาไทย สุภาพ ลงท้ายด้วย "' + HONORIFIC + '" และตอบให้สั้นกระชับ ไม่เกิน 5-6 บรรทัด',
    '2. ลูกค้ามักพิมพ์ผิด สะกดเพี้ยน หรือลืมสลับภาษา เช่น "พารา"/"ราคะ" = "ราคา", "สมัคเรียน" = "สมัครเรียน"',
    '   ให้เดาเจตนาจากรายการข้างบนแล้วตอบไปเลย ห้ามตอบว่า "ไม่เข้าใจ" ถ้ายังพอเดาได้',
    '3. ถ้ามีหัวข้อที่ใกล้เคียงชัดเจนหัวข้อเดียว ให้ตอบตามคำตอบมาตรฐานของหัวข้อนั้นทันที',
    '   (จะทวนสั้น ๆ ว่า "เข้าใจว่าสอบถามเรื่อง ... นะ' + HONORIFIC + '" ก่อนตอบก็ได้)',
    '4. ถ้าคลุมเครือจริง ๆ ให้เดาที่น่าจะใช่ที่สุดมาตอบก่อน 1 เรื่อง แล้วค่อยเสนอหัวข้ออื่นให้เลือกไม่เกิน 3 หัวข้อ',
    '5. ห้ามแต่งข้อมูลที่ไม่มีในข้อมูลข้างบนเด็ดขาด โดยเฉพาะราคา โปรโมชั่น เงื่อนไข หรือวันเวลานัดหมาย',
    '6. เวลาบอกราคา ให้ระบุว่าเป็นราคาอ้างอิง และชวนติดต่อทีมงานเพื่อขอใบเสนอราคาจริง',
    '7. ถ้าเป็นเรื่องที่ต้องให้คนช่วย (ต่อรองราคา ออกใบเสนอราคา นัดสาธิต แจ้งซ่อม เคลม) ให้แจ้งช่องทางติดต่อ:',
    '   โทร 099-626-9787 หรือ 082-731-8082 / อีเมล supannee@iwarichyoudee.com',
    '8. ถ้าเป็นเรื่องนอกขอบเขตธุรกิจ ให้ปฏิเสธอย่างสุภาพสั้น ๆ แล้วชวนกลับเข้าเรื่องบริการของบริษัท',
    '9. ห้ามใช้ Markdown (**ตัวหนา**, #, ตาราง) เพราะ LINE แสดงผลไม่ได้ ใช้ข้อความธรรมดา ขึ้นบรรทัดใหม่ และ • ได้',
    '10. ใช้อิโมจิได้พอประมาณ ไม่เกิน 2 ตัวต่อข้อความ',
    '11. ตอบให้ตรงประเด็นที่ลูกค้าถามเท่านั้น ห้ามแถมข้อมูลที่ไม่เกี่ยวข้อง และห้ามทวนคำถามยาว ๆ',
    '12. ถ้าลูกค้าถามหลายเรื่องในข้อความเดียว ให้ตอบให้ครบทุกเรื่อง โดยแยกเป็นบรรทัดละเรื่อง',
    '13. ถ้าข้อมูลที่มีตอบได้แค่บางส่วน ให้ตอบส่วนที่ตอบได้ก่อน แล้วบอกตรง ๆ ว่าส่วนที่เหลือขอให้ทีมงานติดต่อกลับ',
  ].join('\n');

  return {
    ...base,
    route: 'ai',
    matchType: candidates.length ? 'ai_with_candidates' : 'ai_open',
    matchedKeyword: top && top.score >= CANDIDATE_THRESHOLD ? top.keyword : '',
    score: top ? Number(top.score.toFixed(3)) : 0,
    keyboardFixed: kbFixed || '',
    suggestions: suggestions.slice(0, 5),
    systemPrompt,
  };
}

/* ---- วนทุก event ที่เข้ามา ---- */
return $input.all()
  .map((item) => item.json)
  .filter((evt) => evt && typeof evt.text === 'string' && evt.text.trim())
  .map((evt) => ({ json: handle(evt) }));

#!/usr/bin/env node
/**
 * สร้างไฟล์ workflow ของ n8n จากซอร์สใน src/
 * ใช้: node build.mjs   ->  ได้ line-oa-ai-agent.json พร้อม import
 *
 * เหตุผลที่ต้อง build: โค้ดใน Code node ของ n8n ถูกเก็บเป็น string ยาว ๆ
 * ในไฟล์ JSON ซึ่งแก้และ review ยาก จึงเก็บเป็นไฟล์ .js แยกไว้ให้อ่านง่าย
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(HERE, 'src', f), 'utf8');

const businessProfile = src('business-profile.txt').trim();

const matcherCode = src('smart-matcher.js').replace(
  /const BUSINESS_PROFILE = \/\*__BUSINESS_PROFILE__\*\/ '';/,
  `const BUSINESS_PROFILE = ${JSON.stringify(businessProfile)};`
);
if (!matcherCode.includes('ไอว่า ริช ยู ดี')) {
  throw new Error('ไม่สามารถแทรก business-profile.txt เข้า smart-matcher.js ได้');
}

const SHEET_DOC = {
  __rl: true,
  value: '1I1eY-t-1DGjInKdZ0w0iFHZXtdlxbDP-TsR_NcRkIuQ',
  mode: 'list',
  cachedResultName: 'Line OA and n8n',
  cachedResultUrl:
    'https://docs.google.com/spreadsheets/d/1I1eY-t-1DGjInKdZ0w0iFHZXtdlxbDP-TsR_NcRkIuQ/edit?usp=drivesdk',
};
const SHEETS_CRED = {
  googleSheetsOAuth2Api: { id: '73fNRvR60tmd1znc', name: 'Google Sheets account' },
};

const sticky = (id, name, content, position, w, h, color) => ({
  parameters: { content, height: h, width: w, color },
  type: 'n8n-nodes-base.stickyNote',
  typeVersion: 1,
  position,
  id,
  name,
});

const workflow = {
  name: 'IWA LINE OA — AI FAQ Agent',
  nodes: [
    /* ---------- 0. ทางทดสอบ (ไม่ต้องยิงจาก LINE) ---------- */
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [-900, 300],
      id: 'b1a1c0de-0011-4000-8000-000000000011',
      name: 'ทดสอบด้วยตนเอง',
    },
    {
      parameters: {
        assignments: {
          assignments: [
            { id: 'a1', name: 'message', value: 'ราคะเท่าไหร่ครับ', type: 'string' },
            { id: 'a2', name: 'userId', value: 'TEST-USER', type: 'string' },
            { id: 'a3', name: 'replyToken', value: '', type: 'string' },
          ],
        },
        options: {},
      },
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [-680, 300],
      id: 'b1a1c0de-0012-4000-8000-000000000012',
      name: '🧪 ข้อความทดสอบ',
      notesInFlow: true,
      notes: 'พิมพ์คำถามที่อยากลองตรงนี้ แล้วกด Test workflow — ไม่ส่งเข้า LINE จริง',
    },

    /* ---------- 1. รับข้อความ ---------- */
    {
      parameters: { httpMethod: 'POST', path: 'lineoa_chatbot', options: {} },
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2.1,
      position: [-640, 0],
      id: '745a3d8b-08e6-4bff-ad7b-85cbf5c19576',
      name: 'Webhook',
      webhookId: 'f6a3c02c-31d5-4dcc-9ad1-5110c885e7b0',
    },
    {
      parameters: { jsCode: src('parse-line-event.js') },
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [20, 0],
      id: 'b1a1c0de-0001-4000-8000-000000000001',
      name: 'Parse LINE Event',
    },
    {
      parameters: {
        method: 'POST',
        url: 'https://api.line.me/v2/bot/chat/loading/start',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({ chatId: $json.userId, loadingSeconds: 20 }) }}',
        options: {},
      },
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.5,
      position: [240, 220],
      id: 'b1a1c0de-0002-4000-8000-000000000002',
      name: 'Show Typing',
      onError: 'continueRegularOutput',
      alwaysOutputData: true,
      notesInFlow: true,
      notes: 'แสดงจุดสามจุด "กำลังพิมพ์" ใน LINE ระหว่างรอ AI (ล้มเหลวได้ ไม่กระทบการตอบ)',
    },

    /* ---------- 2. ดึงความรู้ ---------- */
    {
      parameters: {
        documentId: SHEET_DOC,
        sheetName: {
          __rl: true,
          value: 1142604915,
          mode: 'list',
          cachedResultName: 'FAQ',
          cachedResultUrl:
            'https://docs.google.com/spreadsheets/d/1I1eY-t-1DGjInKdZ0w0iFHZXtdlxbDP-TsR_NcRkIuQ/edit#gid=1142604915',
        },
        options: {},
      },
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 4.7,
      position: [-420, 0],
      id: '99df0946-debd-4b6d-9aa5-dfcde38af2ad',
      name: 'Get FAQ',
      credentials: SHEETS_CRED,
      alwaysOutputData: true,
      onError: 'continueRegularOutput',
    },
    {
      parameters: {
        documentId: SHEET_DOC,
        sheetName: { __rl: true, value: 'Knowledge', mode: 'name' },
        options: {},
      },
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 4.7,
      position: [-200, 0],
      id: 'b1a1c0de-0003-4000-8000-000000000003',
      name: 'Get Knowledge',
      credentials: SHEETS_CRED,
      executeOnce: true,
      alwaysOutputData: true,
      onError: 'continueRegularOutput',
      notesInFlow: true,
      notes: 'ชีตความรู้เพิ่มเติม (คอลัมน์ topic, content) — ถ้ายังไม่มีชีตนี้ ระบบยังทำงานได้ปกติ',
    },

    /* ---------- 3. สมองส่วนจับคู่คำ ---------- */
    {
      parameters: { jsCode: matcherCode },
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [240, 0],
      id: 'b1a1c0de-0004-4000-8000-000000000004',
      name: 'Smart Thai Matcher',
    },
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [
            {
              id: 'route-check',
              leftValue: '={{ $json.route }}',
              rightValue: 'direct',
              operator: { type: 'string', operation: 'equals' },
            },
          ],
          combinator: 'and',
        },
        looseTypeValidation: true,
        options: {},
      },
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: [460, 0],
      id: 'b1a1c0de-0005-4000-8000-000000000005',
      name: 'มั่นใจพอไหม?',
    },

    /* ---------- 4. AI Agent ---------- */
    {
      parameters: {
        promptType: 'define',
        text: '={{ $json.userMessage }}',
        options: { systemMessage: '={{ $json.systemPrompt }}', maxIterations: 3 },
      },
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 2,
      position: [680, 160],
      id: 'b1a1c0de-0006-4000-8000-000000000006',
      name: 'AI Agent',
      onError: 'continueRegularOutput',
      alwaysOutputData: true,
    },
    {
      parameters: {
        model: { __rl: true, mode: 'list', value: 'gpt-4.1-mini' },
        options: { temperature: 0.3, maxTokens: 700 },
      },
      type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      typeVersion: 1.2,
      position: [640, 400],
      id: 'b1a1c0de-0007-4000-8000-000000000007',
      name: 'OpenAI Chat Model',
      notesInFlow: true,
      notes: 'สลับไปใช้ Google Gemini หรือโมเดลอื่นได้ โดยลบโหนดนี้แล้วต่อโหนดโมเดลใหม่เข้าช่อง Chat Model',
    },
    {
      parameters: {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.userId }}',
        contextWindowLength: 12,
      },
      type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
      typeVersion: 1.3,
      position: [820, 400],
      id: 'b1a1c0de-0008-4000-8000-000000000008',
      name: 'Chat Memory (ต่อผู้ใช้)',
    },

    /* ---------- 5. ตอบกลับ ---------- */
    {
      parameters: { mode: 'runOnceForEachItem', jsCode: src('build-reply.js') },
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [960, 0],
      id: 'b1a1c0de-0009-4000-8000-000000000009',
      name: 'Build LINE Reply',
    },
    {
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [
            {
              id: 'has-reply-token',
              leftValue: '={{ $json.replyToken }}',
              rightValue: '',
              operator: { type: 'string', operation: 'notEmpty', singleValue: true },
            },
          ],
          combinator: 'and',
        },
        looseTypeValidation: true,
        options: {},
      },
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: [1160, 0],
      id: 'b1a1c0de-0013-4000-8000-000000000013',
      name: 'ส่งเข้า LINE จริงไหม?',
      notesInFlow: true,
      notes: 'ไม่มี replyToken = กำลังทดสอบ จึงไม่ยิงเข้า LINE',
    },
    {
      parameters: {
        method: 'POST',
        url: 'https://api.line.me/v2/bot/message/reply',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify($json.body) }}',
        options: {},
      },
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.5,
      position: [1380, 0],
      id: '16560780-0089-48c2-9edd-8d8066782e72',
      name: 'Reply to LINE',
    },
    {
      parameters: {
        operation: 'append',
        documentId: SHEET_DOC,
        sheetName: { __rl: true, value: 'Chat Log', mode: 'name' },
        columns: {
          mappingMode: 'defineBelow',
          value: {
            timestamp: "={{ $now.setZone('Asia/Bangkok').toFormat('yyyy-MM-dd HH:mm:ss') }}",
            userId: "={{ $('Build LINE Reply').item.json.userId }}",
            question: "={{ $('Build LINE Reply').item.json.userMessage }}",
            route: "={{ $('Build LINE Reply').item.json.route }}",
            matchType: "={{ $('Build LINE Reply').item.json.matchType }}",
            matchedKeyword: "={{ $('Build LINE Reply').item.json.matchedKeyword }}",
            score: "={{ $('Build LINE Reply').item.json.score }}",
            answer: "={{ $('Build LINE Reply').item.json.answerText }}",
          },
          matchingColumns: [],
          schema: [
            'timestamp', 'userId', 'question', 'route', 'matchType', 'matchedKeyword', 'score', 'answer',
          ].map((k) => ({
            id: k, displayName: k, required: false, defaultMatch: false,
            display: true, type: 'string', canBeUsedToMatch: true,
          })),
          attemptToConvertTypes: false,
          convertFieldsToString: true,
        },
        options: {},
      },
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 4.7,
      position: [1600, 0],
      id: 'b1a1c0de-0010-4000-8000-000000000010',
      name: 'Log to Sheet',
      credentials: SHEETS_CRED,
      disabled: true,
      onError: 'continueRegularOutput',
      notesInFlow: true,
      notes: 'บันทึกทุกคำถามลงชีต "Chat Log" — สร้างชีตแล้วค่อยเปิดใช้ (คลิกขวา > Activate)',
    },

    /* ---------- โน้ตอธิบาย ---------- */
    sticky(
      'note-1',
      'Sticky Note',
      '## 1) รับข้อความ + ดึงความรู้\n' +
        '**Webhook** รับ event จาก LINE Messaging API\n\n' +
        '**Get FAQ** — ชีต `FAQ` คอลัมน์ `keyword`, `answer`\n' +
        'ใส่หลายคีย์เวิร์ดในช่องเดียวได้ คั่นด้วย `,` หรือ `|`\n' +
        'เช่น `ราคา, ค่าใช้จ่าย, กี่บาท, เท่าไหร่`\n\n' +
        '**Get Knowledge** — ชีต `Knowledge` คอลัมน์ `topic`, `content`\n' +
        'ใส่เรื่องอะไรก็ได้ที่อยากให้บอทตอบ เช่น เวลาทำการ,\n' +
        'ขั้นตอนสั่งซื้อ, การรับประกัน (ยังไม่มีชีตนี้ก็ทำงานได้)',
      [-700, -360],
      640,
      320,
      5
    ),
    sticky(
      'note-2',
      'Sticky Note1',
      '## 2) แยกข้อความ + สมองจับคู่คำ\n' +
        '**Parse LINE Event** อ่าน `body.events[]` ตามสเปกจริง\n' +
        'ของ LINE (ของเดิมอ่าน `body.message` ซึ่งไม่มีอยู่จริง)\n' +
        'รองรับหลาย event ต่อ 1 request\n\n' +
        '**Smart Thai Matcher** ยุบวรรณยุกต์/สระ/พยัญชนะ\n' +
        '+ Levenshtein + Dice bigram + โครงพยัญชนะ\n' +
        '`ราคะ` `ร่าคา` `ลาคา` `ik8k` -> **ราคา**',
      [-20, -360],
      400,
      320,
      3
    ),
    sticky(
      'note-3',
      'Sticky Note2',
      '## 3) เลือกเส้นทางตอบ\n' +
        'มั่นใจ >= 90% **และ** เป็นคำถามสั้น\n' +
        '-> ตอบจากชีตทันที (เร็ว ไม่เสียค่า token)\n\n' +
        'นอกนั้น -> ส่งให้ **AI Agent** พร้อมข้อมูลบริษัท\n' +
        'FAQ ทั้งหมด คลังความรู้ และรายการหัวข้อที่ระบบ\n' +
        'เดาไว้ให้พร้อม % ความมั่นใจ',
      [400, -360],
      400,
      320,
      4
    ),
    sticky(
      'note-4',
      'Sticky Note3',
      '## 4) AI Agent\n' +
        'ตอบได้ทุกเรื่องในธุรกิจ จาก system prompt ที่บรรจุ\n' +
        'ข้อมูลบริษัท + FAQ + คลังความรู้ และเดาเจตนา\n' +
        'จากคำที่ลูกค้าพิมพ์ผิดได้เองอีกชั้นหนึ่ง\n\n' +
        '**Chat Memory** จำบทสนทนาแยกตาม userId ของ LINE\n' +
        'ทำให้ถามต่อเนื่องได้ เช่น "แล้วราคาล่ะ"\n\n' +
        'เปลี่ยนไปใช้ Gemini ได้ โดยเปลี่ยนโหนด Chat Model',
      [600, 560],
      440,
      280,
      6
    ),
    sticky(
      'note-5',
      'Sticky Note4',
      '## 5) ตอบกลับ\n' +
        '**Build LINE Reply** ทำงานทีละข้อความ (ตอบถูกคน\n' +
        'แม้มีหลาย event) ล้าง Markdown ที่ LINE แสดงไม่ได้\n' +
        'ตัดข้อความยาวเป็นหลายข้อความ และแนบ Quick Reply\n\n' +
        '**Reply to LINE** ใช้ credential แบบ Header Auth\n' +
        '(ไม่เก็บ token ไว้ในไฟล์ workflow)\n\n' +
        '**Log to Sheet** ปิดไว้ก่อน เปิดเมื่อสร้างชีต `Chat Log`',
      [900, -360],
      460,
      320,
      7
    ),
  ],
  pinData: {},
  connections: {
    Webhook: { main: [[{ node: 'Get FAQ', type: 'main', index: 0 }]] },
    'ทดสอบด้วยตนเอง': { main: [[{ node: '🧪 ข้อความทดสอบ', type: 'main', index: 0 }]] },
    '🧪 ข้อความทดสอบ': { main: [[{ node: 'Get FAQ', type: 'main', index: 0 }]] },
    'Get FAQ': { main: [[{ node: 'Get Knowledge', type: 'main', index: 0 }]] },
    'Get Knowledge': { main: [[{ node: 'Parse LINE Event', type: 'main', index: 0 }]] },
    // แตกเป็น 2 ทาง: แจ้ง "กำลังพิมพ์" (ทางตัน) และเข้าสู่การจับคู่คำถาม
    'Parse LINE Event': {
      main: [[
        { node: 'Smart Thai Matcher', type: 'main', index: 0 },
        { node: 'Show Typing', type: 'main', index: 0 },
      ]],
    },
    'Smart Thai Matcher': { main: [[{ node: 'มั่นใจพอไหม?', type: 'main', index: 0 }]] },
    'มั่นใจพอไหม?': {
      main: [
        [{ node: 'Build LINE Reply', type: 'main', index: 0 }],
        [{ node: 'AI Agent', type: 'main', index: 0 }],
      ],
    },
    'AI Agent': { main: [[{ node: 'Build LINE Reply', type: 'main', index: 0 }]] },
    'OpenAI Chat Model': { ai_languageModel: [[{ node: 'AI Agent', type: 'ai_languageModel', index: 0 }]] },
    'Chat Memory (ต่อผู้ใช้)': { ai_memory: [[{ node: 'AI Agent', type: 'ai_memory', index: 0 }]] },
    'Build LINE Reply': { main: [[{ node: 'ส่งเข้า LINE จริงไหม?', type: 'main', index: 0 }]] },
    'ส่งเข้า LINE จริงไหม?': { main: [[{ node: 'Reply to LINE', type: 'main', index: 0 }], []] },
    'Reply to LINE': { main: [[{ node: 'Log to Sheet', type: 'main', index: 0 }]] },
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

const out = join(HERE, 'line-oa-ai-agent.json');
writeFileSync(out, JSON.stringify(workflow, null, 2) + '\n', 'utf8');
console.log('เขียนไฟล์แล้ว:', out, '(' + workflow.nodes.length + ' โหนด)');

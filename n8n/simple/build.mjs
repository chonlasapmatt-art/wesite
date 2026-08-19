#!/usr/bin/env node
/** ประกอบไฟล์ workflow เวอร์ชันเรียบง่าย: node build.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

const workflow = {
  name: 'LINE OA + AI Agent (เวอร์ชันเรียบง่าย)',
  nodes: [
    {
      parameters: { httpMethod: 'POST', path: 'lineoa_chatbot', options: {} },
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2.1,
      position: [-380, 0],
      id: '745a3d8b-08e6-4bff-ad7b-85cbf5c19576',
      name: 'Webhook',
      webhookId: 'f6a3c02c-31d5-4dcc-9ad1-5110c885e7b0',
    },
    {
      parameters: {
        documentId: {
          __rl: true,
          value: '1I1eY-t-1DGjInKdZ0w0iFHZXtdlxbDP-TsR_NcRkIuQ',
          mode: 'list',
          cachedResultName: 'Line OA and n8n',
          cachedResultUrl:
            'https://docs.google.com/spreadsheets/d/1I1eY-t-1DGjInKdZ0w0iFHZXtdlxbDP-TsR_NcRkIuQ/edit?usp=drivesdk',
        },
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
      position: [-160, 0],
      id: '99df0946-debd-4b6d-9aa5-dfcde38af2ad',
      name: 'Get row(s) in sheet',
      credentials: { googleSheetsOAuth2Api: { id: '73fNRvR60tmd1znc', name: 'Google Sheets account' } },
      alwaysOutputData: true,
    },
    {
      parameters: { jsCode: readFileSync(join(HERE, 'src', 'prepare.js'), 'utf8') },
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [60, 0],
      id: 'ee844ed8-232e-496e-a1d4-b826c95e7712',
      name: 'เตรียมข้อมูลให้ AI',
      notesInFlow: true,
      notes: 'แก้ข้อมูลบริษัทได้ที่บรรทัดบน ๆ ของโค้ด',
    },
    {
      parameters: {
        promptType: 'define',
        text: '={{ $json.question }}',
        options: { systemMessage: '={{ $json.systemPrompt }}' },
      },
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 2,
      position: [280, 0],
      id: 'a9b8c7d6-0001-4000-8000-000000000001',
      name: 'AI Agent',
      onError: 'continueRegularOutput',
      alwaysOutputData: true,
    },
    {
      parameters: {
        model: { __rl: true, mode: 'list', value: 'gpt-4.1-mini' },
        options: { temperature: 0.3 },
      },
      type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      typeVersion: 1.2,
      position: [240, 220],
      id: 'a9b8c7d6-0002-4000-8000-000000000002',
      name: 'OpenAI Chat Model',
    },
    {
      parameters: {
        method: 'POST',
        url: 'https://api.line.me/v2/bot/message/reply',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Authorization', value: 'Bearer วาง LINE Channel Access Token ตัวใหม่ตรงนี้' },
            { name: 'Content-Type', value: 'application/json' },
          ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
          "={{ JSON.stringify({\n" +
          "  replyToken: $('เตรียมข้อมูลให้ AI').item.json.replyToken,\n" +
          "  messages: [{\n" +
          "    type: 'text',\n" +
          "    text: ($json.output || 'ขออภัยครับ ระบบขัดข้องชั่วคราว รบกวนติดต่อ 099-626-9787')\n" +
          "      .replace(/[*#_`]/g, '').slice(0, 4900)\n" +
          "  }]\n" +
          "}) }}",
        options: {},
      },
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.5,
      position: [500, 0],
      id: '16560780-0089-48c2-9edd-8d8066782e72',
      name: 'ตอบกลับ LINE',
    },
    {
      parameters: {
        content:
          '## ทำ 3 อย่างนี้แล้วใช้ได้เลย\n\n' +
          '**1.** โหนด `ตอบกลับ LINE` -> ช่อง Authorization\n' +
          'วาง `Bearer <token ใหม่>` (token เดิมหลุดแล้ว ต้องออกใหม่)\n\n' +
          '**2.** โหนด `OpenAI Chat Model` -> ใส่ API key\n\n' +
          '**3.** กด Active มุมขวาบน\n\n' +
          'ชีตที่ใช้: `FAQ` คอลัมน์ `keyword`, `answer` เท่านั้น\n' +
          'อยากให้บอทตอบเรื่องอะไรเพิ่ม = เพิ่มแถวในชีต ไม่ต้องแก้ workflow\n' +
          '(ใส่หลายคำในช่อง keyword ได้ คั่นด้วย `,`)',
        height: 340,
        width: 420,
        color: 4,
      },
      type: 'n8n-nodes-base.stickyNote',
      typeVersion: 1,
      position: [-380, -400],
      id: 'a9b8c7d6-0003-4000-8000-000000000003',
      name: 'Sticky Note',
    },
  ],
  pinData: {},
  connections: {
    Webhook: { main: [[{ node: 'Get row(s) in sheet', type: 'main', index: 0 }]] },
    'Get row(s) in sheet': { main: [[{ node: 'เตรียมข้อมูลให้ AI', type: 'main', index: 0 }]] },
    'เตรียมข้อมูลให้ AI': { main: [[{ node: 'AI Agent', type: 'main', index: 0 }]] },
    'OpenAI Chat Model': { ai_languageModel: [[{ node: 'AI Agent', type: 'ai_languageModel', index: 0 }]] },
    'AI Agent': { main: [[{ node: 'ตอบกลับ LINE', type: 'main', index: 0 }]] },
  },
  active: false,
  settings: { executionOrder: 'v1' },
  tags: [],
};

writeFileSync(join(HERE, 'line-oa-simple.json'), JSON.stringify(workflow, null, 2) + '\n', 'utf8');
console.log('เขียนไฟล์แล้ว: line-oa-simple.json (' + workflow.nodes.length + ' โหนด)');

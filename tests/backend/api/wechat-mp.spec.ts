/**
 * WeChat MP (公众号) API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#10
 * PR: WnadeyaowuOraganization/wande-ai-backend#780
 *
 * API Endpoints:
 * - GET  /wx/mp  — 微信服务器验证 (signature验证)
 * - POST /wx/mp  — 接收微信消息/事件
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

test.describe('WeChat MP API @api @wechat @issue:backend#10', () => {
  test('GET /wx/mp should respond to verification', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wx/mp`, {
      params: {
        signature: 'test',
        timestamp: Date.now().toString(),
        nonce: 'test-nonce',
        echostr: 'test-echo',
      },
    });
    // WeChat verification should respond (may fail signature check, that's ok)
    // This endpoint is for WeChat callback, not user-facing
    expect(response.status()).toBeLessThan(500);
  });

  test('POST /wx/mp should accept XML message', async ({ request }) => {
    const xmlBody = `<xml>
      <ToUserName><![CDATA[test]]></ToUserName>
      <FromUserName><![CDATA[test_user]]></FromUserName>
      <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[E2E test message]]></Content>
      <MsgId>1234567890</MsgId>
    </xml>`;

    const response = await request.post(`${API_BASE}/wx/mp`, {
      headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
      data: xmlBody,
    });
    // Should not crash; may return error since it's not a real WeChat message
    expect(response.status()).toBeLessThan(500);
  });
});

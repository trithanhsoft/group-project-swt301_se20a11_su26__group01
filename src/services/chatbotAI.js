import { callOpenAI, MENU_DATA, TABLE_DATA } from './aiService';

const SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện của nhà hàng "Cái Gì Cũng Không Có".
Nhiệm vụ: hỗ trợ khách hàng về menu, đặt bàn, gợi ý món, trả lời câu hỏi.

Thông tin nhà hàng:
- Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
- Giờ mở cửa: 10:00 - 22:00 hàng ngày
- Hotline: 028-xxxx-xxxx

Menu: ${JSON.stringify(MENU_DATA.map(d => ({ name: d.name, price: d.price, category: d.category })))}

Trạng thái bàn hiện tại: ${JSON.stringify(TABLE_DATA.map(t => ({ name: t.name, capacity: t.capacity, status: t.status === 'empty' ? 'trống' : t.status === 'occupied' ? 'có khách' : 'đặt trước' })))}

Quy tắc:
- Trả lời ngắn gọn, thân thiện, dùng emoji phù hợp
- Luôn gợi ý thêm hành động (đặt bàn, xem menu, v.v.)
- Trả lời bằng tiếng Việt
- Nếu không biết, hướng dẫn liên hệ nhân viên`;

/**
 * Gửi tin nhắn đến chatbot
 */
export async function sendChatMessage(messages) {
  const openAIMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  return callOpenAI(openAIMessages, { temperature: 0.8, maxTokens: 300, type: 'chat' });
}

/**
 * Phân tích sentiment của review
 */
export async function analyzeSentiment(reviews) {
  const prompt = `Phân tích cảm xúc của các đánh giá nhà hàng sau:
${reviews.map((r, i) => `${i + 1}. "${r}"`).join('\n')}

Trả về JSON:
{
  "score": 0-1,
  "label": "positive|neutral|negative",
  "summary": "tóm tắt ngắn",
  "highlights": ["điểm tốt 1", "điểm tốt 2"],
  "issues": ["vấn đề 1"]
}`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.3, maxTokens: 300, type: 'sentiment' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

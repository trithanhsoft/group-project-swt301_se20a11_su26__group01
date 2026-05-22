import { callOpenAI, MENU_DATA } from './aiService';

/**
 * Gợi ý món + combo dựa trên sở thích / lịch sử
 */
export async function getRecommendations(preferences = {}) {
  const { liked = [], disliked = [], guests = 1, budget = null } = preferences;

  const prompt = `Bạn là AI gợi ý món ăn cho nhà hàng Việt Nam.
Menu hiện có: ${JSON.stringify(MENU_DATA.map(d => ({ id: d.id, name: d.name, price: d.price, tags: d.tags, rating: d.rating })))}

Thông tin khách:
- Đã thích: ${liked.join(', ') || 'chưa có'}
- Không thích: ${disliked.join(', ') || 'chưa có'}
- Số người: ${guests}
- Ngân sách: ${budget ? budget.toLocaleString('vi-VN') + 'đ' : 'không giới hạn'}

Trả về JSON với format:
{
  "dishes": [{"id": number, "name": string, "reason": string}],
  "combo": string,
  "comboPrice": number,
  "comboSaving": number
}
Chỉ trả JSON, không giải thích thêm.`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.6, maxTokens: 400, type: 'recommend' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

/**
 * Smart search — tìm món theo mô tả tự nhiên
 */
export async function smartSearch(query) {
  const prompt = `Từ danh sách món: ${JSON.stringify(MENU_DATA.map(d => ({ id: d.id, name: d.name, tags: d.tags, category: d.category })))}
Người dùng tìm: "${query}"
Trả về mảng JSON các id món phù hợp nhất (tối đa 4): [1, 2, 3]
Chỉ trả mảng số, không giải thích.`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.3, maxTokens: 50, type: 'recommend' }
  );

  try {
    const ids = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return MENU_DATA.filter(d => ids.includes(d.id));
  } catch {
    return [];
  }
}

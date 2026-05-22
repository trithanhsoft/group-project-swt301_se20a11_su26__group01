import { callOpenAI, MENU_DATA, TABLE_DATA } from './aiService';

/**
 * AI dự đoán doanh thu
 */
export async function predictRevenue(historicalData) {
  const prompt = `Bạn là AI phân tích kinh doanh nhà hàng.
Dữ liệu doanh thu 6 tháng qua (VNĐ): ${JSON.stringify(historicalData)}
Menu phổ biến: ${MENU_DATA.sort((a,b) => b.orders - a.orders).slice(0,3).map(d => d.name).join(', ')}

Dự đoán 3 tháng tới. Trả về JSON:
{
  "prediction": [{"month": string, "predicted": number, "confidence": number}],
  "trend": string,
  "topFactors": [string]
}`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.4, maxTokens: 400, type: 'revenue' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

/**
 * AI đề xuất bàn phù hợp cho staff
 */
export async function recommendTable(guests, preference = '') {
  const available = TABLE_DATA.filter(t => t.status === 'empty');
  const prompt = `Đề xuất bàn phù hợp cho ${guests} người.
Bàn trống: ${JSON.stringify(available)}
Yêu cầu thêm: "${preference}"
Trả về JSON: {"recommended": [{"id": number, "name": string, "reason": string}]}`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.4, maxTokens: 200, type: 'table' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

/**
 * AI sắp xếp thứ tự chế biến + dự đoán thời gian
 */
export async function optimizeKitchenQueue(orders) {
  const prompt = `Bạn là AI quản lý bếp nhà hàng.
Danh sách order đang chờ: ${JSON.stringify(orders)}
Menu: ${JSON.stringify(MENU_DATA.map(d => ({ name: d.name, category: d.category })))}

Sắp xếp thứ tự ưu tiên và dự đoán thời gian. Trả về JSON:
{
  "priority": [{"orderId": string, "reason": string, "urgency": "high|medium|low"}],
  "estimatedTimes": {"orderId": "X phút"},
  "warnings": [string]
}`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.3, maxTokens: 400, type: 'kitchen' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

/**
 * AI phân tích hành vi khách hàng
 */
export async function analyzeCustomerBehavior(orderHistory) {
  const prompt = `Phân tích hành vi khách hàng từ lịch sử đơn hàng:
${JSON.stringify(orderHistory)}

Trả về JSON:
{
  "peakHours": [string],
  "popularCombos": [string],
  "avgOrderValue": number,
  "loyaltyInsight": string,
  "recommendations": [string]
}`;

  const raw = await callOpenAI(
    [{ role: 'user', content: prompt }],
    { temperature: 0.5, maxTokens: 400, type: 'revenue' }
  );

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}

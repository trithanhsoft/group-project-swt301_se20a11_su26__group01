/**
 * Core AI Service - OpenAI GPT-4o
 * Tất cả AI features đều đi qua đây
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

// Menu data dùng làm context cho AI
export const MENU_DATA = [
  { id: 1,  name: 'Súp bào ngư vi cá',       category: 'Khai vị',     price: 185000, tags: ['hải sản', 'súp', 'cao cấp', 'thanh đạm'], rating: 4.9, orders: 87 },
  { id: 2,  name: 'Gỏi tôm hùm xoài xanh',   category: 'Khai vị',     price: 220000, tags: ['tôm hùm', 'gỏi', 'chua ngọt', 'tươi mát'], rating: 4.8, orders: 64 },
  { id: 3,  name: 'Chả giò hải sản',          category: 'Khai vị',     price: 120000, tags: ['chiên', 'giòn', 'hải sản', 'tôm mực'], rating: 4.7, orders: 102 },
  { id: 4,  name: 'Bò Wagyu nướng than hoa',  category: 'Món chính',   price: 580000, tags: ['bò', 'nướng', 'wagyu', 'cao cấp', 'thịt'], rating: 5.0, orders: 143 },
  { id: 5,  name: 'Tôm hùm hấp bia',          category: 'Món chính',   price: 750000, tags: ['tôm hùm', 'hải sản', 'hấp', 'cao cấp'], rating: 4.9, orders: 98 },
  { id: 6,  name: 'Cá hồi áp chảo sốt chanh', category: 'Món chính',  price: 320000, tags: ['cá hồi', 'áp chảo', 'hải sản', 'chanh bơ'], rating: 4.8, orders: 176 },
  { id: 7,  name: 'Vịt quay Bắc Kinh',        category: 'Món chính',   price: 420000, tags: ['vịt', 'quay', 'giòn', 'truyền thống'], rating: 4.7, orders: 89 },
  { id: 8,  name: 'Sườn bò hầm rượu vang',    category: 'Món chính',   price: 380000, tags: ['bò', 'hầm', 'rượu vang', 'mềm'], rating: 4.9, orders: 121 },
  { id: 9,  name: 'Khoai tây nghiền truffle',  category: 'Món phụ',     price: 95000,  tags: ['khoai tây', 'truffle', 'bơ', 'mềm mịn'], rating: 4.6, orders: 54 },
  { id: 10, name: 'Rau củ nướng thảo mộc',    category: 'Món phụ',     price: 85000,  tags: ['rau củ', 'nướng', 'healthy', 'thảo mộc'], rating: 4.5, orders: 43 },
  { id: 11, name: 'Bánh soufflé socola',       category: 'Tráng miệng', price: 125000, tags: ['socola', 'bánh', 'nóng', 'ngọt'], rating: 4.9, orders: 167 },
  { id: 12, name: 'Crème brûlée vani',         category: 'Tráng miệng', price: 95000,  tags: ['kem', 'vani', 'caramel', 'Pháp'], rating: 4.8, orders: 134 },
  { id: 13, name: 'Bánh tart chanh leo',       category: 'Tráng miệng', price: 85000,  tags: ['tart', 'chanh leo', 'chua ngọt'], rating: 4.7, orders: 98 },
  { id: 14, name: 'Rượu vang đỏ Pháp',        category: 'Đồ uống',     price: 280000, tags: ['rượu vang', 'Pháp', 'đỏ', 'cao cấp'], rating: 4.8, orders: 76 },
  { id: 15, name: 'Cocktail Signature',        category: 'Đồ uống',     price: 145000, tags: ['cocktail', 'gin', 'đặc trưng', 'pha chế'], rating: 4.9, orders: 112 },
  { id: 16, name: 'Trà thảo mộc hữu cơ',      category: 'Đồ uống',     price: 65000,  tags: ['trà', 'thảo mộc', 'hữu cơ', 'ấm'], rating: 4.6, orders: 88 },
  { id: 17, name: 'Nước ép lựu tươi',         category: 'Đồ uống',     price: 85000,  tags: ['nước ép', 'lựu', 'tươi', 'healthy'], rating: 4.7, orders: 65 },
];

export const TABLE_DATA = [
  { id: 1, name: 'Bàn 1', capacity: 2, status: 'empty' },
  { id: 2, name: 'Bàn 2', capacity: 4, status: 'occupied' },
  { id: 3, name: 'Bàn 3', capacity: 4, status: 'occupied' },
  { id: 4, name: 'Bàn 4', capacity: 6, status: 'reserved' },
  { id: 5, name: 'Bàn 5', capacity: 2, status: 'empty' },
  { id: 6, name: 'Bàn 6', capacity: 4, status: 'occupied' },
  { id: 7, name: 'Bàn 7', capacity: 8, status: 'empty' },
  { id: 8, name: 'Bàn 8', capacity: 6, status: 'occupied' },
];

/**
 * Gọi OpenAI API
 */
export async function callOpenAI(messages, options = {}) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    // Mock response khi chưa có API key
    return getMockResponse(messages, options);
  }

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
      ...options.extra,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'OpenAI API error');
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/**
 * Mock responses khi chưa có API key (demo mode)
 */
function getMockResponse(messages, options) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const type = options.type || 'chat';

  const mocks = {
    recommend: JSON.stringify({
      dishes: [
        { id: 1, name: 'Phở bò', reason: 'Món bán chạy nhất, phù hợp mọi khẩu vị' },
        { id: 4, name: 'Gỏi cuốn', reason: 'Khai vị nhẹ nhàng, tươi mát' },
        { id: 7, name: 'Trà đá', reason: 'Đồ uống phổ biến đi kèm' },
      ],
      combo: 'Phở bò + Gỏi cuốn + Trà đá',
      comboPrice: 110000,
      comboSaving: 10000,
    }),
    sentiment: JSON.stringify({ score: 0.85, label: 'positive', summary: 'Khách hàng hài lòng với chất lượng món ăn và dịch vụ' }),
    revenue: JSON.stringify({
      prediction: [
        { month: 'T7/2026', predicted: 145000000, confidence: 0.87 },
        { month: 'T8/2026', predicted: 158000000, confidence: 0.82 },
        { month: 'T9/2026', predicted: 162000000, confidence: 0.78 },
      ],
      trend: 'Doanh thu có xu hướng tăng 8-12% mỗi tháng',
      topFactors: ['Cuối tuần tăng 40%', 'Tháng 8 mùa du lịch', 'Món mới thu hút khách'],
    }),
    table: JSON.stringify({
      recommended: [
        { id: 7, name: 'Bàn 7', reason: 'Bàn 8 chỗ phù hợp nhóm lớn, gần cửa sổ' },
        { id: 1, name: 'Bàn 1', reason: 'Bàn 2 chỗ yên tĩnh, phù hợp cặp đôi' },
      ],
    }),
    kitchen: JSON.stringify({
      priority: [
        { orderId: '#S013', reason: 'Đợi lâu nhất (12 phút)', urgency: 'high' },
        { orderId: '#S016', reason: 'Có món đang nấu dở', urgency: 'medium' },
      ],
      estimatedTimes: { '#S013': '8 phút', '#S016': '5 phút', '#S017': '12 phút' },
      warnings: ['Nguyên liệu phở bò còn ít, đủ cho ~5 tô'],
    }),
  };

  // Chat responses
  if (type === 'chat') {
    // Hỏi về bàn theo số người
    const guestMatch = lastMsg.match(/(\d+)\s*(người|khách|chỗ)/);
    if (guestMatch) {
      const n = parseInt(guestMatch[1]);
      const MAX_CAPACITY = Math.max(...TABLE_DATA.map(t => t.capacity)); // 8
      if (n > MAX_CAPACITY) {
        return `Hiện tại bàn lớn nhất của nhà hàng chỉ có **${MAX_CAPACITY} chỗ**. Với **${n} người**, bạn cần ghép nhiều bàn — vui lòng gọi **028-xxxx-xxxx** để nhân viên hỗ trợ sắp xếp! 🙏`;
      }
      const suitable = TABLE_DATA.filter(t => t.status === 'empty' && t.capacity >= n);
      if (suitable.length > 0) {
        return `Có **${suitable.length} bàn trống** phù hợp cho **${n} người**: ${suitable.map(t => `${t.name} (${t.capacity} chỗ)`).join(', ')}. Bạn muốn đặt bàn nào không? 😊`;
      } else {
        return `Hiện không có bàn trống đủ **${n} chỗ**. Bạn có thể đặt trước tại trang Đặt bàn hoặc gọi **028-xxxx-xxxx**! 📅`;
      }
    }

    // Hỏi bàn trống chung
    if (lastMsg.includes('bàn') && (lastMsg.includes('trống') || lastMsg.includes('còn') || lastMsg.includes('có không') || lastMsg.includes('available'))) {
      const empty = TABLE_DATA.filter(t => t.status === 'empty');
      if (empty.length > 0) {
        return `Hiện tại nhà hàng có **${empty.length} bàn trống**: ${empty.map(t => `${t.name} (${t.capacity} người)`).join(', ')}. Bạn muốn đặt bàn không? 😊`;
      }
      return 'Hiện tại tất cả các bàn đều đang có khách. Bạn có muốn đặt bàn trước không? 📅';
    }

    // Gợi ý món
    if (lastMsg.includes('gợi ý') || lastMsg.includes('món gì') || lastMsg.includes('ăn gì') || lastMsg.includes('nên ăn')) {
      return 'Tôi gợi ý bạn thử **Phở bò** — món bán chạy nhất của chúng tôi! Nước dùng đậm đà, thịt bò tươi. Kết hợp với **Gỏi cuốn** khai vị và **Trà đá** sẽ rất tuyệt 🍜\n\nHoặc nếu bạn thích cơm, **Cơm tấm sườn** cũng rất được yêu thích!';
    }

    // Combo
    if (lastMsg.includes('combo') || lastMsg.includes('tiết kiệm') || lastMsg.includes('set')) {
      return '🎁 **Combo gợi ý:**\n- Phở bò + Gỏi cuốn + Trà đá = **110.000đ** (tiết kiệm 10.000đ)\n- Cơm tấm + Nước cam + Chè ba màu = **110.000đ** (tiết kiệm 5.000đ)\n\nBạn muốn thêm combo nào vào giỏ hàng không?';
    }

    // Giá
    if (lastMsg.includes('giá') || lastMsg.includes('bao nhiêu') || lastMsg.includes('menu')) {
      return 'Thực đơn của chúng tôi:\n- **Món chính**: 55.000 - 65.000đ\n- **Khai vị**: 35.000 - 40.000đ\n- **Tráng miệng**: 25.000đ\n- **Đồ uống**: 10.000 - 30.000đ\n\nBạn muốn xem chi tiết món nào không?';
    }

    // Giờ mở cửa / địa chỉ
    if (lastMsg.includes('giờ') || lastMsg.includes('mở cửa') || lastMsg.includes('đóng cửa')) {
      return 'Nhà hàng mở cửa từ **10:00 - 22:00** tất cả các ngày trong tuần. Bạn có muốn đặt bàn trước không? 📅';
    }
    if (lastMsg.includes('địa chỉ') || lastMsg.includes('ở đâu') || lastMsg.includes('chỗ nào')) {
      return '📍 Nhà hàng tại **123 Đường ABC, Quận 1, TP.HCM**\n📞 Hotline: **028-xxxx-xxxx**\n🕐 Mở cửa: **10:00 - 22:00**';
    }

    // Đặt bàn
    if (lastMsg.includes('đặt bàn') || lastMsg.includes('book') || lastMsg.includes('reservation')) {
      return 'Bạn có thể đặt bàn trực tiếp tại trang **Đặt bàn** trên menu. Chọn ngày, giờ và số người là xong! 📅\n\nHoặc gọi **028-xxxx-xxxx** để đặt qua điện thoại.';
    }

    // Cảm ơn / tạm biệt
    if (lastMsg.includes('cảm ơn') || lastMsg.includes('thanks') || lastMsg.includes('thank')) {
      return 'Không có gì! Chúc bạn ngon miệng 😊🍜 Nếu cần thêm gì cứ hỏi tôi nhé!';
    }
    if (lastMsg.includes('tạm biệt') || lastMsg.includes('bye') || lastMsg.includes('goodbye')) {
      return 'Tạm biệt! Hẹn gặp lại bạn tại nhà hàng 👋😊';
    }

    // Default greeting
    return 'Xin chào! Tôi là trợ lý AI của nhà hàng. Tôi có thể giúp bạn:\n- 🍜 Gợi ý món ăn\n- 🪑 Kiểm tra bàn trống\n- 📅 Hỗ trợ đặt bàn\n- 💰 Tư vấn combo tiết kiệm\n\nBạn cần gì ạ?';
  }

  return mocks[type] || '{}';
}

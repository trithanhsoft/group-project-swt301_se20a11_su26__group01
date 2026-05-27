/**
 * Nguồn dữ liệu menu dùng chung toàn app
 * Import từ đây thay vì hardcode ở từng file
 */

export const MENU_ITEMS = [
  { id: 1,  name: 'Súp bào ngư vi cá',        category: 'Khai vị',     price: 185000, img: '🍲', desc: 'Súp bào ngư hầm vi cá thượng hạng, thanh ngọt tự nhiên',          rating: 4.9, orders: 87,  available: true },
  { id: 2,  name: 'Gỏi tôm hùm xoài xanh',    category: 'Khai vị',     price: 220000, img: '🥗', desc: 'Tôm hùm tươi trộn xoài xanh, sốt chanh dây đặc biệt',             rating: 4.8, orders: 64,  available: true },
  { id: 3,  name: 'Chả giò hải sản',           category: 'Khai vị',     price: 120000, img: '🥟', desc: 'Chả giò nhân tôm mực cua, vỏ giòn tan',                           rating: 4.7, orders: 102, available: true },
  { id: 4,  name: 'Bò Wagyu nướng than hoa',   category: 'Món chính',   price: 580000, img: '🥩', desc: 'Bò Wagyu A5 nướng than hoa, sốt tiêu đen Kampot',                  rating: 5.0, orders: 143, available: true },
  { id: 5,  name: 'Tôm hùm hấp bia',           category: 'Món chính',   price: 750000, img: '🦞', desc: 'Tôm hùm Canada hấp bia tươi, bơ tỏi thơm lừng',                   rating: 4.9, orders: 98,  available: true },
  { id: 6,  name: 'Cá hồi áp chảo sốt chanh',  category: 'Món chính',   price: 320000, img: '🐟', desc: 'Cá hồi Na Uy áp chảo vàng giòn, sốt chanh bơ thảo mộc',           rating: 4.8, orders: 176, available: true },
  { id: 7,  name: 'Vịt quay Bắc Kinh',         category: 'Món chính',   price: 420000, img: '🦆', desc: 'Vịt quay da giòn rụm, ăn kèm bánh mỏng và tương hoisin',           rating: 4.7, orders: 89,  available: true },
  { id: 8,  name: 'Sườn bò hầm rượu vang',     category: 'Món chính',   price: 380000, img: '🍖', desc: 'Short rib hầm rượu vang đỏ 6 tiếng, mềm tan trong miệng',          rating: 4.9, orders: 121, available: true },
  { id: 9,  name: 'Khoai tây nghiền truffle',   category: 'Món phụ',     price: 95000,  img: '🥔', desc: 'Khoai tây nghiền mịn với bơ và dầu truffle đen',                   rating: 4.6, orders: 54,  available: true },
  { id: 10, name: 'Rau củ nướng thảo mộc',     category: 'Món phụ',     price: 85000,  img: '🥦', desc: 'Hỗn hợp rau củ theo mùa nướng với thảo mộc Địa Trung Hải',        rating: 4.5, orders: 43,  available: true },
  { id: 11, name: 'Bánh soufflé socola',        category: 'Tráng miệng', price: 125000, img: '🍫', desc: 'Soufflé socola nóng chảy bên trong, kem vani Bourbon',              rating: 4.9, orders: 167, available: true },
  { id: 12, name: 'Crème brûlée vani',          category: 'Tráng miệng', price: 95000,  img: '🍮', desc: 'Kem trứng vani Madagascar, lớp caramel giòn tan',                   rating: 4.8, orders: 134, available: true },
  { id: 13, name: 'Bánh tart chanh leo',        category: 'Tráng miệng', price: 85000,  img: '🍋', desc: 'Tart chanh leo chua ngọt cân bằng, meringue nướng nhẹ',             rating: 4.7, orders: 98,  available: true },
  { id: 14, name: 'Rượu vang đỏ Pháp',         category: 'Đồ uống',     price: 280000, img: '🍷', desc: 'Bordeaux AOC, tanin mềm mại, hậu vị dài',                          rating: 4.8, orders: 76,  available: true },
  { id: 15, name: 'Cocktail Signature',         category: 'Đồ uống',     price: 145000, img: '🍹', desc: 'Cocktail đặc trưng với gin, elderflower và chanh',                  rating: 4.9, orders: 112, available: true },
  { id: 16, name: 'Trà thảo mộc hữu cơ',       category: 'Đồ uống',     price: 65000,  img: '🍵', desc: 'Blend trà thảo mộc hữu cơ nhập khẩu, phục vụ ấm',                  rating: 4.6, orders: 88,  available: true },
  { id: 17, name: 'Nước ép lựu tươi',          category: 'Đồ uống',     price: 85000,  img: '🍎', desc: 'Nước ép lựu tươi nguyên chất, giàu antioxidant',                   rating: 4.7, orders: 65,  available: true },
];

export const MENU_CATEGORIES = ['Tất cả', 'Khai vị', 'Món chính', 'Món phụ', 'Tráng miệng', 'Đồ uống'];

export const TOP_DISHES = [...MENU_ITEMS]
  .sort((a, b) => b.orders - a.orders)
  .slice(0, 5)
  .map(d => ({ name: d.name, orders: d.orders }));

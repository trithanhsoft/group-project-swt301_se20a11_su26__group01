import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DISHES = [
  { img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', name: 'Bò Wagyu nướng than hoa',  price: '580.000đ', cat: 'Món chính' },
  { img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', name: 'Tôm hùm hấp bia',          price: '750.000đ', cat: 'Món chính' },
  { img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', name: 'Cá hồi áp chảo sốt chanh', price: '320.000đ', cat: 'Món chính' },
  { img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', name: 'Súp bào ngư vi cá',         price: '185.000đ', cat: 'Khai vị'   },
  { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', name: 'Bánh soufflé socola',      price: '125.000đ', cat: 'Tráng miệng' },
  { img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', name: 'Rượu vang đỏ Pháp',       price: '280.000đ', cat: 'Đồ uống'  },
];

const REVIEWS = [
  { name: 'Nguyễn Văn An', stars: 5, text: 'Bò Wagyu tuyệt vời, chín vừa, mềm tan trong miệng. Không gian sang trọng, nhân viên nhiệt tình.' },
  { name: 'Trần Thị Bích',  stars: 5, text: 'Trải nghiệm ẩm thực đẳng cấp nhất tôi từng có tại TP.Đà Nẵng. Sẽ quay lại và giới thiệu bạn bè.' },
  { name: 'Lê Minh Khoa',   stars: 5, text: 'Không gian đẹp, món ăn ngon, dịch vụ hoàn hảo. Xứng đáng với từng đồng bỏ ra.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <div className="bg-[#0d0d1a] text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-[#0d0d1a]/95 backdrop-blur shadow-lg' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <span className="text-2xl">🍜</span>
            <span className="font-extrabold text-white">F Restaurant</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[['about','Về chúng tôi'],['menu-section','Thực đơn'],['reviews','Đánh giá'],['contact','Liên hệ']].map(([id,l]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm text-gray-300 hover:text-[#e85d04] transition-colors">{l}</button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-white px-4 py-2 rounded-full transition-colors">Đăng nhập</button>
            <button onClick={() => navigate('/register')} className="text-sm bg-[#e85d04] hover:bg-[#c44d00] text-white font-semibold px-4 py-2 rounded-full transition-colors">Đặt bàn ngay</button>
          </div>
          <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#0d0d1a] border-t border-gray-800 px-4 py-4 flex flex-col gap-3">
            {[['about','Về chúng tôi'],['menu-section','Thực đơn'],['reviews','Đánh giá'],['contact','Liên hệ']].map(([id,l]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm text-gray-300 text-left">{l}</button>
            ))}
            <hr className="border-gray-700" />
            <button onClick={() => navigate('/login')} className="text-sm text-gray-300 text-left">Đăng nhập</button>
            <button onClick={() => navigate('/register')} className="text-sm text-[#e85d04] font-semibold text-left">Đặt bàn ngay</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e85d04]/5 via-transparent to-transparent"></div>
        <div className="text-center px-4 relative">
          <div className="inline-block bg-[#e85d04]/10 border border-[#e85d04]/30 text-[#e85d04] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            ✦ Fine Dining · Est. 2026 ✦
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            F<br />
            <span className="text-[#e85d04]">Restaurant</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Trải nghiệm ẩm thực đẳng cấp với những món ăn tinh tế nhất,<br />
            không gian sang trọng và đội ngũ phục vụ tận tâm tại TP.Đà Nẵng.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/register')} className="bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold px-8 py-3.5 rounded-full text-sm transition-colors shadow-lg shadow-[#e85d04]/30">📅 Đặt bàn ngay</button>
            <button onClick={() => scrollTo('menu-section')} className="border border-gray-600 hover:border-white text-gray-300 hover:text-white font-bold px-8 py-3.5 rounded-full text-sm transition-colors">🍽️ Xem thực đơn</button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12">
            {[['500+','Món ăn'],['4.9★','Đánh giá'],['10K+','Khách hàng']].map(([num,label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{num}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => scrollTo('about')} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white animate-bounce">↓</button>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#e85d04] text-sm font-semibold mb-3">✦ Câu chuyện của chúng tôi ✦</div>
          <h2 className="text-4xl font-extrabold mb-4">Nghệ thuật ẩm thực<br /><span className="text-[#e85d04]">đỉnh cao</span></h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Được thành lập năm 2026, <strong className="text-white">F Restaurant</strong> là điểm đến ẩm thực
            cao cấp tại TP.Đà Nẵng. Chúng tôi kết hợp tinh hoa ẩm thực Á-Âu,
            mang đến những trải nghiệm vị giác độc đáo và không thể quên.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon:'👨‍🍳', title:'Đầu bếp 5 sao', desc:'Đội ngũ đầu bếp được đào tạo tại Pháp và Nhật Bản' },
              { icon:'🌿', title:'Nguyên liệu tươi', desc:'Nhập khẩu trực tiếp từ các trang trại hữu cơ hàng đầu' },
              { icon:'🏮', title:'Không gian sang trọng', desc:'Thiết kế nội thất độc đáo, phù hợp mọi dịp đặc biệt' },
              { icon:'🍷', title:'Hầm rượu đặc biệt', desc:'Bộ sưu tập hơn 200 loại rượu vang từ khắp thế giới' },
            ].map((f,i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section id="menu-section" className="py-20 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#e85d04] text-sm font-semibold mb-3">✦ Thực đơn nổi bật ✦</div>
            <h2 className="text-4xl font-extrabold">Những món <span className="text-[#e85d04]">được yêu thích nhất</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {DISHES.map((d,i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#e85d04]/50 transition-colors">
                <div className="h-48 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div className="hidden w-full h-full bg-gray-800 items-center justify-center text-5xl">🍽️</div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#e85d04] font-semibold">{d.cat}</span>
                  <h3 className="font-bold text-white mb-2">{d.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#e85d04] font-extrabold">{d.price}</span>
                    <button onClick={() => navigate('/register')} className="text-xs bg-[#e85d04] hover:bg-[#c44d00] text-white font-semibold px-3 py-1.5 rounded-full">Đặt ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => navigate('/register')} className="bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold px-8 py-3 rounded-full text-sm">Xem toàn bộ thực đơn →</button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#e85d04] text-sm font-semibold mb-3">✦ Khách hàng nói gì ✦</div>
            <h2 className="text-4xl font-extrabold">Đánh giá <span className="text-[#e85d04]">từ thực khách</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r,i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-yellow-400 text-lg mb-3">{'★'.repeat(r.stars)}</p>
                <p className="text-gray-300 text-sm italic mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e85d04] flex items-center justify-center font-bold text-xs">{r.name.charAt(0)}</div>
                  <span className="text-sm font-semibold">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Sẵn sàng trải nghiệm?</h2>
          <p className="text-gray-400 mb-8">Đặt bàn ngay hôm nay và nhận ưu đãi đặc biệt cho lần đầu tiên</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold px-8 py-3.5 rounded-full text-sm">📅 Đặt bàn ngay</button>
            <button onClick={() => navigate('/login')} className="border border-gray-600 hover:border-white text-gray-300 hover:text-white font-bold px-8 py-3.5 rounded-full text-sm">🔑 Đăng nhập</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍜</span>
              <span className="font-extrabold">F Restaurant</span>
            </div>
            <p className="text-gray-400 text-sm">Trải nghiệm ẩm thực đẳng cấp tại TP.Đà Nẵng</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Thông tin</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📍 123 Đường ABC, Quận 1, TP.Đà Nẵng</p>
              <p>📞 028-xxxx-xxxx</p>
              <p>✉️ hello@frestuarant.vn</p>
              <p>🕐 10:00 – 22:00 hàng ngày</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Truy cập nhanh</h4>
            <div className="space-y-2">
              {[['Đăng nhập','/login'],['Đăng ký','/register']].map(([l,p]) => (
                <button key={p} onClick={() => navigate(p)} className="block text-sm text-gray-400 hover:text-[#e85d04]">{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>© 2026 F Restaurant. All rights reserved.</span>
          <span>Made with ❤️ in TP.Đà Nẵng</span>
        </div>
      </footer>
    </div>
  );
}

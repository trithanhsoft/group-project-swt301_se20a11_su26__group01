import React, { useState } from 'react';
import { MENU_ITEMS } from '../../data/menuData';
import './StaffOrders.css';

const TABLES = ['Bàn 1','Bàn 2','Bàn 3','Bàn 4','Bàn 5','Bàn 6','Bàn 7','Bàn 8'];

const initialOrders = [
  { id: '#S012', table: 'Bàn 2', waiter: 'Minh', items: [{ name: 'Bò Wagyu nướng than hoa', qty: 1, price: 580000 }, { name: 'Rượu vang đỏ Pháp', qty: 2, price: 280000 }], total: 1140000, status: 'serving', time: '18:32' },
  { id: '#S013', table: 'Bàn 3', waiter: 'Lan',  items: [{ name: 'Tôm hùm hấp bia', qty: 1, price: 750000 }, { name: 'Cocktail Signature', qty: 2, price: 145000 }], total: 1040000, status: 'pending', time: '18:40' },
  { id: '#S014', table: 'Bàn 6', waiter: 'Minh', items: [{ name: 'Cá hồi áp chảo sốt chanh', qty: 2, price: 320000 }], total: 640000, status: 'serving', time: '18:15' },
  { id: '#S015', table: 'Bàn 8', waiter: 'Hùng', items: [{ name: 'Vịt quay Bắc Kinh', qty: 1, price: 420000 }, { name: 'Bánh soufflé socola', qty: 2, price: 125000 }, { name: 'Trà thảo mộc hữu cơ', qty: 2, price: 65000 }], total: 800000, status: 'done', time: '17:50' },
];

const statusFlow = { pending: 'serving', serving: 'done' };
const statusMap = {
  pending:   { label: 'Chờ xác nhận', cls: 'status-pending' },
  serving:   { label: 'Đang phục vụ', cls: 'status-serving' },
  done:      { label: 'Hoàn thành',   cls: 'status-done' },
  cancelled: { label: 'Đã hủy',       cls: 'status-cancelled' },
};

function InvoiceModal({ order, onClose }) {
  const serviceFee = Math.round(order.total * 0.05);
  const grandTotal = order.total + serviceFee;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invoice-modal card" onClick={e => e.stopPropagation()}>
        <div className="invoice-header">
          <h2>🍜 Cái Gì Cũng Không Có</h2>
          <p>123 Đường ABC, Quận 1, TP.HCM</p>
          <p>ĐT: 028-xxxx-xxxx</p>
          <div className="invoice-divider"></div>
          <h3>HÓA ĐƠN THANH TOÁN</h3>
          <p>Mã đơn: <strong>{order.id}</strong></p>
          <p>{order.table} · {order.time} · NV: {order.waiter}</p>
        </div>
        <div className="invoice-divider"></div>
        <table className="invoice-table">
          <thead>
            <tr><th>Món</th><th>SL</th><th>Đơn giá</th><th>T.Tiền</th></tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString('vi-VN')}đ</td>
                <td>{(item.price * item.qty).toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-divider"></div>
        <div className="invoice-totals">
          <div className="inv-row"><span>Tạm tính</span><span>{order.total.toLocaleString('vi-VN')}đ</span></div>
          <div className="inv-row"><span>Phí dịch vụ (5%)</span><span>{serviceFee.toLocaleString('vi-VN')}đ</span></div>
          <div className="inv-row inv-grand"><span>TỔNG CỘNG</span><strong>{grandTotal.toLocaleString('vi-VN')}đ</strong></div>
        </div>
        <div className="invoice-divider"></div>
        <p className="invoice-thanks">Cảm ơn quý khách! Hẹn gặp lại 🙏</p>
        <div className="invoice-actions">
          <button className="print-real-btn" onClick={() => window.print()}>🖨️ In hóa đơn</button>
          <button className="modal-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function CreateOrderModal({ onClose, onCreate }) {
  const [table, setTable]   = useState('');
  const [waiter, setWaiter] = useState('');
  const [cart, setCart]     = useState([]);
  const [catFilter, setCatFilter] = useState('Tất cả');

  const categories = ['Tất cả', ...new Set(MENU_ITEMS.map(m => m.category))];

  const filteredMenu = catFilter === 'Tất cả'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(m => m.category === catFilter);

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(c => c.id !== id));
    else setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!table || cart.length === 0) return;
    const newOrder = {
      id: `#S${Date.now().toString().slice(-3)}`,
      table, waiter,
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total,
      status: 'pending',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    onCreate(newOrder);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-order-modal card" onClick={e => e.stopPropagation()}>
        <h2>📋 Tạo đơn hàng mới</h2>
        <form onSubmit={handleCreate}>
          <div className="co-top">
            <div className="form-group">
              <label className="form-label">Bàn</label>
              <select className="form-input" value={table} onChange={e => setTable(e.target.value)} required>
                <option value="">-- Chọn bàn --</option>
                {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nhân viên</label>
              <input className="form-input" placeholder="Tên nhân viên" value={waiter}
                onChange={e => setWaiter(e.target.value)} />
            </div>
          </div>

          <div className="co-body">
            {/* Menu */}
            <div className="co-menu">
              <h4>Chọn món</h4>
              <div className="co-cats">
                {categories.map(c => (
                  <button key={c} type="button"
                    className={`co-cat-btn ${catFilter === c ? 'active' : ''}`}
                    onClick={() => setCatFilter(c)}>{c}</button>
                ))}
              </div>
              <div className="co-menu-list">
                {filteredMenu.map(item => (
                  <div key={item.id} className="co-menu-item">
                    <span className="co-item-img">{item.img}</span>
                    <div className="co-item-info">
                      <span className="co-item-name">{item.name}</span>
                      <span className="co-item-price">{item.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <button type="button" className="co-add-btn" onClick={() => addToCart(item)}>+</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="co-cart">
              <h4>Giỏ hàng {cart.length > 0 && `(${cart.length} món)`}</h4>
              {cart.length === 0
                ? <p className="co-empty">Chưa chọn món nào</p>
                : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="co-cart-item">
                        <span className="co-cart-name">{item.name}</span>
                        <div className="co-cart-qty">
                          <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                          <span>{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        </div>
                        <span className="co-cart-price">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                    <div className="co-total">
                      <span>Tổng:</span>
                      <strong>{total.toLocaleString('vi-VN')}đ</strong>
                    </div>
                  </>
                )
              }
            </div>
          </div>

          <div className="modal-btns">
            <button type="submit" className="btn-primary" disabled={!table || cart.length === 0}>
              ✅ Tạo đơn hàng
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StaffOrders() {
  const [orders, setOrders]       = useState(initialOrders);
  const [filter, setFilter]       = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showInvoice, setShowInvoice] = useState(null);

  const advance = (id) => {
    setOrders(prev => prev.map(o =>
      o.id === id && statusFlow[o.status] ? { ...o, status: statusFlow[o.status] } : o
    ));
  };

  const cancel = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="staff-orders">
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Tạo đơn mới</button>
      </div>

      <div className="filter-tabs" style={{marginBottom:16}}>
        {[['all','Tất cả'],['pending','Chờ xác nhận'],['serving','Đang phục vụ'],['done','Hoàn thành'],['cancelled','Đã hủy']].map(([v,l]) => (
          <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      <div className="staff-orders-list">
        {filtered.map(order => (
          <div key={order.id} className="staff-order-card card">
            <div className="sorder-left">
              <span className="sorder-id">{order.id}</span>
              <span className="sorder-table">🪑 {order.table}</span>
              <span className="sorder-time">🕐 {order.time}</span>
              {order.waiter && <span className="sorder-waiter">👤 {order.waiter}</span>}
            </div>
            <div className="sorder-items">
              {order.items.map((item, i) => (
                <span key={i} className="sorder-tag">
                  {item.name} × {item.qty}
                </span>
              ))}
            </div>
            <div className="sorder-right">
              <span className="sorder-total">{order.total.toLocaleString('vi-VN')}đ</span>
              <span className={`status-badge ${statusMap[order.status].cls}`}>
                {statusMap[order.status].label}
              </span>
              <div className="sorder-actions">
                {statusFlow[order.status] && (
                  <button className="advance-btn" onClick={() => advance(order.id)}>
                    {order.status === 'pending' ? '✓ Xác nhận' : '✓ Hoàn thành'}
                  </button>
                )}
                {order.status !== 'done' && order.status !== 'cancelled' && (
                  <button className="cancel-order-btn" onClick={() => cancel(order.id)}>✕</button>
                )}
                <button className="print-btn" onClick={() => setShowInvoice(order)}>🖨️ In HĐ</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateOrderModal
          onClose={() => setShowCreate(false)}
          onCreate={(order) => setOrders(prev => [order, ...prev])}
        />
      )}

      {showInvoice && (
        <InvoiceModal order={showInvoice} onClose={() => setShowInvoice(null)} />
      )}
    </div>
  );
}

export default StaffOrders;

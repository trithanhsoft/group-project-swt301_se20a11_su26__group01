import React, { useState, useEffect, useRef } from 'react';
import './KitchenQueue.css';

const initialQueue = [
  {
    id: '#S013', table: 'Bàn 3', time: '18:40', arrivedAt: Date.now() - 12 * 60000,
    items: [
      { name: 'Bò Wagyu nướng than hoa',  qty: 2, status: 'cooking' },
      { name: 'Khoai tây nghiền truffle',  qty: 2, status: 'pending' },
      { name: 'Rượu vang đỏ Pháp',        qty: 2, status: 'done' },
    ],
  },
  {
    id: '#S016', table: 'Bàn 5', time: '18:45', arrivedAt: Date.now() - 7 * 60000,
    items: [
      { name: 'Tôm hùm hấp bia',    qty: 1, status: 'cooking' },
      { name: 'Súp bào ngư vi cá',  qty: 2, status: 'pending' },
      { name: 'Cocktail Signature', qty: 2, status: 'done' },
    ],
  },
  {
    id: '#S017', table: 'Bàn 9', time: '18:52', arrivedAt: Date.now() - 3 * 60000,
    items: [
      { name: 'Cá hồi áp chảo sốt chanh', qty: 2, status: 'pending' },
      { name: 'Gỏi tôm hùm xoài xanh',    qty: 1, status: 'pending' },
      { name: 'Bánh soufflé socola',        qty: 2, status: 'pending' },
    ],
  },
];

const itemStatusMap = {
  pending: { label: 'Chờ',      cls: 'item-pending', next: 'cooking' },
  cooking: { label: 'Đang nấu', cls: 'item-cooking', next: 'done' },
  done:    { label: 'Xong',     cls: 'item-done',    next: null },
};

function elapsed(arrivedAt) {
  const mins = Math.floor((Date.now() - arrivedAt) / 60000);
  if (mins < 1) return '< 1 phút';
  return `${mins} phút`;
}

function urgencyClass(arrivedAt) {
  const mins = Math.floor((Date.now() - arrivedAt) / 60000);
  if (mins >= 20) return 'urgent-high';
  if (mins >= 10) return 'urgent-med';
  return '';
}

function KitchenQueue() {
  const [queue, setQueue]     = useState(initialQueue);
  const [done, setDone]       = useState([]);
  const [clock, setClock]     = useState(new Date());
  const [filter, setFilter]   = useState('all'); // all | pending | cooking | done
  const [tick, setTick]       = useState(0);     // force re-render mỗi giây để cập nhật elapsed
  const alertRef              = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      setTick(n => n + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Cập nhật trạng thái từng món
  const advanceItem = (orderId, itemIdx) => {
    setQueue(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const items = order.items.map((item, i) => {
        if (i !== itemIdx || !itemStatusMap[item.status].next) return item;
        return { ...item, status: itemStatusMap[item.status].next };
      });
      return { ...order, items };
    }));
  };

  // Mark toàn bộ order là xong → chuyển sang history
  const completeOrder = (orderId) => {
    const order = queue.find(o => o.id === orderId);
    if (!order) return;
    setDone(prev => [{ ...order, completedAt: new Date().toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' }) }, ...prev]);
    setQueue(prev => prev.filter(o => o.id !== orderId));
  };

  const allDone = (order) => order.items.every(i => i.status === 'done');

  // Filter
  const filteredQueue = queue.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.items.some(i => i.status === 'pending');
    if (filter === 'cooking') return order.items.some(i => i.status === 'cooking');
    if (filter === 'done')    return allDone(order);
    return true;
  });

  const cookingCount = queue.filter(o => o.items.some(i => i.status === 'cooking')).length;
  const pendingCount = queue.filter(o => o.items.some(i => i.status === 'pending')).length;

  return (
    <div className="kitchen-queue">
      {/* Header */}
      <div className="kitchen-topbar">
        <div className="kitchen-clock">
          🕐 {clock.toLocaleTimeString('vi-VN')}
        </div>
        <div className="kitchen-summary">
          <span className="ks-badge ks-total">{queue.length} đơn</span>
          <span className="ks-badge ks-cooking">🔥 {cookingCount} đang nấu</span>
          <span className="ks-badge ks-pending">⏳ {pendingCount} chờ</span>
          <span className="ks-badge ks-done">✅ {done.length} hoàn thành</span>
        </div>
      </div>

      {/* Filter */}
      <div className="kitchen-filters">
        {[['all','Tất cả'],['pending','Chờ nấu'],['cooking','Đang nấu'],['done','Sẵn sàng']].map(([v,l]) => (
          <button key={v} className={`kfilter-btn ${filter === v ? 'active' : ''}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {/* Order cards */}
      <div className="kitchen-cards">
        {filteredQueue.length === 0 && (
          <div className="kitchen-empty">
            <p>🎉 Không có đơn nào đang chờ</p>
          </div>
        )}
        {filteredQueue.map(order => {
          const urgent = urgencyClass(order.arrivedAt);
          const ready  = allDone(order);
          return (
            <div key={order.id} className={`kitchen-card ${ready ? 'all-done' : ''} ${urgent}`}>
              <div className="kcard-header">
                <div className="kcard-left">
                  <span className="kcard-id">{order.id}</span>
                  <span className="kcard-table">🪑 {order.table}</span>
                </div>
                <div className="kcard-right">
                  <span className="kcard-time">⏱ {order.time}</span>
                  <span className={`kcard-elapsed ${urgent}`}>
                    {elapsed(order.arrivedAt)}
                    {urgent === 'urgent-high' && ' ⚠️'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="kcard-items">
                {order.items.map((item, i) => (
                  <div key={i} className={`kcard-item ${itemStatusMap[item.status].cls}`}>
                    <div className="kitem-info">
                      <span className="kitem-name">{item.name}</span>
                      <span className="kitem-qty">× {item.qty}</span>
                    </div>
                    <div className="kitem-right">
                      <span className="kitem-status-label">{itemStatusMap[item.status].label}</span>
                      {itemStatusMap[item.status].next && (
                        <button className="kitem-btn" onClick={() => advanceItem(order.id, i)}>
                          {item.status === 'pending' ? '🔥 Bắt đầu' : '✓ Xong'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {ready ? (
                <div className="kcard-ready">
                  <span>✅ Tất cả món sẵn sàng!</span>
                  <button className="kcard-serve-btn" onClick={() => completeOrder(order.id)}>
                    🚀 Đã phục vụ
                  </button>
                </div>
              ) : (
                <div className="kcard-progress">
                  <div className="kprog-bar">
                    <div className="kprog-fill" style={{
                      width: `${Math.round(order.items.filter(i => i.status === 'done').length / order.items.length * 100)}%`
                    }}></div>
                  </div>
                  <span className="kprog-text">
                    {order.items.filter(i => i.status === 'done').length}/{order.items.length} món xong
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completed today */}
      {done.length > 0 && (
        <div className="kitchen-done-section">
          <h3 className="done-title">✅ Đã hoàn thành hôm nay ({done.length})</h3>
          <div className="done-list">
            {done.map((order, i) => (
              <div key={i} className="done-card">
                <span className="done-id">{order.id}</span>
                <span className="done-table">🪑 {order.table}</span>
                <span className="done-items">{order.items.length} món</span>
                <span className="done-time">✅ {order.completedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KitchenQueue;

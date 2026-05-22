import React from 'react';
import './KitchenHistory.css';

const history = [
  { id: '#S012', table: 'Bàn 2', completedAt: '18:35', items: ['Vịt quay Bắc Kinh x1', 'Crème brûlée vani x2', 'Rượu vang đỏ Pháp x1'] },
  { id: '#S011', table: 'Bàn 7', completedAt: '18:20', items: ['Sườn bò hầm rượu vang x2', 'Rau củ nướng thảo mộc x1', 'Trà thảo mộc hữu cơ x2'] },
  { id: '#S010', table: 'Bàn 4', completedAt: '18:05', items: ['Chả giò hải sản x2', 'Cá hồi áp chảo sốt chanh x2', 'Bánh tart chanh leo x2'] },
];

function KitchenHistory() {
  return (
    <div className="kitchen-history">
      <h1 className="kitchen-history-title">Đơn đã hoàn thành hôm nay</h1>
      <div className="history-list">
        {history.map(order => (
          <div key={order.id} className="history-card">
            <div className="history-header">
              <span className="history-id">{order.id}</span>
              <span className="history-table">🪑 {order.table}</span>
              <span className="history-time">✅ {order.completedAt}</span>
            </div>
            <div className="history-items">
              {order.items.map((item, i) => <span key={i} className="history-tag">{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KitchenHistory;

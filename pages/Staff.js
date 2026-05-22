import React from 'react';
import './Staff.css';

const staffList = [
  { id: 1, name: 'Nguyễn Văn Minh', role: 'Phục vụ', shift: 'Ca sáng', phone: '090x-xxx-xxx', status: 'working' },
  { id: 2, name: 'Trần Thị Lan',    role: 'Phục vụ', shift: 'Ca chiều', phone: '091x-xxx-xxx', status: 'working' },
  { id: 3, name: 'Lê Văn Hùng',     role: 'Bếp trưởng', shift: 'Ca sáng', phone: '093x-xxx-xxx', status: 'working' },
  { id: 4, name: 'Phạm Thị Mai',    role: 'Thu ngân', shift: 'Ca chiều', phone: '094x-xxx-xxx', status: 'off' },
  { id: 5, name: 'Hoàng Văn Nam',   role: 'Phụ bếp', shift: 'Ca tối', phone: '096x-xxx-xxx', status: 'working' },
];

const roleColors = {
  'Phục vụ': '#e6f4ff',
  'Bếp trưởng': '#fff0e6',
  'Thu ngân': '#e6fff0',
  'Phụ bếp': '#fff6e6',
};

function Staff() {
  return (
    <div className="staff-page">
      <div className="page-header">
        <h1 className="page-title">Nhân viên</h1>
        <button className="btn-primary">+ Thêm nhân viên</button>
      </div>

      <div className="staff-grid">
        {staffList.map(staff => (
          <div key={staff.id} className="staff-card card">
            <div className="staff-avatar">{staff.name.charAt(0)}</div>
            <div className="staff-info">
              <h3 className="staff-name">{staff.name}</h3>
              <span className="staff-role" style={{ background: roleColors[staff.role] || '#f0f0f0' }}>
                {staff.role}
              </span>
              <p className="staff-detail">🕐 {staff.shift}</p>
              <p className="staff-detail">📞 {staff.phone}</p>
            </div>
            <span className={`staff-status ${staff.status === 'working' ? 'status-working' : 'status-off'}`}>
              {staff.status === 'working' ? '● Đang làm' : '○ Nghỉ'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Staff;

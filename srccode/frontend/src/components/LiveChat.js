import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './LiveChat.css';

// Mock messages — thực tế dùng WebSocket/Firebase
const INITIAL_MESSAGES = [
  { id: 1, from: 'staff', name: 'Nhân viên', text: 'Xin chào! Chúng tôi có thể giúp gì cho bạn? 😊', time: '18:30' },
];

function LiveChat() {
  const { user } = useAuth();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]     = useState('');
  const [unread, setUnread]   = useState(1);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  // Giả lập staff reply sau 1.5s
  const mockReply = (userMsg) => {
    const replies = [
      'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ hỗ trợ ngay.',
      'Bạn vui lòng cho biết thêm chi tiết nhé?',
      'Nhân viên của chúng tôi sẽ đến bàn bạn ngay!',
      'Dạ, chúng tôi đã ghi nhận yêu cầu của bạn 🙏',
    ];
    const text = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        from: 'staff', name: 'Nhân viên',
        text,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }]);
      if (!open) setUnread(n => n + 1);
    }, 1500);
  };

  const send = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      from: 'customer',
      name: user?.name || 'Bạn',
      text: input.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    mockReply(msg.text);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* FAB */}
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
        {!open && unread > 0 && <span className="chat-unread">{unread}</span>}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-staff-avatar">👨‍💼</div>
              <div>
                <p className="chat-title">Hỗ trợ trực tuyến</p>
                <p className="chat-online">● Đang trực tuyến</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.from}`}>
                {msg.from === 'staff' && <div className="msg-av">👨‍💼</div>}
                <div className="msg-content">
                  <div className="msg-bubble">{msg.text}</div>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="chat-send" onClick={send} disabled={!input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveChat;

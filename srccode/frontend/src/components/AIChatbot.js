import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/chatbotAI';
import { useNavigate } from 'react-router-dom';
import './AIChatbot.css';

const QUICK_ACTIONS = [
  { label: '🍜 Gợi ý món', msg: 'Bạn gợi ý tôi ăn gì hôm nay?' },
  { label: '🪑 Bàn trống', msg: 'Hiện tại còn bàn trống không?' },
  { label: '💰 Combo tiết kiệm', msg: 'Có combo nào tiết kiệm không?' },
  { label: '🕐 Giờ mở cửa', msg: 'Nhà hàng mở cửa mấy giờ?' },
];

function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! 👋 Tôi là trợ lý AI của nhà hàng. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await sendChatMessage(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau! 🙏'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Parse markdown bold **text**
  const formatMsg = (text) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
    );

  return (
    <>
      {/* Floating button */}
      <button className={`chatbot-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        {open ? '✕' : '🤖'}
        {!open && <span className="fab-label">AI Hỗ trợ</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <p className="chatbot-name">AI Assistant</p>
              <p className="chatbot-status">● Đang hoạt động</p>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === 'assistant' && <div className="msg-avatar">🤖</div>}
                <div className="msg-bubble">
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j}>{formatMsg(line)}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="msg-avatar">🤖</div>
                <div className="msg-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 2 && (
            <div className="quick-actions">
              {QUICK_ACTIONS.map((a, i) => (
                <button key={i} className="quick-btn" onClick={() => send(a.msg)}>
                  {a.label}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button className="chatbot-send" onClick={() => send()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;

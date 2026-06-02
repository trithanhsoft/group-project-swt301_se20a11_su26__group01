import React, { useState } from 'react';
import { predictRevenue, analyzeCustomerBehavior } from '../services/analyticsAI';
import { analyzeSentiment } from '../services/chatbotAI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AIAnalytics.css';

const historicalRevenue = [
  { month: 'T1', revenue: 85000000 },
  { month: 'T2', revenue: 92000000 },
  { month: 'T3', revenue: 78000000 },
  { month: 'T4', revenue: 105000000 },
  { month: 'T5', revenue: 118000000 },
  { month: 'T6', revenue: 132000000 },
];

const sampleReviews = [
  'Món ăn rất ngon, phục vụ nhanh và thân thiện!',
  'Phở bò tuyệt vời, nước dùng đậm đà. Sẽ quay lại.',
  'Hơi đông vào cuối tuần nhưng đồ ăn ngon.',
  'Nhân viên nhiệt tình, không gian sạch sẽ.',
  'Giá cả hợp lý, khẩu phần vừa đủ.',
];

const sampleOrderHistory = [
  { time: '12:30', items: ['Phở bò', 'Trà đá'], total: 75000 },
  { time: '13:00', items: ['Cơm tấm', 'Nước cam'], total: 85000 },
  { time: '18:30', items: ['Bún bò', 'Gỏi cuốn', 'Trà đá'], total: 105000 },
  { time: '19:00', items: ['Phở bò', 'Chả giò'], total: 105000 },
  { time: '20:00', items: ['Cơm tấm', 'Chè ba màu'], total: 80000 },
];

function AIAnalytics() {
  const [revenueData, setRevenueData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [behaviorData, setBehaviorData] = useState(null);
  const [loading, setLoading] = useState({});

  const run = async (key, fn) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const result = await fn();
      if (key === 'revenue') setRevenueData(result);
      if (key === 'sentiment') setSentimentData(result);
      if (key === 'behavior') setBehaviorData(result);
    } catch {}
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const chartData = revenueData
    ? [
        ...historicalRevenue,
        ...revenueData.prediction.map(p => ({ month: p.month, predicted: p.predicted })),
      ]
    : historicalRevenue;

  return (
    <div className="ai-analytics">
      <div className="page-header">
        <h1 className="page-title">🤖 AI Analytics</h1>
        <span className="ai-badge-lg">Powered by GPT-4o</span>
      </div>

      <div className="ai-cards-grid">

        {/* Revenue Prediction */}
        <div className="ai-card card">
          <div className="ai-card-header">
            <h2>📈 Dự đoán doanh thu</h2>
            <button className="ai-run-btn" onClick={() => run('revenue', () => predictRevenue(historicalRevenue))} disabled={loading.revenue}>
              {loading.revenue ? '⏳ Đang phân tích...' : '🤖 Chạy AI'}
            </button>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={v => `${v?.toLocaleString('vi-VN')}đ`} />
              <Line type="monotone" dataKey="revenue" stroke="#e85d04" strokeWidth={2} dot={{ r: 3 }} name="Thực tế" />
              <Line type="monotone" dataKey="predicted" stroke="#3182ce" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Dự đoán" />
            </LineChart>
          </ResponsiveContainer>

          {revenueData && (
            <div className="ai-result">
              <p className="ai-trend">📊 {revenueData.trend}</p>
              <div className="ai-factors">
                {revenueData.topFactors?.map((f, i) => <span key={i} className="ai-factor-tag">✓ {f}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        <div className="ai-card card">
          <div className="ai-card-header">
            <h2>💬 Phân tích đánh giá</h2>
            <button className="ai-run-btn" onClick={() => run('sentiment', () => analyzeSentiment(sampleReviews))} disabled={loading.sentiment}>
              {loading.sentiment ? '⏳ Đang phân tích...' : '🤖 Chạy AI'}
            </button>
          </div>

          <div className="sample-reviews">
            {sampleReviews.slice(0, 3).map((r, i) => (
              <p key={i} className="sample-review">"{r}"</p>
            ))}
          </div>

          {sentimentData && (
            <div className="ai-result">
              <div className="sentiment-score">
                <div className="score-circle" style={{ '--score': sentimentData.score }}>
                  <span>{Math.round(sentimentData.score * 100)}%</span>
                </div>
                <div>
                  <p className="sentiment-label">{sentimentData.label === 'positive' ? '😊 Tích cực' : sentimentData.label === 'neutral' ? '😐 Trung lập' : '😞 Tiêu cực'}</p>
                  <p className="sentiment-summary">{sentimentData.summary}</p>
                </div>
              </div>
              {sentimentData.highlights?.length > 0 && (
                <div className="sentiment-highlights">
                  {sentimentData.highlights.map((h, i) => <span key={i} className="highlight-tag">👍 {h}</span>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Behavior */}
        <div className="ai-card card ai-card-full">
          <div className="ai-card-header">
            <h2>👥 Phân tích hành vi khách hàng</h2>
            <button className="ai-run-btn" onClick={() => run('behavior', () => analyzeCustomerBehavior(sampleOrderHistory))} disabled={loading.behavior}>
              {loading.behavior ? '⏳ Đang phân tích...' : '🤖 Chạy AI'}
            </button>
          </div>

          {behaviorData ? (
            <div className="behavior-grid">
              <div className="behavior-item">
                <h4>⏰ Giờ cao điểm</h4>
                <div className="tag-list">{behaviorData.peakHours?.map((h, i) => <span key={i} className="ai-tag">{h}</span>)}</div>
              </div>
              <div className="behavior-item">
                <h4>🍽️ Combo phổ biến</h4>
                <div className="tag-list">{behaviorData.popularCombos?.map((c, i) => <span key={i} className="ai-tag">{c}</span>)}</div>
              </div>
              <div className="behavior-item">
                <h4>💰 Giá trị đơn TB</h4>
                <p className="behavior-value">{behaviorData.avgOrderValue?.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="behavior-item">
                <h4>💡 Đề xuất</h4>
                <ul>{behaviorData.recommendations?.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            </div>
          ) : (
            <p className="ai-placeholder">Nhấn "Chạy AI" để phân tích hành vi khách hàng từ dữ liệu đơn hàng</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default AIAnalytics;

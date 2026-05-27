import React, { createContext, useContext, useState } from 'react';

const FeedbackContext = createContext(null);

const initialFeedbacks = [
  {
    id: 1, name: 'Nguyễn Văn An', date: '20/05/2026', orderId: '#C046',
    overallRating: 5, foodRating: 5, serviceRating: 5, ambianceRating: 4,
    comment: 'Bò Wagyu tuyệt vời, chín vừa, mềm tan trong miệng. Nhân viên rất nhiệt tình!',
    dishes: ['Bò Wagyu nướng than hoa', 'Rượu vang đỏ Pháp'],
    status: 'replied', reply: 'Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi bạn hài lòng.',
  },
  {
    id: 2, name: 'Trần Thị Bích', date: '19/05/2026', orderId: '#C045',
    overallRating: 4, foodRating: 4, serviceRating: 3, ambianceRating: 5,
    comment: 'Không gian đẹp, món ăn ngon. Tuy nhiên phục vụ hơi chậm vào giờ cao điểm.',
    dishes: ['Tôm hùm hấp bia', 'Cocktail Signature'],
    status: 'pending', reply: '',
  },
  {
    id: 3, name: 'Lê Minh Khoa', date: '18/05/2026', orderId: '#C044',
    overallRating: 5, foodRating: 5, serviceRating: 5, ambianceRating: 5,
    comment: 'Hoàn hảo! Sẽ quay lại và giới thiệu bạn bè.',
    dishes: ['Cá hồi áp chảo sốt chanh', 'Bánh soufflé socola'],
    status: 'replied', reply: 'Hẹn gặp lại bạn! 🎉',
  },
];

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  const addFeedback = (data) => {
    const newFb = {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'pending',
      reply: '',
    };
    setFeedbacks(prev => [newFb, ...prev]);
  };

  const replyFeedback = (id, reply) => {
    setFeedbacks(prev => prev.map(f =>
      f.id === id ? { ...f, reply, status: 'replied' } : f
    ));
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.overallRating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, replyFeedback, avgRating }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  return useContext(FeedbackContext);
}

import API from './api';

export const getAllFeedbacks = async () => {
  const response = await API.get('/feedbacks');
  return response.data;
};

export const getFeedbacksByCustomer = async (userId) => {
  const response = await API.get(`/feedbacks/customer/${userId}`);
  return response.data;
};

export const createFeedback = async (data) => {
  const response = await API.post('/feedbacks', data);
  return response.data;
};

export const updateFeedbackStatus = async (feedbackId, status) => {
  const response = await API.put(`/feedbacks/${feedbackId}/status`, {
    status
  });
  return response.data;
};

export const deleteFeedback = async (feedbackId) => {
  const response = await API.delete(`/feedbacks/${feedbackId}`);
  return response.data;
};
import API from './api';

export const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

export const getStaffCustomers = async () => {
  const response = await API.get('/users/customers');
  return response.data;
};

export const updateUserRole = async (userId, roleName, currentUserId) => {
  const response = await API.put(`/users/${userId}/role`, {
    roleName,
    currentUserId
  });

  return response.data;
};

export const updateUserStatus = async (userId, isActive, currentUserId) => {
  const response = await API.put(`/users/${userId}/status`, {
    isActive,
    currentUserId
  });

  return response.data;
};
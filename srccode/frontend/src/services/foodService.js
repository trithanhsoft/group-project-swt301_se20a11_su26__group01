import API from "./api";

export const getAllFoods = async () => {
  const response = await API.get("/foods");
  return response.data;
};

export const getAvailableFoods = async () => {
  const response = await API.get("/foods/available");
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await API.get(`/foods/${id}`);
  return response.data;
};

export const getFoodsByCategory = async (categoryId) => {
  const response = await API.get(`/foods/category/${categoryId}`);
  return response.data;
};

export const createFood = async (foodData) => {
  const response = await API.post("/foods", foodData);
  return response.data;
};

export const updateFood = async (id, foodData) => {
  const response = await API.put(`/foods/${id}`, foodData);
  return response.data;
};

export const toggleFoodAvailable = async (id) => {
  const response = await API.patch(`/foods/${id}/toggle-available`);
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await API.delete(`/foods/${id}`);
  return response.data;
};
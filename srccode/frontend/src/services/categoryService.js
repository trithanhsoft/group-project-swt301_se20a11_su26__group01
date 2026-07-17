import API from "./api";

export const getAllCategories = async () => {
  const response = await API.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await API.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await API.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await API.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/categories/${id}`);
  return response.data;
};
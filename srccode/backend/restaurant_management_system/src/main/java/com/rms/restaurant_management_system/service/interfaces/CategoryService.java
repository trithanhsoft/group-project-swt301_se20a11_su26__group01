package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.CategoryRequest;
import com.rms.restaurant_management_system.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);
}
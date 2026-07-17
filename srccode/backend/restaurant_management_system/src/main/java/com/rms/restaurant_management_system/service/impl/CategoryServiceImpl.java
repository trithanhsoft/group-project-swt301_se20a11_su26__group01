package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.request.CategoryRequest;
import com.rms.restaurant_management_system.dto.response.CategoryResponse;
import com.rms.restaurant_management_system.entity.Category;
import com.rms.restaurant_management_system.repository.CategoryRepository;
import com.rms.restaurant_management_system.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));

        return mapToResponse(category);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        validateCategoryRequest(request);

        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Tên category đã tồn tại");
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        validateCategoryRequest(request);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));

        categoryRepository.findByCategoryName(request.getCategoryName())
                .ifPresent(existingCategory -> {
                    if (!existingCategory.getCategoryId().equals(id)) {
                        throw new RuntimeException("Tên category đã tồn tại");
                    }
                });

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    private void validateCategoryRequest(CategoryRequest request) {
        if (request.getCategoryName() == null || request.getCategoryName().trim().isEmpty()) {
            throw new RuntimeException("Tên category không được để trống");
        }

        request.setCategoryName(request.getCategoryName().trim());
    }
}
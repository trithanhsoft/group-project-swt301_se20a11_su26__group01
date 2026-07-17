package com.rms.restaurant_management_system.service;

import com.rms.restaurant_management_system.dto.request.CategoryRequest;
import com.rms.restaurant_management_system.dto.response.CategoryResponse;
import com.rms.restaurant_management_system.entity.Category;
import com.rms.restaurant_management_system.repository.CategoryRepository;
import com.rms.restaurant_management_system.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category sampleCategory;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder()
                .categoryId(1L)
                .categoryName("Mon chinh")
                .description("Cac mon chinh")
                .isActive(true)
                .build();
    }

    // ── getAllCategories ───────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllCategories - returns list")
    void getAllCategories_returnsList() {
        when(categoryRepository.findAll()).thenReturn(List.of(sampleCategory));

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategoryName()).isEqualTo("Mon chinh");
    }

    @Test
    @DisplayName("getAllCategories - empty list")
    void getAllCategories_emptyList() {
        when(categoryRepository.findAll()).thenReturn(List.of());

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).isEmpty();
    }

    // ── getCategoryById ───────────────────────────────────────────────────────

    @Test
    @DisplayName("getCategoryById - success")
    void getCategoryById_success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));

        CategoryResponse result = categoryService.getCategoryById(1L);

        assertThat(result.getCategoryId()).isEqualTo(1L);
        assertThat(result.getCategoryName()).isEqualTo("Mon chinh");
    }

    @Test
    @DisplayName("getCategoryById - not found")
    void getCategoryById_notFound_throwsException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    // ── createCategory ────────────────────────────────────────────────────────

    @Test
    @DisplayName("createCategory - success")
    void createCategory_success() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName("Khai vi");
        req.setDescription("Mon khai vi");

        when(categoryRepository.existsByCategoryName("Khai vi")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> {
            Category c = inv.getArgument(0);
            c = Category.builder().categoryId(2L).categoryName(c.getCategoryName())
                    .description(c.getDescription()).isActive(true).build();
            return c;
        });

        CategoryResponse result = categoryService.createCategory(req);

        assertThat(result.getCategoryName()).isEqualTo("Khai vi");
        assertThat(result.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("createCategory - duplicate name")
    void createCategory_duplicateName_throwsException() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName("Mon chinh");

        when(categoryRepository.existsByCategoryName("Mon chinh")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.createCategory(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Tên category đã tồn tại");
    }

    @Test
    @DisplayName("createCategory - empty name")
    void createCategory_emptyName_throwsException() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName("   ");

        assertThatThrownBy(() -> categoryService.createCategory(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("trống");
    }

    @Test
    @DisplayName("createCategory - null name")
    void createCategory_nullName_throwsException() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName(null);

        assertThatThrownBy(() -> categoryService.createCategory(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("trống");
    }

    // ── updateCategory ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateCategory - success")
    void updateCategory_success() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName("Mon chinh updated");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.findByCategoryName("Mon chinh updated")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);

        CategoryResponse result = categoryService.updateCategory(1L, req);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("updateCategory - category not found")
    void updateCategory_notFound_throwsException() {
        CategoryRequest req = new CategoryRequest();
        req.setCategoryName("Test");

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.updateCategory(99L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    // ── deleteCategory ────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteCategory - success")
    void deleteCategory_success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        doNothing().when(categoryRepository).delete(sampleCategory);

        assertThatCode(() -> categoryService.deleteCategory(1L)).doesNotThrowAnyException();
        verify(categoryRepository).delete(sampleCategory);
    }

    @Test
    @DisplayName("deleteCategory - not found")
    void deleteCategory_notFound_throwsException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.deleteCategory(99L))
                .isInstanceOf(RuntimeException.class);
    }
}

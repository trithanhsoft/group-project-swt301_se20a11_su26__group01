package com.rms.restaurant_management_system.service;

import com.rms.restaurant_management_system.dto.request.FoodRequest;
import com.rms.restaurant_management_system.dto.response.FoodResponse;
import com.rms.restaurant_management_system.entity.Category;
import com.rms.restaurant_management_system.entity.Food;
import com.rms.restaurant_management_system.repository.CategoryRepository;
import com.rms.restaurant_management_system.repository.FoodRepository;
import com.rms.restaurant_management_system.service.impl.FoodServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodServiceImplTest {

    @Mock private FoodRepository foodRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks
    private FoodServiceImpl foodService;

    private Category category;
    private Food food;

    @BeforeEach
    void setUp() {
        category = Category.builder().categoryId(1L).categoryName("Mon chinh").isActive(true).build();
        food = Food.builder()
                .foodId(1L).foodName("Bo Wagyu").description("Bo ngon")
                .price(BigDecimal.valueOf(580000)).isAvailable(true)
                .rating(4.5).orders(0).category(category).build();
    }

    // ── getAllFoods ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllFoods - returns list")
    void getAllFoods_returnsList() {
        when(foodRepository.findAll()).thenReturn(List.of(food));

        List<FoodResponse> result = foodService.getAllFoods();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFoodName()).isEqualTo("Bo Wagyu");
    }

    // ── getAvailableFoods ──────────────────────────────────────────────────────

    @Test
    @DisplayName("getAvailableFoods - returns only available")
    void getAvailableFoods_returnsOnlyAvailable() {
        when(foodRepository.findByIsAvailableTrue()).thenReturn(List.of(food));

        List<FoodResponse> result = foodService.getAvailableFoods();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIsAvailable()).isTrue();
    }

    // ── getFoodById ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("getFoodById - success")
    void getFoodById_success() {
        when(foodRepository.findById(1L)).thenReturn(Optional.of(food));

        FoodResponse result = foodService.getFoodById(1L);

        assertThat(result.getFoodId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getFoodById - not found")
    void getFoodById_notFound_throwsException() {
        when(foodRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.getFoodById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    // ── createFood ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createFood - success")
    void createFood_success() {
        FoodRequest req = buildValidFoodRequest("Tom hum", 750000L, 1L);

        when(foodRepository.existsByFoodName("Tom hum")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(foodRepository.save(any(Food.class))).thenReturn(food);

        FoodResponse result = foodService.createFood(req);

        assertThat(result).isNotNull();
        verify(foodRepository).save(any(Food.class));
    }

    @Test
    @DisplayName("createFood - duplicate name")
    void createFood_duplicateName_throwsException() {
        FoodRequest req = buildValidFoodRequest("Bo Wagyu", 580000L, 1L);

        when(foodRepository.existsByFoodName("Bo Wagyu")).thenReturn(true);

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Tên món ăn đã tồn tại");
    }

    @Test
    @DisplayName("createFood - category not found")
    void createFood_categoryNotFound_throwsException() {
        FoodRequest req = buildValidFoodRequest("New food", 100000L, 99L);

        when(foodRepository.existsByFoodName("New food")).thenReturn(false);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("createFood - null name")
    void createFood_nullName_throwsException() {
        FoodRequest req = buildValidFoodRequest(null, 100000L, 1L);

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("trống");
    }

    @Test
    @DisplayName("createFood - price zero")
    void createFood_priceZero_throwsException() {
        FoodRequest req = new FoodRequest();
        req.setFoodName("Test food");
        req.setPrice(BigDecimal.ZERO);
        req.setCategoryId(1L);

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("0");
    }

    @Test
    @DisplayName("createFood - negative price")
    void createFood_negativePrice_throwsException() {
        FoodRequest req = new FoodRequest();
        req.setFoodName("Test food");
        req.setPrice(BigDecimal.valueOf(-1000));
        req.setCategoryId(1L);

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    @DisplayName("createFood - name exceeds 150 chars")
    void createFood_nameTooLong_throwsException() {
        String longName = "A".repeat(151);
        FoodRequest req = buildValidFoodRequest(longName, 100000L, 1L);

        assertThatThrownBy(() -> foodService.createFood(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("150");
    }

    // ── toggleAvailable ───────────────────────────────────────────────────────

    @Test
    @DisplayName("toggleAvailable - true to false")
    void toggleAvailable_trueToFalse() {
        when(foodRepository.findById(1L)).thenReturn(Optional.of(food));
        when(foodRepository.save(any(Food.class))).thenAnswer(inv -> inv.getArgument(0));

        FoodResponse result = foodService.toggleAvailable(1L);

        assertThat(result.getIsAvailable()).isFalse();
    }

    @Test
    @DisplayName("toggleAvailable - not found")
    void toggleAvailable_notFound_throwsException() {
        when(foodRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.toggleAvailable(99L))
                .isInstanceOf(RuntimeException.class);
    }

    // ── deleteFood ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteFood - success")
    void deleteFood_success() {
        when(foodRepository.findById(1L)).thenReturn(Optional.of(food));
        doNothing().when(foodRepository).delete(food);

        assertThatCode(() -> foodService.deleteFood(1L)).doesNotThrowAnyException();
        verify(foodRepository).delete(food);
    }

    @Test
    @DisplayName("deleteFood - not found")
    void deleteFood_notFound_throwsException() {
        when(foodRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.deleteFood(99L))
                .isInstanceOf(RuntimeException.class);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private FoodRequest buildValidFoodRequest(String name, long price, long categoryId) {
        FoodRequest req = new FoodRequest();
        req.setFoodName(name);
        req.setPrice(name != null ? BigDecimal.valueOf(price) : null);
        req.setCategoryId(name != null ? categoryId : null);
        return req;
    }
}

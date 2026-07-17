package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByCategoryCategoryId(Long categoryId);

    List<Food> findByIsAvailableTrue();

    boolean existsByFoodName(String foodName);
}
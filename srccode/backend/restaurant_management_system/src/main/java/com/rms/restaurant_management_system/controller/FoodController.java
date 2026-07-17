package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.FoodRequest;
import com.rms.restaurant_management_system.dto.response.FoodResponse;
import com.rms.restaurant_management_system.service.interfaces.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/foods", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/available")
    public ResponseEntity<List<FoodResponse>> getAvailableFoods() {
        return ResponseEntity.ok(foodService.getAvailableFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodResponse>> getFoodsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(foodService.getFoodsByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<FoodResponse> createFood(@RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.createFood(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse> updateFood(
            @PathVariable Long id,
            @RequestBody FoodRequest request
    ) {
        return ResponseEntity.ok(foodService.updateFood(id, request));
    }

    @PatchMapping("/{id}/toggle-available")
    public ResponseEntity<FoodResponse> toggleAvailable(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.toggleAvailable(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok("Xóa món ăn thành công");
    }
}
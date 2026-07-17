package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.RestaurantTable;
import com.rms.restaurant_management_system.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    Optional<RestaurantTable> findByTableName(String tableName);

    boolean existsByTableName(String tableName);

    List<RestaurantTable> findByIsActiveTrueOrderByTableIdAsc();

    List<RestaurantTable> findByStatusAndIsActiveTrueOrderByTableIdAsc(TableStatus status);
}
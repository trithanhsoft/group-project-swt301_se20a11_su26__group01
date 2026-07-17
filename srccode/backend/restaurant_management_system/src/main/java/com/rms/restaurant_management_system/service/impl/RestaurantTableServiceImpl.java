package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.request.MergeTableRequest;
import com.rms.restaurant_management_system.dto.request.TableRequest;
import com.rms.restaurant_management_system.dto.request.TransferTableRequest;
import com.rms.restaurant_management_system.dto.request.UpdateTableStatusRequest;
import com.rms.restaurant_management_system.dto.response.TableResponse;
import com.rms.restaurant_management_system.entity.RestaurantTable;
import com.rms.restaurant_management_system.enums.TableStatus;
import com.rms.restaurant_management_system.repository.RestaurantTableRepository;
import com.rms.restaurant_management_system.service.interfaces.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableServiceImpl implements RestaurantTableService {

    private final RestaurantTableRepository tableRepository;

    @Override
    @Transactional
    public TableResponse createTable(TableRequest request) {
        if (tableRepository.existsByTableName(request.getTableName())) {
            throw new RuntimeException("Table name already exists");
        }

        RestaurantTable table = RestaurantTable.builder()
                .tableName(request.getTableName())
                .capacity(request.getCapacity())
                .status(TableStatus.EMPTY)
                .isActive(true)
                .build();

        return mapToResponse(tableRepository.save(table));
    }

    @Override
    public List<TableResponse> getAllTables() {
        return tableRepository.findByIsActiveTrueOrderByTableIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TableResponse getTableById(Long tableId) {
        RestaurantTable table = findTable(tableId);
        return mapToResponse(table);
    }

    @Override
    public List<TableResponse> getTablesByStatus(String status) {
        TableStatus tableStatus;

        try {
            tableStatus = TableStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new RuntimeException("Invalid table status: " + status);
        }

        return tableRepository.findByStatusAndIsActiveTrueOrderByTableIdAsc(tableStatus)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public TableResponse updateTable(Long tableId, TableRequest request) {
        RestaurantTable table = findTable(tableId);

        if (!table.getTableName().equals(request.getTableName())
                && tableRepository.existsByTableName(request.getTableName())) {
            throw new RuntimeException("Table name already exists");
        }

        table.setTableName(request.getTableName());
        table.setCapacity(request.getCapacity());

        return mapToResponse(tableRepository.save(table));
    }

    @Override
    @Transactional
    public TableResponse updateTableStatus(Long tableId, UpdateTableStatusRequest request) {
        RestaurantTable table = findTable(tableId);

        table.setStatus(request.getStatus());

        if (request.getCurrentOrderCode() != null) {
            table.setCurrentOrderCode(request.getCurrentOrderCode());
        }

        if (request.getReservedBy() != null) {
            table.setReservedBy(request.getReservedBy());
        }

        if (request.getStatus() == TableStatus.EMPTY) {
            table.setCurrentOrderCode(null);
            table.setReservedBy(null);
            table.setMergedInto(null);
            table.setMergedWith(null);
        }

        return mapToResponse(tableRepository.save(table));
    }

    @Override
    @Transactional
    public void deleteTable(Long tableId) {
        RestaurantTable table = findTable(tableId);

        table.setIsActive(false);
        table.setStatus(TableStatus.INACTIVE);

        tableRepository.save(table);
    }

    @Override
    @Transactional
    public List<TableResponse> transferTable(Long sourceTableId, TransferTableRequest request) {
        RestaurantTable source = findTable(sourceTableId);
        RestaurantTable target = findTable(request.getTargetTableId());

        if (source.getStatus() != TableStatus.OCCUPIED) {
            throw new RuntimeException("Only occupied table can be transferred");
        }

        if (target.getStatus() != TableStatus.EMPTY) {
            throw new RuntimeException("Target table must be empty");
        }

        target.setStatus(TableStatus.OCCUPIED);
        target.setCurrentOrderCode(source.getCurrentOrderCode());

        source.setStatus(TableStatus.EMPTY);
        source.setCurrentOrderCode(null);
        source.setReservedBy(null);

        tableRepository.save(source);
        tableRepository.save(target);

        return getAllTables();
    }

    @Override
    @Transactional
    public List<TableResponse> mergeTables(Long sourceTableId, MergeTableRequest request) {
        RestaurantTable source = findTable(sourceTableId);
        RestaurantTable target = findTable(request.getTargetTableId());

        if (target.getStatus() != TableStatus.EMPTY) {
            throw new RuntimeException("Target table must be empty");
        }

        String currentMergedWith = source.getMergedWith();

        if (currentMergedWith == null || currentMergedWith.isBlank()) {
            source.setMergedWith(target.getTableName());
        } else {
            source.setMergedWith(currentMergedWith + ", " + target.getTableName());
        }

        source.setCapacity(source.getCapacity() + target.getCapacity());

        target.setStatus(TableStatus.MERGED);
        target.setMergedInto(source.getTableName());

        tableRepository.save(source);
        tableRepository.save(target);

        return getAllTables();
    }

    @Override
    @Transactional
    public List<TableResponse> splitTable(Long tableId) {
        RestaurantTable source = findTable(tableId);

        if (source.getMergedWith() == null || source.getMergedWith().isBlank()) {
            throw new RuntimeException("This table is not merged");
        }

        String[] mergedTableNames = source.getMergedWith().split(",");

        for (String name : mergedTableNames) {
            String tableName = name.trim();

            tableRepository.findByTableName(tableName).ifPresent(table -> {
                table.setStatus(TableStatus.EMPTY);
                table.setMergedInto(null);
                tableRepository.save(table);
            });
        }

        // Đơn giản hóa: không tự khôi phục capacity gốc vì đã cộng dồn trước đó.
        // Nếu cần chính xác tuyệt đối, nên thêm field originalCapacity.
        source.setMergedWith(null);

        tableRepository.save(source);

        return getAllTables();
    }

    private RestaurantTable findTable(Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!table.getIsActive()) {
            throw new RuntimeException("Table is inactive");
        }

        return table;
    }

    private TableResponse mapToResponse(RestaurantTable table) {
        return new TableResponse(
                table.getTableId(),
                table.getTableName(),
                table.getCapacity(),
                table.getStatus(),
                table.getCurrentOrderCode(),
                table.getReservedBy(),
                table.getMergedInto(),
                table.getMergedWith(),
                table.getIsActive(),
                table.getCreatedAt(),
                table.getUpdatedAt()
        );
    }
}
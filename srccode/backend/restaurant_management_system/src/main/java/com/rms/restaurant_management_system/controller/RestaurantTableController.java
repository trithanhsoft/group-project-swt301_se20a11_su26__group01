package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.MergeTableRequest;
import com.rms.restaurant_management_system.dto.request.TableRequest;
import com.rms.restaurant_management_system.dto.request.TransferTableRequest;
import com.rms.restaurant_management_system.dto.request.UpdateTableStatusRequest;
import com.rms.restaurant_management_system.dto.response.TableResponse;
import com.rms.restaurant_management_system.service.interfaces.RestaurantTableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RestaurantTableController {

    private final RestaurantTableService tableService;

    @PostMapping
    public TableResponse createTable(@Valid @RequestBody TableRequest request) {
        return tableService.createTable(request);
    }

    @GetMapping
    public List<TableResponse> getAllTables() {
        return tableService.getAllTables();
    }

    @GetMapping("/{tableId}")
    public TableResponse getTableById(@PathVariable Long tableId) {
        return tableService.getTableById(tableId);
    }

    @GetMapping("/status/{status}")
    public List<TableResponse> getTablesByStatus(@PathVariable String status) {
        return tableService.getTablesByStatus(status);
    }

    @PutMapping("/{tableId}")
    public TableResponse updateTable(
            @PathVariable Long tableId,
            @Valid @RequestBody TableRequest request
    ) {
        return tableService.updateTable(tableId, request);
    }

    @PutMapping("/{tableId}/status")
    public TableResponse updateTableStatus(
            @PathVariable Long tableId,
            @Valid @RequestBody UpdateTableStatusRequest request
    ) {
        return tableService.updateTableStatus(tableId, request);
    }

    @PutMapping("/{sourceTableId}/transfer")
    public List<TableResponse> transferTable(
            @PathVariable Long sourceTableId,
            @Valid @RequestBody TransferTableRequest request
    ) {
        return tableService.transferTable(sourceTableId, request);
    }

    @PutMapping("/{sourceTableId}/merge")
    public List<TableResponse> mergeTables(
            @PathVariable Long sourceTableId,
            @Valid @RequestBody MergeTableRequest request
    ) {
        return tableService.mergeTables(sourceTableId, request);
    }

    @PutMapping("/{tableId}/split")
    public List<TableResponse> splitTable(@PathVariable Long tableId) {
        return tableService.splitTable(tableId);
    }

    @DeleteMapping("/{tableId}")
    public String deleteTable(@PathVariable Long tableId) {
        tableService.deleteTable(tableId);
        return "Table deleted successfully";
    }
}
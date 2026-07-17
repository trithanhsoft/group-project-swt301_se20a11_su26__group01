package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.MergeTableRequest;
import com.rms.restaurant_management_system.dto.request.TableRequest;
import com.rms.restaurant_management_system.dto.request.TransferTableRequest;
import com.rms.restaurant_management_system.dto.request.UpdateTableStatusRequest;
import com.rms.restaurant_management_system.dto.response.TableResponse;

import java.util.List;

public interface RestaurantTableService {

    TableResponse createTable(TableRequest request);

    List<TableResponse> getAllTables();

    TableResponse getTableById(Long tableId);

    List<TableResponse> getTablesByStatus(String status);

    TableResponse updateTable(Long tableId, TableRequest request);

    TableResponse updateTableStatus(Long tableId, UpdateTableStatusRequest request);

    void deleteTable(Long tableId);

    List<TableResponse> transferTable(Long sourceTableId, TransferTableRequest request);

    List<TableResponse> mergeTables(Long sourceTableId, MergeTableRequest request);

    List<TableResponse> splitTable(Long tableId);
}
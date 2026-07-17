import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import API from '../../services/api';
import './TableQRCode.css';

function TableQRCode() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const frontendBaseUrl = window.location.origin;

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/tables');
      setTables(response.data || []);
    } catch (error) {
      console.error('Fetch tables error:', error);
      setError('Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
    }
  };

  const getQrUrl = (table) => {
    return `${frontendBaseUrl}/table/${table.tableId}/menu`;
  };

  const downloadQRCode = (table) => {
    const canvas = document.getElementById(`qr-table-${table.tableId}`);

    if (!canvas) {
      alert('Không tìm thấy QR Code');
      return;
    }

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const downloadLink = document.createElement('a');

    downloadLink.href = pngUrl;
    downloadLink.download = `QR-${table.tableName || `Table-${table.tableId}`}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) {
    return (
      <div className="table-qr-page">
        <h1 className="table-qr-title">QR Code cho từng bàn</h1>

        <div className="table-qr-card">
          ⏳ Đang tải danh sách bàn...
        </div>
      </div>
    );
  }

  return (
    <div className="table-qr-page">
      <div className="table-qr-header">
        <div>
          <h1 className="table-qr-title">QR Code cho từng bàn</h1>

          <p className="table-qr-subtitle">
            Tạo mã QR để khách quét và đặt món trực tiếp tại bàn.
          </p>
        </div>

        <button className="table-qr-refresh" onClick={fetchTables}>
          🔄 Làm mới
        </button>
      </div>

      {error && (
        <div className="table-qr-error">
          ⚠️ {error}
        </div>
      )}

      {tables.length === 0 ? (
        <div className="table-qr-card">
          Chưa có bàn nào trong hệ thống.
        </div>
      ) : (
        <div className="table-qr-grid">
          {tables.map((table) => {
            const qrUrl = getQrUrl(table);

            return (
              <div key={table.tableId} className="table-qr-card">
                <div className="table-qr-info">
                  <h3>{table.tableName || `Bàn ${table.tableId}`}</h3>

                  <span className={`table-status table-status-${String(table.status || '').toLowerCase()}`}>
                    {table.status}
                  </span>

                  <p>Sức chứa: {table.capacity || '-'} khách</p>
                </div>

                <div className="table-qr-code">
                  <QRCodeCanvas
                    id={`qr-table-${table.tableId}`}
                    value={qrUrl}
                    size={180}
                    includeMargin={true}
                  />
                </div>

                <div className="table-qr-link">
                  {qrUrl}
                </div>

                <div className="table-qr-actions">
                  <button onClick={() => setSelectedTable(table)}>
                    👁️ Xem lớn
                  </button>

                  <button onClick={() => downloadQRCode(table)}>
                    ⬇️ Tải QR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTable && (
        <div
          className="qr-modal-overlay"
          onClick={() => setSelectedTable(null)}
        >
          <div
            className="qr-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{selectedTable.tableName}</h2>

            <QRCodeCanvas
              id={`qr-table-${selectedTable.tableId}`}
              value={getQrUrl(selectedTable)}
              size={300}
              includeMargin={true}
            />

            <p>{getQrUrl(selectedTable)}</p>

            <div className="qr-modal-actions">
              <button onClick={() => downloadQRCode(selectedTable)}>
                ⬇️ Tải QR
              </button>

              <button onClick={() => setSelectedTable(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableQRCode;
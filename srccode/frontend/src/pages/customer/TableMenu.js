import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import './TableMenu.css';

function TableMenu() {
  const { tableId } = useParams();

  const [table, setTable] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState('');

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [tableId]);

  const getApiMessage = (data, fallback) => {
    if (!data) {
      return fallback;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      return data.message || data.error || data.detail || fallback;
    }

    return fallback;
  };

  const normalizeFood = (food) => {
    const categoryName =
      food.categoryName ||
      food.category?.categoryName ||
      food.category ||
      'Khác';

    return {
      foodId: food.foodId || food.id,
      foodName: food.foodName || food.name || food.title || 'Món ăn',
      description: food.description || '',
      price: Number(food.price || 0),
      category: categoryName,
      imageUrl: food.imageUrl || '',
      emoji: food.emoji || '🍽️',
      isAvailable: food.isAvailable !== false
    };
  };

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');

    try {
      const [tableRes, foodsRes, categoriesRes] = await Promise.all([
        API.get(`/tables/${tableId}`),
        API.get('/foods'),
        API.get('/categories')
      ]);

      setTable(tableRes.data);

      const availableFoods = (foodsRes.data || [])
        .map(normalizeFood)
        .filter((food) => food.isAvailable);

      setFoods(availableFoods);

      const categoryNames = (categoriesRes.data || [])
        .map((category) => category.categoryName || category.name)
        .filter(Boolean);

      if (categoryNames.length > 0) {
        setCategories(['Tất cả', ...categoryNames]);
      } else {
        const uniqueCategories = [
          ...new Set(availableFoods.map((food) => food.category).filter(Boolean))
        ];
        setCategories(['Tất cả', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Fetch table menu error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải menu cho bàn này'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (foodId, delta) => {
    setCart((prev) => {
      const currentQty = prev[foodId] || 0;
      const nextQty = currentQty + delta;

      if (nextQty <= 0) {
        const nextCart = { ...prev };
        delete nextCart[foodId];
        return nextCart;
      }

      return {
        ...prev,
        [foodId]: nextQty
      };
    });
  };

  const selectedItems = foods.filter((food) => cart[food.foodId]);

  const totalAmount = selectedItems.reduce((sum, food) => {
    return sum + food.price * cart[food.foodId];
  }, 0);

  const totalQuantity = selectedItems.reduce((sum, food) => {
    return sum + cart[food.foodId];
  }, 0);

  const filteredFoods =
    activeCategory === 'Tất cả'
      ? foods
      : foods.filter((food) => food.category === activeCategory);

  const buildOrderItems = () => {
    return selectedItems.map((food) => ({
      foodId: food.foodId,
      quantity: cart[food.foodId]
    }));
  };

  const handlePlaceOrder = async () => {
    setError('');

    if (selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất 1 món');
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await API.post('/orders', {
        tableId: Number(tableId),
        customerName: customerName.trim() || `Khách ${table?.tableName || `Bàn ${tableId}`}`,
        customerPhone: customerPhone.trim(),
        note: note.trim(),
        items: buildOrderItems()
      });

      setCreatedOrder(response.data);
      setCart({});
      setNote('');
      setCustomerName('');
      setCustomerPhone('');
    } catch (error) {
      console.error('Create QR order error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể đặt món. Vui lòng thử lại.'
        )
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const openFeedback = () => {
    setFeedbackName(customerName || createdOrder?.customerName || '');
    setFeedbackPhone(customerPhone || createdOrder?.customerPhone || '');
    setFeedbackContent('');
    setFeedbackRating(5);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackContent.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    try {
      setFeedbackLoading(true);

      const tableName = table?.tableName || createdOrder?.tableName || `Bàn ${tableId}`;
      const orderCode = createdOrder?.orderCode || '';

      await API.post('/feedbacks', {
        userId: null,
        customerName: feedbackName.trim() || `Khách ${tableName}`,
        customerEmail: '',
        customerPhone: feedbackPhone.trim(),
        tableId: Number(tableId),
        tableName,
        orderCode,
        rating: Number(feedbackRating),
        content: feedbackContent.trim()
      });

      alert('Cảm ơn bạn đã gửi phản hồi.');

      setFeedbackRating(5);
      setFeedbackContent('');
      setFeedbackName('');
      setFeedbackPhone('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Submit QR feedback error:', error);

      alert(
        getApiMessage(
          error.response?.data,
          'Không thể gửi phản hồi. Vui lòng thử lại.'
        )
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeFeedbackModal = () => {
    if (feedbackLoading) {
      return;
    }

    setShowFeedback(false);
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const renderFeedbackModal = () => {
    if (!showFeedback) {
      return null;
    }

    return (
      <div className="qr-feedback-overlay" onClick={closeFeedbackModal}>
        <div className="qr-feedback-modal" onClick={(e) => e.stopPropagation()}>
          <div className="qr-feedback-header">
            <h2>Gửi phản hồi</h2>

            <button
              type="button"
              onClick={closeFeedbackModal}
              disabled={feedbackLoading}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmitFeedback}>
            <label>
              Tên khách
              <input
                type="text"
                placeholder="Tên của bạn"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
              />
            </label>

            <label>
              Số điện thoại
              <input
                type="tel"
                placeholder="Không bắt buộc"
                value={feedbackPhone}
                onChange={(e) => setFeedbackPhone(e.target.value)}
              />
            </label>

            <label>
              Đánh giá
              <select
                value={feedbackRating}
                onChange={(e) => setFeedbackRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ - Rất tốt</option>
                <option value="4">⭐⭐⭐⭐ - Tốt</option>
                <option value="3">⭐⭐⭐ - Bình thường</option>
                <option value="2">⭐⭐ - Chưa tốt</option>
                <option value="1">⭐ - Tệ</option>
              </select>
            </label>

            <label>
              Nội dung phản hồi
              <textarea
                rows={4}
                placeholder="Bạn muốn góp ý điều gì?"
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="place-order-btn"
              disabled={feedbackLoading}
            >
              {feedbackLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="table-menu-page">
        <div className="table-menu-loading">
          ⏳ Đang tải menu...
        </div>
      </div>
    );
  }

  if (error && !table) {
    return (
      <div className="table-menu-page">
        <div className="table-menu-error">
          <h2>Không thể mở menu</h2>
          <p>{error}</p>
          <button onClick={fetchInitialData}>Thử lại</button>
        </div>
      </div>
    );
  }

  if (createdOrder) {
    return (
      <div className="table-menu-page">
        <div className="order-success-card">
          <div className="success-icon">✅</div>

          <h1>Đặt món thành công!</h1>

          <p>Đơn của bạn đã được gửi đến nhà bếp.</p>

          <div className="success-info">
            <div className="success-row">
              <span>Mã đơn:</span>
              <strong>{createdOrder.orderCode}</strong>
            </div>

            <div className="success-row">
              <span>Bàn:</span>
              <strong>{createdOrder.tableName || table?.tableName}</strong>
            </div>

            <div className="success-row">
              <span>Trạng thái:</span>
              <strong>{createdOrder.status}</strong>
            </div>

            <div className="success-row">
              <span>Tổng tiền:</span>
              <strong>{formatMoney(createdOrder.totalAmount)}đ</strong>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="primary-btn"
              onClick={() => setCreatedOrder(null)}
            >
              Đặt thêm món
            </button>

            <button
              className="feedback-btn"
              onClick={openFeedback}
            >
              💬 Gửi phản hồi
            </button>
          </div>
        </div>

        {renderFeedbackModal()}
      </div>
    );
  }

  return (
    <div className="table-menu-page">
      <header className="table-menu-header">
        <div>
          <p className="header-subtitle">QR Ordering</p>

          <h1>{table?.tableName || `Bàn ${tableId}`}</h1>

          <p className="header-desc">
            Chọn món và gửi đơn trực tiếp đến nhà bếp
          </p>
        </div>

        <div className="table-header-actions">
          <button className="feedback-header-btn" onClick={openFeedback}>
            💬 Phản hồi
          </button>

          <div className="table-badge">
            🪑 {table?.capacity || '?'} chỗ
          </div>
        </div>
      </header>

      {error && (
        <div className="table-menu-alert">
          ⚠️ {error}
        </div>
      )}

      <div className="table-menu-layout">
        <main className="menu-section">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${
                  activeCategory === category ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {filteredFoods.map((food) => (
              <div key={food.foodId} className="food-card">
                <div className="food-image">
                  {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.foodName} />
                  ) : (
                    <span>{food.emoji}</span>
                  )}
                </div>

                <div className="food-content">
                  <h3>{food.foodName}</h3>

                  {food.description && (
                    <p className="food-desc">{food.description}</p>
                  )}

                  <p className="food-category">{food.category}</p>

                  <div className="food-bottom">
                    <strong>{formatMoney(food.price)}đ</strong>

                    {cart[food.foodId] ? (
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(food.foodId, -1)}>
                          −
                        </button>

                        <span>{cart[food.foodId]}</span>

                        <button onClick={() => updateQuantity(food.foodId, 1)}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="add-food-btn"
                        onClick={() => updateQuantity(food.foodId, 1)}
                      >
                        + Thêm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredFoods.length === 0 && (
              <div className="empty-menu">
                Không có món nào trong danh mục này
              </div>
            )}
          </div>
        </main>

        <aside className="cart-section">
          <h2>🛒 Giỏ món</h2>

          {selectedItems.length === 0 ? (
            <p className="empty-cart">
              Bạn chưa chọn món nào.
            </p>
          ) : (
            <div className="cart-items">
              {selectedItems.map((food) => (
                <div key={food.foodId} className="cart-item">
                  <div>
                    <strong>{food.foodName}</strong>

                    <p>
                      {formatMoney(food.price)}đ × {cart[food.foodId]}
                    </p>
                  </div>

                  <div className="cart-item-right">
                    <strong>
                      {formatMoney(food.price * cart[food.foodId])}đ
                    </strong>

                    <div className="cart-qty">
                      <button onClick={() => updateQuantity(food.foodId, -1)}>
                        −
                      </button>

                      <span>{cart[food.foodId]}</span>

                      <button onClick={() => updateQuantity(food.foodId, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="customer-form">
            <label>
              Tên khách
              <input
                type="text"
                placeholder={`Khách ${table?.tableName || `Bàn ${tableId}`}`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>

            <label>
              Số điện thoại
              <input
                type="tel"
                placeholder="Không bắt buộc"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </label>

            <label>
              Ghi chú
              <textarea
                rows={3}
                placeholder="Ví dụ: ít cay, không hành..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </div>

          <div className="cart-total">
            <span>Tổng món:</span>
            <strong>{totalQuantity}</strong>
          </div>

          <div className="cart-total final">
            <span>Tổng tiền:</span>
            <strong>{formatMoney(totalAmount)}đ</strong>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={submitLoading || selectedItems.length === 0}
          >
            {submitLoading ? 'Đang gửi đơn...' : 'Gửi order'}
          </button>
        </aside>
      </div>

      {renderFeedbackModal()}
    </div>
  );
}

export default TableMenu;
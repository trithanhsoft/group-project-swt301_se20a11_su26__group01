import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getAllCategories } from '../../services/categoryService';
import { getAvailableFoods } from '../../services/foodService';
import './CustomerMenu.css';

function CustomerMenu() {
  const { addItem, items } = useCart();

  const [categories, setCategories] = useState(['Tất cả']);
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const mapFoodFromApi = (food) => ({
    id: food.foodId,
    name: food.foodName,
    desc: food.description,
    price: Number(food.price),
    imageUrl: food.imageUrl,
    img: food.emoji || '🍽️',
    rating: food.rating || 0,
    orders: food.orders || 0,
    available: food.isAvailable,
    categoryId: food.categoryId,
    category: food.categoryName
  });

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();

      const activeCategoryNames = data
        .filter(cat => cat.isActive === true)
        .map(cat => cat.categoryName);

      setCategories(['Tất cả', ...activeCategoryNames]);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách category:', error);
      setCategories(['Tất cả']);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFoods = async () => {
    try {
      const data = await getAvailableFoods();
      setFoods(data.map(mapFoodFromApi));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách món ăn:', error);
      setFoods([]);
    } finally {
      setLoadingFoods(false);
    }
  };

  const filtered = foods.filter(d => {
    const matchCat = category === 'Tất cả' || d.category === category;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (dish) => {
    addItem(dish);
    setAdded(dish.id);
    setTimeout(() => setAdded(null), 1200);
  };

  const getQty = (id) => items.find(i => i.id === id)?.qty || 0;

  return (
    <div className="cust-menu">
      <div className="cust-menu-hero">
        <h1>Thực đơn của chúng tôi</h1>
        <p>Khám phá các món ăn ngon được chế biến từ nguyên liệu tươi sạch</p>

        <input
          className="cust-search"
          placeholder="🔍  Tìm món ăn..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="cust-cat-tabs">
        {loadingCategories ? (
          <p>Đang tải danh mục...</p>
        ) : (
          categories.map(cat => (
            <button
              key={cat}
              className={`cust-cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      {loadingFoods ? (
        <p>Đang tải món ăn...</p>
      ) : (
        <div className="cust-dishes-grid">
          {filtered.length > 0 ? (
            filtered.map(dish => (
              <div
                key={dish.id}
                className="cust-dish-card"
                onClick={() => setSelected(dish)}
              >
                <div className="cust-dish-img">
                  {dish.imageUrl ? (
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="cust-dish-photo"
                    />
                  ) : (
                    dish.img
                  )}
                </div>

                <div className="cust-dish-info">
                  <h3>{dish.name}</h3>
                  <p className="cust-dish-desc">{dish.desc}</p>

                  <div className="cust-dish-rating">
                    ⭐ {dish.rating} <span>({dish.orders})</span>
                  </div>

                  <div className="cust-dish-footer">
                    <span className="cust-dish-price">
                      {dish.price.toLocaleString('vi-VN')}đ
                    </span>

                    <button
                      className={`add-cart-btn ${added === dish.id ? 'added' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        handleAdd(dish);
                      }}
                    >
                      {added === dish.id
                        ? '✓'
                        : getQty(dish.id) > 0
                          ? `+1 (${getQty(dish.id)})`
                          : '+ Thêm'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có món ăn nào trong danh mục này.</p>
          )}
        </div>
      )}

      {selected && (
        <div className="dish-modal-overlay" onClick={() => setSelected(null)}>
          <div className="dish-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>

            <div className="modal-img">
              {selected.imageUrl ? (
                <img
                  src={selected.imageUrl}
                  alt={selected.name}
                  className="modal-img-photo"
                />
              ) : (
                selected.img
              )}
            </div>

            <h2>{selected.name}</h2>
            <p className="modal-cat">{selected.category}</p>
            <p className="modal-desc">{selected.desc}</p>

            <div className="modal-rating">
              ⭐ {selected.rating} · {selected.orders} đánh giá
            </div>

            <div className="modal-footer">
              <span className="modal-price">
                {selected.price.toLocaleString('vi-VN')}đ
              </span>

              <button
                className="add-cart-btn"
                onClick={() => {
                  handleAdd(selected);
                  setSelected(null);
                }}
              >
                🛒 Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerMenu;
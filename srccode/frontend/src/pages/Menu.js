import React, { useEffect, useState, useRef } from 'react';
import {
  getAllCategories,
  createCategory,
  deleteCategory as deleteCategoryApi
} from '../services/categoryService';
import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood as deleteFoodApi,
  toggleFoodAvailable
} from '../services/foodService';
import './Menu.css';

function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    img: '🍽️',
    desc: '',
    available: true,
    imageUrl: ''
  });

  const [newCat, setNewCat] = useState('');
  const [tab, setTab] = useState('menu');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);

  const fileRef = useRef();

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const getApiMessage = (data, fallback) => {
    if (!data) return fallback;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      return data.message || data.error || data.detail || fallback;
    }

    return fallback;
  };

  const trimToEmpty = (value) => (value || '').trim();

  const isValidImageUrl = (value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith('data:image/')) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  const getFoodSaveErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (responseData?.message) {
      return responseData.message;
    }

    return 'Không thể lưu món ăn. Vui lòng kiểm tra dữ liệu hoặc backend.';
  };

  const mapFoodFromApi = (food) => ({
    id: food.foodId,
    name: food.foodName || '',
    desc: food.description || '',
    price: Number(food.price || 0),
    imageUrl: food.imageUrl || '',
    img: food.emoji || '🍽️',
    rating: food.rating || 0,
    orders: food.orders || 0,
    available: food.isAvailable ?? food.available ?? true,
    categoryId: food.categoryId,
    category: food.categoryName || 'Chưa phân loại'
  });

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const data = await getAllCategories();
      const activeCategories = (data || []).filter(
        cat => cat.isActive === true || cat.active === true
      );

      setCategories(activeCategories);

      if (activeCategories.length > 0) {
        setForm(prev => ({
          ...prev,
          categoryId: prev.categoryId || activeCategories[0].categoryId
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      alert(getApiMessage(error.response?.data, 'Không thể tải danh mục từ backend.'));
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setLoadingFoods(true);

      const data = await getAllFoods();
      setItems((data || []).map(mapFoodFromApi));
    } catch (error) {
      console.error('Lỗi khi lấy món ăn:', error);
      alert(getApiMessage(error.response?.data, 'Không thể tải món ăn từ backend.'));
    } finally {
      setLoadingFoods(false);
    }
  };

  const categoryNames = categories.map(cat => cat.categoryName);
  const allCategories = ['Tất cả', ...categoryNames];

  const filtered = items.filter(item => {
    const keyword = search.trim().toLowerCase();

    const matchCat =
      activeCategory === 'Tất cả' ||
      item.category === activeCategory;

    const matchSearch =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword);

    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({
      name: '',
      categoryId: categories[0]?.categoryId || '',
      price: '',
      img: '🍽️',
      desc: '',
      available: true,
      imageUrl: ''
    });
    setShowAdd(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      img: item.img,
      desc: item.desc || '',
      available: item.available,
      imageUrl: item.imageUrl || ''
    });
    setShowAdd(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const foodName = trimToEmpty(form.name);
    const description = trimToEmpty(form.desc);
    const imageUrl = trimToEmpty(form.imageUrl);
    const emoji = trimToEmpty(form.img);
    const price = Number(form.price);

    if (!form.categoryId) {
      alert('Vui lòng chọn danh mục.');
      return;
    }

    if (!foodName) {
      alert('Vui lòng nhập tên món.');
      return;
    }

    if (foodName.length > 150) {
      alert('Tên món không được vượt quá 150 ký tự.');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert('Giá món phải lớn hơn 0.');
      return;
    }

    if (description.length > 500) {
      alert('Mô tả món không được vượt quá 500 ký tự.');
      return;
    }

    if (imageUrl.length > 500) {
      alert('URL ảnh không được vượt quá 500 ký tự.');
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      alert('URL ảnh không hợp lệ. Vui lòng dùng liên kết http hoặc https.');
      return;
    }

    if (emoji.length > 50) {
      alert('Icon món không được vượt quá 50 ký tự.');
      return;
    }

    try {
      const foodData = {
        foodName,
        description,
        price,
        imageUrl,
        emoji: emoji || '🍽️',
        rating: editItem ? editItem.rating : 0,
        orders: editItem ? editItem.orders : 0,
        isAvailable: form.available,
        categoryId: Number(form.categoryId)
      };

      if (editItem) {
        await updateFood(editItem.id, foodData);
      } else {
        await createFood(foodData);
      }

      await fetchFoods();

      setShowAdd(false);
      setEditItem(null);
    } catch (error) {
      console.error('Lỗi khi lưu món ăn:', error);
      alert(getFoodSaveErrorMessage(error));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Xóa món này?');

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteFoodApi(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error);
      alert(getApiMessage(error.response?.data, 'Không thể xóa món ăn.'));
    }
  };

  const toggleAvailable = async (id) => {
    try {
      const updatedFood = await toggleFoodAvailable(id);
      const mappedFood = mapFoodFromApi(updatedFood);

      setItems(prev =>
        prev.map(i => i.id === id ? mappedFood : i)
      );
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái món:', error);
      alert(getApiMessage(error.response?.data, 'Không thể đổi trạng thái món ăn.'));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      const imageData = ev.target.result;

      if (imageData.length > 500) {
        alert('Ảnh upload quá lớn để lưu vào trường imageUrl hiện tại. Vui lòng dùng URL ảnh ngắn hơn 500 ký tự.');
        return;
      }

      setForm(f => ({
        ...f,
        imageUrl: imageData,
        img: ''
      }));
    };

    reader.readAsDataURL(file);
  };

  const addCategory = async (e) => {
    e.preventDefault();

    const categoryName = newCat.trim();

    if (!categoryName) {
      return;
    }

    if (categoryNames.some(name => name.toLowerCase() === categoryName.toLowerCase())) {
      alert('Danh mục này đã tồn tại.');
      return;
    }

    try {
      const savedCategory = await createCategory({
        categoryName: categoryName,
        description: '',
        imageUrl: '',
        isActive: true
      });

      setCategories(prev => [...prev, savedCategory]);
      setNewCat('');

      if (!form.categoryId) {
        setForm(prev => ({
          ...prev,
          categoryId: savedCategory.categoryId
        }));
      }
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      alert(getApiMessage(error.response?.data, 'Không thể thêm danh mục. Vui lòng kiểm tra backend.'));
    }
  };

  const deleteCategory = async (cat) => {
    const selectedCategory = categories.find(c => c.categoryName === cat);

    if (!selectedCategory) {
      alert('Không tìm thấy danh mục.');
      return;
    }

    if (items.some(i => i.category === cat)) {
      alert(`Không thể xóa danh mục "${cat}" vì còn món ăn thuộc danh mục này.`);
      return;
    }

    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa danh mục "${cat}" không?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCategoryApi(selectedCategory.categoryId);

      const nextCategories = categories.filter(
        c => c.categoryId !== selectedCategory.categoryId
      );

      setCategories(nextCategories);

      if (activeCategory === cat) {
        setActiveCategory('Tất cả');
      }

      if (Number(form.categoryId) === selectedCategory.categoryId) {
        setForm(prev => ({
          ...prev,
          categoryId: nextCategories[0]?.categoryId || ''
        }));
      }
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      alert(getApiMessage(error.response?.data, 'Không thể xóa danh mục. Vui lòng kiểm tra backend.'));
    }
  };

  return (
    <div className="menu-page">
      <div className="page-header">
        <h1 className="page-title">Thực đơn</h1>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`tab-btn ${tab === 'menu' ? 'active' : ''}`}
            onClick={() => setTab('menu')}
          >
            🍽️ Món ăn
          </button>

          <button
            className={`tab-btn ${tab === 'categories' ? 'active' : ''}`}
            onClick={() => setTab('categories')}
          >
            📂 Danh mục
          </button>

          {tab === 'menu' && (
            <button className="btn-primary" onClick={openAdd}>
              + Thêm món
            </button>
          )}
        </div>
      </div>

      {tab === 'categories' && (
        <div className="cat-manager card">
          <h3>Quản lý danh mục món ăn</h3>

          <form onSubmit={addCategory} className="cat-add-form">
            <input
              className="form-input"
              placeholder="Tên danh mục mới..."
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary">
              + Thêm
            </button>
          </form>

          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="cat-list">
              {categories.length > 0 ? (
                categories.map(cat => (
                  <div key={cat.categoryId} className="cat-item">
                    <span className="cat-name">
                      📂 {cat.categoryName}
                    </span>

                    <span className="cat-count">
                      {items.filter(i => i.category === cat.categoryName).length} món
                    </span>

                    <button
                      className="cat-del-btn"
                      onClick={() => deleteCategory(cat.categoryName)}
                      title="Xóa danh mục"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              ) : (
                <p>Chưa có danh mục nào.</p>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'menu' && (
        <>
          <div className="menu-toolbar">
            <input
              className="search-input"
              placeholder="🔍  Tìm món ăn, danh mục, mô tả..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="filter-tabs">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loadingFoods ? (
            <p>Đang tải món ăn...</p>
          ) : (
            <div className="menu-grid">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <div
                    key={item.id}
                    className={`menu-card card ${!item.available ? 'unavailable' : ''}`}
                  >
                    <div className="menu-img">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="menu-img-photo"
                        />
                      ) : (
                        item.img
                      )}
                    </div>

                    <div className="menu-info">
                      <h3 className="menu-name">{item.name}</h3>
                      <p className="menu-category">{item.category}</p>

                      <div className="menu-footer">
                        <span className="menu-price">
                          {item.price.toLocaleString('vi-VN')}đ
                        </span>

                        <button
                          className={`avail-badge ${item.available ? 'avail-yes' : 'avail-no'}`}
                          onClick={() => toggleAvailable(item.id)}
                        >
                          {item.available ? 'Còn món' : 'Hết món'}
                        </button>
                      </div>
                    </div>

                    <div className="menu-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>

                      <button
                        className="action-btn del-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có món ăn nào.</p>
              )}
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="menu-modal card" onClick={e => e.stopPropagation()}>
            <h2>{editItem ? 'Chỉnh sửa món' : 'Thêm món mới'}</h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Hình ảnh món ăn</label>

                <div
                  className="img-upload-area"
                  onClick={() => fileRef.current.click()}
                >
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="img-preview"
                    />
                  ) : (
                    <div className="img-placeholder">
                      <span style={{ fontSize: 32 }}>
                        {form.img || '🍽️'}
                      </span>
                      <p>Click để upload ảnh</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />

                {form.imageUrl && (
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() =>
                      setForm(f => ({
                        ...f,
                        imageUrl: '',
                        img: '🍽️'
                      }))
                    }
                  >
                    ✕ Xóa ảnh
                  </button>
                )}
                <input
                  className="form-input image-url-input"
                  placeholder="Dán URL ảnh món ăn..."
                  value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
                  onChange={e =>
                    setForm({
                      ...form,
                      imageUrl: e.target.value,
                      img: e.target.value ? '' : form.img
                    })
                  }
                />

                <p className="form-hint">
                  Có thể bỏ trống ảnh hoặc dùng URL http/https ngắn hơn 500 ký tự.
                </p>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Tên món</label>

                  <input
                    className="form-input"
                    value={form.name}
                    onChange={e =>
                      setForm({
                        ...form,
                        name: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon (emoji)</label>

                  <input
                    className="form-input"
                    value={form.img}
                    onChange={e =>
                      setForm({
                        ...form,
                        img: e.target.value
                      })
                    }
                    disabled={!!form.imageUrl}
                    placeholder={form.imageUrl ? 'Đã dùng ảnh' : '🍽️'}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>

                  <select
                    className="form-input"
                    value={form.categoryId}
                    onChange={e =>
                      setForm({
                        ...form,
                        categoryId: e.target.value
                      })
                    }
                    required
                  >
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Giá (đ)</label>

                  <input
                    className="form-input"
                    type="number"
                    min="1000"
                    step="1000"
                    value={form.price}
                    onChange={e =>
                      setForm({
                        ...form,
                        price: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>

                <textarea
                  className="form-input"
                  rows={2}
                  value={form.desc}
                  onChange={e =>
                    setForm({
                      ...form,
                      desc: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={e =>
                      setForm({
                        ...form,
                        available: e.target.checked
                      })
                    }
                  />
                  Còn phục vụ
                </label>
              </div>

              <div className="modal-btns">
                <button type="submit" className="btn-primary">
                  {editItem ? 'Lưu' : 'Thêm'}
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAdd(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;

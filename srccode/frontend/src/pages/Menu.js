import React, { useState, useRef } from 'react';
import { MENU_ITEMS } from '../data/menuData';
import './Menu.css';

const DEFAULT_CATEGORIES = ['Khai vị', 'Món chính', 'Món phụ', 'Tráng miệng', 'Đồ uống'];

function Menu() {
  const [items, setItems]           = useState(MENU_ITEMS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch]         = useState('');
  const [showAdd, setShowAdd]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState({ name:'', category:'Khai vị', price:'', img:'🍽️', desc:'', available: true, imageUrl: '' });
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCat, setNewCat]         = useState('');
  const [tab, setTab]               = useState('menu'); // menu | categories
  const fileRef                     = useRef();

  const allCategories = ['Tất cả', ...categories];

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'Tất cả' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ name:'', category: categories[0], price:'', img:'🍽️', desc:'', available: true, imageUrl: '' });
    setShowAdd(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, price: item.price, img: item.img, desc: item.desc || '', available: item.available, imageUrl: item.imageUrl || '' });
    setShowAdd(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form, price: Number(form.price) } : i));
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), rating: 0, orders: 0 }]);
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa món này?')) setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleAvailable = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  // Upload ảnh — đọc file thành base64 (demo, thực tế gọi API)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, imageUrl: ev.target.result, img: '' }));
    reader.readAsDataURL(file);
  };

  // Category CRUD
  const addCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim() || categories.includes(newCat.trim())) return;
    setCategories(prev => [...prev, newCat.trim()]);
    setNewCat('');
  };

  const deleteCategory = (cat) => {
    if (items.some(i => i.category === cat)) {
      alert(`Không thể xóa danh mục "${cat}" vì còn món ăn thuộc danh mục này.`);
      return;
    }
    setCategories(prev => prev.filter(c => c !== cat));
  };

  return (
    <div className="menu-page">
      <div className="page-header">
        <h1 className="page-title">Thực đơn</h1>
        <div style={{display:'flex', gap:8}}>
          <button className={`tab-btn ${tab === 'menu' ? 'active' : ''}`} onClick={() => setTab('menu')}>🍽️ Món ăn</button>
          <button className={`tab-btn ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>📂 Danh mục</button>
          {tab === 'menu' && <button className="btn-primary" onClick={openAdd}>+ Thêm món</button>}
        </div>
      </div>

      {/* ── Tab: Danh mục ── */}
      {tab === 'categories' && (
        <div className="cat-manager card">
          <h3>Quản lý danh mục món ăn</h3>
          <form onSubmit={addCategory} className="cat-add-form">
            <input className="form-input" placeholder="Tên danh mục mới..."
              value={newCat} onChange={e => setNewCat(e.target.value)} required />
            <button type="submit" className="btn-primary">+ Thêm</button>
          </form>
          <div className="cat-list">
            {categories.map(cat => (
              <div key={cat} className="cat-item">
                <span className="cat-name">📂 {cat}</span>
                <span className="cat-count">{items.filter(i => i.category === cat).length} món</span>
                <button className="cat-del-btn"
                  onClick={() => deleteCategory(cat)}
                  title="Xóa danh mục">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Món ăn ── */}
      {tab === 'menu' && (
        <>
          <div className="menu-toolbar">
            <input className="search-input" placeholder="🔍  Tìm món ăn..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <div className="filter-tabs">
              {allCategories.map(cat => (
                <button key={cat} className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className={`menu-card card ${!item.available ? 'unavailable' : ''}`}>
                {/* Ảnh hoặc emoji */}
                <div className="menu-img">
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} className="menu-img-photo" />
                    : item.img}
                </div>
                <div className="menu-info">
                  <h3 className="menu-name">{item.name}</h3>
                  <p className="menu-category">{item.category}</p>
                  <div className="menu-footer">
                    <span className="menu-price">{item.price.toLocaleString('vi-VN')}đ</span>
                    <button className={`avail-badge ${item.available ? 'avail-yes' : 'avail-no'}`}
                      onClick={() => toggleAvailable(item.id)}>
                      {item.available ? 'Còn món' : 'Hết món'}
                    </button>
                  </div>
                </div>
                <div className="menu-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                  <button className="action-btn del-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Modal thêm/sửa món ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="menu-modal card" onClick={e => e.stopPropagation()}>
            <h2>{editItem ? 'Chỉnh sửa món' : 'Thêm món mới'}</h2>
            <form onSubmit={handleSave}>
              {/* Upload ảnh */}
              <div className="form-group">
                <label className="form-label">Hình ảnh món ăn</label>
                <div className="img-upload-area" onClick={() => fileRef.current.click()}>
                  {form.imageUrl
                    ? <img src={form.imageUrl} alt="preview" className="img-preview" />
                    : <div className="img-placeholder">
                        <span style={{fontSize:32}}>{form.img || '🍽️'}</span>
                        <p>Click để upload ảnh</p>
                      </div>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}}
                  onChange={handleImageUpload} />
                {form.imageUrl && (
                  <button type="button" className="remove-img-btn"
                    onClick={() => setForm(f => ({...f, imageUrl: '', img: '🍽️'}))}>
                    ✕ Xóa ảnh
                  </button>
                )}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Tên món</label>
                  <input className="form-input" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (emoji)</label>
                  <input className="form-input" value={form.img}
                    onChange={e => setForm({...form, img: e.target.value})}
                    disabled={!!form.imageUrl} placeholder={form.imageUrl ? 'Đã dùng ảnh' : '🍽️'} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select className="form-input" value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Giá (đ)</label>
                  <input className="form-input" type="number" value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-input" rows={2} value={form.desc}
                  onChange={e => setForm({...form, desc: e.target.value})} />
              </div>

              <div className="form-group">
                <label style={{display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, cursor:'pointer'}}>
                  <input type="checkbox" checked={form.available}
                    onChange={e => setForm({...form, available: e.target.checked})} />
                  Còn phục vụ
                </label>
              </div>

              <div className="modal-btns">
                <button type="submit" className="btn-primary">{editItem ? 'Lưu' : 'Thêm'}</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;

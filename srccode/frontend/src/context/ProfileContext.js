import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

// Voucher tiers dựa trên tổng chi tiêu
const VOUCHER_TIERS = [
  { minSpend: 500000,   code: 'CGKC5',   discount: 5,  label: 'Thành viên Bạc',   color: '#a0aec0' },
  { minSpend: 1500000,  code: 'CGKC10',  discount: 10, label: 'Thành viên Vàng',  color: '#d69e2e' },
  { minSpend: 3000000,  code: 'CGKC15',  discount: 15, label: 'Thành viên Bạch Kim', color: '#805ad5' },
  { minSpend: 6000000,  code: 'CGKC20',  discount: 20, label: 'Thành viên Kim Cương', color: '#3182ce' },
];

const VOUCHER_CODES = {
  'CGKC5':  { discount: 5,  type: 'percent', label: 'Giảm 5%' },
  'CGKC10': { discount: 10, type: 'percent', label: 'Giảm 10%' },
  'CGKC15': { discount: 15, type: 'percent', label: 'Giảm 15%' },
  'CGKC20': { discount: 20, type: 'percent', label: 'Giảm 20%' },
  'WELCOME': { discount: 50000, type: 'fixed', label: 'Giảm 50.000đ' },
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: 'Khách hàng',
    phone: '',
    email: '',
    birthday: '',
    avatar: '👤',
    totalSpend: 850000,
    orderCount: 7,
    joinDate: '01/01/2026',
  });

  const [usedVouchers, setUsedVouchers] = useState([]);
  const [activeVoucher, setActiveVoucher] = useState(null);

  const updateProfile = (data) => setProfile(prev => ({ ...prev, ...data }));

  const addSpend = (amount) => {
    setProfile(prev => ({
      ...prev,
      totalSpend: prev.totalSpend + amount,
      orderCount: prev.orderCount + 1,
    }));
  };

  // Lấy tier hiện tại
  const getCurrentTier = () => {
    const tiers = [...VOUCHER_TIERS].reverse();
    return tiers.find(t => profile.totalSpend >= t.minSpend) || null;
  };

  // Lấy tier tiếp theo
  const getNextTier = () => {
    return VOUCHER_TIERS.find(t => profile.totalSpend < t.minSpend) || null;
  };

  // Voucher khả dụng dựa trên tier
  const getAvailableVouchers = () => {
    return VOUCHER_TIERS
      .filter(t => profile.totalSpend >= t.minSpend && !usedVouchers.includes(t.code))
      .map(t => ({ ...VOUCHER_CODES[t.code], code: t.code, tier: t.label }));
  };

  // Áp dụng voucher
  const applyVoucher = (code) => {
    const voucher = VOUCHER_CODES[code.toUpperCase()];
    if (!voucher) return { success: false, message: 'Mã voucher không hợp lệ' };
    if (usedVouchers.includes(code.toUpperCase())) return { success: false, message: 'Voucher đã được sử dụng' };
    setActiveVoucher({ ...voucher, code: code.toUpperCase() });
    return { success: true, voucher };
  };

  const clearVoucher = () => setActiveVoucher(null);

  const useVoucher = (code) => {
    setUsedVouchers(prev => [...prev, code]);
    setActiveVoucher(null);
  };

  return (
    <ProfileContext.Provider value={{
      profile, updateProfile, addSpend,
      getCurrentTier, getNextTier,
      getAvailableVouchers, applyVoucher, clearVoucher, useVoucher,
      activeVoucher, VOUCHER_TIERS,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

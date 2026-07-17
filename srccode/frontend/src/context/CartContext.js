import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart_items');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      localStorage.removeItem('cart_items');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const getFoodId = (item) => {
    return item.foodId || item.id;
  };

  const normalizeDish = (dish) => {
    return {
      ...dish,
      foodId: dish.foodId || dish.id,
      id: dish.id || dish.foodId,
      foodName: dish.foodName || dish.name || dish.title,
      name: dish.name || dish.foodName || dish.title,
      price: Number(dish.price || 0),
      imageUrl: dish.imageUrl || dish.image || '',
      emoji: dish.emoji || '',
      qty: dish.qty || dish.quantity || 1
    };
  };

  const addItem = (dish) => {
    const normalizedDish = normalizeDish(dish);
    const foodId = getFoodId(normalizedDish);

    setItems((prev) => {
      const existing = prev.find((item) => getFoodId(item) === foodId);

      if (existing) {
        return prev.map((item) =>
          getFoodId(item) === foodId
            ? {
                ...item,
                qty: item.qty + 1
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...normalizedDish,
          qty: 1
        }
      ];
    });
  };

  const updateQty = (id, qty) => {
    const newQty = Number(qty);

    if (newQty <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        getFoodId(item) === id || item.id === id
          ? {
              ...item,
              qty: newQty
            }
          : item
      )
    );
  };

  const increaseQty = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        getFoodId(item) === id || item.id === id
          ? {
              ...item,
              qty: item.qty + 1
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          getFoodId(item) === id || item.id === id
            ? {
                ...item,
                qty: item.qty - 1
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => getFoodId(item) !== id && item.id !== id)
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart_items');
  };

  const totalItems = items.reduce((sum, item) => {
    return sum + Number(item.qty || 0);
  }, 0);

  const totalPrice = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.qty || 0);
  }, 0);

  const buildOrderItems = () => {
    return items.map((item) => ({
      foodId: getFoodId(item),
      quantity: item.qty
    }));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        buildOrderItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
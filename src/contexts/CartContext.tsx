import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '@/types';
import { toast } from 'sonner';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book: Book, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.book.id === book.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock
        if (newQuantity > book.stock) {
          toast.error('Not enough stock', {
            description: `Only ${book.stock} items available`,
          });
          return prevItems;
        }
        
        toast.success('Cart updated', {
          description: `${book.title} quantity updated`,
        });
        
        return prevItems.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        if (quantity > book.stock) {
          toast.error('Not enough stock', {
            description: `Only ${book.stock} items available`,
          });
          return prevItems;
        }
        
        toast.success('Added to cart! 🛒', {
          description: `${book.title} has been added to your cart`,
        });
        
        return [...prevItems, { book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.book.id === bookId);
      if (item) {
        toast.info('Removed from cart', {
          description: `${item.book.title} has been removed`,
        });
      }
      return prevItems.filter((item) => item.book.id !== bookId);
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.book.id === bookId) {
          if (quantity > item.book.stock) {
            toast.error('Not enough stock', {
              description: `Only ${item.book.stock} items available`,
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'extin_b2b_quote_cart';
const APPLIES_IVA_STORAGE_KEY = 'extin_quote_applies_iva';
const TAX_RATE_STORAGE_KEY = 'extin_quote_tax_rate';

// Official reference prices matching the backend catalog / database seeder
export const REFERENCE_PRICES = {
  'EXT-PQS-5': { product: 25.0, service: 8.5 },
  'EXT-PQS-10': { product: 38.5, service: 12.0 },
  'EXT-PQS-20': { product: 58.0, service: 18.0 },
  'EXT-CO2-5': { product: 65.0, service: 15.0 },
  'EXT-CO2-10': { product: 95.0, service: 24.0 },
  'EXT-CO2-15': { product: 135.0, service: 32.0 },
  'EXT-AGUA-25': { product: 48.0, service: 18.0 },
  'EXT-H2O-25': { product: 48.0, service: 18.0 },
  'EXT-K-6L': { product: 130.0, service: 45.0 },
  'EXT-SOLK-10': { product: 145.0, service: 40.0 },
  'GAB-MET-10': { product: 32.0, service: 15.0 },
  'MANG-INC-30': { product: 85.0, service: 25.0 },
  'VALV-ANG-15': { product: 42.0, service: 15.0 },
  'DET-HUM-OPT': { product: 18.5, service: 10.0 },
};

/**
 * Returns the resolved unit price for an item based on its explicit price or catalog reference.
 */
export const getItemUnitPrice = (item) => {
  if (typeof item.unitPrice === 'number' && item.unitPrice > 0) {
    return item.unitPrice;
  }
  const ref = REFERENCE_PRICES[item.sku];
  if (ref) {
    return item.requestType === 'SERVICE' ? ref.service : ref.product;
  }
  return item.requestType === 'SERVICE' ? 15.0 : 38.5;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fiscal modality state: appliesIva boolean (default: true for official fiscal invoice)
  const [appliesIva, setAppliesIva] = useState(() => {
    try {
      const saved = localStorage.getItem(APPLIES_IVA_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Numeric tax rate percentage (default: 16.0% for Venezuela standard IVA)
  const [taxRate, setTaxRate] = useState(() => {
    try {
      const saved = localStorage.getItem(TAX_RATE_STORAGE_KEY);
      return saved !== null ? Number(saved) : 16;
    } catch {
      return 16;
    }
  });

  // Sync cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  // Sync fiscal modality state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPLIES_IVA_STORAGE_KEY, JSON.stringify(appliesIva));
      localStorage.setItem(TAX_RATE_STORAGE_KEY, String(taxRate));
    } catch (e) {
      console.warn('Failed to save fiscal modality to localStorage:', e);
    }
  }, [appliesIva, taxRate]);

  /**
   * Adds an item to the quote cart.
   * Differentiates between 'PRODUCT' (Equipo Nuevo) and 'SERVICE' (Recarga).
   *
   * @param {Object} product - Product/extinguisher metadata
   * @param {string} requestType - 'PRODUCT' | 'SERVICE'
   * @param {number} quantity - Initial quantity, defaults to 1
   */
  const addToCart = (product, requestType = 'PRODUCT', quantity = 1) => {
    const itemKey = `${product.sku}_${requestType}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemKey);

      if (existingIndex > -1) {
        // Increment quantity if already in cart with the same service type
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Resolve unit price from product or official catalog reference
      const resolvedUnitPrice =
        product.unitPrice ||
        product.basePrice ||
        (product.sku && REFERENCE_PRICES[product.sku]
          ? requestType === 'SERVICE'
            ? REFERENCE_PRICES[product.sku].service
            : REFERENCE_PRICES[product.sku].product
          : requestType === 'SERVICE'
          ? 15.0
          : 38.5);

      // Add new cart entry
      const newItem = {
        id: itemKey,
        sku: product.sku,
        name: product.name,
        category: product.category,
        classType: product.classType,
        capacity: product.capacity,
        agent: product.agent,
        requestType, // 'PRODUCT' | 'SERVICE'
        quantity,
        unitPrice: resolvedUnitPrice,
      };

      return [...prevItems, newItem];
    });
  };

  /**
   * Removes an item from the cart by its composite ID.
   */
  const removeFromCart = (cartItemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  /**
   * Updates the quantity of a specific item. Removes item if quantity <= 0.
   */
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Clears all items from the quote cart.
   */
  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Total count of all items in cart
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Mathematical subtotal of all items
  const subtotal = items.reduce((sum, item) => {
    const price = getItemUnitPrice(item);
    return sum + price * item.quantity;
  }, 0);

  // Tax amount calculation: subtotal * (taxRate / 100) if appliesIva is true, else 0.00
  const taxAmount = appliesIva
    ? (subtotal * (Number(taxRate) || 0)) / 100
    : 0;

  // Total amount: subtotal + taxAmount if appliesIva is true, else subtotal
  const totalAmount = appliesIva ? subtotal + taxAmount : subtotal;

  const value = {
    items,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Fiscal modality and totals
    appliesIva,
    setAppliesIva,
    taxRate,
    setTaxRate,
    subtotal,
    taxAmount,
    totalAmount,
    getItemUnitPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

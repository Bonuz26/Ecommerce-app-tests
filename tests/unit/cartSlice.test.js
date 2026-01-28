import { describe, it, expect, beforeEach, vi } from "vitest";
import cartReducer, { addToCart, clearCart } from "../../src/redux/cartSlice";

const mockLoginUser = (userId, username = "testuser") => {
  const mockUser = { id: userId, username };
  localStorage.getItem.mockReturnValue(btoa(JSON.stringify(mockUser)));
  return mockUser;
};

describe("cartSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      items: [],
    };
    vi.clearAllMocks();
  });

  describe("addToCart", () => {
    // TEST 1. Dodawanie produktu do koszyka zalogowanego użytkownika

    it("should add item to cart", () => {
      const mockUser = mockLoginUser(1);

      const product = { id: 1, title: "Product 1", price: 100 };
      const action = addToCart(product);
      const newState = cartReducer(initialState, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual({ ...product, userId: 1 });
    });

    // TEST 2. Zapobieganie duplikowania produktów u tego samego użytkownika

    it("should not add duplicate item for same user", () => {
      mockLoginUser(1);

      const product = { id: 1, title: "Product 1", price: 100 };

      let state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);

      state = cartReducer(state, addToCart(product));
      expect(state.items).toHaveLength(1);
    });

    // TEST 3. Dodawanie do koszyka tego samego produktu dla różnych użytkowników

    it("should add same product for different users", () => {
      const product = { id: 1, title: "Product 1", price: 100 };

      mockLoginUser(1, "user1");
      let state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(1);

      mockLoginUser(2, "user2");
      state = cartReducer(state, addToCart(product));
      expect(state.items).toHaveLength(2);
      expect(state.items[0].userId).toBe(1);
      expect(state.items[1].userId).toBe(2);
    });

    // TEST 4. Dodawanie różnych produktów do koszyka u zalogowanego użytkownika

    it("should add different items", () => {
      mockLoginUser(1);

      const product1 = { id: 1, title: "Product 1", price: 100 };
      const product2 = { id: 2, title: "Product 2", price: 200 };

      let state = cartReducer(initialState, addToCart(product1));
      state = cartReducer(state, addToCart(product2));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].id).toBe(1);
      expect(state.items[1].id).toBe(2);
    });

    // TEST 5. Użytkownicy niezalogowani nie mogą dodać produktu do koszyka

    it("should not add item when user is not logged in", () => {
      localStorage.getItem.mockReturnValue(null);
      const product = { id: 1, title: "Product 1", price: 100 };

      const state = cartReducer(initialState, addToCart(product));
      expect(state.items).toHaveLength(0);
    });

    // TEST 6. Produkt bez ID nie powinien być dodany do koszyka

    it("should not add product without id", () => {
      mockLoginUser(1);

      const productWithoutId = { title: "Product 1", price: 100 };

      const state = cartReducer(initialState, addToCart(productWithoutId));

      expect(state.items).toHaveLength(0);
    });

    // TEST 7. Produkt z ceną 0 lub ujemną nie powinien być dodany do koszyka

    it("should not add product with zero or negative price", () => {
      mockLoginUser(1);

      const productWithZeroPrice = { id: 1, title: "Product 1", price: 0 };
      let state = cartReducer(initialState, addToCart(productWithZeroPrice));
      expect(state.items).toHaveLength(0);

      const productWithNegativePrice = {
        id: 2,
        title: "Product 2",
        price: -100,
      };
      state = cartReducer(initialState, addToCart(productWithNegativePrice));
      expect(state.items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    // TEST 8. Czyszczenie koszyka zalogowanego użytkownika

    it("should clear current user items", () => {
      mockLoginUser(1, "user1");

      const initialStateWithItems = {
        items: [
          { id: 1, title: "Product 1", userId: 1, price: 100 },
          { id: 2, title: "Product 2", userId: 2, price: 200 },
          { id: 3, title: "Product 3", userId: 1, price: 300 },
        ],
      };

      const state = cartReducer(initialStateWithItems, clearCart());

      expect(state.items).toHaveLength(1);
      expect(state.items[0].userId).toBe(2);
      expect(state.items[0].id).toBe(2);
    });

    // TEST 9. Czyszczenie koszyka nie wpływa na przedmioty innych użytkowników

    it("should not affect other users items", () => {
      mockLoginUser(2, "user2");

      const initialStateWithItems = {
        items: [
          { id: 1, title: "Product 1", userId: 1, price: 100 },
          { id: 2, title: "Product 2", userId: 3, price: 200 },
        ],
      };

      const state = cartReducer(initialStateWithItems, clearCart());
      expect(state.items).toHaveLength(2);
      expect(state.items).toEqual(initialStateWithItems.items);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import wishlistReducer, {
  addToWishlist,
  clearWishlist,
} from "../../src/redux/wishlistSlice";

const mockLoginUser = (userId, username = "testuser") => {
  const mockUser = { id: userId, username };
  localStorage.getItem.mockReturnValue(btoa(JSON.stringify(mockUser)));
  return mockUser;
};

describe("wishlistSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      items: [],
    };
    vi.clearAllMocks();
  });

  describe("addToWishlist", () => {
    // TEST 1. Dodawanie produktu do pustej listy życzeń zalogowanego użytkownika

    it("should add item to empty wishlist", () => {
      const mockUser = mockLoginUser(1);

      const product = { id: 1, title: "Product 1", price: 100 };
      const action = addToWishlist(product);
      const newState = wishlistReducer(initialState, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual({ ...product, userId: 1 });
    });

    // TEST 2. Zapobieganie duplikowania produktów u tego samego użytkownika

    it("should not add duplicate item for same user", () => {
      mockLoginUser(1);

      const product = { id: 1, title: "Product 1", price: 100 };

      let state = wishlistReducer(initialState, addToWishlist(product));
      expect(state.items).toHaveLength(1);

      state = wishlistReducer(state, addToWishlist(product));
      expect(state.items).toHaveLength(1);
    });

    // TEST 3. Dodawanie do listy życzeń tego samego produktu dla różnych użytkowników

    it("should add same product for different users", () => {
      const product = { id: 1, title: "Product 1", price: 100 };

      mockLoginUser(1, "user1");
      let state = wishlistReducer(initialState, addToWishlist(product));
      expect(state.items).toHaveLength(1);

      mockLoginUser(2, "user2");
      state = wishlistReducer(state, addToWishlist(product));
      expect(state.items).toHaveLength(2);
      expect(state.items[0].userId).toBe(1);
      expect(state.items[1].userId).toBe(2);
    });

    // TEST 4. Dodawanie różnych produktów do listy życzeń u zalogowanego użytkownika

    it("should add multiple different items", () => {
      mockLoginUser(1);

      const product1 = { id: 1, title: "Product 1", price: 100 };
      const product2 = { id: 2, title: "Product 2", price: 200 };

      let state = wishlistReducer(initialState, addToWishlist(product1));
      state = wishlistReducer(state, addToWishlist(product2));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].id).toBe(1);
      expect(state.items[1].id).toBe(2);
    });

    // TEST 5. Użytkownicy niezalogowani nie mogą dodać produktu do listy życzeń

    it("should not add item when user is not logged in", () => {
      localStorage.getItem.mockReturnValue(null);

      const product = { id: 1, title: "Product 1", price: 100 };
      const state = wishlistReducer(initialState, addToWishlist(product));

      expect(state.items).toHaveLength(0);
    });

    // TEST 6. Produkt bez ID nie powinien być dodany do listy życzeń

    it("should not add product without id", () => {
      mockLoginUser(1);

      const productWithoutId = { title: "Product 1", price: 100 };
      const state = wishlistReducer(
        initialState,
        addToWishlist(productWithoutId),
      );

      expect(state.items).toHaveLength(0);
    });
  });

  describe("clearWishlist", () => {
    // TEST 7. Czyszczenie listy życzeń dla zalogowanego użytkownika

    it("should clear only current user items", () => {
      mockLoginUser(1, "user1");

      const initialStateWithItems = {
        items: [
          { id: 1, title: "Product 1", userId: 1, price: 100 },
          { id: 2, title: "Product 2", userId: 2, price: 200 },
          { id: 3, title: "Product 3", userId: 1, price: 300 },
        ],
      };

      const state = wishlistReducer(initialStateWithItems, clearWishlist());

      expect(state.items).toHaveLength(1);
      expect(state.items[0].userId).toBe(2);
      expect(state.items[0].id).toBe(2);
    });
  });
});

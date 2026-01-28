import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchProducts, fetchProductById, fetchUsers } from "../../src/api/api";

describe("API Functions with Mocking", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchProducts", () => {
    // TEST 1. Pomyślne pobranie listy produktów

    it("should successfully fetch products", async () => {
      const mockProducts = [
        { id: 1, title: "Product 1", price: 100, category: "electronics" },
        { id: 2, title: "Product 2", price: 200, category: "clothing" },
        { id: 3, title: "Product 3", price: 150, category: "electronics" },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProducts,
      });

      const result = await fetchProducts();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProducts);
      expect(result.data).toHaveLength(3);
      expect(result.error).toBeNull();
      expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
    });

    // TEST 2. Obsługa błędu 404 przy pobieraniu produktów

    it("should handle 404 error when fetching products", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await fetchProducts();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toContain("404");
    });

    // TEST 3. Obsługa błędu sieci

    it("should handle network error", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchProducts();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe("Network error");
    });
  });

  describe("fetchProductById", () => {
    // TEST 4. Pomyślne pobranie szczegółów produktu

    it("should successfully fetch product details by ID", async () => {
      const mockProduct = {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Great product",
        category: "electronics",
        image: "image.jpg",
        rating: { rate: 4.5, count: 100 },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProduct,
      });

      const result = await fetchProductById(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(result.data.id).toBe(1);
      expect(result.error).toBeNull();
      expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products/1");
    });

    // TEST 5. Obsługa błędu dla nieistniejącego produktu

    it("should handle error for non-existent product", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchProductById(9999);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe("fetchUsers", () => {
    // TEST 6. Pomyślne pobranie listy użytkowników

    it("should successfully fetch users", async () => {
      const mockUsers = [
        {
          id: 1,
          email: "john@gmail.com",
          username: "johnd",
          password: "m38rmF$",
          name: { firstname: "John", lastname: "Doe" },
        },
        {
          id: 2,
          email: "morrison@gmail.com",
          username: "mor_2314",
          password: "83r5^_",
          name: { firstname: "David", lastname: "Morrison" },
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      });

      const result = await fetchUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(result.data).toHaveLength(2);
      expect(result.error).toBeNull();
      expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/users");
    });

    // TEST 7. Obsługa błędu serwera (500)

    it("should handle server error (500)", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const result = await fetchUsers();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toContain("500");
    });

    // TEST 8. Obsługa timeout/abort

    it("should handle fetch timeout", async () => {
      global.fetch.mockRejectedValueOnce(
        new Error("The operation was aborted"),
      );

      const result = await fetchUsers();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe("The operation was aborted");
    });
  });

  describe("Multiple API calls", () => {
    // TEST 9. Sekwencyjne wywołania API

    it("should handle multiple sequential API calls", async () => {
      const mockProducts = [{ id: 1, title: "Product 1" }];
      const mockUsers = [{ id: 1, username: "user1" }];

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProducts,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsers,
        });

      const productsResult = await fetchProducts();
      const usersResult = await fetchUsers();

      expect(productsResult.success).toBe(true);
      expect(usersResult.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // TEST 10. Równoległe wywołania API

    it("should handle parallel API calls", async () => {
      const mockProducts = [{ id: 1, title: "Product 1" }];
      const mockProduct = { id: 1, title: "Product 1", price: 100 };
      const mockUsers = [{ id: 1, username: "user1" }];

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProducts,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsers,
        });

      const [productsResult, productResult, usersResult] = await Promise.all([
        fetchProducts(),
        fetchProductById(1),
        fetchUsers(),
      ]);

      expect(productsResult.success).toBe(true);
      expect(productResult.success).toBe(true);
      expect(usersResult.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});

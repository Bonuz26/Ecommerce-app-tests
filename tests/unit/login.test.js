import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateAndFindUser,
  storeUserInLocalStorage,
  removeUserFromLocalStorage,
} from "../../src/context/UserContext";

const createMockUsers = () => [
  {
    id: 1,
    email: "user1@test.com",
    password: "password123",
    username: "user1",
  },
  { id: 2, email: "user2@test.com", password: "pass456", username: "user2" },
  { id: 3, email: "user3@test.com", password: "pass789", username: "user3" },
];

describe("Login Logic - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("validateAndFindUser", () => {
    // TEST 1. Pomyślne znalezienie użytkownika z poprawnymi danymi

    it("should find user with correct credentials", () => {
      const users = createMockUsers();
      const credentials = { email: "user1@test.com", password: "password123" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeDefined();
      expect(foundUser).not.toBeNull();
      expect(foundUser.id).toBe(1);
      expect(foundUser.username).toBe("user1");
    });

    // TEST 2. Odrzucenie niepoprawnego emaila

    it("should return null for incorrect email", () => {
      const users = createMockUsers();
      const credentials = { email: "wrong@test.com", password: "password123" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 3. Odrzucenie niepoprawnego hasła

    it("should return null for incorrect password", () => {
      const users = createMockUsers();
      const credentials = {
        email: "user1@test.com",
        password: "wrongpassword",
      };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 4. Logowanie z pustą listą użytkowników

    it("should return null when user list is empty", () => {
      const users = [];
      const credentials = { email: "user@test.com", password: "password" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 5. Znalezienie drugiego użytkownika z listy

    it("should find second user from the list", () => {
      const users = createMockUsers();
      const credentials = { email: "user2@test.com", password: "pass456" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(2);
      expect(foundUser.username).toBe("user2");
    });

    // TEST 6. Puste dane logowania

    it("should return null for empty credentials", () => {
      const users = createMockUsers();
      const credentials = { email: "", password: "" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 7. Brak hasła

    it("should return null when password is missing", () => {
      const users = createMockUsers();
      const credentials = { email: "user1@test.com", password: "" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 8. Brak emaila

    it("should return null when email is missing", () => {
      const users = createMockUsers();
      const credentials = { email: "", password: "password123" };

      const foundUser = validateAndFindUser(credentials, users);

      expect(foundUser).toBeNull();
    });

    // TEST 9. Undefined jako credentials

    it("should return null when credentials is undefined", () => {
      const users = createMockUsers();

      const foundUser = validateAndFindUser(undefined, users);

      expect(foundUser).toBeNull();
    });
  });

  describe("storeUserInLocalStorage", () => {
    // TEST 10. Zapisywanie użytkownika do localStorage

    it("should store user in localStorage", () => {
      const user = { id: 1, email: "user@test.com", username: "testuser" };

      const result = storeUserInLocalStorage(user);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "currentUser",
        expect.any(String),
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("login", true);
    });

    // TEST 11. Dekodowanie użytkownika z localStorage

    it("should encode user data correctly", () => {
      const user = { id: 5, email: "test@example.com", username: "testuser" };

      storeUserInLocalStorage(user);

      const [[, encodedUser]] = localStorage.setItem.mock.calls.filter(
        (call) => call[0] === "currentUser",
      );

      const decodedUser = JSON.parse(atob(encodedUser));
      expect(decodedUser).toEqual(user);
      expect(decodedUser.id).toBe(5);
      expect(decodedUser.username).toBe("testuser");
    });

    // TEST 12. Nie zapisywanie null użytkownika

    it("should return false when user is null", () => {
      const result = storeUserInLocalStorage(null);

      expect(result).toBe(false);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    // TEST 13. Nie zapisywanie undefined użytkownika

    it("should return false when user is undefined", () => {
      const result = storeUserInLocalStorage(undefined);

      expect(result).toBe(false);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("removeUserFromLocalStorage", () => {
    // TEST 14. Wylogowanie - czyszczenie localStorage

    it("should clear user data from localStorage on logout", () => {
      removeUserFromLocalStorage();

      expect(localStorage.setItem).toHaveBeenCalledWith("currentUser", null);
      expect(localStorage.setItem).toHaveBeenCalledWith("login", false);
    });
  });
});

import {
  REACT_APP_PRODUCTS_API,
  REACT_APP_PRODUCT_DETAILS_API,
  REACT_APP_USERS_API,
} from "../utils";

// Fetch all products from API
export const fetchProducts = async () => {
  try {
    const response = await fetch(REACT_APP_PRODUCTS_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

// Fetch product details by ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(REACT_APP_PRODUCT_DETAILS_API + id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

// Fetch all users from API
export const fetchUsers = async () => {
  try {
    const response = await fetch(REACT_APP_USERS_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

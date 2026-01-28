import { createSlice, current } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // Check if user is logged in
      const userDataFromStorage = localStorage.getItem("currentUser");
      if (!userDataFromStorage) {
        return; // Exit early if not logged in
      }

      let currentUser = JSON.parse(atob(userDataFromStorage));

      // Validate product exists and is an object
      if (!action.payload || typeof action.payload !== "object") {
        return; // Exit early if product is null, undefined, or not an object
      }

      // Validate product has required fields
      if (!action.payload.id || typeof action.payload.id !== "number") {
        return; // Exit early if product doesn't have a valid numeric ID
      }

      // Validate product has valid price
      if (!action.payload.price || action.payload.price <= 0) {
        return; // Exit early if product doesn't have a valid price
      }

      // Validate price is a number
      if (typeof action.payload.price !== "number") {
        return; // Exit early if price is not a number
      }

      // check for already added data
      const isPresent = state.items.filter(
        (item) =>
          item.id === action.payload.id && currentUser.id === item.userId,
      );
      // console.log('ispresent', isPresent);
      // console.log('addto cart called form slice',action.payload);

      if (isPresent.length == 0) {
        const combined = {
          ...action.payload,
          userId: currentUser.id,
        };
        console.log("combined data", combined);

        state.items.push(combined);
        // alert('Added to Cart');
        swal("Congratulations!", "Item added to cart", "success");
      } else {
        // alert("Already added to cart");
        swal("Sorry!", "Item already added to cart", "error");
      }
    },
    clearCart: (state, action) => {
      // Check if user is logged in
      const userDataFromStorage = localStorage.getItem("currentUser");
      if (!userDataFromStorage) {
        return; // Exit early if not logged in
      }

      let currentUser = JSON.parse(atob(userDataFromStorage));

      // const othersData = current(state.items.filter((item) => item.userId !== currentUser.id))
      let othersData = [];
      for (let i = 0; i < state.items.length; i++) {
        let curr = current(state.items[i]);

        console.log("current data", curr);
        if (curr.userId !== currentUser.id) othersData.push(curr);
      }
      console.log("other data", othersData);
      console.log("clear cart called from slice");
      state.items = othersData;
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

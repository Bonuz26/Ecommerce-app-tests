import { createSlice, current } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      // Check if user is logged in
      const userDataFromStorage = localStorage.getItem("currentUser");
      if (!userDataFromStorage) {
        return; // Exit early if not logged in
      }

      let currentUser = JSON.parse(atob(userDataFromStorage));

      // Validate product has required fields
      if (!action.payload.id) {
        return; // Exit early if product doesn't have an ID
      }

      const isPresent = state.items.filter(
        (item) =>
          item.id === action.payload.id && currentUser.id === item.userId,
      );
      // console.log('ispresent', isPresent);
      // console.log('addto cart called form slice',action.payload);
      if (isPresent.length == 0) {
        // add userid with each product , for check whther this product belongs to which user
        // add userdata along with the product
        const combined = {
          ...action.payload,
          userId: currentUser.id,
        };
        console.log("combined data", combined);

        state.items.push(combined);
        // alert('Added to wishlist');
        swal("Congratulations!", "Item added to wishlist", "success");
      } else {
        // alert("Already added to wishlist");
        swal("Sorry!", "Item already added to wishlist", "error");
      }
    },
    clearWishlist: (state, action) => {
      // Check if user is logged in
      const userDataFromStorage = localStorage.getItem("currentUser");
      if (!userDataFromStorage) {
        return; // Exit early if not logged in
      }

      // remove only current user data
      let currentUser = JSON.parse(atob(userDataFromStorage));

      // const othersData = current(state.items.filter((item) => item.userId !== currentUser.id))
      let othersData = [];
      for (let i = 0; i < state.items.length; i++) {
        let curr = current(state.items[i]);

        console.log("current data", curr);
        if (curr.userId !== currentUser.id) othersData.push(curr);
      }
      console.log("other data", othersData);
      console.log("clear wishlist called from slice");
      state.items = othersData;
      // return othersData;
    },
  },
});

export const { addToWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

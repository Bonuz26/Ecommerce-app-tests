import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import wishlistSlice from "./wishlistSlice";

const Store = configureStore({
    reducer: {
        cart: cartSlice,
        wishlist: wishlistSlice
    }
})

export default Store;
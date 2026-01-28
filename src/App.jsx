import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import context
import UserContext from './context/UserContext';

// import components
import Header from './components/Header';
import Home from './components/Home';
import Cart from './components/Cart';
import Login from './components/Login';
import Error from './components/Error';
import ProductDetails from './components/ProductDetails';
import Profile from './components/Profile';

// redux setup
import { Provider } from 'react-redux';
import Store from './redux/Store';
import WishList from './components/WishList';
import ThemeContext, { themeContext } from './context/ThemeContext';
import Checkout from './components/Checkout';

export default function App() {

  const { darkMode } = useContext(themeContext);
  return (

      <div className={` ${darkMode && (darkMode == 'true' || darkMode == true) && 'dark'} dark:bg-gray-900`}>


        <UserContext>
          <Provider store={Store}>



            <BrowserRouter>

              <div>
                {/* <h1 className="font-bold text-xl">App is working</h1> */}
                <Header />
              </div>



              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<WishList />} />
                <Route path='/productdetails/:id' element={<ProductDetails />} />
                <Route path='/login' element={<Login />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='*' element={<Error />} />

              </Routes>
            </BrowserRouter>
          </Provider>
        </UserContext>
      </div>
  )
}

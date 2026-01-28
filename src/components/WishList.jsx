import React, { useContext } from 'react';
import { userContext } from '../context/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import ShowProduct from './ShowProduct';
import { clearWishlist } from '../redux/wishlistSlice';


export default function WishList() {

  const { isLoggedIn } = useContext(userContext);
  const temp = localStorage.getItem('currentUser')

  let currentUser=[];
  if(temp && temp!='null')
    currentUser = JSON.parse(atob(temp))
  console.log('current user from wishlist', currentUser)


  // displatch clear wishlist
  const dispatch = useDispatch();
  const handleClearWishlist = ()=>{
    console.log('handle clear list called')
    dispatch(clearWishlist());
  }


  // fetch wishlist data
  const wishlistItems = useSelector(store => store.wishlist.items);
  console.log('wishlist items', wishlistItems);

  const currentUserData = [];
  for(let i=0;i<wishlistItems.length;i++){
    if(wishlistItems[i].userId == currentUser.id){
      currentUserData.push(wishlistItems[i]);
    }
  }

  console.log('current user data from wishlist', currentUserData);

  return (currentUserData.length == 0) ?
    (<div className="flex items-center justify-center h-screen dark:bg-gray-900 ">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-bounce  dark:text-white">Oops! No item found in wishlist</h1>
      <p className="text-gray-600  dark:text-gray-300">Please add some Items.</p>
    </div>
  </div>) : (
    <div className='dark:bg-gray-900 h-[92vh]'>

      <div className="container flex flex-wrap justify-center mx-auto py-10">

        {currentUserData.map((item, index) => (

          <ShowProduct data={item} key={item.id} />
        ))}

        <div className="flex justify-center mx-auto my-5 w-full">

          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-1/4"
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </button>
        </div>

      </div>

    </div>
  )
}

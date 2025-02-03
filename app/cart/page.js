// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useUser, RedirectToSignIn, useAuth } from '@clerk/nextjs';

// export default function Cart() {
//   const [cart, setCart] = useState({ products: [] }); // Cart items state
//   const [total, setTotal] = useState(0); // Total cost state
//   const [error, setError] = useState(null); // Error state
//   const [isLoading, setIsLoading] = useState(true); // Loading state for fetch operations

//   const { isLoaded, isSignedIn, user } = useUser(); // Clerk user state
//   const { getToken } = useAuth(); // Clerk token getter

//   // Debugging: Log the user state
//   useEffect(() => {
//     if (isLoaded) {
//       console.log('Clerk User:', user);
//       if (!user) {
//         console.error('User is undefined. Please check Clerk integration.');
//       }
//     }
//   }, [isLoaded, user]);

//   // Effect: Fetch cart items
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         setError(null);
//         setIsLoading(true);
//         const token = await getToken();
//         if (!token) throw new Error('Authentication token missing.');

//         const { data } = await axios.get('/api/cart', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCart(data);
//       } catch (err) {
//         console.error('Failed to fetch cart items:', err);
//         setError('Failed to fetch cart items. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isSignedIn) fetchCart();
//   }, [isSignedIn, getToken]);

//   // Effect: Calculate total whenever cart changes
//   useEffect(() => {
//     const calculateTotal = () => {
//       const totalAmount = cart.products.reduce(
//         (acc, item) => acc + item.item.price * item.quantity,
//         0
//       );
//       setTotal(totalAmount.toFixed(2));
//     };

//     calculateTotal();
//   }, [cart]);

//   // Update quantity handler
//   const handleUpdateQuantity = async (productId, newQuantity) => {
//     if (newQuantity < 1) return;
//     try {
//       setError(null);
//       const token = await getToken();
//       if (!token) throw new Error('Authentication token missing.');

//       await axios.put(
//         '/api/cart',
//         { productId, quantity: newQuantity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCart((prevCart) => ({
//         ...prevCart,
//         products: prevCart.products.map((product) =>
//           product.item._id === productId
//             ? { ...product, quantity: newQuantity }
//             : product
//         ),
//       }));
//     } catch (err) {
//       console.error('Failed to update item quantity:', err);
//       setError('Failed to update item quantity. Please try again.');
//     }
//   };

//   // Remove item handler
//   const handleRemoveItem = async (productId) => {
//     try {
//       setError(null);
//       const token = await getToken();
//       if (!token) throw new Error('Authentication token missing.');

//       await axios.delete('/api/cart', {
//         data: { productId },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCart((prevCart) => ({
//         ...prevCart,
//         products: prevCart.products.filter(
//           (product) => product.item._id !== productId
//         ),
//       }));
//     } catch (err) {
//       console.error('Failed to remove item:', err);
//       setError('Failed to remove item. Please try again.');
//     }
//   };

//   // Handle checkout for a single product
//   const handleCheckoutItem = async (productId) => {
//     try {
//       setError(null);
//       if (!user?.id) throw new Error('User ID is missing.');

//       const token = await getToken();
//       if (!token) throw new Error('Authentication token missing.');

//       const product = cart.products.find((p) => p.item._id === productId);

//       if (!product) throw new Error('Product not found in cart.');

//       const cartItems = [
//         {
//           productId,
//           quantity: product.quantity,
//         },
//       ];

//       const response = await axios.post(
//         '/api/stripe',
//         {
//           cartItems,
//           metadata: {
//             userId: user.id,
//             cartItems: JSON.stringify(cartItems),
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         window.location.href = response.data.url;
//       }
//     } catch (err) {
//       console.error('Checkout Item Error:', err.response?.data || err.message);
//       setError('Failed to proceed to checkout. Please try again.');
//     }
//   };

//   // Handle checkout for all products
//   const handleCheckoutAll = async () => {
//     try {
//       setError(null);
//       if (!user?.id) throw new Error('User ID is missing.');

//       const token = await getToken();
//       if (!token) throw new Error('Authentication token missing.');

//       const cartItems = cart.products.map((product) => ({
//         productId: product.item._id,
//         quantity: product.quantity,
//       }));

//       const response = await axios.post(
//         '/api/stripe',
//         {
//           cartItems,
//           metadata: {
//             userId: user.id,
//             cartItems: JSON.stringify(cartItems),
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         window.location.href = response.data.url;
//       }
//     } catch (err) {
//       console.error('Checkout All Error:', err.response?.data || err.message);
//       setError('Failed to proceed to checkout. Please try again.');
//     }
//   };

//   if (!isLoaded || isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isSignedIn) {
//     return <RedirectToSignIn />;
//   }

//   return (
//     <div className="min-h-screen bg-[#EEECED] p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Your Cart
//         </h1>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {cart.products.length === 0 ? (
//           <p className="text-center text-gray-500">Your cart is empty!</p>
//         ) : (
//           <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//             {cart.products.map(({ item, quantity }) => (
//               <div
//                 key={item._id}
//                 className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
//               >
//                 <div className="w-24 h-24 overflow-hidden rounded-lg mb-4 sm:mb-0">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="flex-1 sm:px-4 text-center sm:text-left">
//                   <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
//                   <p className="text-sm text-gray-500">{item.category}</p>
//                 </div>

//                 <div className="flex gap-x-3">
//                   <div className="flex items-center space-x-4">
//                     <p className="text-lg font-bold text-green-600">
//                       ${(item.price * quantity).toFixed(2)}
//                     </p>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
//                         onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
//                       >
//                         -
//                       </button>
//                       <span className="px-4 py-1 bg-gray-100 rounded-lg">
//                         {quantity}
//                       </span>
//                       <button
//                         className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
//                         onClick={() => handleUpdateQuantity(item._id, quantity + 1)}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0 space-y-2 sm:space-y-0">
//                     <button
//                       className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
//                       onClick={() => handleRemoveItem(item._id)}
//                     >
//                       Remove
//                     </button>
//                     <button
//                       className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
//                       onClick={() => handleCheckoutItem(item._id)}
//                     >
//                       Checkout Item
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <div className="flex justify-between items-center border-t pt-4 mt-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Total: <span className="text-green-600">${total}</span>
//               </h2>
//               <button
//                 className="bg-[#2D332F] text-white rounded-lg px-6 py-2 hover:bg-gray-800 transition duration-200"
//                 onClick={handleCheckoutAll}
//               >
//                 Checkout All
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, RedirectToSignIn, useAuth } from '@clerk/nextjs';

export default function Cart() {
  const [cart, setCart] = useState({ products: [] }); // Cart items state
  const [total, setTotal] = useState(0); // Total cost state
  const [error, setError] = useState(null); // Error state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const { isLoaded, isSignedIn, user } = useUser(); // Clerk user state
  const { getToken } = useAuth(); // Clerk token getter

  const primaryEmail =
  user.primaryEmailAddress?.emailAddress ||
  (user.emailAddresses && user.emailAddresses.length > 0
    ? user.emailAddresses[0].emailAddress
    : null);

  // Debugging: Log user state
  useEffect(() => {
    if (isLoaded) {
      console.log('Clerk User:', user);
      if (!user) console.error('User is undefined. Please check Clerk integration.');
    }
  }, [isLoaded, user]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const token = await getToken();
        if (!token) throw new Error('Authentication token missing.');

        const { data } = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(data);
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to fetch cart items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) fetchCart();
  }, [isSignedIn, getToken]);

  // Calculate total
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cart.products.reduce(
        (acc, item) => acc + item.item.price * item.quantity,
        0
      );
      setTotal(totalAmount.toFixed(2));
    };

    calculateTotal();
  }, [cart]);

  // Update item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Authentication token missing.');

      await axios.put(
        '/api/cart',
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((product) =>
          product.item._id === productId
            ? { ...product, quantity: newQuantity }
            : product
        ),
      }));
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      setError('Failed to update item quantity. Please try again.');
    }
  };

  // Remove item
  const handleRemoveItem = async (productId) => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Authentication token missing.');

      await axios.delete('/api/cart', {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.filter(
          (product) => product.item._id !== productId
        ),
      }));
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // // Checkout single item
  // const handleCheckoutItem = async (productId) => {
  //   try {
  //     setError(null);
  //     if (!user?.id) throw new Error('User ID is missing.');

  //     const token = await getToken();
  //     if (!token) throw new Error('Authentication token missing.');

  //     const product = cart.products.find((p) => p.item._id === productId);
  //     if (!product) throw new Error('Product not found in cart.');

  //     const cartItems = [{ productId, quantity: product.quantity }];

  //     const response = await axios.post(
  //       '/api/stripe',
  //       { cartItems, userId: user.id },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.status === 200) {
  //       window.location.href = response.data.url;
  //     }
  //   } catch (err) {
  //     console.error('Checkout Item Error:', err.response?.data || err.message);
  //     setError('Failed to proceed to checkout. Please try again.');
  //   }
  // };


  const handleCheckoutItem = async (productId) => {
    try {
      setError(null);
      if (!user?.id) throw new Error('User ID is missing.');
  
      const token = await getToken();
      if (!token) throw new Error('Authentication token missing.');
  
      const product = cart.products.find((p) => p.item._id === productId);
      if (!product) throw new Error('Product not found in cart.');
  
      const cartItems = [{ productId, quantity: product.quantity }];
  
      const response = await axios.post(
        '/api/stripe',
        { cartItems, userId: user.id ,customerEmail: primaryEmail},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        window.location.href = response.data.url;
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error('Checkout Item Error:', err.response?.data || err.message);
      setError(`Checkout failed: ${err.response?.data?.error || err.message}`);
    }
  };
  
  // Checkout all items
  const handleCheckoutAll = async () => {
    try {
      setError(null);
      if (!user?.id) throw new Error('User ID is missing.');

      const token = await getToken();
      if (!token) throw new Error('Authentication token missing.');

      const cartItems = cart.products.map((product) => ({
        productId: product.item._id,
        quantity: product.quantity,
      }));

      const response = await axios.post(
        '/api/stripe',
        { cartItems, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Checkout All Error:', err.response?.data || err.message);
      setError('Failed to proceed to checkout. Please try again.');
    }
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-[#EEECED] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Cart</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {cart.products.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty!</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {cart.products.map(({ item, quantity }) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
              >
                <div className="w-24 h-24 overflow-hidden rounded-lg mb-4 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 sm:px-4 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex gap-x-3">
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-bold text-green-600">
                      ${(item.price * quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 rounded-lg">{quantity}</span>
                      <button
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => handleUpdateQuantity(item._id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0 space-y-2 sm:space-y-0">
                    <button
                      className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                      onClick={() => handleCheckoutItem(item._id)}
                    >
                      Checkout Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-4 mt-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Total: <span className="text-green-600">${total}</span>
              </h2>
              <button
                className="bg-[#2D332F] text-white rounded-lg px-6 py-2 hover:bg-gray-800 transition duration-200"
                onClick={handleCheckoutAll}
              >
                Checkout All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

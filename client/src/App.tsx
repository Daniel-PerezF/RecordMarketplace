import './App.css';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import { ProductPage } from './pages/ProductPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ShoppingCartPage } from './pages/ShoppingCartPage';
import { useEffect, useState } from 'react';
import { AppContext } from './components/AppContext';
import { CartItemsProps, Product, User } from './types/types';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItemsProps[]>([]);
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function loadCart() {
      const getToken = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/cart`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setCartItems(result);
      } catch (error) {
        console.error(error);
      }
    }
    loadCart();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      signIn(JSON.parse(user), token);
    }
  }, []);

  async function addToCart(product: Product) {
    try {
      if (!token) {
        alert('Sign in or make an account to purchase records!');
      }
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recordId: product?.recordId,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setCartItems([...cartItems, result]);
      console.log('Product added to cart:', result);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async function signIn(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    console.log('user:', user, 'token:', token);
  }
  async function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(undefined);
    setToken(undefined);
    console.log('user:', user, 'token:', token);
  }

  async function removeFromCart() {}

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    signIn,
    signOut,
    user,
    token,
  };
  return (
    <div>
      <AppContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="CreateAccount" element={<CreateAccountPage />} />
          <Route path="CreateListing" element={<CreateListingPage />} />
          <Route path="ProductPage" element={<ProductPage />} />
          <Route
            path="ProductDetailsPage/:recordId"
            element={<ProductDetailsPage />}
          />
          <Route path="ShoppingCart" element={<ShoppingCartPage />} />
        </Routes>
      </AppContext.Provider>
    </div>
  );
}

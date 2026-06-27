import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaBook } from 'react-icons/fa';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBook className="brand-icon" />
          BookStore
        </Link>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/catalog" className="nav-link">Catalog</Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link cart-link">
              <FaShoppingCart />
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
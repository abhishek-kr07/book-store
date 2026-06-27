import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
  };

  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        <div className="book-card-image">
          <img src={book.image} alt={book.title} />
          <div className="book-card-overlay">
            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={book.stock === 0}
            >
              <FaShoppingCart /> {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
          <div className="book-card-footer">
            <div className="book-rating">
              <FaStar className="star-icon" />
              <span>{book.rating}</span>
            </div>
            <div className="book-price">${book.price.toFixed(2)}</div>
          </div>
          <span className="book-category">{book.category}</span>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;


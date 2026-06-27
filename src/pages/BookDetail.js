import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { books } from '../data/books';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const book = books.find(b => b.id === parseInt(id));

  if (!book) {
    return (
      <div className="container">
        <div className="book-detail-error">
          <h2>Book not found</h2>
          <button onClick={() => navigate('/catalog')} className="btn btn-primary">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, 1);
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Back
        </button>

        <div className="book-detail-container">
          <div className="book-detail-image">
            <img src={book.image} alt={book.title} />
          </div>

          <div className="book-detail-info">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>
            
            <div className="book-detail-meta">
              <div className="book-rating">
                <FaStar className="star-icon filled" />
                <span>{book.rating}</span>
                <span className="rating-text">({Math.floor(Math.random() * 100 + 50)} reviews)</span>
              </div>
              <span className="book-category-badge">{book.category}</span>
            </div>

            <div className="book-detail-price">
              <span className="price">${book.price.toFixed(2)}</span>
              {book.stock > 0 ? (
                <span className="stock-status in-stock">In Stock ({book.stock} available)</span>
              ) : (
                <span className="stock-status out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="book-detail-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>

            <div className="book-detail-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;


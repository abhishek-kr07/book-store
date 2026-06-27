import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { books } from '../data/books';
import { FaBook, FaSearch, FaTags } from 'react-icons/fa';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const featuredBooks = books.slice(0, 6);
  
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to BookStore</h1>
          <p className="hero-subtitle">Discover your next favorite book from our curated collection</p>
          <Link to="/catalog" className="btn btn-primary btn-large">
            Browse All Books
          </Link>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-filters">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Books</h2>
          <div className="books-grid">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* All Books Section (if filtered) */}
      {(searchTerm || selectedCategory !== 'All') && (
        <section className="all-books-section">
          <div className="container">
            <h2 className="section-title">
              {filteredBooks.length > 0 
                ? `Found ${filteredBooks.length} Book${filteredBooks.length !== 1 ? 's' : ''}`
                : 'No Books Found'
              }
            </h2>
            {filteredBooks.length > 0 && (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <FaBook className="feature-icon" />
              <h3>Wide Selection</h3>
              <p>Browse through hundreds of books across various genres</p>
            </div>
            <div className="feature-item">
              <FaSearch className="feature-icon" />
              <h3>Easy Search</h3>
              <p>Find your favorite books quickly with our powerful search</p>
            </div>
            <div className="feature-item">
              <FaTags className="feature-icon" />
              <h3>Best Prices</h3>
              <p>Competitive prices on all books with regular discounts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

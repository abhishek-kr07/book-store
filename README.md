# Book Store

A full-featured React-based online bookstore application with user authentication, shopping cart, admin panel, and support ticketing system.

## Features

### 🛍️ Shopping Features
- **Catalog**: Browse books with filtering by category
- **Search**: Search books by title or author
- **Shopping Cart**: Add/remove books and manage quantities
- **Checkout**: Secure checkout process with order management
- **Book Details**: Detailed book information, ratings, and reviews

### 👥 User Management
- **Authentication**: User registration and login with Firebase
- **User Profile**: View and manage user account information
- **Password Recovery**: Forgot password functionality
- **Protected Routes**: Secure pages for authenticated users only

### 📊 Admin Panel
- **Dashboard**: Overview of sales and statistics
- **Book Management**: Add, edit, and delete books
- **Order Management**: View and manage customer orders
- **Analytics**: View store statistics and metrics

### 🎫 Support System
- **Ticket Creation**: Users can create support tickets
- **Ticket Management**: View ticket status and history
- **Comments**: Add comments to support tickets

## Tech Stack

- **Frontend**: React.js
- **State Management**: Context API (Authentication, Cart, Toast notifications)
- **Backend**: Firebase (Authentication, Database)
- **Styling**: CSS
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── BookCard.js     # Book card display
│   ├── CategoryFilter.js
│   ├── SearchBar.js
│   ├── Navbar.js
│   ├── Toast.js        # Notification system
│   └── ... other components
├── pages/              # Page components
│   ├── Home.js
│   ├── Catalog.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── AdminPanel.js
│   ├── Login.js
│   ├── Register.js
│   └── ... other pages
├── context/            # Context providers
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── ToastContext.js
├── services/           # External services
│   └── firebase.js     # Firebase configuration
├── data/               # Static data
│   └── books.js
└── App.js             # Main component
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhishek-kr07/book-store.git
cd book-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Create a `.env` or `.env.local` file in the root directory
   - Add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation.**

## Key Components

### AuthContext
- Manages user authentication state
- Provides login, register, and logout functions
- Handles Firebase authentication

### CartContext
- Manages shopping cart state
- Provides add/remove/update cart item functions
- Persists cart data

### ToastContext
- Manages notification/toast messages
- Provides global toast notifications across the app

## Firebase Integration

The app uses Firebase for:
- User Authentication (Email/Password)
- Real-time Database (Firestore)
- File Storage (for book covers and documents)

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Book recommendations based on user history
- Email notifications
- Book reviews and ratings system
- Advanced search filters
- Wishlist functionality
- Social sharing features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- GitHub: [@abhishek-kr07](https://github.com/abhishek-kr07)

---

**Note**: Make sure to configure your Firebase credentials before deploying to production.

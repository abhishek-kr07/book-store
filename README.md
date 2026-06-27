# QuickDesk - Help Desk Solution

## Overview

QuickDesk is a simple, easy-to-use help desk solution where users can raise support tickets, and support staff can manage and resolve them efficiently. The system aims to streamline communication between users and support teams without unnecessary complexity.

## Features

### For End Users
- Register and login to the system
- Create tickets with subject, description, category, and optional attachment
- View and track ticket status
- Search and filter tickets by status, category, and more
- Sort tickets by creation date, update date, or comment count
- Add comments and updates to existing tickets

### For Support Agents
- View all tickets or filter to assigned tickets
- Update ticket status (Open → In Progress → Resolved → Closed)
- Assign tickets to themselves
- Add comments and updates to tickets
- Upload file attachments to tickets

### For Administrators
- Manage user roles and permissions
- Create and manage ticket categories
- Access to all system features

## Technology Stack

- **Frontend**: React.js with React Router for navigation
- **UI Framework**: Bootstrap for responsive design
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage

## Project Structure

```
quickdesk/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── CommentItem.js
│   │   ├── FileUpload.js
│   │   ├── FilterBar.js
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   └── TicketCard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── AdminPanel.js
│   │   ├── CreateTicket.js
│   │   ├── Dashboard.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── NotFound.js
│   │   ├── Register.js
│   │   └── TicketDetail.js
│   ├── services/
│   │   └── firebase.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/quickdesk.git
   cd quickdesk
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure Firebase
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication, Firestore, and Storage services
   - Update the Firebase configuration in `src/services/firebase.js`

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## User Roles and Workflow

1. **End User**
   - Registers/logs in to the system
   - Creates a ticket with details
   - Receives updates and can reply if needed

2. **Support Agent**
   - Views open tickets
   - Assigns tickets to themselves
   - Updates ticket status as they work on it
   - Communicates with users through comments

3. **Administrator**
   - Manages user roles
   - Creates and manages ticket categories
   - Has access to all system features

## Ticket Lifecycle

1. **Open**: Initial state when a ticket is created
2. **In Progress**: When a support agent starts working on the ticket
3. **Resolved**: When the support agent has addressed the issue
4. **Closed**: Final state after the user confirms the resolution

## License

This project is licensed under the MIT License - see the LICENSE file for details.
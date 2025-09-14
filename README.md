# PCB & 3D Printing Service Platform

A comprehensive web application for managing PCB and 3D printing orders with real-time admin dashboard.

## Features

### Customer Features
- **Service Selection**: Choose between PCB Printing and 3D Printing services
- **PDF Upload**: Upload project files with drag-and-drop interface
- **Customer Form**: Comprehensive form for project details and customer information
- **Real-time Submission**: Instant order submission with confirmation

### Admin Features
- **Secure Login**: JWT-based authentication for admin access
- **Real-time Dashboard**: Live updates when new orders are submitted
- **Order Management**: View, filter, and update order status
- **PDF Viewer**: Download and view customer-uploaded PDFs
- **Customer Management**: View customer details and order history
- **Statistics**: Overview of orders, customers, and service metrics

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 19** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates
- **React Hook Form** for form management
- **Axios** for API calls
- **Lucide React** for icons
- **React Toastify** for notifications

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MONGODB_URI=mongodb+srv://lumenworks:12345L@clusterfirst.uqsjoka.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFirst
NODE_ENV=development
```

4. Create a default admin user:
```bash
node scripts/createAdmin.js
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123
- **Email**: admin@pcb3d.com

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `GET /api/admin/profile` - Get admin profile

### Orders
- `POST /api/orders` - Create new order (with PDF upload)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:orderId` - Get order by ID (Admin only)
- `PUT /api/orders/:orderId/status` - Update order status (Admin only)
- `GET /api/orders/:orderId/pdf` - Download order PDF (Admin only)

### Customers
- `GET /api/customers` - Get all customers (Admin only)
- `GET /api/customers/:customerId` - Get customer by ID (Admin only)
- `GET /api/customers/stats/overview` - Get customer statistics (Admin only)

## Project Structure

```
├── Backend/
│   ├── config/
│   │   └── DbConnection.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── model/
│   │   ├── Users.js
│   │   ├── Order.js
│   │   ├── Customer.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── Users.js
│   │   ├── Orders.js
│   │   ├── Admin.js
│   │   └── Customers.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── uploads/ (created automatically)
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── customer/
│   │   │   │   └── CustomerUpload.jsx
│   │   │   ├── homepage/
│   │   │   │   └── Home.jsx
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Usage

### For Customers
1. Visit the homepage at `http://localhost:5173`
2. Click "Start Your Project" or "Upload Your Project"
3. Select service type (PCB Printing or 3D Printing)
4. Upload your PDF file
5. Fill in the customer details form
6. Submit the order

### For Admins
1. Go to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. View the dashboard with real-time order updates
4. Click on orders to view details
5. Download PDFs and update order status
6. Manage customer information

## Real-time Features

- **New Order Notifications**: Admins receive instant notifications when customers submit orders
- **Live Dashboard Updates**: Order list updates automatically without page refresh
- **Status Changes**: Real-time status updates across all connected admin sessions

## File Upload

- **Supported Format**: PDF files only
- **Maximum Size**: 10MB
- **Storage**: Files are stored in `Backend/uploads/` directory
- **Security**: File type validation and size limits

## Security Features

- **JWT Authentication**: Secure admin login with token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **File Validation**: PDF-only uploads with size restrictions
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Form validation on both frontend and backend

## Development

### Adding New Features
1. Backend: Add routes in appropriate route files
2. Frontend: Create components in the components directory
3. Update the main App.jsx for new routes
4. Test the integration

### Database Models
- **User**: General user information
- **Customer**: Customer-specific data
- **Admin**: Admin user authentication
- **Order**: Order details with PDF references

## Production Deployment

### Environment Variables
Update the following for production:
- `JWT_SECRET`: Use a strong, random secret key
- `MONGODB_URI`: Use your production MongoDB connection string
- `NODE_ENV`: Set to "production"

### Security Considerations
- Change default admin credentials
- Use HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment variables for sensitive data

## Support

For issues or questions, please check the code comments and ensure all dependencies are properly installed.

## License

This project is for educational and development purposes.

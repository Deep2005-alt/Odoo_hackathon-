# Frontend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The frontend is configured to connect to the backend at `http://localhost:5000`.

If you need to change the backend URL, update the `API_BASE_URL` in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Features Implemented

### Authentication (Member 1)
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Management
- ✅ Protected Routes
- ✅ Role-based Access Control

### Expense Management (Member 2)
- ✅ Create New Expense Form
- ✅ Receipt Upload with OCR
- ✅ Currency Selection
- ✅ Category Selection
- ✅ Urgent Flag
- ✅ Form Validation

### Dashboard Views (Member 3 & 4)
- ✅ Employee Dashboard
  - Personal expense statistics
  - Recent expenses list
  - Status tracking
  
- ✅ Manager Dashboard
  - Pending approvals count
  - Team expense overview
  - Approval interface
  
- ✅ Admin Dashboard
  - System-wide statistics
  - Top spenders
  - Financial analytics

### Navigation & UI (Member 4)
- ✅ Responsive Navigation Bar
- ✅ Role-based Menu
- ✅ Logout Functionality
- ✅ Clean, Modern Design
- ✅ Mobile Responsive Layout

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Navbar.css
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Role-based dashboard
│   │   ├── ExpenseForm.jsx     # Expense submission form
│   │   ├── Auth.css            # Auth pages styling
│   │   └── ExpenseForm.css     # Form styling
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Usage Guide

### 1. First Time Setup

1. Start the backend server:
```bash
cd ../backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

3. Open browser to `http://localhost:5173`

### 2. Register a New Account

1. Click "Register" on the navigation bar
2. Fill in the registration form:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Company Name
   - Role (Employee, Manager, or Admin)
3. Click "Register"
4. You'll be automatically logged in and redirected to the dashboard

### 3. Submit an Expense (Employee)

1. Navigate to "New Expense"
2. Fill in the expense details:
   - Title (e.g., "Business Trip to NYC")
   - Category (Travel, Meals, etc.)
   - Description (optional)
   - Amount
   - Currency
   - Date
   - Upload receipt image (optional, supports OCR)
   - Mark as urgent if needed
3. Click "Submit Expense"
4. The expense will be created and submitted for approval

### 4. View Dashboard

The dashboard shows different information based on your role:

**Employee:**
- Total expenses submitted
- Pending approvals count
- Approved amount
- Recent expenses list

**Manager:**
- Pending approvals requiring action
- Team expense statistics
- Recent team expenses

**Admin:**
- System-wide overview
- All companies and users
- Financial analytics
- Top spenders

### 5. Approve Expenses (Manager/Admin)

1. Managers will see pending approvals on their dashboard
2. Click "Review" on any pending approval
3. Review the expense details
4. Choose to Approve or Reject
5. Add comments (optional but recommended)
6. Submit decision

## Testing Accounts

You can create test accounts with different roles:

**Employee Account:**
- Email: employee@test.com
- Password: password123
- Role: Employee

**Manager Account:**
- Email: manager@test.com
- Password: password123
- Role: Manager

**Admin Account:**
- Email: admin@test.com
- Password: password123
- Role: Admin

## Styling

The application uses a custom CSS design system with:

- **Color Scheme**: Indigo primary, Emerald secondary
- **Typography**: System fonts
- **Components**: Cards, buttons, forms, tables
- **Responsive**: Mobile-first design
- **Status Badges**: Color-coded status indicators

## API Integration

All API calls are centralized in `src/services/api.js`:

- **authAPI**: Authentication endpoints
- **expenseAPI**: Expense CRUD operations
- **approvalAPI**: Approval workflow
- **dashboardAPI**: Dashboard data
- **notificationAPI**: Real-time notifications

## Troubleshooting

### Backend Connection Issues

If you see network errors:
1. Ensure backend is running on port 5000
2. Check CORS settings in backend
3. Verify API_BASE_URL in api.js

### Authentication Issues

If login/register fails:
1. Check browser console for errors
2. Verify backend is running
3. Clear browser cache and cookies
4. Check JWT_SECRET in backend .env

### Build Errors

If build fails:
1. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```
2. Ensure all dependencies are installed
3. Check Node.js version (must be v16+)

## Next Steps

### Future Enhancements
- [ ] Approval detail page with approve/reject actions
- [ ] Expense edit functionality
- [ ] Expense history with filters
- [ ] Real-time WebSocket notifications
- [ ] Chart visualizations
- [ ] Export to PDF/Excel
- [ ] Dark mode support
- [ ] Multi-language support

## Support

For issues or questions:
1. Check the backend API documentation
2. Review the main README.md
3. Check browser console for errors
4. Verify backend logs

---

**Happy Coding! 🚀**

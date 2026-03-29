# Odoo Hackathon - Reimbursement Management System

A full-stack reimbursement management system built for the Odoo Hackathon with real-time expense tracking, OCR receipt scanning, multi-level approval workflows, and responsive UI.

## 🚀 Features

- **User Authentication** - JWT-based auth with role management (Admin, Manager, Employee)
- **Expense Management** - Submit, track, and manage expenses with validation
- **Real-time Currency Conversion** - Live exchange rate API integration
- **OCR Receipt Scanning** - AI-powered receipt data extraction
- **Approval Workflows** - Multi-level sequential and conditional approvals
- **Responsive UI** - Mobile-friendly, clean design
- **Offline Fallback** - Cached currency rates for offline scenarios

## 🛠️ Tech Stack

### Frontend
- React + Vite
- CSS Modules / Tailwind CSS
- Axios for API calls

### Backend
- Node.js + Express
- RESTful API architecture
- SQLite/PostgreSQL database
- JWT authentication

### APIs & Libraries
- Currency Exchange Rate API (live rates)
- Tesseract.js for OCR
- WebSocket for real-time updates

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Odoo_hackathon-
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Environment Setup

Create `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=sqlite:./database.db
JWT_SECRET=your_jwt_secret_here
CURRENCY_API_KEY=your_api_key_here
```

### 4. Initialize Database

```bash
cd backend
npm run db:init
```

### 5. Run the Application

#### Backend Server
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👥 Team Roles

### Member 1 - Auth + Git Setup
- User authentication (login/signup)
- Role management
- Git repository setup and branching strategy

### Member 2 - Expense Submission + Validation
- Expense form with validation
- Real-time currency conversion API
- OCR receipt scanning

### Member 3 - Approval Workflow ✅ COMPLETED
- ✅ Sequential + conditional approval engine
- ✅ Real-time status updates
- ✅ Dashboard views for all roles (Employee, Manager, Admin)
- ✅ Multi-level approval workflow (1-3 levels based on amount)
- ✅ Complete approval history tracking
- ✅ Notification system with polling support
- 📁 See: `backend/MEMBER3_README.md`

### Member 4 - UI/UX + Admin Panel
- Responsive layout
- Consistent color scheme
- Admin dashboard
- Navigation system

## 📁 Project Structure

```
Odoo_hackathon-
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```

## 🔑 User Roles

### Employee
- Submit expenses
- View personal expense history
- Track approval status

### Manager
- Approve/reject team expenses
- View department analytics
- Configure approval rules

### Admin
- Full system access
- User management
- Company configuration
- System settings

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `POST /api/expenses/:id/ocr` - Upload receipt for OCR

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/:id/approve` - Approve expense
- `POST /api/approvals/:id/reject` - Reject expense

## 🎨 Design System

### Color Scheme
- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Emerald)
- Error: #EF4444 (Red)
- Warning: #F59E0B (Amber)
- Background: #F9FAFB
- Text: #111827

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Monospace: Fira Code

## 📄 License

MIT License - This is a hackathon project for educational purposes.

## 🙏 Acknowledgments

Built for the Odoo Hackathon 2026

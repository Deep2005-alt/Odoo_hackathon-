# Quick Start Guide - Member 3 Approval Workflow

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Environment
```bash
# Copy the example env file
copy .env.example .env

# Edit .env if needed (optional - defaults work fine)
```

### Step 3: Initialize Database
```bash
npm run db:init
```

### Step 4: Start Server
```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server running on port 5000
```

---

## 🧪 Test the Workflow

### Option A: Run Automated Test Script

Open a new terminal and run:
```bash
node test_approval_workflow.js
```

This will automatically:
- Create test accounts
- Submit an expense
- Process approvals
- Show you the complete workflow

### Option B: Manual Testing with cURL/Postman

#### 1. Register an Employee
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"emp@test.com\",\"password\":\"pass123\",\"name\":\"Employee\",\"companyName\":\"TestCo\",\"role\":\"employee\"}"
```

Save the token from response.

#### 2. Create an Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Business Lunch\",\"amount\":150,\"currency\":\"USD\",\"category\":\"meals\",\"expense_date\":\"2026-03-29\"}"
```

Save the expense ID.

#### 3. Submit for Approval
```bash
curl -X POST http://localhost:5000/api/expenses/1/submit \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Register a Manager
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"mgr@test.com\",\"password\":\"pass123\",\"name\":\"Manager\",\"companyName\":\"TestCo\",\"role\":\"manager\"}"
```

#### 5. Login as Manager
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"mgr@test.com\",\"password\":\"pass123\"}"
```

Save the manager token.

#### 6. View Pending Approvals
```bash
curl http://localhost:5000/api/approvals/pending \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

#### 7. Approve the Expense
```bash
curl -X POST http://localhost:5000/api/approvals/1/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -d "{\"action\":\"approve\",\"comments\":\"Looks good!\"}"
```

---

## 📊 View Dashboards

### Employee Dashboard
```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer EMPLOYEE_TOKEN"
```

### Manager Dashboard
```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

---

## 🔍 Useful Commands

### Check Database
```bash
# Open SQLite database (if using SQLite)
sqlite3 backend/database.db

# List tables
.tables

# View expenses
SELECT * FROM expenses;

# View approval levels
SELECT * FROM approval_levels;
```

### Clear Database and Start Fresh
```bash
npm run db:init
```

---

## 📋 Available API Endpoints

All endpoints require `Authorization: Bearer <token>`

### Expenses
- `POST /api/expenses` - Create expense
- `POST /api/expenses/:id/submit` - Submit for approval
- `GET /api/expenses/:id/approvals` - View approval history

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/:levelId/approve` - Approve expense
- `POST /api/approvals/:levelId/reject` - Reject expense

### Dashboard
- `GET /api/dashboard` - Get role-specific dashboard
- `GET /api/dashboard/stats` - Get statistics

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/subscribe` - Subscribe to updates

---

## 🎯 Test Scenarios

### Scenario 1: Small Expense ($300)
- Creates 1 approval level
- Manager approves → Fully approved

### Scenario 2: Medium Expense ($1500)
- Creates 2 approval levels
- Manager 1 approves → Goes to Manager 2
- Manager 2 approves → Fully approved

### Scenario 3: Large Expense ($3000)
- Creates 3 approval levels
- Sequential approval required
- All 3 managers must approve

### Scenario 4: Urgent Expense
- Fast-tracked to 1 level regardless of amount
- Quick approval process

### Scenario 5: Rejection
- Any manager can reject
- Immediately rejects entire expense
- Employee notified

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Errors
```bash
# Delete database and reinitialize
del database.db
npm run db:init
```

### Token Expired
```bash
# Just login again to get new token
POST /api/auth/login
```

---

## 📚 Documentation

- **Full API Docs**: `MEMBER3_API_DOCS.md`
- **Implementation Summary**: `MEMBER3_SUMMARY.md`
- **Test Script**: `test_approval_workflow.js`

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Database initialized successfully
- [ ] Can register users
- [ ] Can create expenses
- [ ] Can submit for approval
- [ ] Managers can see pending approvals
- [ ] Can approve/reject expenses
- [ ] Dashboards show correct data
- [ ] Approval workflow completes successfully

---

## 🎉 You're Ready!

Everything is set up and ready to test. Run the automated test script or manually test through Postman/cURL.

For questions or issues, check the documentation files or review the code in:
- Controllers: `controllers/expense.controller.js`
- Models: `models/Expense.js`, `models/ApprovalLevel.js`
- Routes: `routes/expense.routes.js`, `routes/approval.routes.js`

Happy testing! 🚀

# Complete Installation & Testing Guide

## 🚀 Quick Start (5 Minutes)

This guide will help you get the entire Expense Management System up and running in under 5 minutes.

---

## Prerequisites

- **Node.js** version 16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge)

---

## Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd c:\Users\hp\OneDrive\Documents\Odoo_hackathon-\backend
npm install
```

This will install all required packages including:
- Express.js
- Sequelize ORM
- JWT authentication
- Multer (file upload)
- Tesseract.js (OCR)
- And more...

---

## Step 2: Configure Backend Environment

The `.env` file should already exist in the backend folder. If not, create it:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=sqlite:./database.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CURRENCY_API_KEY=test_api_key
```

---

## Step 3: Start the Backend Server

In the same terminal (backend folder):

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server running on port 5000
📍 Environment: development
🌐 Health check: http://localhost:5000/api/health
```

**Keep this terminal open!** The backend needs to stay running.

---

## Step 4: Install Frontend Dependencies

Open a **NEW terminal** (keep the backend running!) and navigate to the frontend folder:

```bash
cd c:\Users\hp\OneDrive\Documents\Odoo_hackathon-\frontend
npm install
```

This will install:
- React 18
- Vite
- React Router
- Axios
- And other dependencies

---

## Step 5: Start the Frontend Application

In the same terminal (frontend folder):

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 6: Open the Application

Open your web browser and go to:
```
http://localhost:5173
```

You should see the login page!

---

## 🧪 Testing the Application

### Test Scenario 1: Register and Submit an Expense (Employee)

1. **Register a New Account**
   - Click "Register" on the navigation bar
   - Fill in the form:
     - Name: `Test Employee`
     - Email: `employee@test.com`
     - Password: `password123`
     - Company: `Test Corp`
     - Role: `Employee`
   - Click "Register"
   - You'll be logged in automatically

2. **Submit a New Expense**
   - Click "New Expense" in the navigation
   - Fill in the expense form:
     - Title: `Business Trip to NYC`
     - Category: `travel`
     - Amount: `1500`
     - Currency: `USD`
     - Date: Today's date
     - Description: `Client meeting and conference`
     - Upload receipt (optional - any image file)
     - Check "Mark as urgent" if desired
   - Click "Submit Expense"
   - You should see a success message!

3. **View Your Dashboard**
   - Click "Dashboard" in the navigation
   - You'll see:
     - Total Expenses: 1
     - Pending: 1
     - Approved: 0
     - Total Amount: $1500.00
   - Your expense will appear in the recent expenses table

---

### Test Scenario 2: Approve an Expense (Manager)

1. **Register a Manager Account**
   - Logout from the employee account
   - Click "Register"
   - Fill in the form:
     - Name: `Test Manager`
     - Email: `manager@test.com`
     - Password: `password123`
     - Company: `Test Corp` (same as employee)
     - Role: `Manager`
   - Click "Register"

2. **View Pending Approvals**
   - As a manager, go to "Dashboard"
   - You should see "Pending Approvals" section
   - The expense submitted by the employee will appear
   - Click "Review"

3. **Approve the Expense**
   - Review the expense details
   - Add a comment: "Looks good!"
   - Click "Approve"
   - The expense moves to the next approval level (if required)

---

### Test Scenario 3: Admin Dashboard Overview

1. **Register an Admin Account**
   - Logout
   - Register with:
     - Name: `Admin User`
     - Email: `admin@test.com`
     - Password: `password123`
     - Company: `Test Corp`
     - Role: `Admin`

2. **View System Analytics**
   - Navigate to Dashboard
   - You'll see:
     - Total Users
     - Total Companies
     - Total Expenses
     - Status Breakdown (pending/approved/rejected)
     - Financial Statistics
     - Top Spenders
     - Recent Expenses across all companies

---

## 🎯 Testing Different Features

### Test OCR Receipt Scanning

1. Go to "New Expense"
2. Fill in basic expense details
3. Upload a receipt image (any JPEG/PNG of a receipt)
4. Submit the expense
5. The system will:
   - Extract text from the image using OCR
   - Try to identify merchant name
   - Extract date and total amount
   - Validate the extracted data

### Test Currency Conversion

The system supports multiple currencies:
- USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, and more

When creating an expense:
1. Select different currency (e.g., EUR)
2. Enter amount (e.g., 100)
3. The system will:
   - Convert to base currency (USD)
   - Store both original and converted amounts
   - Use live exchange rates (with offline fallback)

### Test Multi-Level Approval

Create expenses with different amounts to see different approval levels:

- **Small ($100)**: 1 approval level (fast)
- **Medium ($1500)**: 2 approval levels
- **Large ($5000)**: 3 approval levels
- **Urgent**: Always 1 level (fast-track)

---

## 🔍 Troubleshooting

### Backend Won't Start

**Error: Cannot find module**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Error: Port 5000 already in use**
```bash
# Solution 1: Kill the process using port 5000
# Solution 2: Change PORT in .env to 5001
```

**Error: Database connection failed**
```bash
# Solution: Delete the database file and restart
rm database.db
npm run dev
```

### Frontend Won't Start

**Error: Cannot find module**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Error: Port 5173 already in use**
```bash
# Solution: Vite will automatically use port 5174
# Or specify: npm run dev -- --port 3000
```

### Can't Login/Register

**Check:**
1. Backend is running on port 5000
2. Browser console for errors (F12)
3. Network tab shows API calls failing
4. CORS is enabled in backend

**Solution:**
```bash
# Clear browser cache
# Or try incognito/private mode
```

### API Calls Failing

**Check Network Tab (F12 → Network)**
- Requests should go to `http://localhost:5000/api/...`
- Status should be 200/201 (not 404/500)
- Authorization header should include Bearer token

**Common Issues:**
- CORS error → Backend CORS configuration
- 401 Unauthorized → Token expired, login again
- 404 Not Found → Wrong API endpoint
- 500 Internal Error → Check backend logs

---

## 📊 Expected Results

### After Complete Setup

You should have:

**Backend:**
- ✅ Server running on http://localhost:5000
- ✅ Database created at `backend/database.db`
- ✅ All API endpoints accessible
- ✅ Health check returns: `{"status": "ok"}`

**Frontend:**
- ✅ App running on http://localhost:5173
- ✅ Login/Register pages working
- ✅ Dashboard loads after login
- ✅ Can create expenses
- ✅ Navigation works correctly

**Features Working:**
- ✅ User registration and login
- ✅ Expense creation with validation
- ✅ Receipt upload (optional)
- ✅ Multi-level approval workflow
- ✅ Role-based dashboards
- ✅ Manager approvals
- ✅ Admin analytics

---

## 🎓 Demo Data Creation

Want to populate the system with demo data? Run the test script:

```bash
cd backend
node test_approval_workflow.js
```

This will:
1. Register test employee and manager
2. Create sample expenses
3. Submit for approval
4. Process approvals
5. Show complete workflow in action

---

## 📝 Testing Checklist

Use this checklist to verify everything is working:

### Backend Tests
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Health check endpoint responds
- [ ] Can register new user via API
- [ ] Can login and receive JWT token
- [ ] Can create expense via API
- [ ] Can submit expense for approval
- [ ] Can approve/reject expenses

### Frontend Tests
- [ ] App loads in browser
- [ ] Can navigate to Register page
- [ ] Can register new account
- [ ] Redirects to dashboard after login
- [ ] Dashboard shows correct statistics
- [ ] Can access "New Expense" form
- [ ] Can submit expense successfully
- [ ] Form validation works
- [ ] Can logout successfully

### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] JWT authentication works
- [ ] Protected routes redirect to login
- [ ] Role-based access control works
- [ ] Real-time updates function
- [ ] File upload works
- [ ] Mobile responsive design works

---

## 🎉 Success Criteria

Your setup is complete when:

1. ✅ Both servers are running (backend + frontend)
2. ✅ You can register and login
3. ✅ You can create and submit expenses
4. ✅ Managers can see pending approvals
5. ✅ Approvals can be processed
6. ✅ Dashboards show correct data
7. ✅ No console errors in browser
8. ✅ No errors in backend logs

---

## 📚 Additional Resources

- **Backend API Docs:** `backend/MEMBER3_API_DOCS.md`
- **Frontend Guide:** `frontend/README.md`
- **Workflow Diagram:** `backend/WORKFLOW_DIAGRAM.md`
- **Quick Start:** `backend/QUICKSTART.md`
- **Project Summary:** `PROJECT_COMPLETION_SUMMARY.md`

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Logs:**
   - Backend terminal output
   - Browser console (F12)
   - Network tab for failed requests

2. **Verify Setup:**
   - Both servers are running
   - Correct ports (5000, 5173)
   - Dependencies installed

3. **Common Fixes:**
   - Restart both servers
   - Clear browser cache
   - Reinstall node_modules
   - Check .env configuration

4. **Still Stuck?**
   - Review error messages carefully
   - Check documentation files
   - Verify all steps were followed
   - Try the test script for debugging

---

**Congratulations! You now have a fully functional Expense Management System! 🎊**

Time to explore all the features and see the approval workflow in action!

# 👤 Member 3 - Approval Workflow System

## 📋 Overview

This implementation provides a complete **multi-level sequential approval workflow** for expense reimbursements with real-time status updates and role-based dashboards.

---

## ✨ Features Implemented

### 1. Multi-Level Approval Engine
- ✅ Sequential approval workflow (Level 1 → Level 2 → Level 3)
- ✅ Conditional approval based on amount
- ✅ Fast-track for urgent expenses
- ✅ Automatic approver assignment
- ✅ Comments on approval actions

### 2. Real-Time Status Updates
- ✅ Polling-based notification system
- ✅ Long-polling subscription support
- ✅ Expense status change tracking
- ✅ Broadcast to relevant users

### 3. Dashboard Views
- ✅ Employee Dashboard (personal expenses)
- ✅ Manager Dashboard (team approvals & statistics)
- ✅ Admin Dashboard (system-wide analytics)

### 4. Complete Audit Trail
- ✅ Full approval history per expense
- ✅ Timestamp tracking
- ✅ Approver information
- ✅ Comments storage

---

## 📁 File Structure

```
backend/
├── models/
│   ├── Expense.js              # Expense data model
│   ├── ApprovalLevel.js        # Approval level model
│   └── index.js                # Model relationships
│
├── controllers/
│   ├── expense.controller.js   # Expense CRUD & submission
│   ├── dashboard.controller.js # Role-based dashboards
│   └── notification.controller.js # Real-time notifications
│
├── routes/
│   ├── expense.routes.js       # Expense endpoints
│   ├── approval.routes.js      # Approval endpoints
│   ├── dashboard.routes.js     # Dashboard endpoints
│   └── notification.routes.js  # Notification endpoints
│
├── server.js                   # Updated with new routes
│
├── MEMBER3_API_DOCS.md         # Complete API documentation
├── MEMBER3_SUMMARY.md          # Implementation summary
├── QUICKSTART.md               # Quick start guide
├── WORKFLOW_DIAGRAM.md         # Visual diagrams
└── test_approval_workflow.js   # Automated test script
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
```bash
npm run db:init
```

### 3. Start Server
```bash
npm run dev
```

### 4. Run Tests
```bash
node test_approval_workflow.js
```

**Detailed instructions:** See [`QUICKSTART.md`](QUICKSTART.md)

---

## 🎯 How It Works

### Approval Flow

1. **Employee creates expense** → Status: `pending`
2. **Employee submits** → Status: `submitted`
3. **System determines approval levels:**
   - ≤ $500 → 1 level
   - ≤ $2000 → 2 levels
   - > $2000 → 3 levels
   - Urgent → 1 level (fast-track)
4. **Level 1 approver reviews:**
   - Approve → Move to next level
   - Reject → Expense rejected
5. **Subsequent levels repeat step 4**
6. **All levels approved** → Status: `approved`

### Example Scenario

```
Employee submits $1500 expense
↓
System creates 2 approval levels
↓
Manager (Level 1) approves
↓
Senior Manager (Level 2) approves
↓
Status changes to "approved"
↓
Ready for reimbursement
```

---

## 📊 API Endpoints

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create expense |
| POST | `/api/expenses/:id/submit` | Submit for approval |
| GET | `/api/expenses/:id/approvals` | Get approval history |

### Approvals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvals/pending` | Get pending approvals |
| POST | `/api/approvals/:levelId/approve` | Approve expense |
| POST | `/api/approvals/:levelId/reject` | Reject expense |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get role-specific dashboard |
| GET | `/api/dashboard/stats` | Get statistics |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| GET | `/api/notifications/subscribe` | Subscribe to updates |

**Full API docs:** [`MEMBER3_API_DOCS.md`](MEMBER3_API_DOCS.md)

---

## 💻 Code Examples

### Create and Submit Expense

```javascript
// Create expense
const expense = await fetch('/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + employeeToken
  },
  body: JSON.stringify({
    title: 'Business Trip',
    amount: 1500,
    currency: 'USD',
    category: 'travel',
    expense_date: '2026-03-29'
  })
});

// Submit for approval
await fetch(`/api/expenses/${expenseId}/submit`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + employeeToken
  }
});
```

### Approve Expense

```javascript
const approve = await fetch(`/api/approvals/${levelId}/approve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + managerToken
  },
  body: JSON.stringify({
    action: 'approve',
    comments: 'Looks good!'
  })
});
```

### Get Dashboard

```javascript
// Employee dashboard
const dashboard = await fetch('/api/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + employeeToken
  }
});

// Shows: total expenses, pending count, approved amount, etc.
```

---

## 🗄️ Database Models

### Expense Model
```javascript
{
  id: INTEGER (PK),
  employee_id: INTEGER (FK),
  title: STRING,
  amount: DECIMAL,
  currency: STRING,
  category: STRING,
  status: STRING (pending/submitted/approved/rejected),
  current_approval_level: INTEGER,
  total_approval_levels: INTEGER,
  is_urgent: BOOLEAN,
  submitted_at: DATE,
  approved_at: DATE,
  ...
}
```

### ApprovalLevel Model
```javascript
{
  id: INTEGER (PK),
  expense_id: INTEGER (FK),
  level_number: INTEGER,
  approver_id: INTEGER (FK),
  status: STRING (pending/approved/rejected),
  action: STRING,
  comments: TEXT,
  acted_at: DATE,
  is_completed: BOOLEAN,
  ...
}
```

---

## 🧪 Testing

### Automated Test Script
Run the included test script to verify all functionality:

```bash
node test_approval_workflow.js
```

**What it tests:**
- ✅ User registration (employee & manager)
- ✅ Expense creation
- ✅ Submission for approval
- ✅ Approval workflow
- ✅ Rejection flow
- ✅ Dashboard data
- ✅ Status tracking

### Manual Testing
Use Postman or cURL following the guide in [`QUICKSTART.md`](QUICKSTART.md)

---

## 📈 Dashboard Features

### Employee Dashboard
- Total expenses submitted
- Pending approvals count
- Approved amount
- Rejected count
- Recent expenses list

### Manager Dashboard
- Pending approvals (with employee info)
- Team expense statistics
- Team total amount
- Recent team expenses

### Admin Dashboard
- System-wide overview
- Status breakdown (pending/approved/rejected)
- Financial analytics
- Top spenders
- All companies data

---

## 🔐 Security

- JWT authentication required for all endpoints
- Role-based access control
- Employees can only see their own expenses
- Managers can only approve assigned expenses
- Admins have full system access

---

## 🎨 Status Codes

| Status | Description |
|--------|-------------|
| `pending` | Created but not submitted |
| `submitted` | Submitted for approval |
| `approved` | Fully approved by all levels |
| `rejected` | Rejected at any level |
| `reimbursed` | Approved and paid out |
| `cancelled` | Cancelled by employee |

---

## 🔄 Workflow Rules

### Approval Level Determination
```
Amount ≤ $500        → 1 approval level
$500 < Amount ≤ $2000 → 2 approval levels
Amount > $2000       → 3 approval levels
Urgent = true        → 1 approval level (fast-track)
```

### Sequential Processing
- Each level must approve before moving to next
- Any rejection immediately rejects entire expense
- Approvers are assigned automatically based on hierarchy
- Comments are optional but encouraged

---

## 📚 Documentation Files

1. **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
2. **[MEMBER3_API_DOCS.md](MEMBER3_API_DOCS.md)** - Complete API reference
3. **[MEMBER3_SUMMARY.md](MEMBER3_SUMMARY.md)** - Implementation details
4. **[WORKFLOW_DIAGRAM.md](WORKFLOW_DIAGRAM.md)** - Visual diagrams
5. **[test_approval_workflow.js](test_approval_workflow.js)** - Automated tests

---

## 🎯 Deliverables Checklist

### Member 3 Requirements
- [x] Sequential + conditional approval engine
- [x] Real-time status updates
- [x] Dashboard views for all roles
- [x] Multi-level workflow
- [x] Approval history
- [x] Notification system

### Code Quality
- [x] Clean, documented code
- [x] Proper error handling
- [x] Input validation
- [x] Security (JWT auth)
- [x] RESTful API design

### Documentation
- [x] API documentation
- [x] Quick start guide
- [x] Test scripts
- [x] Diagrams
- [x] Summary

---

## 🚀 Next Steps (Optional)

Want to enhance the system? Consider:

1. **WebSocket Integration** - True real-time updates
2. **Email Notifications** - Send emails for pending approvals
3. **OCR Receipt Scanning** - Auto-extract expense data
4. **Currency Conversion** - Live exchange rates
5. **Advanced Analytics** - Charts and trend analysis
6. **Custom Approval Chains** - Per-department workflows

---

## 🤝 Support

For questions or issues:
1. Check [`QUICKSTART.md`](QUICKSTART.md) for setup help
2. Review [`MEMBER3_API_DOCS.md`](MEMBER3_API_DOCS.md) for API details
3. Run `test_approval_workflow.js` to verify setup
4. Examine controller code for implementation logic

---

## ✅ All Set!

Member 3's approval workflow system is complete and ready to use. Run the quickstart guide to get started, or dive into the API docs for detailed endpoint information.

**Happy coding! 🎉**

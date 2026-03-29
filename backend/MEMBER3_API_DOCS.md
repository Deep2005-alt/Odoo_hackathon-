# Member 3 - Approval Workflow API Documentation

## Overview
This document covers all API endpoints related to the approval workflow system implemented for Member 3.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Expense Endpoints

### 1. Create Expense
**POST** `/expenses`

Creates a new expense (initially in "pending" status).

**Request Body:**
```json
{
  "title": "Business Trip to NYC",
  "description": "Client meeting and conference",
  "amount": 1500.00,
  "currency": "USD",
  "category": "travel",
  "expense_date": "2026-03-29",
  "is_urgent": false
}
```

**Categories:** `travel`, `meals`, `accommodation`, `office_supplies`, `training`, `equipment`, `other`

**Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "expense": {
      "id": 1,
      "title": "Business Trip to NYC",
      "amount": 1500.00,
      "status": "pending",
      ...
    }
  }
}
```

---

### 2. Submit Expense for Approval
**POST** `/expenses/:id/submit`

Submits an expense for approval. This triggers the approval workflow creation.

**Logic:**
- Amount ≤ $500: 1 approval level
- Amount ≤ $2000: 2 approval levels
- Amount > $2000: 3 approval levels
- Urgent expenses: Fast-tracked (1 level)

**Response:**
```json
{
  "success": true,
  "message": "Expense submitted for approval",
  "data": {
    "expense": { ... },
    "totalLevels": 2,
    "currentLevel": 1
  }
}
```

---

### 3. Get Approval History
**GET** `/expenses/:id/approvals`

Retrieves the complete approval history for an expense.

**Response:**
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": 1,
      "title": "Business Trip",
      "status": "submitted",
      "approvalLevels": [
        {
          "id": 1,
          "level_number": 1,
          "approver": {
            "id": 2,
            "name": "John Manager",
            "email": "manager@company.com"
          },
          "status": "approved",
          "action": "approve",
          "comments": "Looks good",
          "acted_at": "2026-03-29T10:00:00Z"
        },
        {
          "id": 2,
          "level_number": 2,
          "approver": { ... },
          "status": "pending",
          "action": null,
          "comments": null
        }
      ]
    }
  }
}
```

---

## ✅ Approval Endpoints

### 4. Get Pending Approvals
**GET** `/approvals/pending`

Gets all pending approvals for the current manager.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "pendingApprovals": [
      {
        "id": 1,
        "level_number": 1,
        "expense": {
          "id": 1,
          "title": "Business Trip",
          "amount": 1500.00,
          "employee": {
            "id": 3,
            "name": "Jane Employee",
            "email": "jane@company.com"
          }
        }
      }
    ]
  }
}
```

---

### 5. Approve Expense
**POST** `/approvals/:levelId/approve`

Approves an expense at the current level.

**Request Body:**
```json
{
  "action": "approve",
  "comments": "Approved - within budget"
}
```

**Response (if more levels remain):**
```json
{
  "success": true,
  "message": "Approved - forwarded to next level",
  "data": {
    "expense": {
      "id": 1,
      "status": "submitted",
      "current_approval_level": 2
    },
    "approvalLevel": { ... },
    "nextApprover": 4
  }
}
```

**Response (fully approved):**
```json
{
  "success": true,
  "message": "Expense fully approved",
  "data": {
    "expense": {
      "id": 1,
      "status": "approved",
      "approved_at": "2026-03-29T12:00:00Z"
    },
    "approvalLevel": { ... }
  }
}
```

---

### 6. Reject Expense
**POST** `/approvals/:levelId/reject`

Rejects an expense. This immediately rejects the entire expense.

**Request Body:**
```json
{
  "action": "reject",
  "comments": "Exceeds budget limit. Please provide justification."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense rejected",
  "data": {
    "expense": {
      "id": 1,
      "status": "rejected",
      "rejected_at": "2026-03-29T11:00:00Z"
    },
    "approvalLevel": { ... }
  }
}
```

---

## 📊 Dashboard Endpoints

### 7. Get Dashboard Data
**GET** `/dashboard`

Gets dashboard data based on user role.

**Employee Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "role": "employee",
    "statistics": {
      "totalExpenses": 15,
      "pendingCount": 3,
      "approvedCount": 10,
      "rejectedCount": 2,
      "totalAmount": 15000.00,
      "pendingAmount": 2500.00
    },
    "recentExpenses": [...]
  }
}
```

**Manager Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "role": "manager",
    "statistics": {
      "pendingApprovalCount": 5,
      "teamTotalExpenses": 45,
      "teamPendingCount": 8,
      "teamApprovedCount": 35,
      "teamTotalAmount": 50000.00
    },
    "pendingApprovals": [...],
    "recentTeamExpenses": [...]
  }
}
```

**Admin Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "role": "admin",
    "overview": {
      "totalUsers": 50,
      "totalCompanies": 5,
      "totalExpenses": 200
    },
    "statusBreakdown": {
      "pendingCount": 20,
      "approvedCount": 150,
      "rejectedCount": 20,
      "reimbursedCount": 10
    },
    "financials": {
      "totalAmount": 250000.00,
      "pendingAmount": 30000.00,
      "reimbursedAmount": 15000.00
    },
    "recentExpenses": [...],
    "topSpenders": [...]
  }
}
```

---

### 8. Get Statistics
**GET** `/dashboard/stats`

Gets filtered statistics.

**Query Parameters:**
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `department`: Filter by department (admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "status": "pending",
        "count": 10,
        "total": 15000.00
      },
      {
        "status": "approved",
        "count": 50,
        "total": 75000.00
      }
    ]
  }
}
```

---

## 🔔 Notification Endpoints

### 9. Get Notifications
**GET** `/notifications`

Gets notifications for the current user.

**Query Parameters:**
- `lastCheck`: ISO timestamp of last check

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingApprovals": [...],
    "updatedExpenses": [...],
    "timestamp": "2026-03-29T14:00:00Z"
  }
}
```

---

### 10. Subscribe to Real-time Updates
**GET** `/notifications/subscribe`

Long-polling subscription for real-time updates.

**Query Parameters:**
- `lastEventId`: Last received event ID

**Response:**
Server will hold connection and send updates as they occur, or send heartbeat every 10 seconds.

---

## 🧪 Testing Workflow

### Complete Approval Flow Test:

1. **Create Employee Account**
   ```bash
   POST /api/auth/register
   {
     "email": "employee@test.com",
     "password": "password123",
     "name": "Test Employee",
     "companyName": "Test Corp",
     "role": "employee"
   }
   ```

2. **Login as Employee**
   ```bash
   POST /api/auth/login
   {
     "email": "employee@test.com",
     "password": "password123"
   }
   ```

3. **Create Expense**
   ```bash
   POST /api/expenses
   Authorization: Bearer <employee_token>
   {
     "title": "Office Supplies",
     "amount": 300,
     "category": "office_supplies",
     "expense_date": "2026-03-29"
   }
   ```

4. **Submit for Approval**
   ```bash
   POST /api/expenses/1/submit
   Authorization: Bearer <employee_token>
   ```

5. **Create Manager Account** (if not exists)
   ```bash
   POST /api/auth/register
   {
     "email": "manager@test.com",
     "password": "password123",
     "name": "Test Manager",
     "companyName": "Test Corp",
     "role": "manager"
   }
   ```

6. **Login as Manager**
   ```bash
   POST /api/auth/login
   {
     "email": "manager@test.com",
     "password": "password123"
   }
   ```

7. **Get Pending Approvals**
   ```bash
   GET /api/approvals/pending
   Authorization: Bearer <manager_token>
   ```

8. **Approve Expense**
   ```bash
   POST /api/approvals/1/approve
   Authorization: Bearer <manager_token>
   {
     "action": "approve",
     "comments": "Approved!"
   }
   ```

9. **Check Dashboard**
   ```bash
   GET /api/dashboard
   Authorization: Bearer <employee_token>
   ```

---

## 📋 Status Codes

- `pending`: Initial state, not yet submitted
- `submitted`: Submitted for approval, in workflow
- `approved`: Fully approved by all levels
- `rejected`: Rejected at any level
- `reimbursed`: Approved and paid out
- `cancelled`: Cancelled by employee

---

## 🔄 Approval Workflow Logic

### Sequential Approval:
1. Employee submits expense
2. System determines approval levels based on amount
3. Level 1 approver reviews → if approved, moves to Level 2
4. Each level must approve sequentially
5. If any level rejects → entire expense rejected
6. All levels approved → expense status = "approved"

### Conditional Rules:
- **Small amounts (≤$500)**: Single approval
- **Medium amounts (≤$2000)**: Two approvals
- **Large amounts (>$2000)**: Three approvals
- **Urgent flag**: Fast-tracked to single approval

---

## 🎯 Key Features Implemented

✅ Multi-level sequential approval workflow
✅ Dynamic approval level determination
✅ Role-based dashboards (Employee, Manager, Admin)
✅ Real-time notifications via polling
✅ Approval history tracking
✅ Comments on approval actions
✅ Automatic approver assignment
✅ Status tracking throughout workflow
✅ Dashboard analytics per role
✅ Expense filtering and statistics

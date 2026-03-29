# Approval Workflow Diagram

## Sequential Approval Flow

```mermaid
graph TB
    A[Employee Creates Expense] --> B{Status: Pending}
    B --> C[Employee Submits]
    C --> D{Determine Approval Levels}
    
    D -->|Amount ≤ $500| E[1 Level]
    D -->|$500 < Amount ≤ $2000| F[2 Levels]
    D -->|Amount > $2000| G[3 Levels]
    D -->|Urgent| H[1 Level - Fast Track]
    
    E --> I[Level 1: Manager Review]
    F --> I
    G --> I
    H --> I
    
    I --> J{Manager Decision}
    J -->|Reject| K[Expense Rejected]
    J -->|Approve| L{More Levels?}
    
    L -->|Yes| M[Level 2: Senior Manager]
    M --> N{Decision}
    N -->|Reject| K
    N -->|Approve| O{More Levels?}
    
    O -->|Yes| P[Level 3: Admin/Finance]
    P --> Q{Decision}
    Q -->|Reject| K
    Q -->|Approve| R
    
    O -->|No| R[Fully Approved]
    L -->|No| R
    
    R --> S[Status: Approved]
    K --> T[Status: Rejected]
    S --> U[Ready for Reimbursement]
```

## Status Flow Diagram

```mermaid
graph LR
    A[Pending] --> B[Submitted]
    B --> C[In Approval]
    C --> D{Final Status}
    D --> E[Approved]
    D --> F[Rejected]
    E --> G[Reimbursed]
    F --> H[Cancelled]
```

## Multi-Level Approval Example

```mermaid
sequenceDiagram
    participant E as Employee
    participant S as System
    participant M1 as Manager (L1)
    participant M2 as Sr. Manager (L2)
    participant A as Admin (L3)

    E->>S: Create Expense ($3000)
    E->>S: Submit for Approval
    S->>S: Determine: 3 Levels Needed
    S->>M1: Notification: Approval Required
    
    M1->>S: Review Expense
    M1->>S: Approve with Comments
    S->>M2: Notification: Next Level
    
    M2->>S: Review Expense
    M2->>S: Approve
    S->>A: Notification: Final Level
    
    A->>S: Review Expense
    A->>S: Approve
    S->>E: Notification: Fully Approved
    S->>S: Update Status: Approved
```

## Dashboard Data Flow

```mermaid
graph TB
    A[User Login] --> B{User Role?}
    
    B -->|Employee| C[Employee Dashboard]
    C --> C1[My Expenses]
    C --> C2[Pending Count]
    C --> C3[Approved Amount]
    C --> C4[Recent History]
    
    B -->|Manager| D[Manager Dashboard]
    D --> D1[Pending Approvals]
    D --> D2[Team Statistics]
    D --> D3[Team Expenses]
    D --> D4[Approval Queue]
    
    B -->|Admin| E[Admin Dashboard]
    E --> E1[System Overview]
    E --> E2[All Companies]
    E --> E3[Financial Analytics]
    E --> E4[Top Spenders]
    E --> E5[Status Breakdown]
```

## Notification System

```mermaid
graph LR
    A[Event Occurs] --> B{Event Type?}
    
    B -->|Expense Submitted| C[Notify Manager]
    B -->|Approval Action| D[Notify Employee]
    B -->|Status Change| E[Notify All Parties]
    
    C --> F[Polling Service]
    D --> F
    E --> F
    
    F --> G[Update Dashboard]
    F --> H[Send Notification]
    F --> I[Refresh UI]
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ EXPENSE : creates
    USER ||--o{ APPROVAL_LEVEL : assigned_to
    COMPANY ||--o{ USER : employs
    EXPENSE ||--o{ APPROVAL_LEVEL : has
    
    USER {
        int id PK
        string email
        string password
        string name
        string role
        int company_id
        boolean is_active
    }
    
    COMPANY {
        int id PK
        string name
        string base_currency
        string address
        string phone
        string industry
        boolean is_active
    }
    
    EXPENSE {
        int id PK
        int employee_id FK
        string title
        decimal amount
        string currency
        string category
        date expense_date
        string status
        int current_approval_level
        int total_approval_levels
        boolean is_urgent
        datetime submitted_at
        datetime approved_at
        datetime rejected_at
    }
    
    APPROVAL_LEVEL {
        int id PK
        int expense_id FK
        int level_number
        int approver_id FK
        string status
        string action
        text comments
        datetime acted_at
        boolean is_completed
    }
```

## Approval Level States

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Approved: Approve
    Pending --> Rejected: Reject
    Approved --> [*]
    Rejected --> [*]
    
    note right of Pending
        Waiting for
        approver action
    end note
    
    note right of Approved
        Moved to next level
        or fully approved
    end note
    
    note right of Rejected
        Expense rejected
        Workflow ends
    end note
```

## Complete Request Flow

```mermaid
graph TB
    A[Client Request] --> B{Endpoint?}
    
    B -->|/expenses| C[Expense Controller]
    B -->|/approvals| D[Approval Controller]
    B -->|/dashboard| E[Dashboard Controller]
    B -->|/notifications| F[Notification Controller]
    
    C --> G[Database]
    D --> G
    E --> G
    F --> G
    
    G --> H[Return Response]
    H --> I[Client Receives Data]
```

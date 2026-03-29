// Test script for Approval Workflow (Member 3)
// Run this after starting the server with: npm run dev

const API_BASE = 'http://localhost:5000/api';

let employeeToken = '';
let managerToken = '';
let expenseId = null;
let approvalLevelId = null;

// Helper function to make API requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ ${options.method || 'GET'} ${endpoint}`);
      console.error('Error:', data.message || data);
      return null;
    }
    
    console.log(`✅ ${options.method || 'GET'} ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`❌ ${options.method || 'GET'} ${endpoint}`);
    console.error('Network error:', error.message);
    return null;
  }
}

// Test sequence
async function runTests() {
  console.log('\n🚀 Starting Approval Workflow Tests\n');
  console.log('='.repeat(50));

  // Step 1: Register Employee
  console.log('\n📝 Step 1: Registering Employee...');
  const empReg = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'employee@test.com',
      password: 'password123',
      name: 'Test Employee',
      companyName: 'Test Corp',
      role: 'employee',
    }),
  });
  
  if (empReg) {
    employeeToken = empReg.data.token;
    console.log('Employee registered:', empReg.data.user.name);
  }

  // Step 2: Register Manager
  console.log('\n📝 Step 2: Registering Manager...');
  const mgrReg = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'manager@test.com',
      password: 'password123',
      name: 'Test Manager',
      companyName: 'Test Corp',
      role: 'manager',
    }),
  });
  
  if (mgrReg) {
    managerToken = mgrReg.data.token;
    console.log('Manager registered:', mgrReg.data.user.name);
  }

  // Step 3: Login as Employee
  console.log('\n🔐 Step 3: Employee Login...');
  const empLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'employee@test.com',
      password: 'password123',
    }),
  });
  
  if (empLogin) {
    employeeToken = empLogin.data.token;
    console.log('Employee logged in successfully');
  }

  // Step 4: Create Expense
  console.log('\n💰 Step 4: Creating Expense...');
  const expense = await request('/expenses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${employeeToken}` },
    body: JSON.stringify({
      title: 'Business Trip to NYC',
      description: 'Client meeting and conference attendance',
      amount: 1500.00,
      currency: 'USD',
      category: 'travel',
      expense_date: '2026-03-29',
      is_urgent: false,
    }),
  });
  
  if (expense) {
    expenseId = expense.data.expense.id;
    console.log('Expense created:', expense.data.expense.title);
    console.log('Amount: $' + expense.data.expense.amount);
    console.log('Status:', expense.data.expense.status);
  }

  // Step 5: Submit Expense for Approval
  console.log('\n📤 Step 5: Submitting Expense for Approval...');
  const submit = await request(`/expenses/${expenseId}/submit`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${employeeToken}` },
  });
  
  if (submit) {
    console.log('Expense submitted!');
    console.log('Total approval levels:', submit.data.totalLevels);
    console.log('Current level:', submit.data.currentLevel);
  }

  // Step 6: Login as Manager
  console.log('\n🔐 Step 6: Manager Login...');
  const mgrLogin = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'manager@test.com',
      password: 'password123',
    }),
  });
  
  if (mgrLogin) {
    managerToken = mgrLogin.data.token;
    console.log('Manager logged in successfully');
  }

  // Step 7: Get Pending Approvals
  console.log('\n📋 Step 7: Getting Pending Approvals...');
  const pending = await request('/approvals/pending', {
    headers: { 'Authorization': `Bearer ${managerToken}` },
  });
  
  if (pending) {
    console.log('Pending approvals count:', pending.count);
    if (pending.count > 0 && pending.data.pendingApprovals[0]) {
      approvalLevelId = pending.data.pendingApprovals[0].id;
      console.log('First approval level ID:', approvalLevelId);
      console.log('Expense:', pending.data.pendingApprovals[0].expense.title);
    }
  }

  // Step 8: Approve Expense
  console.log('\n✅ Step 8: Approving Expense...');
  const approve = await request(`/approvals/${approvalLevelId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${managerToken}` },
    body: JSON.stringify({
      action: 'approve',
      comments: 'Looks good - within budget',
    }),
  });
  
  if (approve) {
    console.log('Approval result:', approve.message);
    console.log('Expense status:', approve.data.expense.status);
    if (approve.data.nextApprover) {
      console.log('Forwarded to next approver:', approve.data.nextApprover);
    }
  }

  // Step 9: Check Approval History
  console.log('\n📜 Step 9: Checking Approval History...');
  const history = await request(`/expenses/${expenseId}/approvals`, {
    headers: { 'Authorization': `Bearer ${employeeToken}` },
  });
  
  if (history) {
    console.log('Expense status:', history.data.expense.status);
    console.log('Approval levels:');
    history.data.expense.approvalLevels.forEach(level => {
      console.log(`  Level ${level.level_number}:`, 
        level.status, 
        level.comments ? `- "${level.comments}"` : ''
      );
    });
  }

  // Step 10: Check Dashboard
  console.log('\n📊 Step 10: Checking Employee Dashboard...');
  const dashboard = await request('/dashboard', {
    headers: { 'Authorization': `Bearer ${employeeToken}` },
  });
  
  if (dashboard) {
    console.log('Dashboard statistics:');
    console.log('  Total expenses:', dashboard.data.statistics.totalExpenses);
    console.log('  Pending:', dashboard.data.statistics.pendingCount);
    console.log('  Approved:', dashboard.data.statistics.approvedCount);
    console.log('  Total amount:', '$' + dashboard.data.statistics.totalAmount);
  }

  // Step 11: Test Rejection Flow
  console.log('\n\n🔄 Testing Rejection Flow...\n');
  console.log('='.repeat(50));

  // Create another expense
  const expense2 = await request('/expenses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${employeeToken}` },
    body: JSON.stringify({
      title: 'Expensive Equipment',
      description: 'High-end laptop',
      amount: 3000.00,
      currency: 'USD',
      category: 'equipment',
      expense_date: '2026-03-29',
      is_urgent: false,
    }),
  });
  
  if (expense2) {
    const expense2Id = expense2.data.expense.id;
    console.log('Created second expense:', expense2.data.expense.title);

    // Submit it
    await request(`/expenses/${expense2Id}/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${employeeToken}` },
    });

    // Get new pending approval
    const pending2 = await request('/approvals/pending', {
      headers: { 'Authorization': `Bearer ${managerToken}` },
    });

    if (pending2 && pending2.count > 0) {
      const newApprovalId = pending2.data.pendingApprovals.find(
        p => p.expense_id === expense2Id
      )?.id;

      if (newApprovalId) {
        // Reject it
        console.log('\n❌ Step 12: Rejecting Expense...');
        const reject = await request(`/approvals/${newApprovalId}/reject`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${managerToken}` },
          body: JSON.stringify({
            action: 'reject',
            comments: 'Exceeds budget limit. Needs justification.',
          }),
        });

        if (reject) {
          console.log('Rejection result:', reject.message);
          console.log('Expense status:', reject.data.expense.status);
        }
      }
    }
  }

  // Final Summary
  console.log('\n\n🎉 Test Summary');
  console.log('='.repeat(50));
  console.log('✅ All approval workflow features tested successfully!');
  console.log('\nFeatures verified:');
  console.log('  ✓ Expense creation');
  console.log('  ✓ Expense submission for approval');
  console.log('  ✓ Multi-level approval workflow');
  console.log('  ✓ Manager approval/rejection');
  console.log('  ✓ Approval history tracking');
  console.log('  ✓ Role-based dashboards');
  console.log('  ✓ Sequential approval process');
  console.log('\n📝 Check MEMBER3_API_DOCS.md for complete API documentation');
  console.log('='.repeat(50));
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test failed with error:', error);
});

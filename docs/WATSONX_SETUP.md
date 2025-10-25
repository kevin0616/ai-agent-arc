# 🔧 IBM watsonx Orchestrate Setup Guide

## Quick Start for Agent Architect (Person 1)

---

## 📝 **Step 1: Create Account (5 minutes)**

### **Sign Up:**
1. Go to: https://www.ibm.com/account/reg/signup?formid=urx-52753
2. Click "Start your free trial"
3. Fill in:
   - Email address
   - Company name: "WorkFlow Wizard Team"
   - Job role: "Developer"
   - Industry: "Technology"
4. Verify email
5. Complete profile setup

### **Access watsonx Orchestrate:**
1. Login: https://cloud.ibm.com
2. Navigate to: **watsonx → Orchestrate**
3. You should see the main dashboard

---

## 🎓 **Step 2: Platform Tutorial (10 minutes)**

### **Take the Quick Tour:**
1. Click "Take a tour" when prompted
2. Learn about:
   - Agent builder
   - Skills catalog
   - Workflow designer
   - Testing console

### **Watch IBM Videos:**
- [watsonx Orchestrate Overview](https://www.ibm.com/products/watsonx-orchestrate) (3 min)
- Getting Started tutorial in platform (5 min)

---

## 🤖 **Step 3: Create Your First Agent (15 minutes)**

### **Create Coordinator Agent:**

1. **Click "Create Agent"**
   - Name: `Coordinator Agent`
   - Description: `Master orchestrator for all employee requests`
   - Icon: 🎯

2. **Add Skills:**
   - Click "Add Skill"
   - Choose "Custom Skill"
   
3. **Configure Intent Analysis Skill:**
   ```
   Skill Name: Analyze Request
   Description: Classify employee request intent
   
   Input Parameters:
   - user_message (string, required)
   - employee_id (string, optional)
   
   Output Parameters:
   - intent (string)
   - confidence (number)
   - suggested_agent (string)
   
   Logic:
   Use watsonx.ai to classify into:
   - vacation_request
   - employee_onboarding
   - expense_reimbursement
   - equipment_order
   - access_request
   ```

4. **Add Routing Skill:**
   ```
   Skill Name: Route to Agent
   Description: Route request to specialized agent
   
   Input Parameters:
   - intent (string)
   - task_data (object)
   
   Output Parameters:
   - target_agent (string)
   - task_id (string)
   - status (string)
   ```

5. **Test the Agent:**
   - Click "Test" button
   - Input: "I need vacation next week"
   - Expected: Should classify as "vacation_request" and route to "hr_agent"

---

## 🏗️ **Step 4: Create Specialized Agents**

### **A. HR Agent**

```yaml
Name: HR Agent
Description: Handles human resources tasks
Icon: 👥

Skills to Add:

1. Check PTO Balance
   Input: employee_id
   Output: available_days, accrued_days, used_days
   Integration: Mock API / Workday API

2. Submit Leave Request
   Input: employee_id, start_date, end_date, leave_type
   Output: request_id, approval_status, approval_link
   Logic:
   - Validate dates
   - Check PTO balance
   - Create calendar block
   - Notify manager for approval
   
3. Process Onboarding
   Input: new_hire_name, start_date, department, role
   Output: onboarding_schedule, mentor_assigned
   Logic:
   - Schedule orientation
   - Assign mentor
   - Create welcome email
```

### **B. IT Agent**

```yaml
Name: IT Agent
Description: Manages IT resources and access
Icon: 💻

Skills to Add:

1. Create User Account
   Input: name, email, department, role
   Output: email_address, credentials, access_groups
   Integration: Azure AD API / Mock

2. Grant System Access
   Input: employee_id, system_name, permission_level, duration
   Output: access_granted, expiration_date, audit_log_id
   Logic:
   - Verify employee role
   - Check approval requirements
   - Grant access with expiration
   - Log for audit

3. Provision Equipment
   Input: employee_id, equipment_type
   Output: equipment_id, delivery_date
   Logic:
   - Check inventory
   - Create ticket
   - Notify IT team
```

### **C. Finance Agent**

```yaml
Name: Finance Agent
Description: Handles financial transactions
Icon: 💰

Skills to Add:

1. Process Expense Reimbursement
   Input: employee_id, amount, category, receipt_image
   Output: claim_id, approval_status, payment_date
   Integration: OCR API + Expense system
   Logic:
   - Extract receipt data using OCR
   - Validate against policy
   - Check budget availability
   - Route for approval
   - Process payment

2. Check Budget
   Input: department, budget_code, amount
   Output: available_budget, can_approve

3. Setup Payroll
   Input: employee_id, salary, bank_details
   Output: payroll_id, first_payment_date
```

### **D. Procurement Agent**

```yaml
Name: Procurement Agent
Description: Manages purchasing and orders
Icon: 📦

Skills to Add:

1. Order Equipment
   Input: item_description, quantity, requester_id
   Output: po_number, vendor, estimated_delivery
   Logic:
   - Check inventory
   - Get quotes from approved vendors
   - Create purchase order
   - Track shipment

2. Check Inventory
   Input: item_name
   Output: quantity_available, location

3. Track Order
   Input: po_number
   Output: status, tracking_number, eta
```

---

## 🔗 **Step 5: Connect Agents (Orchestration)**

### **Setup Agent-to-Agent Communication:**

1. **Go to Orchestration Settings**
2. **Define Agent Network:**
   ```
   Coordinator Agent
   ├─> HR Agent
   ├─> IT Agent
   ├─> Finance Agent
   └─> Procurement Agent
   ```

3. **Configure Routing Rules:**
   ```javascript
   // In Coordinator Agent
   if (intent === "vacation_request") {
     route_to("hr_agent", task_data);
   }
   else if (intent === "employee_onboarding") {
     // Parallel execution
     route_to_multiple([
       "hr_agent",
       "it_agent",
       "finance_agent",
       "procurement_agent"
     ], task_data);
   }
   // ... more rules
   ```

4. **Enable Message Passing:**
   - Allow agents to send/receive messages
   - Setup callback URLs
   - Configure timeout handling

---

## 🧪 **Step 6: Test Workflows**

### **Test Scenarios:**

1. **Simple Routing:**
   ```
   Input: "I need vacation Dec 20-30"
   Expected:
   - Coordinator receives → classifies as vacation_request
   - Routes to HR Agent
   - HR Agent processes → returns result
   - Coordinator sends final response
   ```

2. **Multi-Agent Orchestration:**
   ```
   Input: "New employee Sarah Chen starts Monday"
   Expected:
   - Coordinator routes to ALL agents (parallel)
   - HR Agent: Schedules onboarding
   - IT Agent: Creates accounts
   - Finance Agent: Sets up payroll
   - Procurement Agent: Orders equipment
   - Coordinator aggregates results
   ```

3. **Error Handling:**
   ```
   Input: "I need 100 days vacation"
   Expected:
   - HR Agent checks PTO → insufficient balance
   - Returns error message
   - Suggests alternative (use fewer days)
   ```

---

## 🔌 **Step 7: API Integration**

### **Get API Credentials:**
1. Go to **Settings → API Keys**
2. Click "Generate New Key"
3. Copy:
   - API Key
   - API URL
   - Service Instance ID

### **Save to .env file:**
```bash
# IBM watsonx Orchestrate
WATSONX_API_KEY=your_api_key_here
WATSONX_API_URL=https://us-south.ml.cloud.ibm.com
WATSONX_PROJECT_ID=your_project_id
WATSONX_SPACE_ID=your_space_id

# Agent IDs
COORDINATOR_AGENT_ID=agent_id_1
HR_AGENT_ID=agent_id_2
IT_AGENT_ID=agent_id_3
FINANCE_AGENT_ID=agent_id_4
PROCUREMENT_AGENT_ID=agent_id_5
```

### **Test API Connection:**
```python
# test_watsonx.py
import os
from ibm_watsonx_ai import Credentials, APIClient

# Initialize client
credentials = Credentials(
    url=os.getenv("WATSONX_API_URL"),
    api_key=os.getenv("WATSONX_API_KEY")
)

client = APIClient(credentials)

# Test connection
print("✅ Connected to watsonx Orchestrate!")

# Invoke Coordinator Agent
response = client.agents.run(
    agent_id=os.getenv("COORDINATOR_AGENT_ID"),
    input={
        "user_message": "I need vacation next week",
        "employee_id": "EMP-12345"
    }
)

print("Response:", response)
```

---

## 📊 **Step 8: Monitor & Optimize**

### **Analytics Dashboard:**
1. Go to **Analytics** tab
2. Monitor:
   - Agent response times
   - Success rates
   - Error rates
   - Most used agents

### **Optimize Performance:**
- Review slow agents
- Add caching for common requests
- Optimize skill logic
- Add error fallbacks

---

## 🚀 **Step 9: Export Configurations**

### **Export Agent Configs:**
1. Go to each agent
2. Click **Export**
3. Save as JSON files:
   ```
   watsonx-configs/agents/
   ├── coordinator.json
   ├── hr-agent.json
   ├── it-agent.json
   ├── finance-agent.json
   └── procurement-agent.json
   ```

4. Commit to GitHub for team

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Agent not responding"**
   - Check API key validity
   - Verify endpoint URL
   - Check agent status in dashboard

2. **"Skill execution failed"**
   - Review skill logic
   - Check input parameters
   - Test with simple inputs first

3. **"Routing not working"**
   - Verify agent connections
   - Check routing rules syntax
   - Test each agent individually first

4. **"Integration timeout"**
   - Increase timeout settings
   - Check external API availability
   - Add retry logic

---

## 📚 **Resources**

### **IBM Documentation:**
- [watsonx Orchestrate Docs](https://www.ibm.com/docs/en/watsonx/watson-orchestrate)
- [Agent Builder Guide](https://www.ibm.com/products/watsonx-orchestrate/ai-agent-builder)
- [API Reference](https://cloud.ibm.com/apidocs/watsonx-ai)

### **Tutorials:**
- [Building Your First Agent](https://www.ibm.com/docs/en/watsonx-orchestrate/tutorial)
- [Multi-Agent Orchestration](https://www.ibm.com/products/watsonx-orchestrate/multi-agent-orchestration)

### **Community:**
- [IBM Community Forum](https://community.ibm.com/community/user/watsonai/home)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ibm-watson)

---

## ✅ **Checklist**

### **Before Starting Development:**
- [ ] watsonx Orchestrate account created
- [ ] Platform tutorial completed
- [ ] Coordinator Agent created
- [ ] All 5 agents configured
- [ ] Agent connections setup
- [ ] Test workflows working
- [ ] API credentials saved
- [ ] Configurations exported
- [ ] Team notified in Discord

---

## 🎯 **Next Steps**

Once agents are ready:
1. Share API credentials with Person 3 (Backend)
2. Export agent configs for version control
3. Document any custom integrations
4. Help with integration testing

---

**Need help? Post in #agents channel on Discord! 🚀**

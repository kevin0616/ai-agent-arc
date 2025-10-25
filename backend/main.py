"""
WorkFlow Wizard Backend API
IBM watsonx Orchestrate Integration
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from datetime import datetime
import asyncio

app = FastAPI(
    title="WorkFlow Wizard API",
    description="Multi-Department Workflow Orchestration Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# Pydantic models
class Message(BaseModel):
    text: str
    employee_id: Optional[str] = "EMP-12345"
    timestamp: Optional[datetime] = None

class TaskResponse(BaseModel):
    task_id: str
    intent: str
    routed_to: str
    status: str
    message: str
    agent_type: str

# Routes
@app.get("/")
async def root():
    return {
        "service": "WorkFlow Wizard API",
        "version": "1.0.0",
        "status": "running",
        "agents_active": 5
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents": {
            "coordinator": "active",
            "hr": "active",
            "it": "active",
            "finance": "active",
            "procurement": "active"
        }
    }

@app.post("/api/chat")
async def process_message(message: Message) -> TaskResponse:
    """
    Process user message and route to appropriate agent
    
    This will integrate with IBM watsonx Orchestrate
    For now, it's a mock implementation for demo
    """
    user_text = message.text.lower()
    
    # Simulate processing delay
    await asyncio.sleep(0.5)
    
    # Intent classification (will be replaced with watsonx)
    intent = classify_intent(user_text)
    
    # Route to appropriate agent
    if "vacation" in user_text or "leave" in user_text:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="vacation_request",
            routed_to="hr_agent",
            status="processing",
            message="HR Agent is processing your vacation request...",
            agent_type="HR Agent"
        )
    
    elif "onboard" in user_text or "new employee" in user_text:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="employee_onboarding",
            routed_to="multi_agent",
            status="processing",
            message="Initiating multi-agent onboarding workflow...",
            agent_type="Multi-Agent"
        )
    
    elif "expense" in user_text or "reimburse" in user_text:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="expense_reimbursement",
            routed_to="finance_agent",
            status="processing",
            message="Finance Agent is processing your expense...",
            agent_type="Finance Agent"
        )
    
    elif "monitor" in user_text or "equipment" in user_text or "order" in user_text:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="equipment_order",
            routed_to="procurement_agent",
            status="processing",
            message="Procurement Agent is processing your order...",
            agent_type="Procurement Agent"
        )
    
    elif "access" in user_text or "urgent" in user_text:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="access_request",
            routed_to="it_agent",
            status="processing",
            message="IT Agent is processing your access request...",
            agent_type="IT Agent"
        )
    
    else:
        return TaskResponse(
            task_id=f"TASK-{datetime.now().timestamp()}",
            intent="general_inquiry",
            routed_to="coordinator",
            status="completed",
            message="How can I help you today?",
            agent_type="Coordinator"
        )

def classify_intent(text: str) -> str:
    """
    Classify user intent
    TODO: Integrate with watsonx.ai for better classification
    """
    keywords = {
        "vacation_request": ["vacation", "leave", "pto", "time off"],
        "employee_onboarding": ["onboard", "new employee", "new hire"],
        "expense_reimbursement": ["expense", "reimburse", "receipt"],
        "equipment_order": ["order", "equipment", "monitor", "laptop"],
        "access_request": ["access", "permission", "urgent", "production"]
    }
    
    for intent, words in keywords.items():
        if any(word in text for word in words):
            return intent
    
    return "general_inquiry"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time updates
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Process message
            response = await process_message(Message(**data))
            # Send response
            await websocket.send_json(response.dict())
            # Broadcast to other clients
            await manager.broadcast({
                "type": "task_update",
                "data": response.dict()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Demo endpoints
@app.get("/api/agents")
async def get_agents():
    """Get list of active agents"""
    return {
        "agents": [
            {
                "id": "coordinator",
                "name": "Coordinator Agent",
                "status": "active",
                "tasks_processed": 147,
                "average_time": "1.2s"
            },
            {
                "id": "hr",
                "name": "HR Agent",
                "status": "active",
                "tasks_processed": 42,
                "average_time": "28s"
            },
            {
                "id": "it",
                "name": "IT Agent",
                "status": "active",
                "tasks_processed": 38,
                "average_time": "15s"
            },
            {
                "id": "finance",
                "name": "Finance Agent",
                "status": "active",
                "tasks_processed": 31,
                "average_time": "42s"
            },
            {
                "id": "procurement",
                "name": "Procurement Agent",
                "status": "active",
                "tasks_processed": 24,
                "average_time": "1m 45s"
            }
        ]
    }

@app.get("/api/workflows")
async def get_workflows():
    """Get recent workflows"""
    return {
        "workflows": [
            {
                "id": "WF-001",
                "type": "Vacation Request",
                "employee": "John Doe",
                "status": "completed",
                "duration": "32s",
                "timestamp": "2025-11-21T10:15:30Z"
            },
            {
                "id": "WF-002",
                "type": "Employee Onboarding",
                "employee": "Sarah Chen",
                "status": "in_progress",
                "duration": "2m 15s",
                "timestamp": "2025-11-21T10:20:45Z"
            }
        ]
    }

if __name__ == "__main__":
    print("🚀 Starting WorkFlow Wizard API...")
    print("📍 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🔌 WebSocket: ws://localhost:8000/ws")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

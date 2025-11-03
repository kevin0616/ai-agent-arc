"""
WebSocket Handler - Real-time chat via WebSocket
"""
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
from src.api.dependencies import get_ai_agent
from src.ai.agent import AIAgent


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        """Initialize connection manager"""
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        """Remove WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
    
    async def send_personal_message(self, message: str, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        """Broadcast message to all clients"""
        for connection in self.active_connections.values():
            await connection.send_text(message)


manager = ConnectionManager()


async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time chat
    
    Args:
        websocket: WebSocket connection
        client_id: Client identifier
    """
    await manager.connect(websocket, client_id)
    ai_agent = get_ai_agent()
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Process message with AI agent
            result = await ai_agent.process_message(user_message=data)
            
            # Send response back
            response = {
                "intent": result["intent"],
                "response": result["response"],
                "status": result["status"]
            }
            
            await websocket.send_json(response)
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)


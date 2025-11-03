"""
Message Model - Database model for chat messages
"""
from sqlalchemy import Column, String, DateTime, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from typing import Optional

Base = declarative_base()


class Message(Base):
    """Message database model"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_address = Column(String, index=True)
    content = Column(Text)
    role = Column(String)  # user, assistant
    intent = Column(String, nullable=True)
    entities = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "user_address": self.user_address,
            "content": self.content,
            "role": self.role,
            "intent": self.intent,
            "entities": self.entities,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


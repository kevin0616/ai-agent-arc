"""
Transaction Model - Database model for transactions
"""
from sqlalchemy import Column, String, Float, DateTime, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from typing import Optional

Base = declarative_base()


class Transaction(Base):
    """Transaction database model"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    tx_hash = Column(String, unique=True, index=True)
    from_address = Column(String, index=True)
    to_address = Column(String, index=True)
    amount = Column(Float)
    intent = Column(String)
    status = Column(String)  # pending, success, failed
    memo = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "tx_hash": self.tx_hash,
            "from_address": self.from_address,
            "to_address": self.to_address,
            "amount": self.amount,
            "intent": self.intent,
            "status": self.status,
            "memo": self.memo,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


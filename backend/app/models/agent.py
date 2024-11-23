from sqlalchemy import Column, String, JSON, Enum, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship, backref
from .base import TimeStampedBase
import enum

class AgentType(str, enum.Enum):
    ASSISTANT = "assistant"
    RESEARCHER = "researcher"
    EXECUTOR = "executor"
    PLANNER = "planner"

class AgentStatus(str, enum.Enum):
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    DISABLED = "disabled"

class Agent(TimeStampedBase):
    __tablename__ = "agents"

    name = Column(String(100), nullable=False)
    description = Column(Text)
    type = Column(Enum(AgentType), nullable=False)
    status = Column(Enum(AgentStatus), default=AgentStatus.IDLE)
    capabilities = Column(JSON, default=dict)
    config = Column(JSON, default=dict)
    
    # Relationships
    tasks = relationship("Task", back_populates="agent")
    conversations = relationship("Conversation", back_populates="agent")

class Task(TimeStampedBase):
    __tablename__ = "tasks"

    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="pending")
    priority = Column(Integer, default=0)
    result = Column(JSON, nullable=True)
    
    # Foreign Keys
    agent_id = Column(Integer, ForeignKey("agents.id"))
    parent_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    
    # Relationships
    agent = relationship("Agent", back_populates="tasks")
    subtasks = relationship(
        "Task",
        backref=backref("parent", remote_side="Task.id"),
        cascade="all, delete-orphan",
        join_depth=2
    )
    conversations = relationship("Conversation", back_populates="task")

class Conversation(TimeStampedBase):
    __tablename__ = "conversations"

    messages = Column(JSON, default=list)
    meta_info = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    
    # Foreign Keys
    agent_id = Column(Integer, ForeignKey("agents.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    
    # Relationships
    agent = relationship("Agent", back_populates="conversations")
    task = relationship("Task", back_populates="conversations") 
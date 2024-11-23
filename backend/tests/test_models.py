import pytest
from app.models.agent import Agent, Task, Conversation, AgentType, AgentStatus

def test_create_agent(db_session):
    agent = Agent(
        name="Test Agent",
        description="A test agent",
        type=AgentType.ASSISTANT,
        capabilities={"can_search": True}
    )
    
    db_session.add(agent)
    db_session.commit()
    
    assert agent.id is not None
    assert agent.status == AgentStatus.IDLE
    assert agent.capabilities["can_search"] is True

def test_create_task(db_session):
    # Create agent first
    agent = Agent(
        name="Test Agent",
        type=AgentType.ASSISTANT
    )
    db_session.add(agent)
    db_session.commit()
    
    # Create task
    task = Task(
        title="Test Task",
        description="A test task",
        agent_id=agent.id,
        priority=1
    )
    
    db_session.add(task)
    db_session.commit()
    
    assert task.id is not None
    assert task.status == "pending"
    assert task.agent.name == "Test Agent"

def test_create_conversation(db_session):
    # Create agent and task
    agent = Agent(
        name="Test Agent",
        type=AgentType.ASSISTANT
    )
    db_session.add(agent)
    db_session.commit()
    
    task = Task(
        title="Test Task",
        agent_id=agent.id
    )
    db_session.add(task)
    db_session.commit()
    
    # Create conversation
    conversation = Conversation(
        agent_id=agent.id,
        task_id=task.id,
        messages=[
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi there!"}
        ]
    )
    
    db_session.add(conversation)
    db_session.commit()
    
    assert conversation.id is not None
    assert len(conversation.messages) == 2
    assert conversation.agent.name == "Test Agent"
    assert conversation.task.title == "Test Task" 
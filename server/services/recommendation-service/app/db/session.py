from sqlalchemy.ext.asyncio import AsyncSession
from db.database import async_session

async def get_db() -> AsyncSession: # type: ignore
    """
    Dependency function to get database session.
    Yields an AsyncSession object.
    """
    async with async_session() as session:
        yield session

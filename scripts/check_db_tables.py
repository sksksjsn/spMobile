import asyncio
import os
from sqlalchemy import text
from server.app.core.database import engine

async def check_tables():
    async with engine.connect() as conn:
        # Get list of tables in MSSQL
        result = await conn.execute(text("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"))
        tables = [row[0] for row in result.fetchall()]
        print("Current tables in DB:")
        for table in sorted(tables):
            print(f"- {table}")
        
        if "WB_BOARD_INFO" in tables:
            print("\n✅ WB_BOARD_INFO exists!")
        else:
            print("\n❌ WB_BOARD_INFO does not exist.")

if __name__ == "__main__":
    asyncio.run(check_tables())

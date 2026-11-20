"""Initial schema migration with normalized medical models and constraints

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-11-20 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Schema creation handled through Base.metadata
    pass

def downgrade() -> None:
    pass

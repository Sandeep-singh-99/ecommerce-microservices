"""initial payment schema

Revision ID: 001_initial_payment_schema
Revises: 
Create Date: 2026-07-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_payment_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'payments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('order_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('provider', sa.String(), nullable=False, server_default='cashfree'),
        sa.Column('transaction_id', sa.String(), nullable=True),
        sa.Column('payment_link', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'SUCCESS', 'FAILED', name='paymentstatus'), nullable=False, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('transaction_id')
    )
    op.create_index('idx_payments_order_id', 'payments', ['order_id'], unique=False)
    op.create_index('idx_payments_user_id', 'payments', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index('idx_payments_user_id', table_name='payments')
    op.drop_index('idx_payments_order_id', table_name='payments')
    op.drop_table('payments')
    op.execute('DROP TYPE IF EXISTS paymentstatus')

"""Add BenefitGrant.sale_id

Revision ID: 4fcb1d4684a0
Revises: f850759b02d5
Create Date: 2024-05-22 16:37:54.822785

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "4fcb1d4684a0"
down_revision = "f850759b02d5"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("benefit_grants", sa.Column("sale_id", sa.UUID(), nullable=True))
    op.alter_column(
        "benefit_grants", "subscription_id", existing_type=sa.UUID(), nullable=True
    )
    op.create_index(
        op.f("ix_benefit_grants_sale_id"), "benefit_grants", ["sale_id"], unique=False
    )
    op.create_foreign_key(
        op.f("benefit_grants_sale_id_fkey"),
        "benefit_grants",
        "sales",
        ["sale_id"],
        ["id"],
        ondelete="cascade",
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        op.f("benefit_grants_sale_id_fkey"), "benefit_grants", type_="foreignkey"
    )
    op.drop_index(op.f("ix_benefit_grants_sale_id"), table_name="benefit_grants")
    op.alter_column(
        "benefit_grants", "subscription_id", existing_type=sa.UUID(), nullable=False
    )
    op.drop_column("benefit_grants", "sale_id")
    # ### end Alembic commands ###
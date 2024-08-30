"""license key drop unique constraint

Revision ID: 7d7ca1953931
Revises: 225d352dfa66
Create Date: 2024-08-22 13:17:40.378831

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports

# revision identifiers, used by Alembic.
revision = "7d7ca1953931"
down_revision = "225d352dfa66"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        "license_keys_user_id_benefit_id_key", "license_keys", type_="unique"
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "license_keys_user_id_benefit_id_key", "license_keys", ["user_id", "benefit_id"]
    )
    # ### end Alembic commands ###
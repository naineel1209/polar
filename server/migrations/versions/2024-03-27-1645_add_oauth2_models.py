"""Add OAuth2 models

Revision ID: 7ac719755916
Revises: 1f7240e7cc77
Create Date: 2024-03-27 16:45:30.787152

"""
import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "7ac719755916"
down_revision = "1f7240e7cc77"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "oauth2_clients",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("modified_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("client_id", sa.String(length=48), nullable=True),
        sa.Column("client_secret", sa.String(length=120), nullable=True),
        sa.Column("client_id_issued_at", sa.Integer(), nullable=False),
        sa.Column("client_secret_expires_at", sa.Integer(), nullable=False),
        sa.Column("client_metadata", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("oauth2_clients_pkey")),
    )
    op.create_index(
        op.f("ix_oauth2_clients_client_id"),
        "oauth2_clients",
        ["client_id"],
        unique=False,
    )
    op.create_table(
        "oauth2_authorization_codes",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("modified_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("code", sa.String(length=120), nullable=False),
        sa.Column("client_id", sa.String(length=48), nullable=True),
        sa.Column("redirect_uri", sa.Text(), nullable=True),
        sa.Column("response_type", sa.Text(), nullable=True),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("nonce", sa.Text(), nullable=True),
        sa.Column("auth_time", sa.Integer(), nullable=False),
        sa.Column("code_challenge", sa.Text(), nullable=True),
        sa.Column("code_challenge_method", sa.String(length=48), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("oauth2_authorization_codes_user_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("oauth2_authorization_codes_pkey")),
        sa.UniqueConstraint("code", name=op.f("oauth2_authorization_codes_code_key")),
    )
    op.create_table(
        "oauth2_tokens",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("modified_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("client_id", sa.String(length=48), nullable=True),
        sa.Column("token_type", sa.String(length=40), nullable=True),
        sa.Column("access_token", sa.String(length=255), nullable=False),
        sa.Column("refresh_token", sa.String(length=255), nullable=True),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("issued_at", sa.Integer(), nullable=False),
        sa.Column("access_token_revoked_at", sa.Integer(), nullable=False),
        sa.Column("refresh_token_revoked_at", sa.Integer(), nullable=False),
        sa.Column("expires_in", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("oauth2_tokens_user_id_fkey"),
            ondelete="cascade",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("oauth2_tokens_pkey")),
        sa.UniqueConstraint(
            "access_token", name=op.f("oauth2_tokens_access_token_key")
        ),
    )
    op.create_index(
        op.f("ix_oauth2_tokens_refresh_token"),
        "oauth2_tokens",
        ["refresh_token"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_oauth2_tokens_refresh_token"), table_name="oauth2_tokens")
    op.drop_table("oauth2_tokens")
    op.drop_table("oauth2_authorization_codes")
    op.drop_index(op.f("ix_oauth2_clients_client_id"), table_name="oauth2_clients")
    op.drop_table("oauth2_clients")
    # ### end Alembic commands ###
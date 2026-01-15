"""initial migration with all tables and rejection_reason

Revision ID: 001_initial_robust
Revises: 
Create Date: 2026-01-14 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_robust'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types with IF NOT EXISTS logic using raw SQL
    conn = op.get_bind()
    
    # Create toolcategory enum
    conn.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE toolcategory AS ENUM ('development', 'design', 'productivity', 'communication', 'analytics', 'other');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))
    
    # Create toolstatus enum  
    conn.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE toolstatus AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))
    
    # Create userrole enum
    conn.execute(sa.text("""
        DO $$ BEGIN
            CREATE TYPE userrole AS ENUM ('user', 'moderator', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """))
    
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('hashed_password', sa.String(length=100), nullable=False),
        sa.Column('role', postgresql.ENUM('user', 'moderator', 'admin', name='userrole', create_type=False), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('telegram_id', sa.String(length=50), nullable=True),
        sa.Column('is_2fa_enabled', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    
    # Create tools table WITH rejection_reason from the start!
    op.create_table('tools',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', postgresql.ENUM('development', 'design', 'productivity', 'communication', 'analytics', 'other', name='toolcategory', create_type=False), nullable=False),
        sa.Column('status', postgresql.ENUM('pending', 'approved', 'rejected', name='toolstatus', create_type=False), nullable=False),
        sa.Column('url', sa.String(length=255), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('approved_by', sa.Integer(), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),  # ← INCLUDED!
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['approved_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tools_category'), 'tools', ['category'], unique=False)
    op.create_index(op.f('ix_tools_id'), 'tools', ['id'], unique=False)
    op.create_index(op.f('ix_tools_name'), 'tools', ['name'], unique=False)
    op.create_index(op.f('ix_tools_status'), 'tools', ['status'], unique=False)
    
    # Create tool_ratings table
    op.create_table('tool_ratings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tool_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tool_id'], ['tools.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tool_id', 'user_id', name='uix_tool_user_rating')
    )
    op.create_index(op.f('ix_tool_ratings_id'), 'tool_ratings', ['id'], unique=False)
    op.create_index(op.f('ix_tool_ratings_tool_id'), 'tool_ratings', ['tool_id'], unique=False)
    
    # Create tool_comments table
    op.create_table('tool_comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tool_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('upvotes', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('downvotes', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tool_id'], ['tools.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tool_comments_id'), 'tool_comments', ['id'], unique=False)
    op.create_index(op.f('ix_tool_comments_tool_id'), 'tool_comments', ['tool_id'], unique=False)
    
    # Create comment_votes table
    op.create_table('comment_votes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('comment_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('vote_type', sa.String(length=10), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['comment_id'], ['tool_comments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('comment_id', 'user_id', name='uix_comment_user_vote')
    )
    
    # Create audit_logs table
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=50), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=True),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('details', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_table('comment_votes')
    op.drop_index(op.f('ix_tool_comments_tool_id'), table_name='tool_comments')
    op.drop_index(op.f('ix_tool_comments_id'), table_name='tool_comments')
    op.drop_table('tool_comments')
    op.drop_index(op.f('ix_tool_ratings_tool_id'), table_name='tool_ratings')
    op.drop_index(op.f('ix_tool_ratings_id'), table_name='tool_ratings')
    op.drop_table('tool_ratings')
    op.drop_index(op.f('ix_tools_status'), table_name='tools')
    op.drop_index(op.f('ix_tools_name'), table_name='tools')
    op.drop_index(op.f('ix_tools_id'), table_name='tools')
    op.drop_index(op.f('ix_tools_category'), table_name='tools')
    op.drop_table('tools')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    
    # Drop enum types
    conn = op.get_bind()
    conn.execute(sa.text("DROP TYPE IF EXISTS userrole CASCADE"))
    conn.execute(sa.text("DROP TYPE IF EXISTS toolstatus CASCADE"))
    conn.execute(sa.text("DROP TYPE IF EXISTS toolcategory CASCADE"))

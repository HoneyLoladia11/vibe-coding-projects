from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.models.user import User


class AuditService:
    """Service for logging user activity"""
    
    @staticmethod
    def log_action(
        db: Session,
        user: User,
        action: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """
        Log a user action to the audit log
        
        Args:
            db: Database session
            user: User performing the action
            action: Action name (e.g., "create", "update", "delete", "approve")
            entity_type: Type of entity (e.g., "tool", "user")
            entity_id: ID of the affected entity
            details: Additional details as dictionary
            ip_address: User's IP address
            
        Returns:
            AuditLog: Created audit log entry
        """
        audit_log = AuditLog(
            user_id=user.id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            ip_address=ip_address
        )
        
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        
        return audit_log
    
    @staticmethod
    def get_user_activity(
        db: Session,
        user_id: int,
        limit: int = 50
    ) -> list[AuditLog]:
        """
        Get recent activity for a specific user
        
        Args:
            db: Database session
            user_id: User ID
            limit: Maximum number of records to return
            
        Returns:
            List of audit log entries
        """
        return db.query(AuditLog)\
            .filter(AuditLog.user_id == user_id)\
            .order_by(AuditLog.timestamp.desc())\
            .limit(limit)\
            .all()
    
    @staticmethod
    def get_entity_history(
        db: Session,
        entity_type: str,
        entity_id: int,
        limit: int = 50
    ) -> list[AuditLog]:
        """
        Get history for a specific entity
        
        Args:
            db: Database session
            entity_type: Type of entity
            entity_id: Entity ID
            limit: Maximum number of records to return
            
        Returns:
            List of audit log entries
        """
        return db.query(AuditLog)\
            .filter(
                AuditLog.entity_type == entity_type,
                AuditLog.entity_id == entity_id
            )\
            .order_by(AuditLog.timestamp.desc())\
            .limit(limit)\
            .all()


# Singleton instance
audit_service = AuditService()

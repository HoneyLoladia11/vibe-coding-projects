"""
Script to create an admin user for testing/initial setup
"""
import sys
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.utils.security import hash_password


def create_admin(username: str = "admin", email: str = "admin@example.com", password: str = "admin123"):
    """Create an admin user"""
    
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing = db.query(User).filter(User.username == username).first()
        if existing:
            print(f"❌ User '{username}' already exists!")
            return False
        
        # Create admin user
        admin = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            role=UserRole.ADMIN
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: {admin.role.value}")
        print(f"\n⚠️  Please change the password after first login!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        return False
        
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        username = sys.argv[1]
        email = sys.argv[2] if len(sys.argv) > 2 else f"{username}@example.com"
        password = sys.argv[3] if len(sys.argv) > 3 else "admin123"
        create_admin(username, email, password)
    else:
        create_admin()

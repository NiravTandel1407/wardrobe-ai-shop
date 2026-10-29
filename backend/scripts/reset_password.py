import sys
from sqlalchemy import select
from app.core.database import SessionLocal
from app.modules.users.models import User
from app.core.security import hash_password

def main(email: str, password: str) -> None:
    db = SessionLocal()
    try:
        user = db.scalars(select(User).where(User.email == email.lower())).first()
        if user is None:
            print(f"No user with email {email}")
            return
        user.password_hash = hash_password(password)
        db.commit()
        print(f"Password for {user.email} updated successfully")
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@wardrobe.com"
    pwd = sys.argv[2] if len(sys.argv) > 2 else "admin123"
    main(email, pwd)

import argparse
import sys
from sqlalchemy import select
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.modules.users.models import User

def create_or_promote_admin(email: str, password: str = None, full_name: str = "Admin"):
    db = SessionLocal()
    try:
        user = db.scalars(select(User).where(User.email == email.lower())).first()
        if user:
            user.is_admin = True
            if password:
                user.password_hash = hash_password(password)
            if full_name:
                user.full_name = full_name
            db.commit()
            print(f"Success: Existing user '{email}' has been promoted to Admin!")
        else:
            if not password:
                print("Error: Password is required to create a new user.")
                sys.exit(1)
            user = User(
                email=email.lower(),
                full_name=full_name,
                password_hash=hash_password(password),
                is_active=True,
                is_admin=True,
            )
            db.add(user)
            db.commit()
            print(f"Success: Admin user '{email}' created successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or promote an admin user")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=False, help="Admin password (required for new user)")
    parser.add_argument("--name", default="Admin", help="Admin display name")

    args = parser.parse_args()
    create_or_promote_admin(args.email, args.password, args.name)


import sys

from sqlalchemy import select

from app.core.database import SessionLocal
from app.modules.users.models import User


def main(email: str) -> None:
    db = SessionLocal()
    try:
        user = db.scalars(select(User).where(User.email == email.lower())).first()
        if user is None:
            print(f"No user with email {email}")
            return
        user.is_admin = True
        db.commit()
        print(f"{user.email} is now an admin")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m scripts.make_admin user@example.com")
        sys.exit(1)
    main(sys.argv[1])
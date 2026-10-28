from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload
import uuid
from pathlib import Path

from app.modules.products.models import Category, Product, ProductVariant
from app.modules.products.schemas import (
    CategoryCreate,
    ProductCreate,
    ProductUpdate,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
IMAGE_DIR = Path("static/products")

# ---------- Categories ----------

def create_category(db: Session, data: CategoryCreate) -> Category:
    if data.parent_id is not None and get_category(db, data.parent_id) is None:
        raise ValueError("Parent category does not exist")

    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_category(db: Session, category_id: int) -> Category | None:
    return db.get(Category, category_id)


def list_categories(db: Session) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.name)))


# ---------- Products ----------

def create_product(db: Session, data: ProductCreate) -> Product:
    if data.category_id is not None and get_category(db, data.category_id) is None:
        raise ValueError("Category does not exist")

    # Everything except 'variants' becomes the Product row
    product = Product(**data.model_dump(exclude={"variants"}))

    # Each variant dict becomes a ProductVariant attached to the product
    for variant_data in data.variants:
        product.variants.append(ProductVariant(**variant_data.model_dump()))

    db.add(product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("A variant with this SKU already exists")

    return get_product(db, product.id)


def get_product(db: Session, product_id: int) -> Product | None:
    query = (
        select(Product)
        .options(selectinload(Product.variants))
        .where(Product.id == product_id)
    )
    return db.scalars(query).first()


def list_products(db: Session, skip: int = 0, limit: int = 20) -> list[Product]:
    query = (
        select(Product)
        .options(selectinload(Product.variants))
        .order_by(Product.id)
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(query))


def update_product(db: Session, product: Product, data: ProductUpdate) -> Product:
    changes = data.model_dump(exclude_unset=True)

    if changes.get("category_id") is not None and get_category(db, changes["category_id"]) is None:
        raise ValueError("Category does not exist")

    for field, value in changes.items():
        setattr(product, field, value)

    db.commit()
    return get_product(db, product.id)


def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()
    
    
# ---------- Images ----------

def save_product_image(content: bytes, content_type: str) -> str:
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Only JPEG, PNG or WebP images allowed")

    if len(content) > MAX_IMAGE_SIZE:
        raise ValueError("Image too large (max 5 MB)")

    filename = f"{uuid.uuid4().hex}{ALLOWED_IMAGE_TYPES[content_type]}"

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    (IMAGE_DIR / filename).write_bytes(content)

    return f"/static/products/{filename}"
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# ---------- Category ----------

class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    parent_id: int | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ---------- Product Variant ----------

class VariantBase(BaseModel):
    size: str = Field(min_length=1, max_length=10)
    color: str | None = Field(default=None, max_length=50)
    stock: int = Field(default=0, ge=0)
    sku: str | None = Field(default=None, max_length=50)


class VariantCreate(VariantBase):
    pass


class VariantResponse(VariantBase):
    id: int
    product_id: int

    model_config = ConfigDict(from_attributes=True)


# ---------- Product ----------

class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    gender: str | None = Field(default=None, max_length=20)
    base_price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    category_id: int | None = None


class ProductCreate(ProductBase):
    variants: list[VariantCreate] = []


class ProductUpdate(BaseModel):
    # Every field optional, so a client can update just one thing
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    gender: str | None = Field(default=None, max_length=20)
    base_price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    category_id: int | None = None
    variants: list[VariantCreate] | None = None


class ProductResponse(ProductBase):
    id: int
    variants: list[VariantResponse] = []

    model_config = ConfigDict(from_attributes=True)

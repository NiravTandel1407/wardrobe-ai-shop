from decimal import Decimal

from pydantic import BaseModel, Field


class CartItemAdd(BaseModel):
    variant_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemResponse(BaseModel):
    id: int
    variant_id: int
    product_id: int
    product_name: str
    image_url: str | None
    size: str
    color: str | None
    unit_price: Decimal
    quantity: int
    line_total: Decimal
    available_stock: int
    stock_issue: bool


class CartResponse(BaseModel):
    id: int
    items: list[CartItemResponse]
    total_items: int
    subtotal: Decimal
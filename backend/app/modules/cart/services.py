from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.cart.models import Cart, CartItem
from app.modules.cart.schemas import CartItemAdd, CartItemResponse, CartResponse
from app.modules.products.models import ProductVariant

MAX_QUANTITY_PER_ITEM = 10


class NotFoundError(Exception):
    """The thing asked for doesn't exist (or doesn't belong to this user)."""


# ---------- Helpers ----------

def _load_cart(db: Session, user_id: int) -> Cart | None:
    query = (
        select(Cart)
        .options(
            selectinload(Cart.items)
            .selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
        )
        .where(Cart.user_id == user_id)
    )
    return db.scalars(query).first()


def get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = _load_cart(db, user_id)
    if cart is None:
        db.add(Cart(user_id=user_id))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()  # another request created it at the same moment
        cart = _load_cart(db, user_id)
    return cart


def _check_quantity(variant: ProductVariant, quantity: int) -> None:
    if variant.stock <= 0:
        raise ValueError(f"Size {variant.size} is out of stock")
    if quantity > MAX_QUANTITY_PER_ITEM:
        raise ValueError(f"You can buy at most {MAX_QUANTITY_PER_ITEM} of one item")
    if quantity > variant.stock:
        raise ValueError(f"Only {variant.stock} left in stock for size {variant.size}")


def _get_user_item(db: Session, user_id: int, item_id: int) -> CartItem:
    query = (
        select(CartItem)
        .join(Cart, CartItem.cart_id == Cart.id)
        .options(selectinload(CartItem.variant))
        .where(CartItem.id == item_id, Cart.user_id == user_id)
    )
    item = db.scalars(query).first()
    if item is None:
        raise NotFoundError("Cart item not found")
    return item


# ---------- Cart operations ----------

def add_item(db: Session, user_id: int, data: CartItemAdd) -> Cart:
    variant = db.get(ProductVariant, data.variant_id)
    if variant is None:
        raise NotFoundError("Product variant not found")

    cart = get_or_create_cart(db, user_id)

    existing = next((i for i in cart.items if i.variant_id == variant.id), None)
    new_quantity = data.quantity + (existing.quantity if existing else 0)
    _check_quantity(variant, new_quantity)

    if existing:
        existing.quantity = new_quantity
    else:
        db.add(CartItem(cart_id=cart.id, variant_id=variant.id, quantity=new_quantity))

    db.commit()
    return _load_cart(db, user_id)


def update_item(db: Session, user_id: int, item_id: int, quantity: int) -> Cart:
    item = _get_user_item(db, user_id, item_id)
    _check_quantity(item.variant, quantity)
    item.quantity = quantity
    db.commit()
    return _load_cart(db, user_id)


def remove_item(db: Session, user_id: int, item_id: int) -> Cart:
    item = _get_user_item(db, user_id, item_id)
    db.delete(item)
    db.commit()
    return _load_cart(db, user_id)


def clear_cart(db: Session, user_id: int) -> Cart:
    cart = get_or_create_cart(db, user_id)
    cart.items.clear()  # delete-orphan removes the rows
    db.commit()
    return _load_cart(db, user_id)


# ---------- Building the response ----------

def cart_to_response(cart: Cart) -> CartResponse:
    items = []
    for item in sorted(cart.items, key=lambda i: i.id):
        variant = item.variant
        product = variant.product
        unit_price = product.base_price
        items.append(
            CartItemResponse(
                id=item.id,
                variant_id=variant.id,
                product_id=product.id,
                product_name=product.name,
                image_url=product.image_url,
                size=variant.size,
                color=variant.color,
                unit_price=unit_price,
                quantity=item.quantity,
                line_total=unit_price * item.quantity,
                available_stock=variant.stock,
                stock_issue=item.quantity > variant.stock,
            )
        )

    return CartResponse(
        id=cart.id,
        items=items,
        total_items=sum(i.quantity for i in items),
        subtotal=sum((i.line_total for i in items), Decimal("0.00")),
    )
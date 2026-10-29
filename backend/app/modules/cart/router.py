from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.cart import services
from app.modules.cart.schemas import CartItemAdd, CartItemUpdate, CartResponse
from app.modules.users.deps import get_current_user
from app.modules.users.models import User

cart_router = APIRouter(prefix="/cart", tags=["Cart"])


@cart_router.get("", response_model=CartResponse)
def view_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = services.get_or_create_cart(db, current_user.id)
    return services.cart_to_response(cart)


@cart_router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    data: CartItemAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        cart = services.add_item(db, current_user.id, data)
    except services.NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return services.cart_to_response(cart)


@cart_router.patch("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        cart = services.update_item(db, current_user.id, item_id, data.quantity)
    except services.NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return services.cart_to_response(cart)


@cart_router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        cart = services.remove_item(db, current_user.id, item_id)
    except services.NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    return services.cart_to_response(cart)


@cart_router.delete("", response_model=CartResponse)
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = services.clear_cart(db, current_user.id)
    return services.cart_to_response(cart)
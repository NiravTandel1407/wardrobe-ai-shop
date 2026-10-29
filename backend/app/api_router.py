from fastapi import APIRouter

from app.modules.products.router import category_router, product_router
from app.modules.users.router import auth_router, users_router

api_router = APIRouter()

for router in (category_router, product_router, auth_router, users_router):
    api_router.include_router(router)
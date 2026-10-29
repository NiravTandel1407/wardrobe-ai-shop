from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session

from app.modules.users.deps import get_current_admin

from app.core.database import get_db
from app.modules.products import services
from app.modules.products.schemas import (
    CategoryCreate,
    CategoryResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

category_router = APIRouter(prefix="/categories", tags=["Categories"])
product_router = APIRouter(prefix="/products", tags=["Products"])

admin_only = [Depends(get_current_admin)]

# ---------- Categories ----------

@category_router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, dependencies=admin_only)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    try:
        return services.create_category(db, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@category_router.get("", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return services.list_categories(db)


@category_router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = services.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# ---------- Products ----------

@product_router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, dependencies=admin_only)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    try:
        return services.create_product(db, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@product_router.get("", response_model=list[ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return services.list_products(db, skip=skip, limit=limit)


@product_router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@product_router.patch("/{product_id}", response_model=ProductResponse, dependencies=admin_only)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    try:
        return services.update_product(db, product, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@product_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin_only)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    services.delete_product(db, product)
    
@product_router.post("/images", dependencies=admin_only)
async def upload_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        image_url = services.save_product_image(content, file.content_type)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return {"image_url": image_url}


@product_router.post("/{product_id}/image", response_model=ProductResponse, dependencies=admin_only)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    content = await file.read()
    try:
        image_url = services.save_product_image(content, file.content_type)
        return services.update_product(db, product, ProductUpdate(image_url=image_url))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
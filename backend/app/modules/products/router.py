from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session

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

# ---------- Categories ----------

@category_router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
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

@product_router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    try:
        return services.create_product(db, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@product_router.get("", response_model=list[ProductResponse])
def list_products(
    category: str | None = Query(None, description="Category name or ID (e.g. jeans, hoodies)"),
    gender: str | None = Query(None, description="Gender filter: men, women, unisex"),
    min_price: float | None = Query(None, ge=0, description="Minimum price filter"),
    max_price: float | None = Query(None, ge=0, description="Maximum price filter"),
    price: float | None = Query(None, ge=0, description="Price upper bound alias"),
    size: str | None = Query(None, description="Variant size filter (e.g. S, M, L, 32)"),
    search: str | None = Query(None, description="Search keyword in product name or description"),
    q: str | None = Query(None, description="Search keyword alias"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    effective_search = search or q
    effective_max_price = max_price or price

    return services.list_products(
        db,
        category=category,
        gender=gender,
        min_price=min_price,
        max_price=effective_max_price,
        size=size,
        search=effective_search,
        skip=skip,
        limit=limit,
    )


@product_router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@product_router.patch("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    try:
        return services.update_product(db, product, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@product_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = services.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    services.delete_product(db, product)
    
@product_router.post("/images")
async def upload_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        image_url = services.save_product_image(content, file.content_type)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return {"image_url": image_url}


@product_router.post("/{product_id}/image", response_model=ProductResponse)
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
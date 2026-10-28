"""
Seed script to populate complete apparel categories, products, and variants into wardrobe_db.
Run via: python seed.py
"""
import sys
from app.core.database import SessionLocal, Base, engine
from app.modules.products.models import Category, Product, ProductVariant

SAMPLE_DATA = [
    {
        "category": "Hoodies & Sweatshirts",
        "products": [
            {
                "name": "Signature Heavyweight Oversized Hoodie",
                "description": "500 GSM French Terry cotton hoodie in a relaxed drop-shoulder cut with double-layered hood and kangaroo pocket.",
                "gender": "unisex",
                "base_price": 95.00,
                "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Midnight Black", "stock": 15, "sku": "SHO-BLK-S"},
                    {"size": "M", "color": "Midnight Black", "stock": 25, "sku": "SHO-BLK-M"},
                    {"size": "L", "color": "Midnight Black", "stock": 18, "sku": "SHO-BLK-L"},
                    {"size": "XL", "color": "Midnight Black", "stock": 10, "sku": "SHO-BLK-XL"},
                ]
            },
            {
                "name": "Cropped Boxy Streetwear Zip Hoodie",
                "description": "Custom vintage-washed cropped hoodie featuring raw-edge hem, dropped shoulders, and heavyweight antique silver zip.",
                "gender": "women",
                "base_price": 85.00,
                "image_url": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "XS", "color": "Washed Charcoal", "stock": 12, "sku": "CBH-CHR-XS"},
                    {"size": "S", "color": "Washed Charcoal", "stock": 20, "sku": "CBH-CHR-S"},
                    {"size": "M", "color": "Washed Charcoal", "stock": 16, "sku": "CBH-CHR-M"},
                ]
            },
            {
                "name": "Electric Acid-Wash Pullover Hoodie",
                "description": "Artisan hand-dyed acid wash fleece hoodie with tonal minimal embroidery across the chest.",
                "gender": "men",
                "base_price": 110.00,
                "image_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "M", "color": "Slate Wash", "stock": 14, "sku": "EAH-SLT-M"},
                    {"size": "L", "color": "Slate Wash", "stock": 12, "sku": "EAH-SLT-L"},
                    {"size": "XL", "color": "Slate Wash", "stock": 7, "sku": "EAH-SLT-XL"},
                ]
            },
            {
                "name": "Butter Soft Minimal Crewneck",
                "description": "Ultra-comfy brushed fleece crewneck sweatshirt in a clean streetwear silhouette designed for everyday layering.",
                "gender": "women",
                "base_price": 78.00,
                "image_url": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Alabaster Cream", "stock": 18, "sku": "BMC-CRM-S"},
                    {"size": "M", "color": "Alabaster Cream", "stock": 22, "sku": "BMC-CRM-M"},
                    {"size": "L", "color": "Alabaster Cream", "stock": 10, "sku": "BMC-CRM-L"},
                ]
            }
        ]
    },
    {
        "category": "T-Shirts & Tops",
        "products": [
            {
                "name": "Heavyweight Boxy 'MAKE RULES' Tee",
                "description": "280 GSM combed organic cotton with a structured boxy fit, thick 1-inch ribbed collar, and minimal back typographic print.",
                "gender": "men",
                "base_price": 45.00,
                "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Pitch Black", "stock": 20, "sku": "HBT-BLK-S"},
                    {"size": "M", "color": "Pitch Black", "stock": 35, "sku": "HBT-BLK-M"},
                    {"size": "L", "color": "Pitch Black", "stock": 28, "sku": "HBT-BLK-L"},
                    {"size": "XL", "color": "Pitch Black", "stock": 15, "sku": "HBT-BLK-XL"},
                ]
            },
            {
                "name": "Vintage Washed Oversized Graphic Tee",
                "description": "Sun-faded enzyme washed retro skate tee with distressed collar detailing and soft drape.",
                "gender": "unisex",
                "base_price": 48.00,
                "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Vintage Black", "stock": 16, "sku": "VOG-BLK-S"},
                    {"size": "M", "color": "Vintage Black", "stock": 30, "sku": "VOG-BLK-M"},
                    {"size": "L", "color": "Vintage Black", "stock": 20, "sku": "VOG-BLK-L"},
                ]
            },
            {
                "name": "90s Ribbed Minimalist Baby Tee",
                "description": "Classic 90s throwback silhouette in stretchy baby-rib cotton with contrast stitch detailing.",
                "gender": "women",
                "base_price": 38.00,
                "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "XS", "color": "Optic White", "stock": 15, "sku": "RBT-WHT-XS"},
                    {"size": "S", "color": "Optic White", "stock": 25, "sku": "RBT-WHT-S"},
                    {"size": "M", "color": "Optic White", "stock": 18, "sku": "RBT-WHT-M"},
                ]
            },
            {
                "name": "Drop-Shoulder Core Blank Tee",
                "description": "The ultimate daily staple. Heavyweight pre-shrunk cotton with relaxed sleeves and a seamless tubular body.",
                "gender": "men",
                "base_price": 36.00,
                "image_url": "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Olive Drab", "stock": 14, "sku": "CBT-OLV-S"},
                    {"size": "M", "color": "Olive Drab", "stock": 24, "sku": "CBT-OLV-M"},
                    {"size": "L", "color": "Olive Drab", "stock": 18, "sku": "CBT-OLV-L"},
                ]
            }
        ]
    },
    {
        "category": "Caps & Headwear",
        "products": [
            {
                "name": "Signature 'W' Embroidered Dad Cap",
                "description": "6-panel unconstructed low-profile cap in washed cotton twill with brass buckle closure and 3D embroidered logo.",
                "gender": "unisex",
                "base_price": 34.00,
                "image_url": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "OS", "color": "Pitch Black", "stock": 35, "sku": "WDC-BLK-OS"},
                    {"size": "OS", "color": "Electric Yellow", "stock": 20, "sku": "WDC-YEL-OS"},
                    {"size": "OS", "color": "Washed Tan", "stock": 15, "sku": "WDC-TAN-OS"},
                ]
            },
            {
                "name": "Chunky Fisherman Ribbed Beanie",
                "description": "Double-cuffed extra-warm merino wool blend beanie designed to be worn shallow or pulled down.",
                "gender": "unisex",
                "base_price": 32.00,
                "image_url": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "OS", "color": "Mustard Yellow", "stock": 25, "sku": "CFB-YEL-OS"},
                    {"size": "OS", "color": "Charcoal Black", "stock": 30, "sku": "CFB-BLK-OS"},
                ]
            },
            {
                "name": "Tactical Nylon Utility Crossbody Bag",
                "description": "Weather-resistant Cordura nylon sling bag with quick-release Fidlock magnetic buckle and dual compartments.",
                "gender": "unisex",
                "base_price": 58.00,
                "image_url": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "OS", "color": "Stealth Black", "stock": 18, "sku": "TNB-BLK-OS"},
                    {"size": "OS", "color": "Tactical Olive", "stock": 12, "sku": "TNB-OLV-OS"},
                ]
            }
        ]
    },
    {
        "category": "Jackets & Outerwear",
        "products": [
            {
                "name": "Obsidian Wool Trench Coat",
                "description": "Tailored double-breasted trench in Italian virgin wool blend with structured shoulders and horn buttons.",
                "gender": "unisex",
                "base_price": 289.00,
                "image_url": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Midnight Black", "stock": 8, "sku": "OWT-BLK-S"},
                    {"size": "M", "color": "Midnight Black", "stock": 14, "sku": "OWT-BLK-M"},
                    {"size": "L", "color": "Midnight Black", "stock": 6, "sku": "OWT-BLK-L"},
                ]
            },
            {
                "name": "Minimalist Suede Bomber Jacket",
                "description": "Plush goatskin suede jacket featuring ribbed collar and cuff trims with Japanese brass zippers.",
                "gender": "men",
                "base_price": 245.00,
                "image_url": "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "M", "color": "Caramel Tan", "stock": 10, "sku": "MSB-TAN-M"},
                    {"size": "L", "color": "Caramel Tan", "stock": 5, "sku": "MSB-TAN-L"},
                ]
            }
        ]
    },
    {
        "category": "Pants & Denim",
        "products": [
            {
                "name": "Selvedge Raw Indigo Streetwear Denim",
                "description": "14oz Japanese Kuroki mill selvedge denim in a relaxed skate silhouette with copper rivets.",
                "gender": "men",
                "base_price": 175.00,
                "image_url": "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "30", "color": "Raw Indigo", "stock": 9, "sku": "SRD-IND-30"},
                    {"size": "32", "color": "Raw Indigo", "stock": 22, "sku": "SRD-IND-32"},
                    {"size": "34", "color": "Raw Indigo", "stock": 14, "sku": "SRD-IND-34"},
                ]
            },
            {
                "name": "Pleated Wide-Leg Trousers",
                "description": "High-rise relaxed trousers cut from Italian tropical wool with a deep double reverse pleat.",
                "gender": "women",
                "base_price": 145.00,
                "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
                "variants": [
                    {"size": "S", "color": "Charcoal", "stock": 10, "sku": "PWT-CHR-S"},
                    {"size": "M", "color": "Charcoal", "stock": 15, "sku": "PWT-CHR-M"},
                ]
            }
        ]
    }
]

def seed_database(force_refresh=True):
    db = SessionLocal()
    try:
        if force_refresh:
            print("Clearing previous catalog items...")
            db.query(ProductVariant).delete()
            db.query(Product).delete()
            db.query(Category).delete()
            db.commit()

        print("Seeding database with updated apparel, hoodies, t-shirts, caps & accessories...")
        for cat_data in SAMPLE_DATA:
            category = Category(name=cat_data["category"])
            db.add(category)
            db.flush()

            for prod_data in cat_data["products"]:
                product = Product(
                    name=prod_data["name"],
                    description=prod_data["description"],
                    gender=prod_data["gender"],
                    base_price=prod_data["base_price"],
                    image_url=prod_data["image_url"],
                    category_id=category.id,
                )
                db.add(product)
                db.flush()

                for var_data in prod_data["variants"]:
                    variant = ProductVariant(
                        product_id=product.id,
                        size=var_data["size"],
                        color=var_data["color"],
                        stock=var_data["stock"],
                        sku=var_data["sku"],
                    )
                    db.add(variant)

        db.commit()
        total_cats = db.query(Category).count()
        total_prods = db.query(Product).count()
        total_vars = db.query(ProductVariant).count()
        print(f"Successfully seeded {total_cats} categories, {total_prods} products, and {total_vars} variants!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force_refresh=True)

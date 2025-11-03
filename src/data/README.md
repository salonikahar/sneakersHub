# Products Data Management

This directory contains the product data for the Sneakers Hub application.

## Files

- `products.json` - Contains all product information in JSON format

## Product Schema

Each product object has the following structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "price": "199.99",
  "img": "/src/assets/img/product/image.png",
  "category": "Category Name",
  "description": "Product description"
}
```

## Required Fields

- `id` (number): Unique identifier for the product
- `name` (string): Product name/title
- `price` (string): Product price (as string to preserve decimals)
- `img` (string): Path to product image
- `category` (string): Product category for filtering
- `description` (string): Product description

## Adding New Products

1. Add new product objects to `products.json`
2. Ensure the `id` is unique
3. Use proper image paths (relative to the public directory)
4. Categories will be automatically generated from the data

## Usage in Components

Products are loaded in `src/pages/user/Shop.jsx` using:
```javascript
import productsData from '../../data/products.json';
```

The component automatically handles:
- Loading states
- Dynamic category generation
- Search and filtering
- Error handling

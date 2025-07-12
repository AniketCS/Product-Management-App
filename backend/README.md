# Product Management Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-management-app
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL: `http://localhost:5000`

### 1. Health Check
- **GET** `/`
- Returns: `{ "message": "API is running" }`

### 2. Products API

#### Create Product
- **POST** `/api/products`
- Body:
```json
{
  "title": "Product Name",
  "image": "https://example.com/image.jpg",
  "description": "Product description",
  "price": 99.99
}
```

#### Get All Products
- **GET** `/api/products`
- Returns: Array of products

#### Get Single Product
- **GET** `/api/products/:id`
- Returns: Single product object

#### Update Product
- **PUT** `/api/products/:id`
- Body: Same as create product
- Returns: Updated product

#### Delete Product
- **DELETE** `/api/products/:id`
- Returns: Deleted product

## Validation Rules

- **title**: Required, 2-100 characters
- **image**: Required, valid URL
- **description**: Required, 10-500 characters
- **price**: Required, positive number

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error 
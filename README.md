# Pure Seed Oil API

A RESTful API for managing product reviews for Pure Seed Oil. Built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Validation:** express-validator
- **File Uploads:** Multer (memory storage)
- **Logging:** Morgan

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pure-seed-oil-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with your values (see [Environment Variables](#environment-variables)).

### 4. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000` by default.

---

## Environment Variables

| Variable               | Required | Default                              | Description                          |
|------------------------|----------|--------------------------------------|--------------------------------------|
| `PORT`                 | No       | `3000`                               | Port the server listens on           |
| `MONGODB_URI`          | Yes      | —                                    | MongoDB connection string            |
| `ALLOWED_ORIGINS`      | No       | `http://localhost:8080`              | Comma-separated list of allowed CORS origins |
| `MAX_IMAGE_SIZE_MB`    | No       | `5`                                  | Max upload size per image (MB)       |
| `ALLOWED_IMAGE_TYPES`  | No       | `image/jpeg,image/png,image/webp`    | Comma-separated allowed MIME types   |

---

## Folder Structure

```
pure-seed-oil-api/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── review.controller.js  # Request handlers
│   ├── middleware/
│   │   ├── error.middleware.js   # Global error handler
│   │   ├── upload.middleware.js  # Multer file upload config
│   │   └── validate.middleware.js# express-validator error handler
│   ├── models/
│   │   └── review.model.js       # Mongoose schema & model
│   ├── routes/
│   │   └── review.routes.js      # Route definitions
│   ├── services/
│   │   └── review.service.js     # Business logic & DB queries
│   ├── validation/
│   │   └── review.validation.js  # Input validation rules
│   ├── app.js                    # Express app setup
│   └── index.js                  # Entry point
├── .env                          # Local environment variables (git-ignored)
├── .env.example                  # Environment variable template
├── .gitignore
└── package.json
```

---

## API Reference

Base URL: `/api/reviews`

### Reviews

| Method   | Endpoint                    | Description                        |
|----------|-----------------------------|------------------------------------|
| `GET`    | `/api/reviews`              | Get all approved reviews (paginated)|
| `GET`    | `/api/reviews/stats`        | Get rating statistics              |
| `GET`    | `/api/reviews/:id`          | Get a single review by ID          |
| `GET`    | `/api/reviews/:id/images/:index` | Serve a review image          |
| `POST`   | `/api/reviews`              | Create a new review                |
| `PATCH`  | `/api/reviews/:id`          | Update a review                    |
| `PATCH`  | `/api/reviews/:id/helpful`  | Increment helpful count            |
| `DELETE` | `/api/reviews/:id`          | Delete a review                    |

---

### GET `/api/reviews`

Query parameters:

| Param   | Type    | Default | Description                  |
|---------|---------|---------|------------------------------|
| `page`  | integer | `1`     | Page number                  |
| `limit` | integer | `10`    | Results per page (max 50)    |
| `rating`| integer | —       | Filter by rating (1–5)       |

**Response**
```json
{
  "success": true,
  "reviews": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasMore": true
  }
}
```

---

### GET `/api/reviews/stats`

**Response**
```json
{
  "success": true,
  "data": {
    "totalReviews": 120,
    "averageRating": 4.3,
    "distribution": { "1": 2, "2": 5, "3": 10, "4": 40, "5": 63 }
  }
}
```

---

### POST `/api/reviews`

Content-Type: `multipart/form-data`

| Field          | Type     | Required | Description                        |
|----------------|----------|----------|------------------------------------|
| `customerName` | string   | Yes      | Reviewer's name                    |
| `rating`       | integer  | Yes      | Rating from 1 to 5                 |
| `title`        | string   | Yes      | Review title                       |
| `description`  | string   | Yes      | Review body                        |
| `images`       | file[]   | No       | Up to 5 images (jpeg/png/webp)     |

**Response** `201 Created`
```json
{
  "success": true,
  "data": { "_id": "...", "customerName": "Jane", "rating": 5, ... }
}
```

---

### Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Meaning               |
|--------|-----------------------|
| `400`  | Validation error      |
| `404`  | Resource not found    |
| `500`  | Internal server error |

---

## Scripts

| Command       | Description                        |
|---------------|------------------------------------|
| `npm start`   | Start server in production mode    |
| `npm run dev` | Start server with nodemon (watch)  |

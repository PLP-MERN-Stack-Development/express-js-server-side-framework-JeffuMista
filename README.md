...existing code...
# Express JS Server Side Framework

A small Express.js example API with JWT-based test authentication, product listing with filtering, pagination, search, and simple statistics.

## Prerequisites

- Node.js v14+ and npm
- (Optional) MongoDB if you wire up the database (this repo includes a connectDB placeholder)

## Quick start

1. Clone the repo and install dependencies
   ```bash
   git clone https://github.com/yourusername/express-js-server-side-framework.git
   cd express-js-server-side-framework
   npm install
   ```

2. Add environment variables
   - Copy the example file and update values:
     ```bash
     copy .env.example .env
     ```
   - Edit `.env` and set JWT_SECRET (for testing you can use a simple value like HeyYou)

3. Start the server
   ```bash
   npm start
   ```
   By default the server listens on PORT from .env or 3000.

4. (Optional for development) set NODE_ENV=development in `.env` to bypass auth in middleware if implemented that way.

## Authentication (test token)

This project includes a convenience endpoint to generate a JWT for testing:

- GET /generate-test-token

It returns a JSON payload containing a token you can use against protected routes.

Example:
Request
GET http://localhost:3000/generate-test-token

Response
```json
{
  "token": "<your_jwt_token_here>"
}
```

Using the token in Postman:
- Open the request for a protected route (e.g., GET /products)
- Select the "Headers" tab
- Add a header:
  - Key: x-auth-token
  - Value: <paste token string>

## API Endpoints

All endpoints assume base URL: http://localhost:3000

1. GET /generate-test-token
   - Description: Return a signed JWT for test use.
   - Response:
     ```json
     {
       "token": "eyJhbGciOi..."
     }
     ```

2. GET /products
   - Description: List products with optional filtering, search, and pagination.
   - Query parameters:
     - category (string) — filter by category
     - search (string) — case-insensitive name search
     - page (number, default=1) — page number
     - limit (number, default=10) — items per page
   - Example request:
     ```
     GET /products?category=Electronics&search=phone&page=2&limit=5
     ```
   - Example response:
     ```json
     {
       "page": 2,
       "limit": 5,
       "total": 23,
       "products": [
         { "id": "17", "name": "Smart Phone X", "category": "Electronics" },
         { "id": "18", "name": "Smart Phone Y", "category": "Electronics" }
       ]
     }
     ```

3. GET /products/stats
   - Description: Return simple statistics like counts by category.
   - Example response:
     ```json
     {
       "Electronics": 12,
       "Home": 5,
       "Books": 8
     }
     ```

4. (Protected) Any route under /products when auth middleware is applied
   - To access protected product routes, include the header `x-auth-token: <token>` obtained from /generate-test-token (unless NODE_ENV=development bypasses auth).
   - If missing or invalid token, server responds with 401 Unauthorized:
     ```json
     { "message": "No token, authorization denied" }
     ```
     or
     ```json
     { "message": "Token is not valid" }
     ```

## Examples (curl)

Generate token:
```bash
curl http://localhost:3000/generate-test-token
```

List products (with token header):
```bash
curl -H "x-auth-token: <token>" "http://localhost:3000/products?search=shirt&page=1&limit=10"
```

Get stats:
```bash
curl -H "x-auth-token: <token>" http://localhost:3000/products/stats
```

## Environment variables

See `.env.example` for required variables. At minimum set:
- PORT
- JWT_SECRET
- NODE_ENV (optional, e.g., development)

## Notes

- Logger middleware prints request info to the server console. Ensure `app.use(logger)` is registered before route handlers.
- If product routes are not protected, confirm `auth` middleware is applied specifically: `app.use('/products', auth, require('./routes/productRoutes'))`.
- For testing without a login form:
  - Use /generate-test-token to obtain a token
  - Or set NODE_ENV=development and let the auth middleware bypass checks (if implemented that way)

## License
MIT
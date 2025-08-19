# MyHouz - Copilot Instructions

## Project Overview
MyHouz is a Houzz-inspired platform for home renovation and decoration with dual TypeScript monorepo:
- **Backend**: Express.js + MongoDB (Mongoose ODM) API
- **Frontend**: Next.js + Tailwind CSS

## Architecture Patterns

### Backend Structure (`/backend/src/`)
```
models/     # Mongoose schemas with TypeScript interfaces (dual-user system)
controllers/# Static class methods, standardized error handling
routes/     # Express routers with middleware composition  
middleware/ # Auth (JWT + role-based), validation (Joi), file uploads
config/     # Database connection with retry logic
```

### Key Domain Models
- **User**: Dual-type system (`particulier` | `professionnel`) with conditional `professionalInfo`
- **Project**: Professional portfolios with image galleries + product tagging
- **Product**: E-commerce marketplace with specifications, inventory, SEO slugs
- **Ideabook**: Pinterest-like collections with collaboration features
- **Review**: Rating system for professionals/products with verification

### Response Conventions
All API responses follow this structure:
```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  pagination?: { page, limit, total, pages },
  errors?: Array<{ field: string, message: string }>
}
```

### Authentication & Authorization
- JWT-based auth with `userType` roles (`particulier` | `professionnel`)
- Middleware composition: `authenticateToken` → `requireProfessional` | `requireParticulier`
- Optional auth for public endpoints: `optionalAuth`

### Database Patterns
- MongoDB with Mongoose ODM
- Schema pre-hooks for `updatedAt` timestamps
- Composite indexes for search performance (e.g., geospatial, text search)
- Reference population patterns: `.populate('field', 'selected fields')`

## Development Workflows

### Backend Commands
```bash
cd backend
npm run dev          # Development with hot reload (ts-node-dev)
npm run build        # TypeScript compilation
npm start           # Production mode
npm run watch       # TypeScript watch mode
```

### Environment Setup
- Copy `.env.example` to `.env` 
- Key vars: `MONGODB_URI`, `JWT_SECRET`, `PORT=3001`, `CORS_ORIGIN=http://localhost:3000`

### Testing Patterns
Use the health endpoint for API verification:
```bash
curl http://localhost:3001/api/health  # Returns features list + uptime
```

## Code Conventions

### Controller Pattern
Static class methods with standardized error handling:
```typescript
export class UserController {
  static async methodName(req: Request, res: Response): Promise<void> {
    try {
      // Logic here
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur interne' });
    }
  }
}
```

### Model Export Pattern
Centralized exports in `models/index.ts`:
```typescript
export { default as ModelName } from './ModelName';
export type { IModelName } from './ModelName';
```

### Route Protection
Layer middleware for progressive access control:
```typescript
router.post('/', authenticateToken, requireProfessional, Controller.method);
router.get('/', optionalAuth, Controller.publicMethod); // For mixed public/private data
```

### Validation
Use Joi schemas in `middleware/validation.ts` with `validate(schema)` middleware.

## Business Logic Specifics

### Professional vs Particulier Users
- Professionals can create Projects/Products, have subscription tiers, rating systems
- Particuliers can create Ideabooks, leave reviews, contact professionals
- Conditional schema validation based on `userType`

### Search & Discovery
- Projects: Filter by category/room/style, sort by popularity/recent
- Professionals: Geospatial search, service-based filtering, subscription prioritization
- Products: Full-text search, faceted filtering (price, specs, brand)

### File Upload Strategy
- Currently local storage (`uploads/` folders by entity type)
- Cloudinary integration prepared but disabled (missing package)
- Multer middleware with type/size validation

When working on this codebase, always consider the dual-user nature and ensure proper role-based access control.

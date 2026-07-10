# FitnessBattle

Production-quality Fitness Battle app (mobile + backend).

## Release: v1.0.0

Release artifacts are published under `release/`:

- `release/fitnessbattle-backend-v1.0.0.zip` — compiled backend bundle
- `release/fitnessbattle-mobile-ios-v1.0.0.zip` — iOS export bundle
- `release/fitnessbattle-mobile-web-v1.0.0.zip` — web export bundle

### How to run

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Mobile**
```bash
cd apps/mobile
npm install
npx expo start
```

## Architecture

- **Mobile**: React Native + Expo + TypeScript
- **Backend**: Express + MySQL (Prisma ORM) + Socket.IO
- **State**: Zustand + TanStack Query
- **Navigation**: React Navigation (Native Stack)

## Features

### Core
- Authentication (JWT)
- Workout tracking
- Nutrition logging
- Dashboard with analytics

### Social Platform
- Feed with infinite scroll
- Stories
- Friends system
- Messaging
- Communities
- Notifications

### AI Coach
- Chat interface
- Workout generator
- Nutrition planner
- Recovery analysis

### Premium UX
- Glassmorphism design
- Haptic feedback
- Skeleton loading
- Celebration animations

## Development

```bash
# Install dependencies
npm install

# Run mobile app
npm run android --workspace=apps/mobile
npm run ios --workspace=apps/mobile

# Run backend
npm run dev --workspace=backend
```

## API Endpoints (prefix: `/api/v1`)

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/workouts/exercises` - Exercise database
- `GET /api/v1/workouts/templates` - Workout templates
- `GET /api/v1/nutrition/foods` - Food database
- `GET /api/v1/nutrition/analytics` - Nutrition analytics
- `GET /api/v1/social/feed` - Social feed
- `GET /api/v1/social/friends` - Friends list
- `GET /api/v1/ai/conversations` - AI conversations

Full API documentation available in [backend/docs/api.md](backend/docs/api.md)

## Screens

- Login, Register, Home
- WorkoutHome, WorkoutSession, WorkoutHistory, WorkoutDetails
- NutritionDashboard, FoodSearch, FoodDetails, MealCreate, WaterLog
- Social, Stories, Friends, Messages, Chat, Communities
- AI, AIChat, AIWorkoutGenerator, AINutritionPlanner

## Environment

```env
# Backend (.env)
DATABASE_URL=mysql://root:@localhost:3306/fitnessbattle
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000,exp://localhost:8081
PORT=5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=dev
```

## Docker

```bash
# Run tests in Docker
docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from test

# Run production stack
docker compose up -d
```

## Production Readiness

- Security headers via Helmet
- JWT authentication
- Global error handling
- Graceful shutdown
- Health endpoint at `/health`
- Compression middleware
- Structured logging via Morgan
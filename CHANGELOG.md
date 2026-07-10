# Changelog

## v0.9.0-beta - 2026-06-30

### Added
- Complete nutrition module: 12 screens, 101 foods, full backend routes
- Social platform: 8 screens with feed, stories, friends, messages, communities
- AI Coach module: 5 screens with chat, workout generator, nutrition planner
- Premium UX components: Skeleton, Celebration (Confetti), PremiumCard, animations
- Offline sync queue utility
- Socket.IO integration for real-time features
- Health endpoint for monitoring

### Features
- Authentication with JWT (register, login, refresh, logout)
- Workout tracking with advanced set types (supersets, dropsets, EMOM, AMRAP)
- Nutrition logging with meals, water, weight, measurements
- Social feed with infinite scroll
- AI-powered workout and nutrition recommendations
- Theme system with glassmorphism design

### Backend
- Express server with Helmet security
- Validation middleware with Zod
- MongoDB integration with Mongoose
- Graceful shutdown handling
- Structured logging with Morgan
- CORS configuration

### Mobile
- React Native with Expo SDK 52
- React Navigation v7
- TanStack Query for data fetching
- Zustand for state management
- MMKV for local storage

### Security
- JWT authentication
- Rate limiting configuration
- Security headers via Helmet
- Password hashing with bcrypt
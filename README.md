# Ultimate Fitness App 🏋️‍♂️

A comprehensive fitness and nutrition tracking application built with **NestJS** (backend) and **Angular** (frontend).

## 🚀 Project Structure

```
ultimate/
├── back/                    # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication & JWT
│   │   ├── users/          # User management
│   │   ├── nutrition/      # Food & nutrition tracking
│   │   ├── workouts/       # Exercise & workout management
│   │   ├── analytics/      # Progress tracking
│   │   ├── subscriptions/  # Premium features
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # App configuration
│   │   └── database/       # Prisma database service
│   ├── prisma/            # Database schema & migrations
│   └── .env               # Environment variables
│
├── front/                  # Angular Frontend
│   ├── src/
│   │   └── app/
│   │       ├── core/       # Singleton services
│   │       ├── shared/     # Reusable components
│   │       └── features/   # Feature modules
│   └── angular.json
│
└── SETUP.md               # Database design & architecture
```

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, throttling, CORS

### Frontend (Angular)
- **Framework**: Angular 18+ with TypeScript
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router

### Database (PostgreSQL)
- **Users**: Authentication, profiles, goals
- **Nutrition**: Ingredients, meals, daily tracking
- **Workouts**: Exercises, workout plans, sessions
- **Analytics**: Progress tracking, metrics
- **Subscriptions**: Premium features, billing

## 🗄️ Database Schema

The app uses a **PostgreSQL** database with the following main entities:

### Core Tables
- `users` - User accounts and profiles
- `ingredients` - Food database with nutrition facts
- `meals` - User meal entries
- `meal_ingredients` - Many-to-many meal ↔ ingredients
- `exercises` - Exercise library
- `workouts` - User workout plans
- `workout_exercises` - Many-to-many workout ↔ exercises
- `workout_sessions` - Actual workout tracking
- `subscriptions` - Premium user subscriptions

### Key Features
- **UUID primary keys** for security
- **JSONB fields** for flexible user goals
- **Array fields** for muscle groups, equipment
- **Cascade deletes** for data integrity
- **Enums** for data validation
- **Timestamps** for audit trails

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker Desktop
- Git

### 🔧 **Quick Setup (Recommended)**

For first-time setup, run the setup script:

**PowerShell (Recommended):**
```powershell
.\setup.ps1
```

**Command Prompt:**
```cmd
setup.bat
```

### 🚀 **Start Development Environment**

**PowerShell (Recommended):**
```powershell
.\start-dev.ps1
```

**Command Prompt:**
```cmd
start-dev.bat
```

This single script will:
- ✅ Start PostgreSQL database
- ✅ Install all dependencies  
- ✅ Generate Prisma client
- ✅ Run database migrations
- ✅ Start backend server (http://localhost:3000)
- ✅ Start frontend server (http://localhost:4200)

### 🛑 **Stop Development Environment**

**PowerShell:**
```powershell
.\stop-dev.ps1
```

**Command Prompt:**
```cmd
stop-dev.bat
```

### 📍 **Access Points**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000  
- **API Documentation**: http://localhost:3000/api/docs
- **Database Admin**: http://localhost:8080 (pgAdmin)

### Manual Setup (Alternative)

If you prefer manual setup:

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd back
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   # Copy and update .env file
   cp .env.example .env
   
   # Update DATABASE_URL with your PostgreSQL connection
   DATABASE_URL="postgresql://username:password@localhost:5432/fitness_app"
   ```

4. **Setup database**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Optional: Seed database
   npx prisma db seed
   ```

5. **Start development server**:
   ```bash
   npm run start:dev
   ```

   Backend will be available at: `http://localhost:3000`
   API docs available at: `http://localhost:3000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd front
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   ng serve
   ```

   Frontend will be available at: `http://localhost:4200`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PATCH /api/v1/users/profile` - Update user profile

### Nutrition (Planned)
- `GET /api/v1/nutrition/ingredients` - Search ingredients
- `POST /api/v1/nutrition/meals` - Create meal
- `GET /api/v1/nutrition/daily` - Get daily nutrition

### Workouts (Planned)
- `GET /api/v1/workouts/exercises` - Get exercise library
- `POST /api/v1/workouts` - Create workout plan
- `POST /api/v1/workouts/sessions` - Start workout session

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password hashing** with bcryptjs
- **Input validation** with DTOs
- **Rate limiting** to prevent abuse
- **CORS configuration** for frontend
- **SQL injection prevention** with Prisma
- **XSS protection** with input sanitization

## 🎯 Key Features (Planned)

### Nutrition Tracking
- **Food database** with 100k+ ingredients
- **Barcode scanning** for easy food entry
- **Meal planning** and recipe creation
- **Macro tracking** (calories, protein, carbs, fat)
- **Daily nutrition goals** and progress

### Workout Management
- **Exercise library** with instructions
- **Custom workout plans** creation
- **Progress tracking** (weight, reps, duration)
- **Workout history** and analytics
- **Rest timer** and workout guidance

### Analytics & Progress
- **Weight tracking** with charts
- **Progress photos** comparison
- **Nutrition trends** analysis
- **Workout performance** metrics
- **Goal achievement** tracking

### Premium Features
- **Advanced analytics** and insights
- **Meal plan generation** with AI
- **Custom exercise creation**
- **Data export** and backup
- **Priority support**

## 🏗️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Project structure setup
- [x] Database schema design
- [x] Authentication system
- [x] User management
- [x] API documentation

### Phase 2: Core Features
- [ ] Nutrition tracking system
- [ ] Food database integration
- [ ] Meal creation and logging
- [ ] Daily nutrition dashboard

### Phase 3: Workout System
- [ ] Exercise library
- [ ] Workout plan creation
- [ ] Session tracking
- [ ] Progress monitoring

### Phase 4: Analytics
- [ ] Progress charts
- [ ] Trend analysis
- [ ] Goal tracking
- [ ] Performance metrics

### Phase 5: Premium Features
- [ ] Subscription system
- [ ] Advanced analytics
- [ ] AI meal suggestions
- [ ] Data insights

## 📚 Development Guidelines

### Code Style
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional commits** for Git history
- **Feature-based** module organization

### Testing Strategy
- **Unit tests** for services and utilities
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Test coverage** minimum 80%

### Deployment
- **Docker** containers for easy deployment
- **Environment-based** configuration
- **Database migrations** for schema changes
- **Health checks** for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please contact:
- GitHub Issues for bug reports
- Discussions for feature requests
- Email for security concerns

---

**Built with ❤️ for fitness enthusiasts who love to track their progress!**

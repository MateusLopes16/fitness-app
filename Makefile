# Development Scripts

# Backend Development
start-backend:
	cd back && npm run start:dev

# Frontend Development  
start-frontend:
	cd front && ng serve

# Database Operations
db-migrate:
	cd back && npx prisma migrate dev

db-generate:
	cd back && npx prisma generate

db-studio:
	cd back && npx prisma studio

db-reset:
	cd back && npx prisma migrate reset

# Install Dependencies
install-backend:
	cd back && npm install

install-frontend:
	cd front && npm install

install-all: install-backend install-frontend

# Build for Production
build-backend:
	cd back && npm run build

build-frontend:
	cd front && ng build

build-all: build-backend build-frontend

# Testing
test-backend:
	cd back && npm run test

test-frontend:
	cd front && ng test

test-all: test-backend test-frontend

# Linting
lint-backend:
	cd back && npm run lint

lint-frontend:
	cd front && ng lint

lint-all: lint-backend lint-frontend

.PHONY: start-backend start-frontend db-migrate db-generate db-studio db-reset install-backend install-frontend install-all build-backend build-frontend build-all test-backend test-frontend test-all lint-backend lint-frontend lint-all

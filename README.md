# HubShop

[![Frontend CI](https://github.com/bobamagdy/ecommerce-store/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/bobamagdy/ecommerce-store/actions/workflows/frontend-ci.yml)

HubShop is a modern e-commerce frontend application built with Angular 22.

The project demonstrates a complete customer shopping experience, account and order management, an admin dashboard, modern Angular architecture, automated unit testing and browser-based end-to-end testing.

---

## Current Status

The Angular frontend MVP is complete.

The application currently uses:

- Local JSON product data
- Browser storage for cart, wishlist, orders and temporary authentication
- Frontend route guards
- Simulated authentication and password recovery

A separate ASP.NET Core backend will replace the temporary frontend data and authentication implementations.

---

## Main Features

### Store

- Responsive home page
- Product catalog
- Product search
- Category and brand filtering
- Price filtering
- Sorting
- Grid and list views
- Query parameter synchronization
- Product details
- Product image gallery
- Product quantity selector
- Stock handling
- Discount calculation
- Image fallback handling

### Shopping

- Shopping cart
- Quantity management
- Cart totals
- Wishlist
- Persistent browser storage
- Checkout flow
- Checkout form validation
- Unsaved checkout changes guard
- Order creation
- Order history

### Authentication

- Login
- Registration
- Remember me
- Guest route guard
- Authentication route guard
- Forgot password
- Reset password
- Safe return URL handling

Authentication is currently simulated in the frontend and will be replaced by JWT authentication from the ASP.NET Core API.

### Account

- Customer account page
- Customer details
- Orders page
- Order details and status display

### Admin

- Admin layout
- Responsive sidebar
- Dashboard statistics
- Recent orders
- Product catalog management view
- Product search
- Stock status display
- Orders management view
- Order filtering
- Order status updates
- Protected admin routes

Product creation, editing and deletion will be connected to the backend API.

---

## Angular Features

The project uses modern Angular APIs and patterns, including:

- Angular 22
- Standalone components
- Zoneless change detection
- Signals
- Computed signals
- Effects
- Signal Forms
- Signal-based component inputs
- Signal queries
- `httpResource`
- Functional route guards
- Functional HTTP interceptors
- Lazy-loaded routes
- Component input binding from routes
- Native Angular control flow
- OnPush change detection
- Dependency injection tokens
- Strict TypeScript configuration

---

## Technology Stack

- Angular 22
- TypeScript 6
- PrimeNG 22
- PrimeUIX themes
- PrimeIcons
- RxJS
- SCSS
- Vitest
- Playwright
- GitHub Actions

---

## Application Architecture

```text
src/app
├── core
│   ├── guards
│   ├── http
│   ├── layouts
│   ├── models
│   ├── services
│   └── tokens
│
├── features
│   ├── account
│   ├── admin
│   ├── auth
│   ├── cart
│   ├── checkout
│   ├── home
│   ├── not-found
│   ├── products
│   └── wishlist
│
└── shared
    ├── components
    ├── directives
    └── pipes



The application is organized by feature, while reusable services, guards, infrastructure and UI utilities are separated into core and shared.

Main Routes
Route	Description	Access
/	Home page	Public
/products	Product catalog	Public
/products/:id	Product details	Public
/cart	Shopping cart	Public
/wishlist	Wishlist	Public
/auth/login	Login	Guest
/auth/register	Register	Guest
/auth/forgot-password	Forgot password	Guest
/auth/reset-password/:token	Reset password	Guest
/checkout	Checkout	Authenticated
/account	Customer account	Authenticated
/account/orders	Customer orders	Authenticated
/admin/dashboard	Admin dashboard	Authenticated
/admin/products	Admin products	Authenticated
/admin/orders	Admin orders	Authenticated

Real role-based authorization will be enforced by the backend API.

Getting Started
Requirements
Node.js 24
npm 11 or later
Install Dependencies
npm ci
Start Development Server
npm start

Open:

http://localhost:4200
Available Scripts
Development
npm start
Development Build
npm run build
Production Build
npm run build:prod
Unit Tests
npm test
Unit Tests with Coverage
npm run test:coverage
End-to-End Tests
npm run e2e
End-to-End Tests with Browser UI
npm run e2e:ui
End-to-End Tests in Headed Mode
npm run e2e:headed
Playwright Report
npm run e2e:report
Full Frontend Verification
npm run verify

The verification command runs:

Unit tests with coverage
Production build
Playwright end-to-end tests
Automated Testing

The project includes:

Service unit tests
Route guard tests
HTTP interceptor tests
Component tests
Directive tests
Pipe tests
Signal Forms tests
Admin tests
Playwright browser tests

The Playwright suite validates important user journeys such as:

Opening the product catalog
Opening the forgot password page
Guarding checkout routes
Opening the admin dashboard
Opening admin products
Opening admin orders
Signing out
Handling unknown routes
Continuous Integration

GitHub Actions runs automatically for:

Pushes to master
Pull requests targeting master
Manual workflow runs

The CI pipeline performs:

Dependency installation
Unit tests with coverage
Production build
Playwright Chromium tests
Coverage report upload
Production build upload
Playwright report upload
Backend Roadmap

The next phase is a separate ASP.NET Core backend project.

Planned backend features:

ASP.NET Core Web API
SQL Server
Entity Framework Core
JWT authentication
Refresh tokens
Customer and admin roles
Product CRUD
Category and brand management
Cart synchronization
Order management
Inventory updates
Password recovery
Email notifications
Payment integration
API validation
Global exception handling
Logging
Swagger documentation
Important Security Note

The current authentication implementation is for frontend development only.

Production authorization must be enforced by the ASP.NET Core API. Client-side route guards improve navigation and user experience, but they are not a replacement for server-side authorization.

No database credentials, JWT signing keys, payment secrets or private API keys should be stored in the Angular application.

Author

Heba Tallah Magdy

Information Systems graduate and software professional with experience in Angular, .NET, product ownership and project coordination.
# Imperial Book Binding - API & UI Documentation

## Backend API Endpoints

### Customers
- **GET** `/api/customers` - Get all customers
- **POST** `/api/customers` - Create a new customer
- **GET** `/api/customers/{id}` - Get customer by ID
- **GET** `/api/customers/with-balance` - Get all customers with their balance

### Invoices
- **POST** `/api/invoices` - Create a new invoice
- **GET** `/api/invoices` - Get all invoices
- **GET** `/api/invoices/{id}/pdf` - Generate and download invoice PDF

### Payments
- **POST** `/api/payments` - Record a payment (Request body: { customerId, amount })
- **GET** `/api/payments` - Get all payments with customer details

---

## Frontend Pages & Features

### 1. Create Invoice Page (`/`)
- **Features:**
  - Select customer from dropdown
  - Add multiple invoice items with description, quantity, and rate
  - Real-time total calculation
  - Form validation
  - Generate and automatically open PDF for printing
- **Styling:** Modern card-based layout with professional input fields

### 2. Customers Page (`/customers`)
- **Features:**
  - Add new customers with email and phone
  - View all customers with balance information
  - Color-coded balance indicators (Red=Receivable, Green=Payable, Gray=Settled)
  - Summary cards showing total customers and amounts
  - Responsive table layout
- **Styling:** Card-based dashboard with summary statistics

### 3. Payments Page (`/payment`)
- **Features:**
  - Record payment against customer
  - Display customer's current outstanding balance
  - Validate payment amount
  - Show recent payment history
  - Success/error feedback messages
- **Styling:** Two-column layout with form on left, history on right

---

## UI/UX Improvements Made

### Design System
✅ Professional card-based layout throughout the app
✅ Consistent color scheme (Blue primary, Gray secondary)
✅ Responsive design (mobile and desktop)
✅ Loading states and animations
✅ Form validation with error messages
✅ Success notifications

### Navigation
✅ Fixed top navigation bar with:
  - App branding with emoji icons
  - Active page indicators
  - Mobile hamburger menu
  - Clear page titles and descriptions

### Forms
✅ Improved input styling
✅ Field validation before submission
✅ Placeholder text for guidance
✅ Disabled state handling for buttons
✅ Clear error messages

### Tables
✅ Responsive table design
✅ Hover effects for better interactivity
✅ Color-coded status badges
✅ Professional typography

---

## Fixed Issues

### Backend
✅ Added `email` field to Customer entity
✅ Fixed PaymentController to accept JSON requests (POST /api/payments)
✅ Added GET endpoint for payments
✅ Created PaymentResponse DTO for proper API responses
✅ Fixed record syntax usage in PaymentRequest

### Frontend
✅ Fixed payment API endpoint (was /api/payments/record, now /api/payments)
✅ Improved PDF generation and printing
✅ Added proper error handling
✅ Updated CustomerSelect component styling
✅ Added email field to customer types
✅ Fixed all TypeScript compilation errors

---

## Build & Deployment Status

✅ **Backend:** Compiles successfully with Maven
✅ **Frontend:** React build passes without errors
✅ **Styling:** Plain CSS (responsive, clean design)
✅ **All pages:** Fully functional and responsive

---

## How to Run

### Backend
```bash
cd Backend
./mvnw.cmd spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend
```bash
cd Frontend
npm start
```
Frontend runs on `http://localhost:3000`

---

## Database
- SQLite database at `./data/billing.db`
- Auto-creates tables on startup (Hibernate DDL)
- Tables: customers, invoices, invoice_items, payments, invoice_sequence

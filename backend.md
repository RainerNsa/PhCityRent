# Backend Migration Plan

## Overview
This document outlines the plan to migrate from a Supabase/serverless backend to a traditional backend running on our own server. It includes technology choices, migration steps, and a week-by-week timeline for backend-specific deliverables.

**For an in-depth guide on backend developer responsibilities and best practices for this project, see: [Backend Success Guide](./backend-success-guide.md)**

---

## Technology Stack
- **Backend Framework:** Node.js (Express or NestJS recommended)
- **Database:** PostgreSQL (self-hosted or managed)
- **Authentication:** JWT-based (Passport.js or custom middleware)
- **File Storage:** Local disk (dev) or S3-compatible (prod)
- **Real-time:** Socket.IO (WebSockets)
- **Email/SMS:** SendGrid, Mailgun, Twilio, etc.

---

## Migration Steps & Weekly Timeline

### **Week 1: Project Setup & Planning**
- Set up backend repository and initialize Node.js project
- Set up TypeScript, linting, and formatting
- Define API contract (OpenAPI/Swagger)
- Set up PostgreSQL instance (local/dev)
- Review Supabase schema and export migration SQL

### **Week 2: Database & Auth Foundations**
- Apply schema migrations to PostgreSQL
- Implement user authentication (register, login, JWT issuance)
- Set up user roles and permissions middleware
- Migrate user data from Supabase

### **Week 3: Core API Endpoints**
- Implement CRUD endpoints for properties
- Implement search/filter endpoints
- Implement endpoints for user profiles, roles, and permissions
- Set up error handling and input validation

### **Week 4: Advanced Features**
- Implement messaging and notification endpoints
- Integrate real-time features with Socket.IO
- Implement file upload/download endpoints (images, docs)
- Integrate with email/SMS providers

### **Week 5: Payments, Testing & Optimization**
- Integrate payment provider (e.g., Paystack, Stripe)
- Implement escrow/payment endpoints
- Write unit and integration tests for all endpoints
- Optimize queries and API performance

### **Week 6: Frontend Integration & Finalization**
- Provide API documentation for frontend team
- Support frontend integration and bugfixes
- Finalize migration, clean up legacy code
- Prepare for production deployment

---

## Success Criteria
- All features previously handled by Supabase/serverless are now available via the new backend
- Data is migrated and accessible
- API is documented and tested
- Backend is ready for production deployment 
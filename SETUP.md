# Apartment 1507 Setup Guide

## Environment Variables

### 1. Create a `.env.local` file
Copy `.env.example` and fill in your actual credentials:

```bash
cp .env.example .env.local
```

### 2. Sendgrid Configuration
1. Sign up or log in to [Sendgrid](https://sendgrid.com)
2. Navigate to **Settings → API Keys**
3. Create a new API key with "Mail Send" permissions
4. Add to `.env.local`:
```
VITE_SENDGRID_API_KEY=your_actual_api_key_here
VITE_SENDGRID_FROM_EMAIL=noreply@apartment-1507.local
```

### 3. Microsoft/Office 365 Configuration
1. Go to [Azure Portal](https://portal.azure.com)
2. Register a new application in **Azure Active Directory**
3. Add credentials (generate an app password)
4. Add to `.env.local`:
```
VITE_MICROSOFT_CLIENT_ID=your_client_id
VITE_MICROSOFT_CLIENT_SECRET=your_app_password
VITE_MICROSOFT_TENANT_ID=your_tenant_id
```

### 4. Admin Email
Set the email where enquiries should be sent:
```
VITE_ADMIN_EMAIL=peter@bardenhagen.xyz
```

## Vercel Deployment

### Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable from `.env.local`:
   - `VITE_SENDGRID_API_KEY`
   - `VITE_SENDGRID_FROM_EMAIL`
   - `VITE_MICROSOFT_CLIENT_ID`
   - `VITE_MICROSOFT_CLIENT_SECRET`
   - `VITE_MICROSOFT_TENANT_ID`
   - `VITE_ADMIN_EMAIL`

4. Make sure they're available for:
   - Production
   - Preview
   - Development

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Manual Testing

#### Test Enquiry Submission:
1. Go to `/flatmate/login` with credentials `kevin` / `Omnfxop09!`
2. Click "Request Help with Something"
3. Fill in form:
   - Flatmate: Select any
   - Enquiry Type: Select any
   - Message: Type at least 10 characters
4. Submit and verify:
   - Success message appears
   - Enquiry appears in Admin > Flatmate Enquiries
   - Email sent to admin (if Sendgrid configured)

#### Test Admin View:
1. Go to `/admin/login` with password `Omnfxop09!`
2. Click "Flatmate Enquiries"
3. Verify:
   - All submitted enquiries appear
   - Can filter by status (New, Read, Resolved)
   - Can add notes to enquiries
   - Can change status
   - Can delete enquiries

## Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```
Output goes to `dist/` directory

### 4. Preview Production Build
```bash
npm run preview
```

## Features Implemented

- ✅ Admin Dashboard with Guardian System
- ✅ Request Help with Something feature
- ✅ Enquiry management in Admin panel
- ✅ Flatmate Enquiries tracking (new, read, resolved)
- ✅ Email integration with Sendgrid (when configured)
- ✅ Repair Requests tracking
- ✅ Cleaning Issues with Past/Resolved toggle
- ✅ Cleaning Roster with 4 flatmates rotating every 2 weeks
- ✅ Form validation and error handling
- ✅ Test suite for enquiry submissions

## Security Notes

- Never commit `.env.local` or actual credentials
- Keep API keys secure and rotate regularly
- Use environment-specific keys (dev, staging, production)
- Validate all user input server-side (when backend is added)
- Implement rate limiting for form submissions (when backend is added)

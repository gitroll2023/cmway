# Consultation Page Setup Guide

## Overview

The consultation page (`/app/consultation/page.tsx`) has been completed with a comprehensive form that submits data to Supabase. Here's what has been implemented:

## Features Implemented

### 1. Beautiful Consultation Form
- **Personal Information**: Name (required), phone (required), email (optional), company (optional)
- **Consultation Type**: Health consultation, product consultation, nutrition consultation, or other
- **Health Concerns**: Multiple selection checkboxes for specific health areas
- **Scheduling**: Preferred date and time selection
- **Message**: Free-form text area for detailed requests
- **Privacy Agreements**: Required privacy policy agreement and optional marketing consent

### 2. Form Validation
- Client-side validation using React Hook Form
- Field-specific validation with error messages
- Required field indicators
- Phone number format validation
- Email format validation
- Character limits for text fields

### 3. Responsive Design
- Mobile-first responsive design
- Beautiful gradient backgrounds
- Modern card-based layout
- Accessible form controls
- Loading states and success messages

### 4. Process Steps Section
- Clear 4-step process visualization
- Professional styling with icons
- Step-by-step guidance for users

### 5. Contact Information
- Phone, email, and location details
- Business hours information
- Emergency contact options

### 6. FAQ Section
- Common questions and answers
- Professional formatting
- Call-to-action buttons

### 7. API Integration
- Form submits to `/api/consultation` endpoint
- Data stored in Supabase `consultation_requests` table
- Activity logging in `activity_logs` table
- Error handling and user feedback

## Database Setup

### Required Tables

You need to create two tables in your Supabase database:

1. **consultation_requests** - Stores form submissions
2. **activity_logs** - Tracks system activities

### Setup Instructions

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Execute the SQL script

The script will create:
- Both required tables with proper columns and constraints
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

### Database Schema

```sql
-- consultation_requests table
id: UUID (Primary Key)
name: VARCHAR(50) - Required
phone: VARCHAR(15) - Required
email: VARCHAR(255) - Optional
company: VARCHAR(255) - Optional
consultation_type: VARCHAR(50) - Required
product_interests: TEXT[] - Array of selected health concerns
preferred_date: DATE - Optional
preferred_time: VARCHAR(20) - Optional
message: TEXT - Optional (max 1000 chars)
privacy_agreed: BOOLEAN - Required
marketing_agreed: BOOLEAN - Optional
status: VARCHAR(20) - Default 'pending'
created_at: TIMESTAMP - Auto-generated
updated_at: TIMESTAMP - Auto-updated
```

## File Structure

```
/app/consultation/
├── page.tsx                      # Main consultation page
├── consultation-request-form.tsx # Form component
└── 

/app/api/consultation/
└── route.ts                     # API endpoint for form submission

/lib/types/
└── database.ts                  # Updated with new table types
```

## API Endpoints

### POST /api/consultation
Handles form submission and stores data in Supabase.

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (optional)",
  "company": "string (optional)",
  "consultation_type": "string (required)",
  "health_concerns": ["string"] (optional),
  "preferred_date": "string (optional)",
  "preferred_time": "string (optional)",
  "message": "string (optional)",
  "privacy_agreed": boolean (required),
  "marketing_agreed": boolean (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "상담신청이 성공적으로 접수되었습니다.",
  "data": {
    "id": "uuid",
    "status": "pending"
  }
}
```

### GET /api/consultation
Retrieves consultation requests (for admin use).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `search`: Search by name, phone, or email

## Form Fields Details

### Consultation Types
- `health_consultation`: 건강 상담 - Personal health management consultation
- `product_consultation`: 제품 상담 - Health supplement recommendations
- `nutrition_consultation`: 영양 상담 - Nutrition management and dietary improvement
- `other`: 기타 상담 - Other health-related inquiries

### Health Concerns Options
- 면역력 강화 (Immune system boost)
- 피로 회복 (Fatigue recovery)
- 관절 건강 (Joint health)
- 눈 건강 (Eye health)
- 소화 건강 (Digestive health)
- 혈관 건강 (Vascular health)
- 항산화 (Antioxidant)
- 다이어트 (Diet/Weight management)
- 갱년기 관리 (Menopause management)
- 수면 개선 (Sleep improvement)
- 기타 (Others)

### Time Slots
- `morning`: 오전 (09:00~12:00)
- `afternoon`: 오후 (13:00~17:00)
- `evening`: 저녁 (18:00~20:00)

## Contact Information

The page displays:
- **Phone**: 1588-0000
- **Email**: contact@cmway.co.kr
- **Business Hours**: Weekdays 09:00 ~ 18:00
- **Location**: Seoul, Gangnam-gu

## Success Flow

1. User fills out and submits the form
2. Client-side validation ensures all required fields are completed
3. Form data is sent to the API endpoint
4. Data is validated server-side using Zod schema
5. Record is inserted into `consultation_requests` table
6. Activity is logged in `activity_logs` table
7. Success message is displayed to the user
8. User can submit additional requests or return to homepage

## Error Handling

- Client-side validation with immediate feedback
- Server-side validation with detailed error messages
- Network error handling with user-friendly messages
- Graceful degradation for JavaScript-disabled browsers

## Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management

## Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly form controls
- Optimized layout for small screens
- Readable typography on all devices
- Accessible button sizes

## Next Steps

1. Execute the `database-setup.sql` script in your Supabase project
2. Verify the tables are created correctly
3. Test the form submission functionality
4. Set up email notifications for new consultation requests
5. Create an admin interface to manage consultation requests
6. Configure proper authentication and authorization if needed

## Troubleshooting

### Form Not Submitting
- Check browser console for JavaScript errors
- Verify Supabase connection and environment variables
- Ensure database tables exist and have proper permissions

### Database Errors
- Verify the SQL script executed without errors
- Check RLS policies are correctly configured
- Ensure proper column types and constraints

### Validation Errors
- Check form field names match API expectations
- Verify required field validation rules
- Test with various input combinations

## Security Considerations

- Form includes CSRF protection through Next.js
- Input validation both client and server-side
- SQL injection prevention through parameterized queries
- Rate limiting should be implemented for production use
- Personal data handling complies with privacy requirements
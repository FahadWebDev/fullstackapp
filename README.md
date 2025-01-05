# News Portal - Functionality Documentation

## Overview
The News Portal is a web application that allows users to create, manage, and view news articles with a subscription-based system. The application includes user authentication, news management, weather information, and subscription features.


## Instructions to run code
- npm i
- npm run dev


## Key Features

### 1. Authentication System
- Users can register with email and password
- Secure login system
- Profile information display including email and name
- Secure logout functionality

### 2. News Management
- Users can create news articles with:
  - Title
  - Description
  - Status (Pending/Approved/Rejected)
- News article operations:
  - Create: Users can submit new articles
  - Read: View their submitted articles
  - Edit: Modify existing articles
  - Delete: Remove their articles
- Status tracking:
  - New articles start with 'pending' status
  - Admin review changes status to 'approved' or 'rejected'

### 3. Admin Review System
- Special tab only visible to admin users
- Admins can:
  - View all pending news articles
  - Filter news by status (All/Pending/Approved/Rejected)
  - Approve or reject pending articles
  - Review article details before making decisions

### 4. Weather Information
- Users can:
  - View current weather information
  - Search weather by city
  - See weather details like temperature and conditions
- Weather data updates in real-time
- Clean and intuitive weather display

### 5. Subscription System
- Two subscription tiers:
  - Basic Plan ($9.99/month)
    - Create up to 10 news articles
    - Basic analytics
    - Email support
  - Pro Plan ($29.99/month)
    - Unlimited news articles
    - Advanced analytics
    - Priority support
    - Custom branding

- Features:
  - Secure payment processing through Stripe
  - View active subscription details
  - Automatic renewal handling
  - Clear subscription status display

### 6. Push Notifications
- Users receive notifications for:
  - News article status changes
  - Subscription updates
- Notification permissions are requested upon login
- Real-time delivery of important updates

## Technical Notes

### API Integration
- Stripe for payment processing
- OpenWeather API for weather data
- Firebase for authentication and database
- Push notifications through Firebase Cloud Messaging (FCM)

### Database Structure
1. Users Collection
   - User profile information
   - Authentication details

2. News Collection
   - Article content
   - Status information
   - User references

3. Subscriptions Collection
   - Subscription details
   - Payment status
   - Plan information

### Security
- Secure authentication flow
- Protected API routes
- Role-based access control
- Secure payment processing

## User Roles

### Regular Users
- Can create and manage their news articles
- Access to weather information
- Ability to subscribe to plans
- Receive notifications

### Admin Users
- All regular user capabilities
- Access to review system
- Ability to approve/reject articles
- View all news articles


## API Endpoints Documentation

### Authentication Required
All endpoints except the weather API require authentication token in the header:
```
Authorization: Bearer {user-token}
```

### 1. News Endpoints

#### Get All News
```
GET /api/news
Query Parameters:
- userId (optional): Filter news by user
- status (optional): Filter by status (pending/approved/rejected/all)

Response:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "pending" | "approved" | "rejected",
  "createdByUser": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Get Single News
```
GET /api/news/{id}

Response: Same as Get All News
```

#### Create News
```
POST /api/news
Body:
{
  "title": "string",
  "description": "string",
  "userId": "string"
}

Response:
{
  "id": "string",
  "success": true
}
```

#### Update News
```
PUT /api/news/{id}
Body:
{
  "title": "string" (optional),
  "description": "string" (optional),
  "status": "string" (optional)
}

Response:
{
  "success": true
}
```

#### Delete News
```
DELETE /api/news/{id}

Response:
{
  "success": true
}
```

### 2. Subscription Endpoints

#### Get User Subscription
```
GET /api/subscription?userId={userId}

Response:
{
  "subscription": {
    "id": "string",
    "status": "string",
    "stripePriceId": "string",
    "createdAt": "timestamp",
    "periodEnd": "timestamp"
  }
}
```

#### Create Subscription
```
POST /api/subscription
Body:
{
  "priceId": "string",
  "userId": "string"
}

Response:
{
  "sessionId": "string"
}
```

### 3. FCM Token Endpoints

#### Save FCM Token
```
POST /api/notification
Body:
{
  "fcmToken": "string"
}

Response:
{
  "success": true,
  "message": "FCM Token saved successfully"
}
```

#### Delete FCM Token
```
DELETE /api/notification

Response:
{
  "success": true,
  "message": "FCM Token removed successfully"
}
```

### 4. Weather Endpoint

#### Get Weather Data
```
GET /api/weather
Query Parameters:
- city: string

Response:
{
  "main": {
    "temp": number,
    "feels_like": number,
    "humidity": number
  },
  "weather": [{
    "main": string,
    "description": string
  }],
  "name": string
}
```

### 5. Webhook Endpoint

#### Stripe Webhook
```
POST /api/webhook
- Handles Stripe webhook events
- Requires Stripe signature verification
- Updates subscription status in database

Events Handled:
- checkout.session.completed


```
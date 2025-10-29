# QuickPoll Frontend

A modern, responsive polling platform built with Next.js 16, React 19, and TypeScript. This frontend provides an intuitive user interface for creating polls, casting votes, and viewing real-time results with beautiful data visualizations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [Components](#components)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

QuickPoll Frontend is a cutting-edge web application that provides a seamless experience for creating and participating in polls. Built with Next.js 16 and React 19, it features:

- **Server-Side Rendering (SSR)** for optimal performance
- **Client-Side Navigation** for fast page transitions
- **Real-Time Updates** via WebSocket connections
- **Beautiful UI/UX** with Tailwind CSS and Radix UI components
- **Type Safety** with TypeScript
- **Responsive Design** for all device sizes
- **Data Visualization** with Recharts

## ✨ Features

### Core Features

#### Poll Management
- **Create Polls** - Easy-to-use form for creating polls with multiple options
- **View Polls** - Browse trending, popular, and recent polls
- **Poll Details** - Comprehensive poll view with voting interface
- **Poll Search** - Search functionality to find specific polls
- **Poll Statistics** - View detailed statistics and analytics

#### Voting System
- **Cast Votes** - Vote on polls with a single click
- **Real-Time Results** - See vote counts update in real-time
- **Visual Feedback** - Beautiful progress bars and charts
- **Vote Confirmation** - Clear indication when vote is cast
- **Multiple Choice Support** - Support for polls with multiple selections

#### User Management
- **User Registration** - Create new accounts easily
- **User Login** - Secure authentication system
- **User Profile** - View and manage user profiles
- **Authentication State** - Persistent login state management

#### Real-Time Features
- **Live Updates** - Real-time vote count updates using WebSockets
- **Instant Feedback** - See changes as they happen
- **Connection Management** - Automatic reconnection handling

#### User Interface
- **Modern Design** - Clean, modern interface with gradients and animations
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support** - Built-in dark mode (via Tailwind configuration)
- **Loading States** - Beautiful loading indicators
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful empty state messages

#### Data Visualization
- **Bar Charts** - Interactive bar charts for poll results
- **Progress Bars** - Visual progress indicators for each option
- **Percentage Display** - Clear percentage calculations
- **Color Coding** - Distinct colors for different options

## 🛠 Tech Stack

### Core Framework
- **Next.js** (v16.0.0) - React framework with SSR and routing
- **React** (v19.2.0) - UI library
- **React DOM** (v19.2.0) - React DOM renderer
- **TypeScript** (v5) - Type-safe JavaScript

### Styling
- **Tailwind CSS** (v4) - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-checkbox` (v1.3.3)
  - `@radix-ui/react-label` (v2.1.7)
  - `@radix-ui/react-slot` (v1.2.3)
- **class-variance-authority** (v0.7.1) - Variant management
- **clsx** (v2.1.1) - Conditional class names
- **tailwind-merge** (v3.3.1) - Merge Tailwind classes

### Data Visualization
- **Recharts** (v3.3.0) - Composable charting library

### Icons
- **Lucide React** (v0.548.0) - Beautiful icon library

### Development Tools
- **ESLint** (v9) - Linting tool
- **eslint-config-next** (v16.0.0) - Next.js ESLint configuration
- **PostCSS** - CSS processing
- **tw-animate-css** (v1.4.0) - Animation utilities

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **pnpm** (recommended) or **npm** or **yarn** - Package manager
- **Git** - Version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the `my-app` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8001` | Yes |

### Next.js Configuration

The `next.config.ts` file contains Next.js configuration. Current settings:

```typescript
const nextConfig: NextConfig = {
  /* config options here */
}
```

### TypeScript Configuration

TypeScript is configured via `tsconfig.json` with:
- Strict mode enabled
- Path aliases (`@/*` pointing to root)
- ES2017 target
- React JSX support

## 🏃 Running the Application

### Development Mode

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API** (if backend is running): http://localhost:8001

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## 📁 Project Structure

```
my-app/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx             # Root layout component
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   ├── favicon.ico           # Favicon
│   │
│   ├── create/                # Create poll page
│   │   └── page.tsx
│   │
│   ├── login/                 # Login page
│   │   └── page.tsx
│   │
│   ├── signup/                # Signup page
│   │   └── page.tsx
│   │
│   ├── poll/                  # Poll detail pages
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── polls/                 # Polls listing page
│   │   └── page.tsx
│   │
│   └── profile/               # User profile page
│       └── page.tsx
│
├── components/                # React components
│   ├── header.tsx             # Main navigation header
│   ├── poll-card.tsx          # Poll card component
│   ├── providers.tsx          # Context providers wrapper
│   │
│   └── ui/                    # Reusable UI components
│       ├── button.tsx         # Button component
│       ├── card.tsx           # Card component
│       ├── checkbox.tsx       # Checkbox component
│       ├── input.tsx          # Input component
│       └── label.tsx          # Label component
│
├── contexts/                  # React Context providers
│   └── AuthContext.tsx        # Authentication context
│
├── lib/                       # Utility libraries
│   ├── api.ts                 # API client and types
│   └── utils.ts               # Utility functions
│
├── public/                    # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── pnpm-lock.yaml            # pnpm lock file
├── postcss.config.mjs        # PostCSS configuration
├── eslint.config.mjs         # ESLint configuration
└── README.md                  # This file
```

## 📄 Pages Overview

### Home Page (`/`)

- **Route**: `/`
- **File**: `app/page.tsx`
- **Features**:
  - Hero section with call-to-action
  - Statistics dashboard (active polls, total votes, community count)
  - Trending polls grid
  - Beautiful gradient backgrounds

### Create Poll Page (`/create`)

- **Route**: `/create`
- **File**: `app/create/page.tsx`
- **Features**:
  - Form to create new polls
  - Dynamic option addition/removal
  - Title and description fields
  - Authentication required (redirects to login if not authenticated)
  - Form validation

### Poll Detail Page (`/poll/[id]`)

- **Route**: `/poll/:id`
- **File**: `app/poll/[id]/page.tsx`
- **Features**:
  - Full poll details display
  - Voting interface with visual feedback
  - Real-time vote count updates
  - Interactive bar chart visualization
  - Like/share functionality
  - Progress bars for each option
  - Poll statistics sidebar

### Login Page (`/login`)

- **Route**: `/login`
- **File**: `app/login/page.tsx`
- **Features**:
  - User authentication form
  - Email/password login
  - Remember me checkbox
  - Social login buttons (UI only)
  - Redirect after successful login
  - Error handling

### Signup Page (`/signup`)

- **Route**: `/signup`
- **File**: `app/signup/page.tsx`
- **Features**:
  - User registration form
  - Username, email, password fields
  - Form validation
  - Redirect to login after registration

### Polls Listing (`/polls`)

- **Route**: `/polls`
- **File**: `app/polls/page.tsx`
- **Features**:
  - Grid/list view of all polls
  - Pagination support
  - Filtering and sorting options

### Profile Page (`/profile`)

- **Route**: `/profile`
- **File**: `app/profile/page.tsx`
- **Features**:
  - User profile information
  - User's poll history
  - Statistics and analytics

## 🧩 Components

### Header Component

**File**: `components/header.tsx`

- Main navigation bar
- Logo and branding
- Authentication status display
- User menu
- Navigation links

### Poll Card Component

**File**: `components/poll-card.tsx`

- Displays poll summary
- Vote count and like count
- Link to poll detail page
- Responsive card layout

### UI Components

Located in `components/ui/`:

- **Button** - Styled button component with variants
- **Card** - Container component for content
- **Input** - Text input component
- **Checkbox** - Checkbox input component
- **Label** - Form label component

These components are built using Radix UI primitives and styled with Tailwind CSS.

## 🔌 API Integration

### API Client

**File**: `lib/api.ts`

The API client (`ApiClient` class) handles all backend communication:

#### Features

- Automatic token management (localStorage)
- Type-safe API methods
- Error handling
- Response formatting
- Request interceptors

#### Available Methods

**Authentication**
- `login(usernameOrEmail, password)` - User login
- `register(username, email, password)` - User registration
- `getCurrentUser()` - Get current user profile

**Polls**
- `getPolls(skip, limit)` - Get paginated polls
- `getTrendingPolls(skip, limit)` - Get trending polls
- `getPollsStats()` - Get poll statistics
- `getPoll(pollId)` - Get poll by ID
- `createPoll(pollData)` - Create new poll
- `updatePoll(pollId, pollData)` - Update poll
- `deletePoll(pollId)` - Delete poll

**Votes**
- `castVote(pollId, optionIds, anonId)` - Cast vote(s)
- `getPollVotes(pollId, skip, limit)` - Get votes for poll
- `getPollStats(pollId)` - Get vote statistics

**Users**
- `getUsers(skip, limit)` - Get users list
- `getUsersCount()` - Get user count
- `getUser(userId)` - Get user by ID
- `getUserPolls(userId, skip, limit)` - Get user's polls

**Health**
- `healthCheck()` - Check API health

#### Usage Example

```typescript
import { apiClient } from '@/lib/api'

// Get polls
const response = await apiClient.getPolls(0, 20)

if (response.success) {
  console.log(response.data)
} else {
  console.error(response.error)
}

// Create poll
const pollResponse = await apiClient.createPoll({
  title: "What's your favorite color?",
  options: ["Red", "Blue", "Green"],
  allow_multiple: false
})
```

## 🔐 Authentication

### Auth Context

**File**: `contexts/AuthContext.tsx`

The `AuthContext` provides authentication state and methods throughout the application:

#### Features

- Persistent authentication state
- Token management
- User profile data
- Login/logout functionality
- Automatic token refresh

#### Usage

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.username}!</div>
  }
  
  return <div>Please log in</div>
}
```

#### Auth Methods

- `login(usernameOrEmail, password)` - Log in user
- `register(username, email, password)` - Register new user
- `logout()` - Log out current user
- `refreshUser()` - Refresh user data

### Protected Routes

Routes can be protected by checking authentication status:

```typescript
const { isAuthenticated, isLoading } = useAuth()

useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.replace(`/login?next=${router.pathname}`)
  }
}, [isAuthenticated, isLoading, router])
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS v4 for styling with:

- **Utility-first approach** - Fast development with utility classes
- **Custom color palette** - Primary, secondary, accent colors
- **Dark mode support** - Built-in dark mode configuration
- **Responsive design** - Mobile-first responsive utilities
- **Custom animations** - Custom animation utilities

### Design System

**Colors**:
- Primary: Main brand color
- Secondary: Secondary brand color
- Accent: Accent color for highlights
- Background: Page background color
- Foreground: Text color
- Muted: Muted text and backgrounds

**Typography**:
- Font sizes: Tailwind default scale
- Font weights: Regular, medium, semibold, bold

**Spacing**:
- Consistent spacing scale from Tailwind

### Custom Styles

**File**: `app/globals.css`

Contains:
- CSS custom properties (variables)
- Global styles
- Tailwind directives
- Custom animations

## 🚢 Deployment

### Build for Production

```bash
# Build the application
pnpm build

# Test production build locally
pnpm start
```

### Deployment Platforms

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
3. Deploy automatically on push

#### Netlify

1. Build command: `pnpm build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

#### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set correctly for production:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🧪 Development

### Adding New Components

1. Create component in `components/` directory
2. Use TypeScript for type safety
3. Follow existing component patterns
4. Use Tailwind CSS for styling

### Adding New Pages

1. Create page in `app/` directory
2. Use Next.js App Router conventions
3. Add TypeScript types
4. Implement proper error handling

### API Integration

1. Add new methods to `lib/api.ts`
2. Define TypeScript interfaces
3. Handle errors properly
4. Update types as needed

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check backend is running
   - Verify CORS configuration on backend

2. **Build Errors**
   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `pnpm install`
   - Check TypeScript errors: `pnpm run build`

3. **Authentication Issues**
   - Clear localStorage
   - Check token is valid
   - Verify backend authentication endpoints

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports

## 📝 Best Practices

1. **Type Safety**
   - Use TypeScript for all components
   - Define interfaces for API responses
   - Use type guards when needed

2. **Error Handling**
   - Always handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging

3. **Performance**
   - Use Next.js Image component for images
   - Implement code splitting
   - Optimize bundle size

4. **Accessibility**
   - Use semantic HTML
   - Add proper ARIA labels
   - Ensure keyboard navigation

5. **Security**
   - Never expose sensitive data in client-side code
   - Validate all user inputs
   - Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code style
- Use TypeScript strictly
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, please open an issue in the repository or contact the development team.

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Recharts Documentation](https://recharts.org)

---

**Built with ❤️ using Next.js, React, and TypeScript**

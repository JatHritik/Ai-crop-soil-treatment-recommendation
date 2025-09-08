# Soil Analysis Platform - Frontend

A professional React frontend for AI-powered soil analysis and crop treatment recommendations. Built with modern web technologies and a nature-inspired design system.

## 🚀 Features

- **Modern Tech Stack**: React 18, Vite, TypeScript support
- **Beautiful UI**: Tailwind CSS with nature-inspired design system
- **Accessibility**: Radix UI primitives with WCAG AA compliance
- **Smooth Animations**: Framer Motion for subtle, performant animations
- **State Management**: React Query for server state, Context for UI state
- **Form Handling**: react-hook-form with Zod validation
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Performance**: Lazy loading, code splitting, and optimized bundles

## 🎨 Design System

### Color Palette
- **Primary**: Forest greens (#2F6D5F, #16a34a)
- **Accent**: Seafoam teals (#14b8a6, #83c5be)
- **Surface**: Mist grays (#f8fafc, #f1f5f9)
- **Ink**: Forest ink (#0f172a, #334155)
- **Status Colors**: Success, warning, danger variants

### Typography
- **UI Font**: Inter (clean, modern)
- **Display Font**: Fraunces (elegant serif for headings)

### Components
- Reusable UI components with consistent styling
- Nature-inspired gradients and organic shapes
- Soft shadows and rounded corners
- Smooth hover and focus states

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Query** - Server state management
- **Axios** - HTTP client
- **react-hook-form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, Input, etc.)
│   └── layout/          # Layout components (Navbar, Footer, Layout)
├── contexts/            # React contexts (Auth, Theme)
├── hooks/               # Custom hooks (useAuth, useReports, useAdmin)
├── lib/                 # Utilities and configurations
│   ├── api.js          # API client and endpoints
│   ├── utils.js        # Helper functions
│   └── validations.js  # Zod schemas
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── reports/        # Report management pages
│   └── admin/          # Admin pages
├── test/               # Test setup and utilities
└── main.jsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soil-analysis-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Configuration

Update the `VITE_API_URL` in your `.env.local` file to point to your backend API:

```env
# For local development
VITE_API_URL=http://localhost:5000/api

# For production
VITE_API_URL=https://your-api-domain.com/api
```

## 📱 Available Pages

### Public Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - Main dashboard with stats and recent reports
- **Reports** (`/reports`) - List of all user reports
- **Upload Report** (`/reports/upload`) - Upload new soil analysis report
- **Report Details** (`/reports/:id`) - Detailed view of specific report

### Admin Pages
- **Admin Dashboard** (`/admin`) - System overview and statistics
- **User Management** (`/admin/users`) - Manage users and roles
- **Report Management** (`/admin/reports`) - View all system reports

## 🔧 API Integration

The frontend connects to your backend through the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Reports
- `POST /reports/upload` - Upload new report
- `GET /reports/my-reports` - Get user's reports
- `GET /reports/:id` - Get specific report
- `GET /reports/:id/status` - Check report status

### User Management
- `GET /user/dashboard` - Get user dashboard data
- `PUT /user/profile` - Update user profile

### Admin
- `GET /admin/dashboard` - Get admin dashboard data
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/role` - Update user role
- `DELETE /admin/users/:id` - Delete user

## 🎨 Customization

### Adding New Pages

1. Create a new component in the appropriate directory
2. Add the route to `App.jsx`
3. Update navigation in `Navbar.jsx` if needed

Example:
```jsx
// src/pages/NewPage.jsx
import React from 'react'

const NewPage = () => {
  return (
    <div className="container-nature section-padding">
      <h1>New Page</h1>
    </div>
  )
}

export { NewPage }
```

### Adding New Components

1. Create component in `src/components/`
2. Follow the existing patterns for styling and structure
3. Export from appropriate index files

### Styling Guidelines

- Use Tailwind utility classes
- Follow the design system color palette
- Use the provided component variants
- Maintain accessibility standards

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🚀 Deployment

The built application can be deployed to any static hosting service:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload the `dist` folder to an S3 bucket
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 📚 Key Features Explained

### Authentication Flow
- JWT-based authentication with automatic token refresh
- Protected routes with role-based access control
- Automatic redirects for unauthenticated users

### State Management
- **React Query**: Server state, caching, and synchronization
- **Context API**: UI state (theme, authentication)
- **Local Storage**: Persistent user preferences

### Form Handling
- **react-hook-form**: Performant form management
- **Zod**: Runtime type checking and validation
- **Error Handling**: User-friendly error messages

### Responsive Design
- Mobile-first approach
- Breakpoint system: sm, md, lg, xl, 2xl
- Flexible grid layouts
- Touch-friendly interactions

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check `VITE_API_URL` in `.env.local`
   - Ensure backend is running
   - Check CORS configuration

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS
   - Verify component class names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

Built with ❤️ for sustainable agriculture
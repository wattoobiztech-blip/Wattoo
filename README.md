# Rishta.com - Matrimonial Website

A stunning, modern matrimonial website with complete authentication system built with Next.js 14, React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### Landing Page
- **Ultra-modern Design**: Premium aesthetics with gradient backgrounds and glass morphism effects
- **Smooth Animations**: Powered by Framer Motion for buttery smooth interactions
- **Custom Cursor**: Interactive cursor that changes on hover
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Performance Optimized**: Built with Next.js 14 App Router for optimal performance

### Authentication System
- **Login Page**: Split-screen design with beautiful background imagery
- **Multi-step Registration**: 3-step registration process with progress indicator
- **Forgot Password**: Complete password recovery flow
- **Form Validation**: Real-time validation with Zod schemas
- **Password Strength**: Visual password strength indicator
- **Toast Notifications**: Beautiful success/error messages

## 🎨 Design Elements

### Authentication Pages

#### Login Page (`/login`)
- Split-screen layout with couple imagery
- Animated gradient overlays and floating particles
- Form with email/password fields and password toggle
- "Remember me" checkbox and "Forgot Password" link
- Google OAuth integration (UI ready)
- Responsive design with mobile-first approach

#### Registration Page (`/register`)
- **Step 1**: Basic Information (name, email, password, phone, gender)
- **Step 2**: Personal Details (DOB, religion, caste, country, terms)
- **Step 3**: Profile Picture upload with drag & drop
- Progress bar with step indicators
- Form validation with error states
- Smooth step transitions

#### Forgot Password Page (`/forgot-password`)
- Clean, focused design for password recovery
- Email input with validation
- Success state with confirmation message
- Links back to login and support

### Form Components
- **Custom Input**: Floating labels with icons and animations
- **Password Strength**: Visual strength meter (weak/medium/strong)
- **Select Dropdown**: Searchable dropdowns with smooth animations
- **File Upload**: Drag & drop with preview functionality
- **Progress Bar**: Multi-step progress indicator

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Images**: Next.js Image component with Unsplash integration

## 📱 Pages & Routes

- **`/`** - Landing page with hero, features, profiles, footer
- **`/login`** - User authentication page
- **`/register`** - Multi-step registration process
- **`/forgot-password`** - Password recovery page

## 🎯 Key Components

### Authentication Components
- **Input**: Reusable input with floating labels and validation
- **Button**: Animated button with loading states
- **Select**: Dropdown with search functionality
- **PasswordStrength**: Visual password strength indicator
- **ProgressBar**: Multi-step progress tracking

### Form Validation
- **Zod Schemas**: Type-safe validation for all forms
- **Real-time Validation**: Instant feedback on form fields
- **Error Handling**: Smooth error animations and messages

## 🎨 Color Scheme

- **Primary**: Pink (#EC4899) to Purple (#8B5CF6) gradient
- **Background**: Dark blue (#0F172A) and white variations
- **Text**: Responsive text colors based on background
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)

## 📋 Form Data Structure

### Registration Data
```typescript
// Step 1: Basic Information
{
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  gender: 'male' | 'female' | 'other'
}

// Step 2: Personal Details
{
  dateOfBirth: string
  religion: string
  caste: string
  country: string
  agreeToTerms: boolean
}

// Step 3: Profile Picture
{
  profilePicture?: File
}
```

### Database Configuration
```typescript
const dbConfig = {
  host: 'localhost',
  database: 'rishta',
  user: 'root',
  password: ''
}
```

## ⚡ Performance Features

- **Image Optimization**: Next.js Image component with Unsplash CDN
- **Code Splitting**: Automatic code splitting with Next.js
- **CSS Optimization**: Tailwind CSS with purging for minimal bundle size
- **Animation Performance**: Hardware-accelerated animations with Framer Motion
- **Form Optimization**: Efficient form handling with React Hook Form

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to modify the color scheme:

```javascript
colors: {
  primary: {
    500: '#ec4899', // Change primary color
  },
  purple: {
    500: '#8b5cf6', // Change secondary color
  }
}
```

### Form Options
Update `lib/constants.ts` to modify dropdown options:

```javascript
export const religions = ['Islam', 'Christianity', 'Hinduism', ...]
export const castes = ['Khan', 'Wattoo', 'Arain', ...]
export const countries = ['Pakistan', 'India', 'Bangladesh', ...]
```

### Validation Rules
Modify `lib/validations.ts` to update form validation schemas.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🔐 Security Features

- **Input Validation**: Comprehensive client-side validation
- **Password Strength**: Enforced strong password requirements
- **File Upload Security**: File type and size validation
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Form tokens (ready for backend integration)

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your own matrimonial website needs.

## 📄 License

This project is for demonstration purposes. Please ensure you have proper licenses for any images or assets used in production.

## 🙏 Acknowledgments

- Profile images from [Unsplash](https://unsplash.com)
- Icons from [Lucide React](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Form handling with [React Hook Form](https://react-hook-form.com)
- Validation with [Zod](https://zod.dev)

---

**Note**: This includes complete UI implementation with form validation and dummy data handling. Backend integration, user authentication, and database operations would need to be added for a production matrimonial website.
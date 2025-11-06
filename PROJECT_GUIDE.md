# 📚 LibraryHub - Digital Book Catalog

A production-quality online library catalog website built with React 18, TypeScript, and modern web technologies featuring glassmorphism design, smooth animations, and exceptional UX/UI.

## 🎨 Design Features

### Visual Design
- **Modern Glassmorphism**: Backdrop blur effects and translucent cards throughout
- **Vibrant Color Palette**: 
  - Primary: `#4361ee` (Vibrant Blue)
  - Secondary: `#3a0ca3` (Deep Purple)  
  - Accent: `#f72585` (Hot Pink)
- **Gradient Backgrounds**: Beautiful color gradients and overlays
- **Custom Animations**: Framer Motion for smooth page transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with beautiful layouts on all devices

### Typography
- **Font Family**: Plus Jakarta Sans for clean, modern aesthetics
- **Font Weights**: 300-800 for proper hierarchy

### UI Components
- Enhanced shadcn/ui components with custom glassmorphism variants
- Smooth hover effects and interactive states
- Loading skeletons with shimmer animations
- Toast notifications for user feedback

## 🏗️ Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Project Structure
```
src/
├── assets/          # Images and static files
├── components/      # Reusable UI components
│   ├── ui/         # shadcn components
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   └── LoadingSkeleton.tsx
├── contexts/        # React Context providers
│   └── AuthContext.tsx
├── hooks/          # Custom React hooks
│   ├── useBooks.ts
│   └── use-mobile.tsx
├── lib/            # Utilities and API
│   ├── api.ts
│   └── utils.ts
├── pages/          # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── BooksList.tsx
│   ├── BookDetail.tsx
│   ├── AddBook.tsx
│   └── Transactions.tsx
├── types/          # TypeScript type definitions
│   └── index.ts
├── App.tsx         # Main app with routing
├── index.css       # Design system & global styles
└── main.tsx        # Entry point
```

## 🚀 Features

### Authentication System
- **Login Page**: Animated form with floating labels, email/password validation
- **Register Page**: Multi-step form with progress indicator and password strength meter
- **Token Persistence**: LocalStorage for session management
- **Protected Routes**: Automatic redirect for unauthenticated users

### Book Management
- **Books Catalog**: Interactive grid with filters and search
  - Real-time search by title/author
  - Genre filtering
  - Staggered card entrance animations
  - Hover effects with elevation
  
- **Book Details**: Immersive single-book view
  - Large cover image display
  - Tabbed content sections
  - Quantity selector
  - Add to cart functionality
  - Full book metadata display

- **Add Book**: Multi-step wizard form
  - Step 1: Basic info (title, author, genre)
  - Step 2: Pricing & stock
  - Step 3: Additional details
  - Progress indicator
  - Form validation with error handling

### Transaction Management
- **Transaction History**: Timeline-style layout
  - Transaction cards with status badges
  - Item summaries
  - Total calculations
  - Expandable details
  
- **Statistics Dashboard**: 
  - Total transactions count
  - Books purchased
  - Total amount spent

### UI/UX Excellence
- **Loading States**: Custom skeletons with shimmer effects
- **Error Handling**: Beautiful error pages and form validation
- **Empty States**: Engaging illustrations and CTAs
- **Responsive Navigation**: Mobile hamburger menu with slide-in animation
- **User Dropdown**: Profile menu with smooth animations

## 🎯 API Integration

The project uses a mock API implementation that can be easily replaced with real endpoints:

### API Structure (`src/lib/api.ts`)
```typescript
// Authentication
authAPI.login(email, password)
authAPI.register(email, password, name)

// Books
booksAPI.getAll(params?)
booksAPI.getById(id)
booksAPI.create(bookData)
booksAPI.update(id, bookData)
booksAPI.delete(id)

// Transactions
transactionsAPI.getAll()
transactionsAPI.getById(id)
transactionsAPI.create(items)
```

### Replacing Mock API
1. Update `API_BASE_URL` in `src/lib/api.ts`
2. Replace mock implementations with actual axios calls
3. Update TypeScript interfaces in `src/types/index.ts` if needed

## 🎨 Design System

### Color Tokens (index.css)
```css
--primary: 230 70% 60%        /* Vibrant Blue */
--secondary: 259 80% 35%      /* Deep Purple */
--accent: 335 88% 65%         /* Hot Pink */
--glass-bg: 0 0% 100% / 0.7   /* Glassmorphism */
```

### Custom Utility Classes
```css
.glass-card      /* Glassmorphism card style */
.glass-button    /* Glassmorphism button */
.gradient-text   /* Text with gradient */
.hover-lift      /* Lift animation on hover */
.shimmer         /* Shimmer loading effect */
```

### Component Variants
- **Button**: default, destructive, outline, secondary, ghost, link
- **Badge**: default, secondary, destructive, outline
- **Card**: Enhanced with glassmorphism

## 📱 Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`
- Large Desktop: `> 1400px`

## 🔒 TypeScript Types

### Core Interfaces
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface Book {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock: number;
  genre: string;
  // ... additional fields
}

interface Transaction {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  // ... timestamps
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Default Credentials (Mock API)
- Any email/password combination works with the mock API
- User data is stored in LocalStorage

## 🎭 Animation Guidelines

### Page Transitions
- Entry: Fade-in + scale (0.5s)
- Exit: Fade-out + scale (0.3s)

### Interactive Elements
- Hover: Scale 1.05 + shadow enhancement
- Click: Scale 0.98 bounce effect
- Loading: Spin + shimmer

### Stagger Animations
- Book grid: 50ms stagger
- Transaction cards: 50ms stagger

## 🔧 Customization

### Changing Colors
Edit `src/index.css`:
```css
:root {
  --primary: [new HSL values];
  --secondary: [new HSL values];
  --accent: [new HSL values];
}
```

### Adding New Routes
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`

### Custom Hooks
Add to `src/hooks/` for reusable logic:
- API fetching
- Form handling
- LocalStorage management

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Lazy loading with blur-up
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search input with 300ms delay

## 🎨 Best Practices

1. **Always use design system tokens** - Never hardcode colors
2. **Component composition** - Keep components small and focused
3. **TypeScript strict mode** - Full type coverage
4. **Accessibility** - Semantic HTML and ARIA labels
5. **Error boundaries** - Graceful error handling
6. **Responsive first** - Mobile-first approach

## 🐛 Common Issues

### Build Errors
- Ensure all imports use `@/` alias
- Check TypeScript types match API responses

### Styling Issues
- Verify Tailwind classes in `tailwind.config.ts`
- Check HSL color format in `index.css`

### Animation Performance
- Reduce motion for users with `prefers-reduced-motion`
- Use CSS transforms instead of position changes

## 📝 Future Enhancements

Potential features to add:
- [ ] Book cover image upload with crop
- [ ] Reading progress tracking
- [ ] Wishlist functionality
- [ ] Dark/light theme toggle
- [ ] Advanced search filters
- [ ] Review and rating system
- [ ] Shopping cart checkout flow
- [ ] User profile management
- [ ] Email notifications
- [ ] Export transaction reports

## 📄 License

This project is built as a demonstration of modern web development practices with React and TypeScript.

## 🤝 Contributing

When contributing:
1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test on multiple screen sizes
5. Ensure animations are smooth (60fps)

---

Built with ❤️ using React, TypeScript, and modern web technologies.

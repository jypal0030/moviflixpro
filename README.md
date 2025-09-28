# 🎬 Movieflix Pro

A modern, Netflix-like movie and TV show streaming platform built with Next.js 15, featuring horizontal swipe functionality, admin panel, and Telegram integration.

## ✨ Features

### 🎥 Frontend Features
- **🏠 Hero Section**: Featured movies with stunning backgrounds
- **📱 Horizontal Swipe/Scroll**: Touch-optimized mobile gestures and desktop horizontal scrolling
- **🎬 Movie Cards**: Interactive cards with hover effects and quick actions
- **🗂️ Category System**: Organized content by genre (Hollywood, Bollywood, Marvel, etc.)
- **🔍 Search Functionality**: Real-time search with filters
- **🌙 Dark Theme**: Netflix-inspired dark theme with purple accents
- **📱 Responsive Design**: Mobile, tablet, and desktop optimized
- **⚡ Smooth Animations**: 60fps animations with Framer Motion

### 🛠️ Admin Panel Features
- **🔐 Secure Authentication**: Admin login (PISTA@7101 / JAIPAL@7101)
- **📊 Dashboard**: Overview of total content, categories, and statistics
- **🎬 Content Management**: Full CRUD operations for movies and web series
- **🏷️ Category Management**: Create and manage content categories
- **📤 Image Upload**: Drag & drop image upload with validation
- **🔗 Telegram Integration**: Direct users to Telegram channels

### 🚀 Technical Features
- **⚡ Next.js 15**: Latest App Router with server components
- **📘 TypeScript**: Full type safety throughout the application
- **🎨 Tailwind CSS**: Utility-first CSS framework with custom design
- **🗄️ Prisma ORM**: Type-safe database operations with SQLite
- **🎭 shadcn/ui**: High-quality, accessible UI components
- **🎯 Framer Motion**: Production-ready animations and gestures
- **📱 Touch Support**: Native mobile touch gestures for horizontal scrolling

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd movieflix-pro

# Install dependencies
npm install

# Set up the database
npm run db:push
npm run db:generate

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Admin Access

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

**Credentials:**
- Username: `PISTA@7101`
- Password: `JAIPAL@7101`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   │   ├── login/         # Admin login
│   │   └── dashboard/     # Admin dashboard
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── content/       # Content API endpoints
│   │   └── categories/    # Category API endpoints
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── HorizontalScroll.tsx    # Swipeable horizontal scroll
│   ├── MovieCard.tsx          # Movie display card
│   ├── CategoryRow.tsx        # Category content row
│   └── ui/                   # shadcn/ui components
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities and configurations
    ├── db.ts              # Database client
    └── utils.ts           # Helper functions
```

## 🎯 Core Components

### HorizontalScroll Component
- **Touch Gestures**: Swipe left/right with momentum and fling gestures
- **Desktop Support**: Horizontal scroll with mouse wheel and click-drag
- **Visual Indicators**: Scroll buttons and fade effects at edges
- **Performance**: Virtualized scrolling for large lists

### MovieCard Component
- **Interactive Design**: Hover effects with smooth animations
- **Information Display**: Title, rating, duration, quality badges
- **Quick Actions**: Direct Telegram link access
- **Responsive Layout**: Adapts to different screen sizes

### Admin Dashboard
- **Statistics Overview**: Total movies, series, categories, and recent content
- **Content Management**: Search, filter, and manage all content
- **Quick Actions**: Add new content, manage categories
- **Real-time Updates**: Instant reflection of changes

## 🗄️ Database Schema

### Content Model
```typescript
model Content {
  id          String   @id @default(cuid())
  title       String
  description String?
  posterUrl   String?
  year        Int?
  duration    String?
  rating      Float?
  quality     Quality?  // HD, FULL_HD, FOUR_K, EIGHT_K
  telegramUrl String?
  contentType ContentType // MOVIE, WEB_SERIES
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Category Model
```typescript
model Category {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String?
  contentType ContentType
  contents    Content[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables:
     - `DATABASE_URL`: Your SQLite database URL
   - Deploy automatically on every push

### Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient accents (`oklch(0.627 0.265 303.9)`)
- **Background**: Pure black (`oklch(0 0 0)`)
- **Foreground**: Near-white (`oklch(0.985 0 0)`)
- **Cards**: Dark gray (`oklch(0.145 0 0)`)

### Typography
- **Headings**: Bold, high contrast for readability
- **Body**: Clean, legible text with proper spacing
- **UI Elements**: Consistent sizing and weight

### Animations
- **Hover Effects**: Smooth scale and transitions
- **Page Transitions**: Subtle fade and slide animations
- **Loading States**: Elegant skeleton loaders

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
```

## 📱 Mobile Features

- **Touch Gestures**: Native swipe gestures for horizontal scrolling
- **Responsive Design**: Optimized for mobile viewing
- **Performance**: Lazy loading and optimized images
- **Accessibility**: Proper touch targets and screen reader support

## 🔒 Security Features

- **Admin Authentication**: Secure login with session management
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type validation and size limits
- **Environment Variables**: Sensitive data protection

## 🌟 Future Enhancements

- **🔐 User Authentication**: NextAuth.js integration for user accounts
- **📝 Reviews & Ratings**: User review system
- **🎬 Watchlist**: Personal content watchlist
- **🔍 Advanced Search**: Filters by genre, year, rating
- **📱 Mobile App**: React Native companion app
- **🌍 Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎬 Built With

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **Framer Motion** - Animations
- **shadcn/ui** - UI components
- **SQLite** - Database

---

🎉 **Happy streaming!** Built with ❤️ for movie enthusiasts everywhere.

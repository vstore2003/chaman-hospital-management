# 🏥 Chaman Hospital Management System

A comprehensive hospital management system built with Next.js, TypeScript, and Prisma for **Chaman Hospital** located in Bahadurgarh, Patiala, India.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Admin & User roles)
- **Secure authentication** with NextAuth.js
- **Password encryption** with bcrypt
- **Session management** with JWT tokens

### 👨‍⚕️ Admin Dashboard
- **Real-time statistics** overview
- **Patient management** (Add, Edit, View, Delete)
- **Doctor management** with specializations
- **Appointment scheduling** and tracking
- **Medical records** management
- **Staff management**

### 👤 User Features
- **Patient portal** for viewing appointments
- **Medical history** access
- **Appointment booking**
- **Personal profile** management

### 📊 Data Management
- **Patient records** with complete medical information
- **Doctor profiles** with specializations and availability
- **Appointment system** with status tracking
- **Medical records** with diagnosis and treatment history
- **Department management**
- **Staff directory**

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Authentication:** NextAuth.js
- **Database:** SQLite with Prisma ORM
- **API:** Next.js API routes
- **Security:** bcrypt password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chaman-hospital-management.git
   cd chaman-hospital-management
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:8000"
   NEXTAUTH_SECRET="your-secret-key-here"
   HOSPITAL_NAME="Chaman Hospital"
   HOSPITAL_LOCATION="Bahadurgarh, Patiala, India"
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8000`

## 🔑 Demo Credentials

### Admin Access
- **Email:** admin@chaman.com
- **Password:** admin123

### User Access
- **Email:** user@chaman.com
- **Password:** user123

## 📱 Screenshots

### Homepage
![Homepage](docs/screenshots/homepage.png)

### Admin Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Patient Management
![Patients](docs/screenshots/patients.png)

### Appointments
![Appointments](docs/screenshots/appointments.png)

## 🗄️ Database Schema

The system includes the following main entities:

- **Users** - Authentication and role management
- **Patients** - Patient information and medical details
- **Doctors** - Doctor profiles and specializations
- **Appointments** - Appointment scheduling and tracking
- **Medical Records** - Patient medical history
- **Departments** - Hospital departments
- **Staff** - Hospital staff management

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio

# Other
npm run lint         # Run ESLint
```

## 🏗️ Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── scripts/
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── patients/        # Patient management
│   │   ├── appointments/    # Appointment system
│   │   └── ...
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT-based authentication**
- **Role-based access control**
- **Input validation** and sanitization
- **SQL injection protection** with Prisma
- **CSRF protection** with NextAuth.js

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Node.js:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 About Chaman Hospital

**Chaman Hospital** is located in Bahadurgarh, Patiala, Punjab, India. This management system was designed specifically to streamline hospital operations and improve patient care.

### Hospital Services
- Emergency Care (24/7)
- Specialized Treatments
- Digital Medical Records
- Cardiology
- Pediatrics
- Orthopedics
- Gynecology
- General Medicine

## 📞 Support

For support and questions, please contact:
- **Hospital:** Chaman Hospital, Bahadurgarh, Patiala, India
- **Email:** admin@chaman.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/chaman-hospital-management/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://prisma.io/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for Chaman Hospital, Bahadurgarh, Patiala, India**

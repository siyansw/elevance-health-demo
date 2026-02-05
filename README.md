# Elevance Health - Clinical Intelligence Platform

A modern, elegant demo application showcasing AI-powered automation for healthcare workflows using TinyFish AI agent orchestration.

## 🎯 Overview

This platform demonstrates two key healthcare use cases:

1. **P&T Committee Intelligence** - Automate evidence gathering for formulary decisions
2. **Prior Authorization Intelligence** - Streamline PA criteria research and clinical evidence compilation

## ✨ Features

- 🎨 Modern, sleek design with Elevance Health branding
- 🤖 AI-powered automation with real-time execution streaming
- 📊 Evidence-based insights from trusted medical sources
- ⚡ Lightning-fast execution (under 60 seconds)
- 🔒 Password-protected access
- 📱 Fully responsive design
- 🎭 Demo and Live execution modes

## 🛠 Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **AI Orchestration:** TinyFish Mino API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- TinyFish Mino API key (optional for demo mode)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd elevance-health-demo

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API keys (optional for demo mode)
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_MINO_API_KEY`
   - `VITE_MINO_API_URL`
   - `VITE_DEMO_PASSWORD`
6. Click "Deploy"

### Environment Variables for Vercel

In your Vercel project settings, add these environment variables:

```
VITE_MINO_API_KEY=your_mino_api_key
VITE_MINO_API_URL=https://api.tinyfish.ai
VITE_DEMO_PASSWORD=elevance2024
```

## 📁 Project Structure

```
elevance-health-demo/
├── src/
│   ├── components/
│   │   ├── auth/           # Login component
│   │   ├── dashboard/      # Main dashboard
│   │   ├── use-cases/      # PT Committee & Prior Auth
│   │   ├── common/         # Reusable UI components
│   │   └── modals/         # Execution modal
│   ├── lib/
│   │   ├── api.ts          # TinyFish API integration
│   │   └── types.ts        # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles with Tailwind
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── vercel.json             # Vercel configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Brand Colors

- **Primary Blue:** `#1A3673` - Main brand color
- **Light Blue:** `#44b8f3` - Accent color
- **Dark Blue:** `#0f2347` - Darker variant
- **Light Blue Variant:** `#2d4a8f` - Lighter variant

### Typography

- **Font Family:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

## 🔐 Authentication

The demo uses simple password-based authentication. In demo mode, any password will work. For production, integrate with your organization's authentication system.

## 📊 Use Cases

### 1. P&T Committee Intelligence

**Purpose:** Automate evidence gathering for formulary decisions

**Data Sources:**
- FDA Drugs@FDA database
- ClinicalTrials.gov API
- PubMed research database
- Clinical guidelines (ADA/ACC/AHA)

**Example:** Semaglutide formulary review

### 2. Prior Authorization Intelligence

**Purpose:** Research clinical criteria and streamline PA requirements

**Data Sources:**
- CMS LCD/NCD database
- Medical society guidelines (AAD, ACC, AHA)
- FDA approved indications
- Competitor payer coverage policies

**Example:** Dupixent (Dupilumab) for Atopic Dermatitis

## 🔄 Execution Modes

### Demo Mode
- Uses pre-recorded execution data
- Fast and reliable for demonstrations
- No API calls required

### Live Mode
- Makes real API calls to data sources
- Shows actual agent execution
- Requires TinyFish API key

## 🤝 Contributing

This is a demo application. For production use, consider:

- Implementing proper authentication
- Adding error handling and retry logic
- Setting up monitoring and analytics
- Implementing rate limiting
- Adding comprehensive testing

## 📝 License

This project is proprietary to Elevance Health.

## 🙋 Support

For questions or issues, contact your TinyFish account representative.

---

**Powered by TinyFish AI Agent Orchestration**

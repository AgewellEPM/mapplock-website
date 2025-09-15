# MappLock Website

Professional website for MappLock - The premier Mac application locker and kiosk mode solution.

🔒 **Live Site:** [https://mapplock.com](https://mapplock.com)

## Features

- 🎨 Modern, responsive design with purple gradient theme
- 💬 AI-powered chatbot for customer support
- 🎮 Interactive demo showing lock functionality
- 💳 Integrated Stripe checkout
- 📱 100% mobile responsive
- ✨ Smooth animations and parallax effects

## Quick Start

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/mapplock-website.git
cd mapplock-website

# Navigate to the app directory
cd applock-website

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

## CLI Commands

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Deploy to GitHub Pages
npm run deploy

# Deploy to custom domain
npm run deploy:prod
```

## Project Structure

```
applock-website/
├── src/
│   ├── app/
│   │   ├── home/                 # Main landing page
│   │   ├── ai-chatbot/           # AI assistant component
│   │   ├── interactive-demo/     # Live demo component
│   │   ├── checkout-modal/       # Stripe checkout
│   │   └── app.ts                # Root component
│   ├── assets/
│   │   └── applock-knowledge.md  # AI chatbot knowledge base
│   └── index.html                 # Main HTML file
├── angular.json                   # Angular configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

## Deployment

### Deploy to GitHub Pages

1. Build the production version:
```bash
npm run build -- --base-href=/mapplock-website/
```

2. Install GitHub Pages package:
```bash
npm install -g angular-cli-ghpages
```

3. Deploy:
```bash
npx angular-cli-ghpages --dir=dist/applock-website
```

### Deploy to Custom Domain (mapplock.com)

1. Build for production:
```bash
npm run build
```

2. Deploy to your hosting provider (Netlify, Vercel, etc.)

### Using GitHub Actions (Automated)

The repository includes GitHub Actions workflow for automatic deployment on push to main branch.

## Environment Setup

Create a `.env` file in the root directory:

```env
STRIPE_PUBLIC_KEY=your_stripe_public_key
OPENAI_API_KEY=your_openai_api_key_for_chatbot
```

## Technologies Used

- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Advanced animations and gradients
- **Stripe.js** - Payment processing
- **GitHub Actions** - CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

- Website: [https://mapplock.com](https://mapplock.com)
- Email: support@mapplock.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

Built with ❤️ for the Mac community
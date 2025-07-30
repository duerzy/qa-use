![qa use](/static/qa-use-banner.png)

**AI-Powered E2E Testing Platform** ✨

> A comprehensive, production-ready QA testing solution powered by BrowserUse AI agents. Automate your web application testing with intelligent agents that think, act, and validate like human testers—but faster, more consistently, and around the clock.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com) [![BrowserUse](https://img.shields.io/badge/BrowserUse-Integrated-green)](https://browser-use.com) [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://typescriptlang.org)

<p align="center">
  <img src="media/run.png" alt="Test Run in Progress" width="600px">
  <img src="media/editor.png" alt="Test Run in Progress" width="600px">
</p>

## 🚀 Quick Start Guide

### Prerequisites

- 🐳 **Docker** & Docker Compose installed
- 🔑 **BrowserUse API Key** (get yours at [cloud.browser-use.com](https://cloud.browser-use.com/billing))
- 📧 **Resend API Key** (optional, for email notifications)

### ⚡ 3-Step Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/browser-use/qa-use.git
cd qa-use

# 2️⃣ Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# 3️⃣ Launch the platform
docker compose up
```

## ✨ Key Features & Highlights

1. 🤖 **AI-Powered Testing Engine** - Leverages BrowserUse to evaluate test cases in plain English.
1. 🎯 **Advanced Test Management** - Organize tests into suites and run multiple tests in parallel.
1. ⏰ **Automated Scheduling & Monitoring** - Configure suites to run hourly or daily automatically.
1. 📧 **Smart Notifications** - Get an email notification when a test suite fails.

🎉 **That's it!** Visit [http://localhost:3000](http://localhost:3000) to start creating your first test suite.

### 🔧 Environment Variables

Create a `.env` file with the following:

```env
# Required: BrowserUse API Integration
BROWSER_USE_API_KEY=your_browseruse_api_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/qa-use

# Optional: Email Notifications
RESEND_API_KEY=your_resend_api_key_here

# Optional: Inngest Configuration (for production)
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_BASE_URL=http://inngest:8288
```

<p align="center">
  <img src="media/suite.png" alt="Test Suite Interface" width="600px">
</p>

## 💡 How It Works

### 🎯 **Intelligent Test Execution**

1. **Define Your Test**: Write test steps in natural language

   ```
   Steps:
   1. Go to example.com
   2. Click the search button
   3. Type "laptop" in the search field
   4. Press enter and wait for results

   Success Criteria:
   The page should show at least 3 laptop search results
   ```

2. **AI Agent Takes Over**: BrowserUse AI agents execute your test
   - Navigate to pages like a human user
   - Interact with elements intelligently
   - Handle unexpected popups and dialogs
   - Adapt to layout changes and dynamic content

3. **Smart Validation**: AI evaluates results against your criteria
   - Checks final page state precisely
   - Compares actual vs. expected outcomes
   - Provides detailed pass/fail reports
   - Captures screenshots and recordings

## 🤝 Contributing

We welcome contributions! This project showcases the full capabilities of BrowserUse and serves as a reference implementation for AI-powered testing platforms.

### Development Setup

```bash
# Start development environment
docker compose -f docker-compose.dev.yaml up --watch

# Run type checking
pnpm run test:types
```

## 📚 Resources & Links

- 🤖 **[BrowserUse Documentation](https://docs.browser-use.com)** - Learn about AI browser automation
- 🌐 **[BrowserUse Cloud](https://cloud.browser-use.com)** - Try BrowserUse in your browser
- 📧 **[Resend Documentation](https://resend.com/docs)** - Email integration guide
- ⚡ **[Inngest Documentation](https://inngest.com/docs)** - Background job processing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by the BrowserUse team**

[⭐ Star on GitHub](https://github.com/browser-use/qa-use) • [🐛 Report Bug](https://github.com/browser-use/qa-use/issues) • [💡 Request Feature](https://github.com/browser-use/qa-use/issues)

</div>

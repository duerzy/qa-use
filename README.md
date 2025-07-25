# 🎯 Use QA

**AI-Powered E2E Testing Platform** ✨

> A comprehensive, production-ready QA testing solution powered by BrowserUse AI agents. Automate your web application testing with intelligent agents that think, act, and validate like human testers—but faster, more consistently, and around the clock.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com) [![BrowserUse](https://img.shields.io/badge/BrowserUse-Integrated-green)](https://browser-use.com) [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://typescriptlang.org)

<p align="center">
  <img src="media/run.png" alt="Test Run in Progress" width="600px">
</p>

## ✨ Key Features & Highlights

### 🤖 **AI-Powered Testing Engine**

- **Intelligent Agents**: Leverages BrowserUse with GPT-4o/o3 models for human-like testing
- **Natural Language Tests**: Write test cases in plain English—no complex selectors needed
- **Smart Evaluation**: AI agents validate end states against success criteria with precision
- **Adaptive Execution**: Handles dynamic content, popups, and unexpected UI changes

### 🎯 **Advanced Test Management**

- **Test Suites**: Organize related tests into logical groups by domain or feature
- **Step-by-Step Definitions**: Break down complex user journeys into clear, actionable steps
- **Visual Test Editor**: Intuitive interface for creating and managing test scenarios
- **Flexible Evaluation**: Define custom success criteria for any testing scenario

### ⏰ **Automated Scheduling & Monitoring**

- **Cron Integration**: Schedule test runs hourly, daily, or on custom intervals
- **Real-time Execution**: Watch your tests run live with detailed step-by-step progress
- **Complete Audit Trail**: Full history of all test runs with timestamps and results
- **Status Tracking**: Monitor test suite health with comprehensive dashboards

### 📧 **Smart Notifications**

- **Instant Alerts**: Get notified immediately when tests fail via email
- **Failure Details**: Receive detailed error reports with context and screenshots
- **Team Collaboration**: Share test results and failures with your entire team
- **Customizable Recipients**: Configure notifications per test suite

### 🛡️ **Enterprise-Grade Security**

- **Domain Restrictions**: Limit AI agents to specific allowed domains
- **Proxy Support**: Built-in proxy integration for secure testing
- **Ad Blocker**: Clean testing environment without distractions
- **Encrypted Storage**: Secure handling of sensitive test data

## 🚀 Quick Start Guide

### Prerequisites

- 🐳 **Docker** & Docker Compose installed
- 🔑 **BrowserUse API Key** (get yours at [browser-use.com](https://browser-use.com))
- 📧 **Resend API Key** (optional, for email notifications)

### ⚡ 3-Step Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/browser-use/use-qa.git
cd use-qa

# 2️⃣ Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# 3️⃣ Launch the platform
docker compose up
```

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

### 🔄 **Automated Workflows**

- **Continuous Monitoring**: Schedule tests to run automatically
- **Failure Detection**: Instant alerts when something breaks
- **Historical Analysis**: Track test reliability over time
- **Team Notifications**: Keep everyone informed of system health

## 🎯 Perfect Use Cases

### 🛒 **E-Commerce Testing**

- Product search and filtering
- Shopping cart functionality
- Checkout process validation
- User account management

### 📊 **SaaS Application Testing**

- User onboarding flows
- Feature functionality checks
- Integration testing
- Performance monitoring

### 🏢 **Enterprise Workflows**

- Critical business processes
- Compliance validation
- Multi-step form submissions
- Dashboard and reporting features

### 🔄 **Regression Testing**

- Pre-deployment validation
- Release confidence checks
- Cross-browser compatibility
- Mobile responsiveness testing

## 🚀 Getting Started with Your First Test

### 1. **Create a Test Suite**

- Navigate to the dashboard
- Click "Create Suite"
- Set your application domain (e.g., `example.com`)
- Configure notification preferences

### 2. **Add Your First Test**

- Click "Add Test" in your suite
- Write a descriptive test name
- Add step-by-step instructions
- Define success criteria

### 3. **Run and Monitor**

- Hit "Run Test" to execute immediately
- Watch the live execution in real-time
- Review results and recordings
- Set up automated scheduling

### 4. **Scale Your Testing**

- Add more tests to your suite
- Configure cron schedules
- Set up team notifications
- Monitor long-term trends

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

[⭐ Star on GitHub](https://github.com/browser-use/use-qa) • [🐛 Report Bug](https://github.com/browser-use/use-qa/issues) • [💡 Request Feature](https://github.com/browser-use/use-qa/issues)

</div>

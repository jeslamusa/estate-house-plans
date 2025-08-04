#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

class AutoDeployer {
  constructor() {
    this.projectName = 'estate-house-plans';
    this.githubUsername = 'jeslamusa';
    this.backendUrl = '';
    this.frontendUrl = '';
    this.databaseUrl = '';
  }

  async start() {
    console.log(`${colors.bright}${colors.cyan}🚀 Estate House Plans - Automated Deployment${colors.reset}`);
    console.log(`${colors.cyan}==============================================${colors.reset}\n`);

    try {
      await this.checkPrerequisites();
      await this.prepareCode();
      await this.setupDatabase();
      await this.deployBackend();
      await this.deployFrontend();
      await this.finalize();
    } catch (error) {
      log.error(`Deployment failed: ${error.message}`);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  async checkPrerequisites() {
    log.step('Step 1: Checking Prerequisites');

    // Check if git is installed
    try {
      execSync('git --version', { stdio: 'pipe' });
      log.success('Git is installed');
    } catch {
      throw new Error('Git is not installed. Please install Git first.');
    }

    // Check if we're in a git repository
    if (!fs.existsSync('.git')) {
      throw new Error('Not in a git repository. Please run this from your project root.');
    }

    // Check if we're on the right branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main') {
      log.warning(`Currently on branch: ${currentBranch}. Consider switching to main.`);
    }

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log.warning('You have uncommitted changes. Committing them now...');
      execSync('git add .');
      execSync('git commit -m "Auto-deploy: Prepare for deployment"');
      log.success('Changes committed');
    }

    log.success('Prerequisites check completed');
  }

  async prepareCode() {
    log.step('Step 2: Preparing Code for Deployment');

    // Check and install dependencies
    if (!fs.existsSync('backend/node_modules')) {
      log.info('Installing backend dependencies...');
      execSync('cd backend && npm install', { stdio: 'inherit' });
    }

    if (!fs.existsSync('frontend/node_modules')) {
      log.info('Installing frontend dependencies...');
      execSync('cd frontend && npm install', { stdio: 'inherit' });
    }

    // Test frontend build
    log.info('Testing frontend build...');
    execSync('cd frontend && npm run build', { stdio: 'inherit' });
    log.success('Frontend build successful');

    // Push to GitHub
    log.info('Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    log.success('Code pushed to GitHub');

    log.success('Code preparation completed');
  }

  async setupDatabase() {
    log.step('Step 3: Database Setup (Free Options)');

    console.log(`\n${colors.yellow}📊 Database Setup - Choose Your Free Option:${colors.reset}`);
    console.log('');
    console.log('Option 1: Railway (Recommended)');
    console.log('1. Go to https://railway.app/');
    console.log('2. Sign up with GitHub (free)');
    console.log('3. Create new project');
    console.log('4. Add MySQL database');
    console.log('5. Get connection string');
    console.log('');
    console.log('Option 2: Supabase (PostgreSQL)');
    console.log('1. Go to https://supabase.com/');
    console.log('2. Sign up for free account');
    console.log('3. Create new project');
    console.log('4. Get connection string');
    console.log('');
    console.log('Option 3: Neon (PostgreSQL)');
    console.log('1. Go to https://neon.tech/');
    console.log('2. Sign up for free account');
    console.log('3. Create new database');
    console.log('4. Get connection string');
    console.log('');

    const databaseChoice = await question('Which database service would you like to use? (1/2/3): ');
    
    let databaseInstructions = '';
    switch(databaseChoice) {
      case '1':
        databaseInstructions = 'Railway MySQL';
        break;
      case '2':
        databaseInstructions = 'Supabase PostgreSQL';
        break;
      case '3':
        databaseInstructions = 'Neon PostgreSQL';
        break;
      default:
        databaseInstructions = 'Railway MySQL';
    }

    console.log(`\n${colors.cyan}Setting up ${databaseInstructions}...${colors.reset}`);
    console.log('Please get your connection string from your chosen service.');

    this.databaseUrl = await question('\nEnter your database connection string: ');

    if (!this.databaseUrl.includes('://')) {
      throw new Error('Invalid database connection string. Should include protocol (mysql:// or postgresql://)');
    }

    log.success('Database connection string saved');
  }

  async deployBackend() {
    log.step('Step 4: Backend Deployment (Render)');

    console.log(`\n${colors.yellow}⚙️ Backend Deployment Required:${colors.reset}`);
    console.log('1. Go to https://render.com/');
    console.log('2. Sign up with GitHub');
    console.log('3. Click "New +" → "Web Service"');
    console.log('4. Connect repository: jeslamusa/estate-house-plans');
    console.log('5. Configure:');
    console.log('   - Name: estate-house-plans-backend');
    console.log('   - Build Command: cd backend && npm install');
    console.log('   - Start Command: cd backend && npm start');

    console.log('\n6. Add these environment variables:');
    console.log(`   - NODE_ENV=production`);
    console.log(`   - PORT=10000`);
    console.log(`   - JWT_SECRET=estate-house-plans-secret-key-2024`);
    console.log(`   - DATABASE_URL=${this.databaseUrl}`);

    await question('\nPress Enter when you\'ve created the Render service...');

    this.backendUrl = await question('Enter your Render backend URL (e.g., https://estate-house-plans-backend.onrender.com): ');

    // Test backend
    log.info('Testing backend connection...');
    try {
      const response = await fetch(`${this.backendUrl}/api/health`);
      if (response.ok) {
        log.success('Backend is responding');
      } else {
        log.warning('Backend might not be ready yet. Continuing...');
      }
    } catch (error) {
      log.warning('Backend not accessible yet. This is normal during deployment.');
    }

    log.success('Backend deployment initiated');
  }

  async deployFrontend() {
    log.step('Step 5: Frontend Deployment (Vercel)');

    console.log(`\n${colors.yellow}🎨 Frontend Deployment Required:${colors.reset}`);
    console.log('1. Go to https://vercel.com/');
    console.log('2. Sign up with GitHub');
    console.log('3. Click "New Project"');
    console.log('4. Import repository: jeslamusa/estate-house-plans');
    console.log('5. Configure:');
    console.log('   - Framework: Vite');
    console.log('   - Root Directory: frontend');
    console.log('   - Build Command: npm run build');
    console.log('   - Output Directory: dist');

    console.log('\n6. Add this environment variable:');
    console.log(`   - VITE_API_URL=${this.backendUrl}/api`);

    await question('\nPress Enter when you\'ve created the Vercel project...');

    this.frontendUrl = await question('Enter your Vercel frontend URL (e.g., https://estate-house-plans.vercel.app): ');

    log.success('Frontend deployment initiated');
  }

  async finalize() {
    log.step('Step 6: Finalizing Deployment');

    // Create deployment summary
    const summary = `
🎉 DEPLOYMENT SUMMARY
====================

✅ Code Status: Deployed to GitHub
✅ Database: PlanetScale configured
✅ Backend: Render deployment initiated
✅ Frontend: Vercel deployment initiated

🔗 Your URLs:
- Frontend: ${this.frontendUrl}
- Backend: ${this.backendUrl}
- Admin Panel: ${this.frontendUrl}/admin

🔑 Admin Access:
- Email: admin@estateplans.com
- Password: admin123

📋 Next Steps:
1. Wait for deployments to complete (5-10 minutes)
2. Test your backend: ${this.backendUrl}/api/health
3. Test your frontend: ${this.frontendUrl}
4. Access admin panel: ${this.frontendUrl}/admin

🚨 If you encounter issues:
- Check deployment logs in Render/Vercel dashboards
- Verify environment variables are set correctly
- Test database connectivity

🎯 Your estate house plans application will be live soon!
`;

    console.log(summary);

    // Save deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      backendUrl: this.backendUrl,
      frontendUrl: this.frontendUrl,
      databaseUrl: this.databaseUrl.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      status: 'deployment_initiated'
    };

    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    log.success('Deployment information saved to deployment-info.json');

    log.success('Automated deployment process completed!');
  }
}

// Run the automated deployment
if (require.main === module) {
  const deployer = new AutoDeployer();
  deployer.start().catch(console.error);
}

module.exports = AutoDeployer; 
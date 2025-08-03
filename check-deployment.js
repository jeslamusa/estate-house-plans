#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`)
};

class DeploymentChecker {
  constructor() {
    this.deploymentInfo = this.loadDeploymentInfo();
  }

  loadDeploymentInfo() {
    try {
      if (fs.existsSync('deployment-info.json')) {
        return JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
      }
    } catch (error) {
      log.error('Could not load deployment info');
    }
    return null;
  }

  async checkUrl(url, description) {
    return new Promise((resolve) => {
      const req = https.get(url, (res) => {
        if (res.statusCode === 200) {
          log.success(`${description}: ✅ Online`);
          resolve(true);
        } else {
          log.warning(`${description}: ⚠️ Status ${res.statusCode}`);
          resolve(false);
        }
      });

      req.on('error', (error) => {
        log.error(`${description}: ❌ Offline - ${error.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        log.error(`${description}: ❌ Timeout`);
        req.destroy();
        resolve(false);
      });
    });
  }

  async checkBackend() {
    if (!this.deploymentInfo?.backendUrl) {
      log.warning('Backend URL not found in deployment info');
      return;
    }

    log.info('Checking backend status...');
    const isOnline = await this.checkUrl(
      `${this.deploymentInfo.backendUrl}/api/health`,
      'Backend API'
    );

    if (isOnline) {
      log.info('Backend is responding correctly');
    } else {
      log.warning('Backend might still be deploying or have issues');
    }
  }

  async checkFrontend() {
    if (!this.deploymentInfo?.frontendUrl) {
      log.warning('Frontend URL not found in deployment info');
      return;
    }

    log.info('Checking frontend status...');
    const isOnline = await this.checkUrl(
      this.deploymentInfo.frontendUrl,
      'Frontend Website'
    );

    if (isOnline) {
      log.info('Frontend is accessible');
    } else {
      log.warning('Frontend might still be deploying or have issues');
    }
  }

  async checkAdminPanel() {
    if (!this.deploymentInfo?.frontendUrl) {
      log.warning('Frontend URL not found in deployment info');
      return;
    }

    log.info('Checking admin panel...');
    const isOnline = await this.checkUrl(
      `${this.deploymentInfo.frontendUrl}/admin`,
      'Admin Panel'
    );

    if (isOnline) {
      log.success('Admin panel is accessible');
      log.info('You can login with: admin@estateplans.com / admin123');
    } else {
      log.warning('Admin panel might not be ready yet');
    }
  }

  showDeploymentInfo() {
    if (!this.deploymentInfo) {
      log.error('No deployment information found. Run auto-deploy.js first.');
      return;
    }

    console.log(`\n${colors.cyan}📊 Deployment Information:${colors.reset}`);
    console.log(`Timestamp: ${this.deploymentInfo.timestamp}`);
    console.log(`Status: ${this.deploymentInfo.status}`);
    console.log(`Backend: ${this.deploymentInfo.backendUrl || 'Not set'}`);
    console.log(`Frontend: ${this.deploymentInfo.frontendUrl || 'Not set'}`);
    console.log(`Database: ${this.deploymentInfo.databaseUrl ? 'Configured' : 'Not set'}`);
  }

  async run() {
    console.log(`${colors.cyan}🔍 Estate House Plans - Deployment Status Checker${colors.reset}`);
    console.log(`${colors.cyan}==============================================${colors.reset}\n`);

    this.showDeploymentInfo();

    if (!this.deploymentInfo) {
      return;
    }

    console.log(`\n${colors.cyan}🌐 Checking Service Status:${colors.reset}\n`);

    await this.checkBackend();
    await this.checkFrontend();
    await this.checkAdminPanel();

    console.log(`\n${colors.cyan}📋 Summary:${colors.reset}`);
    console.log('If all services show ✅ Online, your deployment is complete!');
    console.log('If any service shows ❌ Offline, it might still be deploying.');
    console.log('Wait 5-10 minutes and run this check again.');
  }
}

// Run the checker
if (require.main === module) {
  const checker = new DeploymentChecker();
  checker.run().catch(console.error);
}

module.exports = DeploymentChecker; 
# Tutorbuddy Deployment Guide

## 🚀 Automated CI/CD Pipeline

Your deployment process is now fully automated! Here's how it works:

### Automatic Deployment (Recommended)

1. **Push to Main Branch**: When you or your teammates push code to the `main` branch, the CI/CD pipeline automatically:
   - Runs all tests (linting, type checking, build)
   - If tests pass, deploys to production
   - Restarts the PM2 process

2. **Pull Request Workflow**: When a PR is created against `main`:
   - Runs all tests to ensure code quality
   - Does NOT deploy (only tests)

### Manual Deployment

You can also trigger manual deployments using the GitHub Actions UI:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Production Deployment" workflow
4. Click "Run workflow"
5. Choose environment and click "Run workflow"

### Manual Server Deployment

If you need to deploy manually on the server:

```bash
# Navigate to your project directory
cd /home/tutorbuddy/htdocs/tutorbuddy.co/Tutorbuddy

# Run the deployment script
./scripts/deploy.sh

# Or skip tests for quick deployment
./scripts/deploy.sh --skip-tests
```

## 📋 What the Pipeline Does

### Testing Phase
- ✅ **Linting**: Runs `npm run lint` to check code style
- ✅ **Type Checking**: Runs `npx tsc --noEmit` to verify TypeScript
- ✅ **Build**: Runs `npm run build` to ensure the app builds successfully

### Deployment Phase
- 🔄 **Backup**: Creates a backup of the current deployment
- 📥 **Pull Code**: Fetches latest code from main branch
- 📦 **Install Dependencies**: Runs `npm ci` for clean install
- 🧪 **Run Tests**: Re-runs all tests on the server
- 🔨 **Build**: Builds the application
- 🔄 **Restart**: Restarts PM2 process
- ✅ **Health Check**: Verifies the application is running

### Rollback
- If deployment fails, the pipeline automatically rolls back to the previous version
- Manual rollback is also available in the deployment script

## 🔧 Configuration

### Required GitHub Secrets

Make sure these secrets are set in your GitHub repository settings:

- `SSH_KEY`: Your private SSH key for server access
- `SERVER_HOST`: Your server's IP address or domain
- `SERVER_USER`: SSH username (e.g., `tutorbuddy`)

### PM2 Configuration

The deployment uses your existing `ecosystem.config.js` file. The process name is `tutorbuddy`.

## 🛠️ Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify your SSH key is correct in GitHub secrets
   - Check server host and username
   - Ensure the SSH key has proper permissions

2. **Build Failed**
   - Check the build logs in GitHub Actions
   - Verify all dependencies are properly installed
   - Check for TypeScript errors

3. **PM2 Process Not Starting**
   - Check PM2 logs: `pm2 logs tutorbuddy`
   - Verify the ecosystem.config.js file
   - Check if port 3000 is available

### Useful Commands

```bash
# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs tutorbuddy

# Restart PM2 process manually
pm2 restart tutorbuddy

# Check application health
curl http://localhost:3000

# View deployment script help
./scripts/deploy.sh --help
```

## 📊 Monitoring

### GitHub Actions
- Monitor deployments in the "Actions" tab
- View detailed logs for each step
- Set up notifications for deployment status

### Server Monitoring
- PM2 provides process monitoring
- Logs are stored in the `logs/` directory
- Use `pm2 monit` for real-time monitoring

## 🔒 Security Notes

- SSH keys are stored securely in GitHub secrets
- The deployment script includes error handling and rollback
- All sensitive data should be in environment variables
- Regular backups are created before each deployment

## 🎯 Best Practices

1. **Always test on a branch before merging to main**
2. **Review PRs before merging**
3. **Monitor deployments and logs**
4. **Keep dependencies updated**
5. **Use semantic versioning for releases**

---

**Happy deploying! 🚀** 
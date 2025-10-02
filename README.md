
# Advocates Exam Trainer

A React-based application for training legal advocates with exam simulations.

## Local Development

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation and Running
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Available Scripts
``` bash
npm start    # Run development server
npm build    # Build for production
npm test     # Run tests
npm eject    # Eject from Create React App (irreversible)
```
## Deployment Options
### Option 1: GitHub + Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Vercel will automatically deploy on every push to main branch

### Option 2: AWS EC2 Ubuntu Deployment
#### Prerequisites
- AWS EC2 Ubuntu instance (t2.micro or higher)
- Security group allowing HTTP (port 80) and HTTPS (port 443) traffic
- SSH access to your EC2 instance

#### Step-by-step Deployment
1. **Connect to your EC2 instance:**
``` bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
```
1. **Install Node.js and npm:**
``` bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
```
1. **Install PM2 (Process Manager):**
``` bash
   sudo npm install -g pm2
```
1. **Install and configure Nginx:**
``` bash
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
```
1. **Clone and build your application:**
``` bash
   # Clone your repository
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   
   # Install dependencies
   npm install
   
   # Build the application
   npm run build
```
1. **Install serve to serve static files:**
``` bash
   sudo npm install -g serve
```
1. **Start the application with PM2:**
``` bash
   # Start the app on port 3000
   pm2 start "serve -s build -l 3000" --name "exam-trainer"
   
   # Save PM2 process list and startup script
   pm2 save
   pm2 startup
```
1. **Configure Nginx as reverse proxy:**
``` bash
   sudo nano /etc/nginx/sites-available/exam-trainer
```
Add the following configuration:
``` nginx
   server {
       listen 80;
       server_name your-domain.com your-ec2-ip;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
```
1. **Enable the site and restart Nginx:**
``` bash
   sudo ln -s /etc/nginx/sites-available/exam-trainer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
```
1. **Optional: Set up SSL with Let's Encrypt:**
``` bash
    # Install Certbot
    sudo apt install snapd -y
    sudo snap install core; sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -s /snap/bin/certbot /usr/bin/certbot
    
    # Get SSL certificate
    sudo certbot --nginx -d your-domain.com
```
1. **Set up automatic deployments (optional):**
``` bash
    # Create deployment script
    nano deploy.sh
```
Add the following content:
``` bash
    #!/bin/bash
    cd /home/ubuntu/your-repo-name
    git pull origin main
    npm install
    npm run build
    pm2 restart exam-trainer
```
Make it executable:
``` bash
    chmod +x deploy.sh
```
#### Managing the Application
``` bash
# View application status
pm2 status

# View logs
pm2 logs exam-trainer

# Restart application
pm2 restart exam-trainer

# Stop application
pm2 stop exam-trainer

# Monitor application
pm2 monit
```
Your application will be accessible at `http://your-ec2-ip` or your domain name if configured with SSL.
## Tech Stack
- React 18.3.1
- React Router DOM 7.1.2
- Create React App
- Sass for styling
- Various UI and utility libraries

## Project Structure
``` 
src/
├── App.jsx          # Main application component
├── TestRunner.jsx   # Test execution component
├── Results.jsx      # Results display component
├── main.jsx         # Application entry point
└── styles.css       # Global styles
```
``` 


The README has been updated to:

1. **Match the actual codebase** - Uses Create React App (not Vite) with correct npm scripts
2. **Include comprehensive AWS EC2 deployment steps** with:
   - Ubuntu server setup
   - Node.js and npm installation
   - PM2 process management
   - Nginx reverse proxy configuration
   - Optional SSL setup with Let's Encrypt
   - Deployment automation scripts
3. **Provide clear local development instructions**
4. **Include both Vercel and EC2 deployment options**
5. **Add project structure and tech stack information**

The EC2 deployment guide includes security best practices like using PM2 for process management and Nginx as a reverse proxy, which is the recommended approach for production React applications.
```

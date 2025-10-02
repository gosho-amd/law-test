```markdown
# Advocates Exam Trainer

A React-based application for training legal advocates with exam simulations.

## Local Development

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation and Running
```
bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
### Available Scripts
```
bash
npm run dev      # Run development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```
## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Vercel will automatically deploy on every push to main branch

### Option 2: Netlify
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Build Command: `npm run build`
4. Publish Directory: `dist`

### Option 3: AWS EC2 Ubuntu Deployment

#### Prerequisites
- AWS EC2 Ubuntu instance (t2.micro or higher)
- Security group allowing HTTP (port 80) and HTTPS (port 443) traffic
- SSH access to your EC2 instance

#### Step-by-step Deployment
1. **Connect to your EC2 instance:**
```
bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```
2. **Install Node.js and npm:**
```
bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```
3. **Install PM2 (Process Manager):**
```
bash
sudo npm install -g pm2
```
4. **Install and configure Nginx:**
```
bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```
5. **Clone and build your application:**
```
bash
# Clone your repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Build the application
npm run build
```
6. **Install serve to serve static files:**
```
bash
sudo npm install -g serve
```
7. **Start the application with PM2:**
```
bash
# Start the app on port 3000 (serving the dist folder created by Vite)
pm2 start "serve -s dist -l 3000" --name "exam-trainer"

# Save PM2 process list and startup script
pm2 save
pm2 startup
```
8. **Configure Nginx as reverse proxy:**
```
bash
sudo nano /etc/nginx/sites-available/exam-trainer
```
Add the following configuration:
```
nginx
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
9. **Enable the site and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/exam-trainer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
```


10. **Optional: Set up SSL with Let's Encrypt:**
```shell script
# Install Certbot
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```


11. **Set up automatic deployments (optional):**
```shell script
# Create deployment script
nano deploy.sh
```

Add the following content:
```shell script
#!/bin/bash
cd /home/ubuntu/your-repo-name
git pull origin main
npm install
npm run build
pm2 restart exam-trainer
```

Make it executable:
```shell script
chmod +x deploy.sh
```


#### Managing the Application
```shell script
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
- React 18.2.0
- React Router DOM 6.23.0
- Vite 5.0.0 (Build tool)
- Modern JavaScript/ES6+

## Project Structure
```
law-test/
├── public/
│   └── all_tests.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── Results.jsx
│   ├── styles.css
│   └── TestRunner.jsx
├── index.html
├── package.json
├── vite.config.js
└── ...
```


## Development Notes
- This project uses Vite as the build tool for fast development and optimized production builds
- The development server runs on `http://localhost:5173` by default
- Production builds are output to the `dist/` directory
- Hot Module Replacement (HMR) is enabled for fast development iterations
```
The key changes made to reflect using Vite:

1. **Scripts section**: Updated to show the correct Vite scripts (`npm run dev`, `npm run build`, `npm run preview`)
2. **Output directory**: Changed from `build` to `dist` (Vite's default output directory)
3. **Tech stack**: Updated to mention Vite 5.0.0 as the build tool
4. **Development notes**: Added section explaining Vite-specific details like default port and HMR
5. **Deployment instructions**: Updated to reference the `dist` folder instead of `build` folder
6. **Prerequisites**: Updated Node.js version requirement to 16+ (Vite requirement)
```

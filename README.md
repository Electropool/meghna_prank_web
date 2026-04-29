# Meghna Meme Web 🚀

A fun, interactive prank website featuring floating meme stickers and a very tempting central button.

## 🎯 Features
- **Central Prank Button**: High-quality 3D assets with random playback speeds.
- **DVD Bouncing Stickers**: 12 stickers distributed across the whole screen.
- **Discord Community**: Direct link to the community at the bottom-left.
- **Responsive Design**: Optimized for PC, Laptop, and Chrome Mobile.
- **Performance**: GPU-accelerated animations for 60fps smoothness.

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 VPS Hosting Guide (The "Professional" Way)

If you want to host this on a VPS (Ubuntu/Debian) and make it accessible via Chrome/Mobile:

### 1. Prepare the VPS
Connect to your VPS and install Nginx:
```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Build the Project
On your local machine or VPS, run:
```bash
npm run build
```
This creates a `dist/` folder. This is the **only** folder you need to host.

### 3. Deploy to VPS
Copy the contents of the `dist/` folder to `/var/www/meghna`:
```bash
sudo mkdir -p /var/www/meghna
sudo cp -r dist/* /var/www/meghna/
sudo chown -R www-data:www-data /var/www/meghna
```

### 4. Configure Nginx
Create a new Nginx config:
```bash
sudo nano /etc/nginx/sites-available/meghna
```
Paste this configuration (Replace `yourdomain.com` with your IP or domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/meghna;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/meghna /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Cloudflare Tunnel Setup (Recommended)
This is the easiest way to get an SSL (HTTPS) and avoid firewall issues.

1. **Install cloudflared** on your VPS:
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```
2. **Authenticate**:
   ```bash
   cloudflared tunnel login
   ```
3. **Create Tunnel**:
   ```bash
   cloudflared tunnel create meghna-prank
   ```
4. **Route Traffic**:
   Replace `your-tunnel-id` and `yourdomain.com`:
   ```bash
   cloudflared tunnel route dns meghna-prank yourdomain.com
   ```
5. **Run Tunnel**:
   ```bash
   cloudflared tunnel run --url http://localhost:80 meghna-prank
   ```

---

## ❓ Troubleshooting Common Issues

### "I can't see the images on mobile"
- **Cause**: Pathing or mixed-content issues.
- **Fix**: Ensure you are using **HTTPS** (Cloudflare handles this). The app uses relative paths `/assets/` which are served correctly by Nginx.

### "The button is still oval"
- **Fix**: I have enforced `aspect-ratio: 1/1` in `index.css`. If it still looks oval, clear your browser cache (Ctrl+F5).

### "Sound doesn't play"
- **Fix**: Chrome mobile requires a "User Gesture" (click) to play audio. The sound will play as soon as you click the button for the first time.

---
Built with ❤️ by Antigravity

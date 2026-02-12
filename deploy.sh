#!/bin/bash
# =================================================================
# MyHouz — Script de déploiement pour serveur Contabo (VPS)
# =================================================================
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [setup|deploy|ssl|backup|logs|status]
# =================================================================

set -e

# Configuration
APP_DIR="/opt/myhouz"
REPO_URL="https://github.com/kiyaladev/myhouz.git"
BRANCH="main"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[MyHouz]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- Initial server setup ----
setup() {
  log "Setting up Contabo server..."

  # Update system
  sudo apt-get update && sudo apt-get upgrade -y

  # Install Docker
  if ! command -v docker &>/dev/null; then
    log "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    log "Docker installed. Please log out and back in, then re-run this script."
    exit 0
  fi

  # Install Docker Compose plugin
  if ! docker compose version &>/dev/null; then
    log "Installing Docker Compose plugin..."
    sudo apt-get install -y docker-compose-plugin
  fi

  # Create app directory
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"

  # Clone repository
  if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
  fi

  # Create .env.production if not exists
  if [ ! -f "$APP_DIR/$ENV_FILE" ]; then
    log "Creating environment file..."
    cat > "$APP_DIR/$ENV_FILE" << 'ENVEOF'
# MyHouz Production Environment
# Fill in all values before deploying

# Domain
DOMAIN=myhouz.example.com

# MongoDB
MONGO_USER=myhouz
MONGO_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# MinIO (S3 storage)
MINIO_ACCESS_KEY=CHANGE_ME_MINIO_KEY
MINIO_SECRET_KEY=CHANGE_ME_MINIO_SECRET

# JWT
JWT_SECRET=CHANGE_ME_JWT_SECRET_64_CHARS_MIN

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@myhouz.com
ENVEOF
    warn "Please edit $APP_DIR/$ENV_FILE with your actual values!"
  fi

  # Create SSL directory
  mkdir -p "$APP_DIR/nginx/ssl"

  # Setup firewall
  log "Configuring firewall..."
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
  sudo ufw --force enable

  log "Setup complete! Next steps:"
  echo "  1. Edit $APP_DIR/$ENV_FILE"
  echo "  2. Run: ./deploy.sh ssl"
  echo "  3. Run: ./deploy.sh deploy"
}

# ---- SSL with Let's Encrypt ----
ssl() {
  cd "$APP_DIR"
  source "$ENV_FILE"

  if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "myhouz.example.com" ]; then
    error "Please set your DOMAIN in $ENV_FILE first"
  fi

  log "Setting up SSL for $DOMAIN..."

  # Install certbot
  sudo apt-get install -y certbot

  # Get certificate (standalone mode, stop nginx first if running)
  docker compose -f "$COMPOSE_FILE" stop nginx 2>/dev/null || true

  sudo certbot certonly --standalone \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "admin@$DOMAIN" \
    --cert-path "$APP_DIR/nginx/ssl/"

  # Copy certs
  sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$APP_DIR/nginx/ssl/"
  sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$APP_DIR/nginx/ssl/"
  sudo chown "$USER:$USER" "$APP_DIR/nginx/ssl/"*.pem

  # Setup auto-renewal cron
  (sudo crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/*.pem $APP_DIR/nginx/ssl/ && docker compose -f $APP_DIR/$COMPOSE_FILE restart nginx") | sudo crontab -

  log "SSL configured for $DOMAIN"
}

# ---- Deploy/Update ----
deploy() {
  cd "$APP_DIR"

  if [ ! -f "$ENV_FILE" ]; then
    error "Missing $ENV_FILE. Run: ./deploy.sh setup"
  fi

  log "Deploying MyHouz..."

  # Pull latest code
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"

  # Load env
  set -a
  source "$ENV_FILE"
  set +a

  # Build and deploy
  docker compose -f "$COMPOSE_FILE" build --no-cache
  docker compose -f "$COMPOSE_FILE" up -d

  # Wait and check health
  log "Waiting for services..."
  sleep 10

  if curl -sf "http://127.0.0.1:3001/api/health" > /dev/null; then
    log "✅ Backend is healthy"
  else
    warn "Backend health check failed — check logs"
  fi

  if curl -sf "http://127.0.0.1:3000" > /dev/null; then
    log "✅ Frontend is healthy"
  else
    warn "Frontend health check failed — check logs"
  fi

  log "Deployment complete!"
  docker compose -f "$COMPOSE_FILE" ps
}

# ---- Backup ----
backup() {
  cd "$APP_DIR"
  source "$ENV_FILE"

  BACKUP_DIR="$APP_DIR/backups"
  mkdir -p "$BACKUP_DIR"
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)

  log "Creating backup..."
  docker compose -f "$COMPOSE_FILE" exec -T mongodb \
    mongodump --uri="mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/myhouz?authSource=admin" \
    --archive > "$BACKUP_DIR/myhouz_$TIMESTAMP.archive"

  # Keep only last 7 backups
  ls -t "$BACKUP_DIR"/*.archive 2>/dev/null | tail -n +8 | xargs -r rm

  log "Backup saved: $BACKUP_DIR/myhouz_$TIMESTAMP.archive"
}

# ---- Logs ----
logs() {
  cd "$APP_DIR"
  docker compose -f "$COMPOSE_FILE" logs -f --tail=100 "${2:-}"
}

# ---- Status ----
status() {
  cd "$APP_DIR"
  docker compose -f "$COMPOSE_FILE" ps
  echo ""
  log "Disk usage:"
  docker system df
}

# ---- Main ----
case "${1:-}" in
  setup)  setup ;;
  deploy) deploy ;;
  ssl)    ssl ;;
  backup) backup ;;
  logs)   logs "$@" ;;
  status) status ;;
  *)
    echo "Usage: $0 {setup|deploy|ssl|backup|logs|status}"
    echo ""
    echo "Commands:"
    echo "  setup   - Initial server setup (Docker, firewall, repo clone)"
    echo "  deploy  - Build and deploy (or update) the application"
    echo "  ssl     - Setup SSL with Let's Encrypt"
    echo "  backup  - Backup MongoDB database"
    echo "  logs    - View container logs (optional: service name)"
    echo "  status  - Show container status and disk usage"
    ;;
esac

#!/bin/bash
cd ~/apps/gerenciamento_patio || exit 1
git pull origin main
npm ci
npm run build

# Copy static files to standalone output
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ 2>/dev/null || true

# Restart with PM2
pm2 restart nextjs-app
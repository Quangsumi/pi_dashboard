#!/bin/bash
# Git pull the pi_dashboard repo and log the result
cd /home/pi/.openclaw/workspace/cronjob_send_quote_image/pi_dashboard

echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="
BEFORE=$(git rev-parse --short HEAD)
git pull origin main 2>&1
AFTER=$(git rev-parse --short HEAD)

if [ "$BEFORE" != "$AFTER" ]; then
    echo "Updated: $BEFORE -> $AFTER"
else
    echo "Already up to date ($BEFORE)"
fi
echo ""

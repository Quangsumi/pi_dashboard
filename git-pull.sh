#!/bin/bash
# Git pull the pi_dashboard repo and log the result
cd /home/pi/.openclaw/workspace/cronjobs/pi_dashboard
echo "=== PULL FROM GITHUB: $(date '+%Y-%m-%d %H:%M:%S') ==="

BEFORE=$(git rev-parse --short HEAD)
git fetch upstream
git merge upstream/main 2>&1
AFTER=$(git rev-parse --short HEAD)

if [ "$BEFORE" != "$AFTER" ]; then
    echo "Updated: $BEFORE -> $AFTER"
else
    echo "Already up to date ($BEFORE)"
fi
echo ""

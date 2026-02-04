#!/bin/bash

# Quick start script for port 3002

echo "Starting Rishta Matrimonial on port 3002..."

# Stop any existing process
fuser -k 3002/tcp 2>/dev/null || true
sleep 1

# Start the application
PORT=3002 npm run start

#!/bin/bash
# ImmersiveEstates — Production Startup
# This runs the database setup, then starts the API server.

set -e

echo "=== ImmersiveEstates Production Boot ==="

# Run database setup
echo "[1/2] Initializing database..."
node setup.js

# Start the API server
echo "[2/2] Starting API server..."
exec node server.js
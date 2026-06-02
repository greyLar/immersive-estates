#!/usr/bin/env bash
set -e

echo "=== ImmersiveEstates Build ==="

echo "[1/3] Backend deps..."
cd backend && npm install && cd ..

echo "[2/3] Frontend deps (including vite)..."
cd frontend && npm install --include=dev && cd ..

echo "[3/3] Building frontend..."
cd frontend && npx vite build && cd ..

echo "=== Build OK ==="
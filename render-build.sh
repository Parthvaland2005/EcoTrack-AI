#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Install Frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# Move frontend build to backend static folder
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

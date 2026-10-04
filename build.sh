#!/usr/bin/env bash
set -o errexit

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Run Django migrations and collect static files
python manage.py collectstatic --no-input
python manage.py migrate

# 3. Build React frontend
cd frontend
npm install
npm run build
cd ..
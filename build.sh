#!/usr/bin/env bash
set -o errexit

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Collect static files & run database migrations
python manage.py collectstatic --no-input
python manage.py migrate

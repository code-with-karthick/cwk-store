#!/usr/bin/env bash
set -o errexit

# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Make migrations automatically on Render build
python manage.py makemigrations
python manage.py makemigrations store

# 3. Collect static files & run database migrations
python manage.py collectstatic --noinput
python manage.py migrate
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate

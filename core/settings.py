# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Safe check for React build folder (prevents 500 error if folder is missing on Render)
import os
FRONTEND_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/build')
if os.path.exists(FRONTEND_BUILD_DIR):
    STATICFILES_DIRS = [FRONTEND_BUILD_DIR]
else:
    STATICFILES_DIRS = []

# Simplified static file serving with Whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
